import { useEffect, useRef, useState } from "react";
import { useAiAssistant } from "../../context/AiAssistantContext.jsx";
import ChatMessage from "./ChatMessage.jsx";

const SUGGESTIONS = [
  "Find me a backpack under $80",
  "I need running shoes for daily use",
  "Which product would you recommend?",
];

const AiAssistantPanel = () => {
  const { isOpen, close, messages, sendMessage, loading, resetConversation } = useAiAssistant();
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Focus the input shortly after the panel opens/animates in.
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput("");
  };

  const askSuggestion = (text) => {
    if (loading) return;
    sendMessage(text);
  };

  return (
    <>
      {/* Backdrop on mobile only, to make the full-screen panel feel modal */}
      <div className="fixed inset-0 bg-ink/30 z-40 sm:hidden" onClick={close} aria-hidden="true" />

      <div
        role="dialog"
        aria-label="AI Shopping Assistant"
        className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 sm:w-[380px] sm:h-[560px] sm:max-h-[75vh] bg-paper sm:rounded-sm sm:border sm:border-ink/15 sm:shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-ink/10 bg-white sm:rounded-t-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-moss shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-display text-card-title leading-tight truncate">Shopping Assistant</p>
              <p className="font-mono text-caption text-slate-450">Powered by FieldNote AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={resetConversation}
              className="font-mono text-caption text-slate-450 hover:text-ink px-2 py-1.5"
              aria-label="Start a new conversation"
              title="New conversation"
            >
              Reset
            </button>
            <button
              onClick={close}
              className="p-1.5 hover:text-signal"
              aria-label="Close assistant"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-ink/10 rounded-sm rounded-bl-none px-3.5 py-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" />
              </div>
            </div>
          )}

          {messages.length <= 1 && !loading && (
            <div className="flex flex-col gap-2 pt-2">
              <p className="label-eyebrow">Try asking</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => askSuggestion(s)}
                  className="text-left text-body-sm border border-ink/10 bg-white rounded-sm px-3 py-2 hover:border-ink/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={submit} className="flex items-center gap-2 p-3 border-t border-ink/10 bg-white sm:rounded-b-sm">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Ask about products…"
            maxLength={500}
            disabled={loading}
            className="input-field disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default AiAssistantPanel;
