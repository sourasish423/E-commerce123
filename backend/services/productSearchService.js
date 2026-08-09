import Product from "../models/Product.js";

// Common words that add no search value and would otherwise pollute both
// the MongoDB text search and the keyword/regex fallback.
const STOPWORDS = new Set([
  "a", "an", "the", "for", "of", "to", "in", "on", "is", "are", "i", "me",
  "my", "need", "needed", "want", "wanted", "please", "show", "find", "get",
  "some", "something", "good", "best", "which", "product", "products",
  "would", "you", "your", "recommend", "recommendation", "recommendations",
  "under", "below", "less", "than", "around", "about", "with", "and", "or",
  "that", "this", "these", "those", "can", "could", "do", "does", "have",
  "has", "looking", "look", "suggest", "suggestions", "options", "option",
  "cheap", "cheapest", "budget", "within", "up", "give", "me", "any",
  "there", "compare", "comparing", "versus", "vs",
]);

// Pulls a numeric price ceiling out of phrases like "under 3000",
// "under ₹3000", "below $50", "less than 2000", "within a budget of 2000".
const extractPriceCeiling = (message) => {
  const patterns = [
    /(?:under|below|less than|no more than|up to|within)\s*[₹$]?\s*(\d+(?:[.,]\d+)?)/i,
    /[₹$]\s*(\d+(?:[.,]\d+)?)\s*(?:or less|max|budget)/i,
  ];
  for (const re of patterns) {
    const match = message.match(re);
    if (match) return Number(match[1].replace(/,/g, ""));
  }
  return null;
};

const extractKeywords = (message) =>
  message
    .toLowerCase()
    .replace(/[₹$,.?!]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w) && Number.isNaN(Number(w)));

// Finds a pool of REAL, in-database candidate products relevant to a
// natural-language shopping query. This is the only source of product data
// ever handed to Gemini, so the model has no way to invent products.
export const searchCandidateProducts = async (message, { limit = 24 } = {}) => {
  const priceCeiling = extractPriceCeiling(message);
  const keywords = extractKeywords(message);

  const categories = await Product.distinct("category");
  const lowerMessage = message.toLowerCase();
  const matchedCategory = categories.find((c) => lowerMessage.includes(c.toLowerCase()));

  const filter = {};
  if (matchedCategory) filter.category = matchedCategory;
  if (priceCeiling !== null) filter.price = { $lte: priceCeiling };

  let candidates = [];

  // 1. MongoDB text search (uses the text index on name/description/category)
  //    combined with any category/price filter — the most relevant match.
  if (keywords.length > 0) {
    try {
      candidates = await Product.find(
        { ...filter, $text: { $search: keywords.join(" ") } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();
    } catch {
      candidates = [];
    }
  }

  // 2. Filter-only fallback (category and/or price, no keyword match needed) —
  //    covers queries like "show me something good for college under 2000".
  if (candidates.length === 0 && (matchedCategory || priceCeiling !== null)) {
    candidates = await Product.find(filter)
      .sort({ rating: -1, countInStock: -1 })
      .limit(limit)
      .lean();
  }

  // 3. Loose regex fallback across name/description/category if text search
  //    and filters found nothing (e.g. singular/plural or phrasing mismatch).
  if (candidates.length === 0 && keywords.length > 0) {
    const regexOr = keywords.flatMap((k) => [
      { name: { $regex: k, $options: "i" } },
      { description: { $regex: k, $options: "i" } },
      { category: { $regex: k, $options: "i" } },
    ]);
    candidates = await Product.find({ $or: regexOr }).limit(limit).lean();
  }

  // 4. Absolute fallback for open-ended asks ("which product would you
  //    recommend?") — surface top-rated, in-stock products storewide.
  if (candidates.length === 0) {
    candidates = await Product.find({ countInStock: { $gt: 0 } })
      .sort({ rating: -1, numReviews: -1 })
      .limit(limit)
      .lean();
  }

  return candidates;
};
