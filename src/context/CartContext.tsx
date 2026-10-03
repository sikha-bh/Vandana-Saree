import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { couponService } from '../services/couponService';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string, quantity?: number, color?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalCount: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'vandna_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((count, item) => count + item.quantity, 0);
  const deliveryCharge = subtotal >= 799 || items.length === 0 ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  // Re-calculate coupon discount if items change
  useEffect(() => {
    if (appliedCoupon) {
      if (subtotal < appliedCoupon.minimum_order_amount) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        showToast(`Coupon removed (Order must be at least ₹${appliedCoupon.minimum_order_amount})`, 'info');
      } else {
        let disc = 0;
        if (appliedCoupon.discount_type === 'percentage') {
          disc = (subtotal * appliedCoupon.discount_value) / 100;
          if (appliedCoupon.maximum_discount) {
            disc = Math.min(disc, appliedCoupon.maximum_discount);
          }
        } else {
          disc = appliedCoupon.discount_value;
        }
        setDiscountAmount(Math.round(disc));
      }
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, appliedCoupon, showToast]);

  const addToCart = (product: Product, size?: string, quantity: number = 1, color?: string) => {
    const chosenSize = size || (product.variants && product.variants.length > 0 ? product.variants[0].size : 'Free Size');
    const existingIndex = items.findIndex((it) => it.product.id === product.id && it.selected_size === chosenSize);

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        product,
        selected_size: chosenSize,
        selected_color: color || product.color,
        quantity,
        price: product.price,
      };
      setItems([...items, newItem]);
    }

    showToast(`"${product.name}" थैले में जोड़ा गया! (Added to bag)`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    if (item) {
      showToast(`Removed from cart`, 'info');
    }
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const res = await couponService.validateCoupon(code, subtotal);
    if (res.isValid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount);
      showToast(res.message, 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalCount,
        appliedCoupon,
        discountAmount,
        deliveryCharge,
        grandTotal,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
