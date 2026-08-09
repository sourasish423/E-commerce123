import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setForm(data))
      .catch((err) => setError(err.response?.data?.message || "Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put(`/products/${id}`, {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        brand: form.brand,
        category: form.category,
        countInStock: Number(form.countInStock),
        sku: form.sku,
      });
      setSuccess("Product updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading product" />;
  if (error && !form) return <div className="max-w-2xl mx-auto px-4 py-16"><Message type="error">{error}</Message></div>;
  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => navigate("/admin/products")} className="font-mono text-caption text-slate-450 hover:text-ink mb-6">
        ← Back to products
      </button>
      <p className="label-eyebrow">Edit product</p>
      <h1 className="font-display text-page-title mt-1 mb-8">{form.name}</h1>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}
      {success && <div className="mb-4"><Message type="success">{success}</Message></div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-eyebrow block mb-1.5">Name</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-eyebrow block mb-1.5">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Stock</label>
            <input
              type="number"
              min="0"
              value={form.countInStock}
              onChange={(e) => update("countInStock", e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-eyebrow block mb-1.5">Category</label>
            <input value={form.category} onChange={(e) => update("category", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Brand</label>
            <input value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="label-eyebrow block mb-1.5">SKU</label>
          <input value={form.sku || ""} onChange={(e) => update("sku", e.target.value)} className="input-field font-mono" />
        </div>
        <div>
          <label className="label-eyebrow block mb-1.5">Image URL</label>
          <input value={form.image} onChange={(e) => update("image", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-eyebrow block mb-1.5">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductEdit;
