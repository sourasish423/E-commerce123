import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order");
    }
  };

  if (loading) return <Loader label="Loading orders" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <p className="label-eyebrow">Fulfillment</p>
      <h1 className="font-display text-page-title mt-1 mb-8">Orders</h1>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}

      <div className="border-y border-ink/10 divide-y divide-ink/10">
        {orders.map((o) => (
          <div key={o._id} className="flex flex-wrap items-center gap-4 py-3">
            <Link to={`/orders/${o._id}`} className="font-mono text-caption text-slate-450 hover:text-signal w-24 shrink-0">
              #{o._id.slice(-8).toUpperCase()}
            </Link>
            <span className="text-body-sm flex-1 min-w-[120px]">{o.user?.name || "Deleted user"}</span>
            <span className="font-mono text-caption text-slate-450">
              {new Date(o.createdAt).toLocaleDateString()}
            </span>
            <span className="price-tag">${o.totalPrice.toFixed(2)}</span>
            <select
              value={o.status}
              onChange={(e) => changeStatus(o._id, e.target.value)}
              className="input-field w-auto font-mono text-caption"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderList;
