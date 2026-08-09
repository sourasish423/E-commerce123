import AiProductCard from "./AiProductCard.jsx";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <div
          className={
            isUser
              ? "bg-ink text-paper rounded-sm rounded-br-none px-3.5 py-2.5 text-body-sm leading-relaxed"
              : message.isError
              ? "bg-clay/10 border border-clay/30 text-clay rounded-sm rounded-bl-none px-3.5 py-2.5 text-body-sm leading-relaxed"
              : "bg-white border border-ink/10 rounded-sm rounded-bl-none px-3.5 py-2.5 text-body-sm leading-relaxed text-ink"
          }
        >
          {message.text}
        </div>

        {message.products?.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            {message.products.map((p) => (
              <AiProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
