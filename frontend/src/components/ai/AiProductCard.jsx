import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

// Compact product card used inside AI assistant replies. Renders only real
// product data returned by the backend (never AI-generated text for
// name/price/stock), and reuses the same cart logic as the rest of the app.
const AiProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex gap-3 border border-ink/10 bg-white rounded-sm p-3 items-center">
      <Link
        to={`/product/${product.slug || product._id}`}
        className="w-14 h-14 shrink-0 rounded-sm overflow-hidden border border-ink/10 bg-paper"
      >
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/product/${product.slug || product._id}`}
          className="font-display text-card-title leading-snug hover:text-signal block truncate"
        >
          {product.name}
        </Link>
        <p className="label-eyebrow mt-0.5">{product.category}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="price-tag py-1 px-2">${product.price.toFixed(2)}</span>
          {product.countInStock === 0 ? (
            <span className="font-mono text-caption text-clay">Sold out</span>
          ) : (
            <span className="font-mono text-caption text-moss">In stock</span>
          )}
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={product.countInStock === 0}
        className="shrink-0 font-mono text-caption font-semibold px-3 py-2 rounded-sm border border-ink/20 hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={`Add ${product.name} to cart`}
      >
        {added ? "Added ✓" : "Add"}
      </button>
    </div>
  );
};

export default AiProductCard;
