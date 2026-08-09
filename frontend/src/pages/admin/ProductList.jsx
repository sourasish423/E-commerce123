import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { limit: 100 } });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProduct = async () => {
    setCreating(true);
    try {
      await api.post("/products", {
        name: "New product",
        description: "Add a description",
        category: "Uncategorized",
        price: 0,
        countInStock: 0,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create product");
    } finally {
      setCreating(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product");
    }
  };

  if (loading) return <Loader label="Loading products" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="label-eyebrow">Catalog</p>
          <h1 className="font-display text-page-title mt-1">Products</h1>
        </div>
        <button onClick={createProduct} disabled={creating} className="btn-primary">
          {creating ? "Creating…" : "+ New product"}
        </button>
      </div>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}

      <div className="border-y border-ink/10 divide-y divide-ink/10">
        {products.map((p) => (
          <div key={p._id} className="flex items-center gap-4 py-3">
            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-sm border border-ink/10" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-body-sm truncate">{p.name}</p>
              <p className="font-mono text-caption text-slate-450">{p.category} · Stock: {p.countInStock}</p>
            </div>
            <span className="price-tag">${p.price.toFixed(2)}</span>
            <Link to={`/admin/products/${p._id}`} className="font-mono text-caption text-signal hover:underline">
              Edit
            </Link>
            <button
              onClick={() => deleteProduct(p._id)}
              className="font-mono text-caption text-clay hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
