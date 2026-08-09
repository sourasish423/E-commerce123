import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";
import { searchCandidateProducts } from "../services/productSearchService.js";
import { askShoppingAssistant } from "../services/geminiClient.js";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;

// @desc    Chat with the AI shopping assistant
// @route   POST /api/ai/assistant
// @access  Public (works for guests and signed-in users alike)
const assistantChat = asyncHandler(async (req, res) => {
  const { message, history, contextProductIds } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    res.status(400);
    throw new Error("Please provide a message");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400);
    throw new Error(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`);
  }
  if (!process.env.GEMINI_API_KEY) {
    res.status(503);
    throw new Error(
      "The AI assistant isn't configured yet. Add GEMINI_API_KEY to the backend .env file."
    );
  }

  // Keep only a short, well-formed slice of prior turns for context.
  const safeHistory = Array.isArray(history)
    ? history
        .slice(-MAX_HISTORY_TURNS)
        .filter((turn) => turn && typeof turn.text === "string" && turn.text.trim())
        .map((turn) => ({
          role: turn.role === "assistant" ? "assistant" : "user",
          text: turn.text.slice(0, MAX_MESSAGE_LENGTH),
        }))
    : [];

  // Step 1: pull a pool of REAL candidate products from MongoDB for this query.
  const searchResults = await searchCandidateProducts(message);

  // Also fold in whatever products were just shown to the user (e.g. after
  // "find me a backpack under $50"), so a follow-up like "compare these" or
  // "which of those is best" has the right products available to reference —
  // without this, a generic follow-up would only see an unrelated fallback set.
  let candidates = searchResults;
  if (Array.isArray(contextProductIds) && contextProductIds.length > 0) {
    const safeContextIds = contextProductIds
      .filter((id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id))
      .slice(0, 8);
    if (safeContextIds.length > 0) {
      const contextProducts = await Product.find({ _id: { $in: safeContextIds } }).lean();
      const seen = new Set(searchResults.map((p) => String(p._id)));
      candidates = [...searchResults, ...contextProducts.filter((p) => !seen.has(String(p._id)))];
    }
  }

  // Step 2: ask Gemini to pick/respond using only those candidates.
  let aiResult;
  try {
    aiResult = await askShoppingAssistant({ message, history: safeHistory, candidates });
  } catch (err) {
    console.error("Gemini request failed:", err.message);
    res.status(502);
    throw new Error("The AI assistant is temporarily unavailable. Please try again in a moment.");
  }

  // Step 3: never trust the model's IDs blindly — only keep ones that were
  // actually in the candidate set we fetched from the database ourselves,
  // then re-fetch those products fresh so price/stock are always current.
  const candidateIds = new Set(candidates.map((c) => String(c._id)));
  const validIds = aiResult.productIds.filter((id) => candidateIds.has(id)).slice(0, 4);

  const freshProducts = validIds.length
    ? await Product.find({ _id: { $in: validIds } }).lean()
    : [];

  // Preserve Gemini's relevance ordering rather than MongoDB's natural order.
  const orderedProducts = validIds
    .map((id) => freshProducts.find((p) => String(p._id) === id))
    .filter(Boolean)
    .map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      image: p.image,
      category: p.category,
      price: p.price,
      countInStock: p.countInStock,
      rating: p.rating,
      numReviews: p.numReviews,
    }));

  res.json({
    reply: aiResult.reply,
    products: orderedProducts,
  });
});

export { assistantChat };
