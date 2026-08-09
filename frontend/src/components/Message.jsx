const variants = {
  error: "bg-clay/10 text-clay border-clay/30",
  success: "bg-moss/10 text-moss border-moss/30",
  info: "bg-signal/10 text-signal border-signal/30",
};

const Message = ({ type = "info", children }) => (
  <div className={`border rounded-sm px-4 py-3 text-body-sm leading-relaxed ${variants[type]}`}>{children}</div>
);

export default Message;
