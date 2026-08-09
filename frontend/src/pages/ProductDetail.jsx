import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setQty(1);
    } catch (err) {
      setError(err.response?.data?.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      setReviewSuccess("Review submitted — thank you!");
      setComment("");
      loadProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit review");
    }
  };

  if (loading) return <Loader label="Loading product" />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-16"><Message type="error">{error}</Message></div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => navigate(-1)} className="font-mono text-caption text-slate-450 hover:text-ink mb-6">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-white border border-ink/10 rounded-sm overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="label-eyebrow">{product.category}</p>
          <h1 className="font-display text-page-title mt-2">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="font-mono text-sm text-slate-450">
              ★ {product.rating.toFixed(1)} ({product.numReviews} review
              {product.numReviews === 1 ? "" : "s"})
            </span>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <span className="price-tag text-base px-3 py-1.5">${product.price.toFixed(2)}</span>
            <span className="font-mono text-caption text-slate-450">SKU {product.sku || "N/A"}</span>
          </div>

          <p className="mt-6 text-body text-slate-450 leading-relaxed">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            {product.countInStock > 0 ? (
              <>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="input-field w-24 font-mono"
                >
                  {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        Qty {n}
                      </option>
                    )
                  )}
                </select>
                <button onClick={handleAddToCart} className="btn-primary flex-1">
                  {added ? "Added ✓" : "Add to cart"}
                </button>
              </>
            ) : (
              <span className="font-mono text-sm text-clay">Currently sold out</span>
            )}
          </div>
          <p className="font-mono text-caption text-slate-450 mt-3">
            {product.countInStock > 0 ? `${product.countInStock} left in stock` : ""}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-16">
        <div>
          <h2 className="font-display text-section-title mb-4">Reviews</h2>
          {product.reviews.length === 0 && (
            <p className="text-sm text-slate-450">No reviews yet — be the first.</p>
          )}
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r._id} className="border border-ink/10 bg-white rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{r.name}</span>
                  <span className="font-mono text-caption text-slate-450">★ {r.rating}</span>
                </div>
                <p className="text-sm text-slate-450 mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-section-title mb-4">Write a review</h2>
          {user ? (
            <form onSubmit={submitReview} className="space-y-4">
              {reviewError && <Message type="error">{reviewError}</Message>}
              {reviewSuccess && <Message type="success">{reviewSuccess}</Message>}
              <div>
                <label className="label-eyebrow block mb-1.5">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="input-field"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} — {["Poor", "Fair", "Good", "Very good", "Excellent"][n - 1]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-eyebrow block mb-1.5">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="input-field"
                  placeholder="What did you think?"
                />
              </div>
              <button type="submit" className="btn-secondary">
                Submit review
              </button>
            </form>
          ) : (
            <Message type="info">Sign in to leave a review.</Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
