import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => setError(err.response?.data?.message || "Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading order" />;
  if (error) return <div className="max-w-3xl mx-auto px-4 py-16"><Message type="error">{error}</Message></div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="label-eyebrow">Order #{order._id.slice(-8).toUpperCase()}</p>
      <h1 className="font-display text-page-title mt-1 mb-8">
        Status: <span className="capitalize">{order.status}</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="font-display text-section-title mb-2">Shipping</h2>
          <p className="text-body-sm text-slate-450">
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="font-mono text-caption mt-2">
            {order.isDelivered
              ? `Delivered ${new Date(order.deliveredAt).toLocaleDateString()}`
              : "Not yet delivered"}
          </p>
        </div>
        <div>
          <h2 className="font-display text-section-title mb-2">Payment</h2>
          <p className="text-body-sm text-slate-450">{order.paymentMethod}</p>
          <p className="font-mono text-caption mt-2">
            {order.isPaid ? `Paid ${new Date(order.paidAt).toLocaleDateString()}` : "Not yet paid"}
          </p>
        </div>
      </div>

      <h2 className="font-display text-section-title mb-3">Items</h2>
      <div className="border-y border-ink/10 divide-y divide-ink/10 mb-8">
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex items-center gap-4 py-3">
            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm border border-ink/10" />
            <span className="flex-1 text-body-sm">{item.name}</span>
            <span className="font-mono text-caption text-slate-450">{item.qty} ×</span>
            <span className="price-tag">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-ink/10 rounded-sm p-6 font-mono text-body-sm max-w-sm ml-auto">
        <div className="flex justify-between py-1">
          <span>Items</span>
          <span>${order.itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Shipping</span>
          <span>${order.shippingPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Tax</span>
          <span>${order.taxPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 mt-2 border-t border-ink/10 font-semibold text-base">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
