import { Link } from "react-router-dom";
import categoryMeta from "../data/categoryMeta.js";

// Homepage navigation grid: one tile per category, each with its own
// background image so the catalog's range is visible before any filtering.
const CategoryGrid = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <p className="label-eyebrow mb-2">Browse the catalog</p>
      <h2 className="font-display text-section-title mb-6">Shop by category</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const meta = categoryMeta[category];
          if (!meta) return null;
          return (
            <Link
              key={category}
              to={`/?category=${encodeURIComponent(category)}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-ink/10 bg-ink"
            >
              <img
                src={meta.image}
                alt={category}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-card-title text-paper">{category}</h3>
                <p className="font-mono text-[11px] text-paper/70 mt-1 leading-snug">
                  {meta.tagline}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
