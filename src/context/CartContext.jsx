import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'restaurant-cart';

const VALID_COUPONS = {
  'WELCOME10': { type: 'PERCENTAGE', value: 10, description: '10% off your order' },
  'FLAT50': { type: 'FIXED', value: 50, description: '₹50 off your order' },
  'SAVE20': { type: 'PERCENTAGE', value: 20, description: '20% off your order' },
  'NEWUSER': { type: 'PERCENTAGE', value: 15, description: '15% off for new users' },
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [coupon, setCoupon] = useState(null); // null or { code, type, value, description }

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((current) => {
      const existing = current.find((c) => c.id === item.id);
      if (existing) {
        return current.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCartItems((c) => c.filter((item) => item.id !== id));

  const increaseQuantity = (id) => setCartItems((c) => c.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));

  const decreaseQuantity = (id) => setCartItems((c) => c.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));

  const clearCart = () => { setCartItems([]); setCoupon(null); };

  const cartCount = useMemo(() => cartItems.reduce((t, item) => t + item.quantity, 0), [cartItems]);

  const subtotal = useMemo(() =>
    cartItems.reduce((t, item) => t + Number(item.price || 0) * Number(item.quantity || 0), 0),
  [cartItems]);

  // Correct per-item discount: uses discountType to compute properly
  const itemDiscount = useMemo(() =>
    cartItems.reduce((t, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      const dv = Number(item.discountValue || 0);
      if (!dv || dv <= 0) return t;
      if (item.discountType === 'PERCENTAGE') {
        return t + (price * dv / 100) * qty;
      }
      if (item.discountType === 'FIXED_AMOUNT') {
        return t + dv * qty;
      }
      return t;
    }, 0),
  [cartItems]);

  const afterItemDiscount = useMemo(() => Math.max(subtotal - itemDiscount, 0), [subtotal, itemDiscount]);

  const couponDiscount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === 'PERCENTAGE') return afterItemDiscount * coupon.value / 100;
    if (coupon.type === 'FIXED') return Math.min(coupon.value, afterItemDiscount);
    return 0;
  }, [coupon, afterItemDiscount]);

  const tax = useMemo(() => {
    // Tax is calculated on (subtotal - itemDiscount) only, not including coupon discount
    // This matches backend calculation
    return afterItemDiscount * 0.05;
  }, [afterItemDiscount]);

  const deliveryFee = useMemo(() => (cartItems.length > 0 ? 40 : 0), [cartItems.length]);

  const grandTotal = useMemo(() =>
    Math.max(afterItemDiscount - couponDiscount + tax + deliveryFee, 0),
  [afterItemDiscount, couponDiscount, tax, deliveryFee]);

  // Keep legacy `discount` alias for existing consumers
  const discount = itemDiscount;

  const applyCoupon = (code) => {
    const trimmed = code.trim().toUpperCase();
    const found = VALID_COUPONS[trimmed];
    if (!found) return { success: false, message: 'Invalid coupon code. Try WELCOME10, FLAT50, or SAVE20.' };
    if (coupon?.code === trimmed) return { success: false, message: 'This coupon is already applied.' };
    setCoupon({ code: trimmed, ...found });
    return { success: true, message: `Coupon applied! ${found.description}` };
  };

  const removeCoupon = () => setCoupon(null);

  const value = {
    cartItems, cartCount,
    subtotal, discount, itemDiscount, couponDiscount,
    tax, deliveryFee, grandTotal,
    coupon, applyCoupon, removeCoupon,
    addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
