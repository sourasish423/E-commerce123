import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.slug || product._id}`}
    className="group block bg-white border border-ink/10 rounded-sm overflow-hidden hover:border-ink/30 transition-colors"
  >
    <div className="aspect-square overflow-hidden bg-paper">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    <div className="p-4">
      <p className="label-eyebrow">{product.category}</p>
      <h3 className="font-display text-card-title mt-1 leading-snug">{product.name}</h3>
      <div className="flex items-center justify-between mt-3">
        <span className="price-tag">${product.price.toFixed(2)}</span>
        {product.countInStock === 0 ? (
          <span className="font-mono text-caption text-clay">Sold out</span>
        ) : (
          <span className="font-mono text-caption text-moss">In stock</span>
        )}
      </div>
    </div>
  </Link>
);

export default ProductCard;
