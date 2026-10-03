import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Tag, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { createCartWhatsAppUrl } from '../../utils/whatsapp';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout, onContinueShopping }) => {
  const { language, t } = useLanguage();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    discountAmount,
    deliveryCharge,
    grandTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 799;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
  };

  const handleWhatsAppCheckout = () => {
    const url = createCartWhatsAppUrl(items, undefined, grandTotal);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCF9F5] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#721B29]" />
              <h2 className="text-lg font-bold font-serif text-neutral-900">{t.cart.title}</h2>
              <span className="text-xs font-bold text-white bg-[#721B29] px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-[#F7EEDD] border-b border-[#D4AF37]/30 text-xs">
              <div className="flex items-center justify-between font-semibold text-[#721B29] mb-1.5">
                <span>
                  {amountNeeded === 0 ? (
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {language === 'hi' ? '🎉 बधाई! आपको मुफ्त डिलीवरी मिलेगी।' : '🎉 Congratulations! You unlocked Free Shipping.'}
                    </span>
                  ) : (
                    <span>
                      {language === 'hi'
                        ? `मुफ्त डिलीवरी के लिए ₹${amountNeeded} का और सामान जोड़ें`
                        : `Add ₹${amountNeeded} more for Free Delivery`}
                    </span>
                  )}
                </span>
                <span>{progressToFreeShipping}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#721B29] to-[#D4AF37] transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-200">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#721B29]/10 flex items-center justify-center text-[#721B29] mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-base font-bold font-serif text-neutral-800 mb-1">{t.cart.empty}</h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Explore our authentic Banarasi sarees, festive family collections, and comfortable daily wear.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#721B29] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#56131F] transition-colors"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3 sm:gap-4 group">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-neutral-100 border border-neutral-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                          {language === 'hi' ? item.product.name_hi || item.product.name : item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {item.selected_size}
                        </span>
                        {item.selected_color && <span>{item.selected_color}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#721B29]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-neutral-200/80 shadow-lg space-y-3">
              {/* Coupon Bar */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon: {appliedCoupon.code}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 underline font-semibold hover:text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon (e.g. VANDNA10)"
                      className="w-full py-2 pl-9 pr-3 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3 py-2 text-xs font-bold text-white bg-[#721B29] rounded-xl disabled:opacity-50 hover:bg-[#56131F] transition-colors"
                  >
                    {couponLoading ? '...' : t.cart.applyCoupon}
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-neutral-800">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t.cart.discount}</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.cart.delivery}</span>
                  <span className="font-semibold text-neutral-800">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">{t.cart.free}</span>
                    ) : (
                      formatCurrency(deliveryCharge)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                  <span>{t.cart.total}</span>
                  <span className="text-[#721B29]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-4 bg-[#721B29] hover:bg-[#56131F] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <span>{t.cart.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'व्हाट्सएप पर कार्ट भेजकर ऑर्डर करें' : 'Order Cart via WhatsApp'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
