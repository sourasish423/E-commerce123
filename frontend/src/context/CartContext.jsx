import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const STORAGE_PREFIX = "fieldnote_cart";
const GUEST_KEY = `${STORAGE_PREFIX}_guest`;

// Cart storage is namespaced per user (fieldnote_cart_user_<id>) with a
// separate guest bucket (fieldnote_cart_guest) so different accounts never
// see each other's cart, and a signed-out visitor still gets a working cart.
const cartKeyFor = (userId) => (userId ? `${STORAGE_PREFIX}_user_${userId}` : GUEST_KEY);

const loadCart = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // localStorage unavailable (e.g. private browsing quota) — fail silently
  }
};

// Combine two item lists (used when a guest cart merges into an account
// cart at login), summing quantities for shared products and capping at
// available stock.
const mergeCarts = (primary, incoming) => {
  const merged = [...primary];
  incoming.forEach((incomingItem) => {
    const idx = merged.findIndex((i) => i.product === incomingItem.product);
    if (idx === -1) {
      merged.push(incomingItem);
    } else {
      const cap = incomingItem.countInStock ?? merged[idx].countInStock ?? Infinity;
      merged[idx] = { ...merged[idx], qty: Math.min(merged[idx].qty + incomingItem.qty, cap) };
    }
  });
  return merged;
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Start from the guest cart so items added before auth status resolves
  // (or while signed out) are never lost.
  const [items, setItems] = useState(() => loadCart(GUEST_KEY));
  const activeKeyRef = useRef(GUEST_KEY);

  // Switch the active cart whenever the signed-in user changes.
  useEffect(() => {
    if (authLoading) return; // wait until we know if there's a session

    const nextKey = cartKeyFor(user?._id);
    if (nextKey === activeKeyRef.current) return;

    if (user) {
      // Logging in: fold any guest-cart items into this user's saved cart,
      // then clear the guest bucket so the next signed-out visitor starts fresh.
      const guestItems = loadCart(GUEST_KEY);
      const userItems = loadCart(nextKey);
      const combined = guestItems.length ? mergeCarts(userItems, guestItems) : userItems;
      if (guestItems.length) {
        localStorage.removeItem(GUEST_KEY);
      }
      activeKeyRef.current = nextKey;
      setItems(combined);
    } else {
      // Logging out: switch back to the (separate) guest cart.
      activeKeyRef.current = nextKey;
      setItems(loadCart(nextKey));
    }
  }, [user, authLoading]);

  // Persist to whichever cart is currently active.
  useEffect(() => {
    saveCart(activeKeyRef.current, items);
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id
            ? { ...i, qty: Math.min(i.qty + qty, product.countInStock) }
            : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setItems((prev) => prev.map((i) => (i.product === productId ? { ...i, qty } : i)));
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  };

  const clearCart = () => setItems([]);

  const itemsPrice = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalQty = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, itemsPrice, totalQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
