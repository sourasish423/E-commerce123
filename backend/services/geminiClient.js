import { GoogleGenAI } from "@google/genai";

// Lazily-created singleton so a missing API key only throws when the AI
// feature is actually invoked, not at server boot.
let client = null;

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Asks Gemini to act as a shopping assistant over a fixed, real product
// catalog and to answer as strict JSON: { reply, productIds }.
//
// Note: the system instruction tells the model to only use the given
// catalog, but the model's output is NOT trusted blindly — the caller
// (aiController) re-validates every returned ID against the same candidate
// set fetched from MongoDB before anything is shown to the user.
export const askShoppingAssistant = async ({ message, history, candidates }) => {
  const ai = getClient();

  const catalogForPrompt = candidates.map((p) => ({
    id: String(p._id),
    name: p.name,
    category: p.category,
    price: p.price,
    inStock: p.countInStock > 0,
    stockCount: p.countInStock,
    rating: p.rating,
    description: (p.description || "").slice(0, 220),
  }));

  const systemInstruction = `You are the shopping assistant for FieldNote, an online general-goods store.
You help customers find products, compare options, and get recommendations, in a friendly and concise way.

Rules you must follow exactly:
1. You may ONLY recommend products from the CATALOG JSON below. Never invent a product, price, ID, category, description, or stock status that is not in that list.
2. If nothing in the catalog is a strong match, say so honestly in "reply" and either suggest the closest alternatives from the catalog or ask one short clarifying question. Do not pretend a weak match is a good one.
3. Catalog prices are in US dollars ($). If the customer gives a price limit in $, ₹, or a bare number, treat it as a ceiling and only recommend products at or under it when one was given.
4. Keep "reply" short and conversational — a few sentences, no markdown headers, no bullet-point walls, no emoji spam.
5. If asked to compare products, briefly compare the relevant ones from the catalog (price, category, stock, rating) in "reply".
6. Respond with strict JSON only — no prose outside the JSON, no markdown code fences — matching exactly this shape:
{"reply": "string, your conversational response", "productIds": ["0 to 4 product _id strings from the catalog, most relevant first"]}
7. Only include a product ID in "productIds" if you actually reference or recommend that product in "reply".

CATALOG (the only products you may reference):
${JSON.stringify(catalogForPrompt)}`;

  const contents = [
    ...(history || []).map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const raw = response.text;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { reply: raw?.trim() || "I couldn't quite process that — could you rephrase?", productIds: [] };
  }

  return {
    reply: typeof parsed.reply === "string" && parsed.reply.trim() ? parsed.reply : "Here's what I found.",
    productIds: Array.isArray(parsed.productIds)
      ? parsed.productIds.filter((id) => typeof id === "string")
      : [],
  };
};
