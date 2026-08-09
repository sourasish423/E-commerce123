import { createContext, useCallback, useContext, useState } from "react";
import api from "../api/axios.js";

const AiAssistantContext = createContext(null);

const GREETING = {
  id: "greeting",
  role: "assistant",
  text:
    "Hi! I'm the FieldNote shopping assistant. Ask me things like \"find me a backpack under $80\" or \"which product would you recommend?\" and I'll pull real items from the catalog.",
  products: [],
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const AiAssistantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [loading, setLoading] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const resetConversation = useCallback(() => setMessages([GREETING]), []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMessage = { id: makeId(), role: "user", text: trimmed, products: [] };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      // Build short conversation history for context, and carry forward the
      // most recently shown products so follow-ups like "compare these" work.
      try {
        const history = messages
          .filter((m) => m.id !== "greeting")
          .slice(-8)
          .map((m) => ({ role: m.role, text: m.text }));

        const lastWithProducts = [...messages].reverse().find((m) => m.products?.length);
        const contextProductIds = lastWithProducts ? lastWithProducts.products.map((p) => p._id) : [];

        const { data } = await api.post("/ai/assistant", {
          message: trimmed,
          history,
          contextProductIds,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            text: data.reply,
            products: Array.isArray(data.products) ? data.products : [],
          },
        ]);
      } catch (err) {
        const errorText =
          err.response?.data?.message ||
          "The assistant is having trouble responding right now. Please try again in a moment.";
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: "assistant", text: errorText, products: [], isError: true },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  return (
    <AiAssistantContext.Provider
      value={{ isOpen, open, close, toggle, messages, sendMessage, loading, resetConversation }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
};

export const useAiAssistant = () => useContext(AiAssistantContext);
