import { useAiAssistant } from "../../context/AiAssistantContext.jsx";

// Floating trigger, present on every page, so the assistant is reachable
// from anywhere in the store — not just the pages that link to it.
const AiAssistantButton = () => {
  const { isOpen, toggle } = useAiAssistant();

  if (isOpen) return null;

  return (
    <button
      onClick={toggle}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-ink text-paper pl-4 pr-5 py-3.5 rounded-full shadow-lg hover:bg-signal transition-colors"
      aria-label="Open AI shopping assistant"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M4 9C4 5.68629 6.68629 3 10 3C13.3137 3 16 5.68629 16 9C16 12.3137 13.3137 15 10 15H6.5L4 17V13.6C3.37 12.66 4 11 4 9Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="9" r="0.9" fill="currentColor" />
        <circle cx="10" cy="9" r="0.9" fill="currentColor" />
        <circle cx="12.5" cy="9" r="0.9" fill="currentColor" />
      </svg>
      <span className="text-button hidden sm:inline">Ask AI</span>
    </button>
  );
};

export default AiAssistantButton;
