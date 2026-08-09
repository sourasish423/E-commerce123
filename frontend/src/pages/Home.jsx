import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import CategoryBanner from "../components/CategoryBanner.jsx";
import { useAiAssistant } from "../context/AiAssistantContext.jsx";

const Home = () => {
  const { open: openAssistant } = useAiAssistant();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [data, setData] = useState({ products: [], pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (sort) params.sort = sort;
        const { data } = await api.get("/products", { params });
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || "We couldn't load the catalog. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, [keyword, category, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    // Changing a filter (category/sort/keyword) should reset back to page 1,
    // but navigating pages via this same helper must NOT wipe the page it just set.
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const showDefaultHero = !keyword && !category;

  return (
    <div>
      {showDefaultHero && (
        <section className="border-b border-ink/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="label-eyebrow mb-4">Featured collection</p>
              <h1 className="font-display text-hero tracking-tight">
                Thoughtfully made goods,
                <br /> built to last.
              </h1>
              <p className="mt-5 text-body text-slate-450 max-w-md">
                FieldNote sources canvas, cast iron, and full-grain leather from makers who stand
                behind their craftsmanship. Every item is cataloged with its own inventory tag and
                backed by our quality standards.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <a href="#catalog" className="btn-primary">
                  Shop the full catalog
                </a>
                <button onClick={openAssistant} className="btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M4 9C4 5.68629 6.68629 3 10 3C13.3137 3 16 5.68629 16 9C16 12.3137 13.3137 15 10 15H6.5L4 17V13.6C3.37 12.66 4 11 4 9Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Ask the AI Assistant
                </button>
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-paper border border-ink/10 rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
                alt="A curated selection of FieldNote goods"
                className="w-full h-full object-cover"
              />
              <span className="price-tag absolute bottom-4 left-4 bg-white">
                FN-0001 · New arrivals
              </span>
            </div>
          </div>
        </section>
      )}

      {category && !keyword && <CategoryBanner category={category} count={data.total} />}

      {showDefaultHero && <CategoryGrid categories={categories} />}

      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="label-eyebrow">
              {keyword ? `Search results for "${keyword}"` : "Full catalog"}
            </p>
            <h2 className="font-display text-section-title mt-1">
              {data.total} item{data.total === 1 ? "" : "s"} available
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
              className="input-field w-auto font-mono text-caption"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input-field w-auto font-mono text-caption"
              aria-label="Sort products"
            >
              <option value="">Newest arrivals</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading catalog" />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : data.products.length === 0 ? (
          <Message type="info">No products matched your search. Try a different keyword or category.</Message>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {data.products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {data.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 font-mono text-sm">
                <button
                  onClick={() => updateParam("page", page - 1)}
                  disabled={page <= 1}
                  className="px-3 h-9 rounded-sm border border-ink/20 hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink/20 transition-colors"
                  aria-label="Previous page"
                >
                  Prev
                </button>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParam("page", p)}
                    className={`w-9 h-9 rounded-sm border ${
                      p === page ? "bg-ink text-paper border-ink" : "border-ink/20 hover:border-ink"
                    }`}
                    aria-label={`Go to page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => updateParam("page", page + 1)}
                  disabled={page >= data.pages}
                  className="px-3 h-9 rounded-sm border border-ink/20 hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink/20 transition-colors"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
