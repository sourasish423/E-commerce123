import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import Message from "../components/Message.jsx";

const Checkout = () => {
  const { items, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.shippingAddress?.address || "");
  const [city, setCity] = useState(user?.shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(user?.shippingAddress?.country || "");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = itemsPrice > 100 ? 0 : itemsPrice > 0 ? 10 : 0;
  const tax = Number((itemsPrice * 0.08).toFixed(2));
  const total = Number((itemsPrice + shipping + tax).toFixed(2));

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        orderItems: items.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
      });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Message type="info">Your cart is empty — add something before checking out.</Message>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <p className="label-eyebrow">Final step</p>
      <h1 className="font-display text-page-title mt-1 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={placeOrder} className="md:col-span-2 space-y-6">
          {error && <Message type="error">{error}</Message>}

          <div>
            <h2 className="font-display text-section-title mb-3">Shipping address</h2>
            <div className="space-y-3">
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="input-field"
                />
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal code"
                  className="input-field"
                />
              </div>
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-section-title mb-3">Payment method</h2>
            <div className="space-y-2">
              {["Cash on Delivery", "Card on Delivery"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 border border-ink/15 rounded-sm px-4 py-3 cursor-pointer has-[:checked]:border-ink"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
            <p className="font-mono text-caption text-slate-450 mt-2">
              This is a demo store — no real payment is processed.
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Placing order…" : `Place order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="bg-white border border-ink/10 rounded-sm p-6 h-fit font-mono text-sm">
          <p className="label-eyebrow font-sans mb-4">Receipt</p>
          {items.map((i) => (
            <div key={i.product} className="flex justify-between py-1">
              <span className="truncate pr-2">
                {i.qty} × {i.name}
              </span>
              <span>${(i.qty * i.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-dashed border-ink/20 mt-3 pt-3 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink/10">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
