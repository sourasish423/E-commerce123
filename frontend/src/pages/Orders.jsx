import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

const statusColor = {
  pending: "text-slate-450",
  processing: "text-signal",
  shipped: "text-signal",
  delivered: "text-moss",
  cancelled: "text-clay",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading orders" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <p className="label-eyebrow">Order history</p>
      <h1 className="font-display text-page-title mt-1 mb-8">Your orders</h1>

      {error && <Message type="error">{error}</Message>}

      {orders.length === 0 ? (
        <Message type="info">
          No orders yet.{" "}
          <Link to="/" className="underline">
            Start shopping
          </Link>
          .
        </Message>
      ) : (
        <div className="border-y border-ink/10 divide-y divide-ink/10">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/orders/${o._id}`}
              className="flex flex-wrap items-center justify-between gap-2 py-4 hover:bg-white px-2 -mx-2 rounded-sm"
            >
              <div>
                <p className="font-mono text-caption text-slate-450">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-body-sm mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`font-mono text-caption uppercase ${statusColor[o.status]}`}>
                {o.status}
              </span>
              <span className="price-tag">${o.totalPrice.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
