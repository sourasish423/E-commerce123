import { getCategoryMeta } from "../data/categoryMeta.js";

// Shown at the top of the catalog when a category filter is active,
// replacing the generic hero with imagery specific to that category.
const CategoryBanner = ({ category, count }) => {
  const meta = getCategoryMeta(category);

  return (
    <section className="relative border-b border-ink/10 overflow-hidden">
      <div className="absolute inset-0">
        <img src={meta.image} alt={category} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="label-eyebrow text-paper/70 mb-3">Category</p>
        <h1 className="font-display text-page-title text-paper">{category}</h1>
        <p className="text-body text-paper/80 mt-3 max-w-md">{meta.tagline}</p>
        {typeof count === "number" && (
          <span className="price-tag mt-6 bg-paper/95">
            {count} item{count === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </section>
  );
};

export default CategoryBanner;
