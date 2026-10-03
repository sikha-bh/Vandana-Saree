import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, Check, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/currency';
import { createCartWhatsAppUrl } from '../utils/whatsapp';

interface CartPageProps {
  onNavigate: (route: string, params?: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const {
    items,
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

  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoading(true);
    await applyCoupon(couponCode.trim());
    setLoading(false);
  };

  const handleWhatsApp = () => {
    const url = createCartWhatsAppUrl(items, undefined, grandTotal);
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCF9F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#D4AF37]/30 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-[#721B29]/10 text-[#721B29] mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-bold font-serif text-neutral-900 mb-2">{t.cart.empty}</h2>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6">
            {language === 'hi'
              ? 'आपकी थैली अभी खाली है। हमारे नए साड़ी व शादी संग्रह से कपड़े चुनें।'
              : 'Add beautiful handcrafted apparel from our collection to your bag.'}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 bg-[#721B29] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#56131F] transition-colors"
          >
            {t.cart.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
              {t.cart.title}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {items.length} {language === 'hi' ? 'सामान आपकी थैली में है' : 'items currently in your bag'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-[#721B29] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.cart.continueShopping}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/80 shadow-md divide-y divide-neutral-200">
            {items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                  alt={item.product.name}
                  className="w-24 h-28 object-cover rounded-2xl bg-neutral-100 border border-neutral-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug">
                        {language === 'hi' ? item.product.name_hi || item.product.name : item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                      <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-semibold">
                        {item.selected_size}
                      </span>
                      {item.selected_color && <span>• {item.selected_color}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-neutral-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-base font-extrabold text-[#721B29]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#D4AF37]/35 shadow-xl space-y-4">
            <h2 className="text-base font-bold font-serif text-neutral-900 pb-2 border-b border-neutral-100">
              {language === 'hi' ? 'ऑर्डर का विवरण' : 'Order Summary'}
            </h2>

            {/* Coupon Box */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{appliedCoupon.code}</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
                <button onClick={removeCoupon} className="underline text-emerald-700 font-semibold">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. VANDNA10)"
                    className="w-full py-2 pl-9 pr-3 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !couponCode.trim()}
                  className="px-3 py-2 bg-[#721B29] text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Price lines */}
            <div className="space-y-2 text-xs text-neutral-600 pt-2">
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

              <div className="flex justify-between text-lg font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>{t.cart.total}</span>
                <span className="text-[#721B29]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-3">
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-3.5 bg-[#721B29] hover:bg-[#56131F] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
              >
                <span>{t.cart.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'व्हाट्सएप पर ऑर्डर करें' : 'Order via WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
