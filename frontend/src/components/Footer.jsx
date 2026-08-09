const Footer = () => (
  <footer className="border-t border-ink/10 mt-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="font-display text-lg">FieldNote.</p>
        <p className="label-eyebrow mt-1">Purpose-built goods for everyday life</p>
      </div>
      <p className="font-mono text-caption text-slate-450">
        © {new Date().getFullYear()} FieldNote. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
