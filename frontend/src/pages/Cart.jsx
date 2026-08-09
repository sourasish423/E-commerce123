import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Message from "../components/Message.jsx";

const Cart = () => {
  const { items, updateQty, removeFromCart, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkout = () => {
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <p className="label-eyebrow">Order slip</p>
      <h1 className="font-display text-page-title mt-1 mb-8">Your cart</h1>

      {items.length === 0 ? (
        <Message type="info">
          Your cart is empty.{" "}
          <Link to="/" className="underline">
            Continue shopping
          </Link>
          .
        </Message>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 divide-y divide-ink/10 border-y border-ink/10">
            {items.map((item) => (
              <div key={item.product} className="flex items-center gap-4 py-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-sm border border-ink/10"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product}`} className="font-medium hover:text-signal">
                    {item.name}
                  </Link>
                  <p className="price-tag mt-2">${item.price.toFixed(2)}</p>
                </div>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, Number(e.target.value))}
                  className="input-field w-20 font-mono"
                >
                  {Array.from({ length: Math.max(item.countInStock, item.qty) }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    )
                  )}
                </select>
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="font-mono text-caption text-clay hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-ink/10 rounded-sm p-6 h-fit font-mono">
            <p className="label-eyebrow font-sans mb-4">Summary</p>
            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>{items.reduce((a, i) => a + i.qty, 0)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4 pb-4 border-b border-dashed border-ink/20">
              <span>Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <button onClick={checkout} className="btn-primary w-full font-body">
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
