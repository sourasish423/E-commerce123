const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center py-24">
    <div className="flex items-center gap-3 font-mono text-sm text-slate-450">
      <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse"></span>
      {label}…
    </div>
  </div>
);

export default Loader;
