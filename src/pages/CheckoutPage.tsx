import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  QrCode,
  CreditCard,
  Banknote,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Address, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/currency';

interface CheckoutPageProps {
  onNavigate: (route: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { items, subtotal, discountAmount, deliveryCharge, grandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState<Address>({
    id: 'addr_' + Date.now(),
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address_line: '',
    village: '',
    town: '',
    district: '',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    pincode: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  if (items.length === 0 && !placedOrderNumber) {
    return (
      <div className="min-h-screen bg-[#FCF9F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#D4AF37]/30 shadow-lg text-center">
          <ShoppingBag className="w-12 h-12 text-[#721B29] mx-auto mb-3" />
          <h2 className="text-lg font-bold font-serif text-neutral-900 mb-2">थैली खाली है (Bag is Empty)</h2>
          <p className="text-xs text-neutral-500 mb-6">
            Please add clothes to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 bg-[#721B29] text-white text-xs font-bold rounded-xl"
          >
            {t.cart.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!address.full_name.trim() || !address.phone.trim() || !address.address_line.trim() || !address.district.trim() || !address.pincode.trim()) {
      alert(language === 'hi' ? 'कृपया सभी आवश्यक पते के विवरण भरें' : 'Please fill all required address fields');
      return;
    }

    if (!/^\d{10}$/.test(address.phone.replace(/[^0-9]/g, '').slice(-10))) {
      alert(language === 'hi' ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((it) => ({
        id: 'ord_item_' + Math.random().toString(36).substr(2, 6),
        product_id: it.product.id,
        product_name: it.product.name,
        image_url: it.product.images?.[0],
        quantity: it.quantity,
        price: it.price,
        total: it.price * it.quantity,
        selected_size: it.selected_size,
      }));

      const newOrder = await orderService.createOrder({
        user_id: user?.id,
        shipping_address: address,
        items: orderItems,
        subtotal,
        discount: discountAmount,
        delivery_charge: deliveryCharge,
        total_amount: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'completed',
        order_status: 'placed',
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#721B29', '#D4AF37', '#2D6A4F', '#F3E5AB'],
        });
      } catch {}

      setPlacedOrderNumber(newOrder.order_number);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrderNumber) {
    return (
      <div className="min-h-screen bg-[#FCF9F5] py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/50 shadow-2xl text-center space-y-5 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.checkout.orderSuccess}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
              {language === 'hi' ? 'बधाई! आपका ऑर्डर सफलतापूर्वक दर्ज हुआ।' : 'Thank You! Your Order is Confirmed.'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto pt-1">
              {t.checkout.orderSuccessMsg}
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="p-4 bg-[#FAF4EB] rounded-2xl border border-[#D4AF37]/40 text-xs sm:text-sm space-y-1.5 text-neutral-700">
            <div className="flex justify-between font-bold text-neutral-900">
              <span>{t.tracking.orderNo}:</span>
              <span className="text-[#721B29] font-mono">{placedOrderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>भुगतान का तरीका:</span>
              <span className="font-semibold uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>डिलीवरी का स्थान:</span>
              <span className="font-medium text-neutral-900">{address.village || address.town || address.address_line}, {address.district}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('orders')}
              className="py-3 px-6 bg-[#721B29] hover:bg-[#56131F] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{t.checkout.trackOrder}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="py-3 px-6 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif mb-2">
          {t.checkout.title}
        </h1>
        <p className="text-xs text-neutral-500 mb-8">
          {language === 'hi' ? 'आसान 2-स्टेप फॉर्म भरें और बिना किसी झंझट के ऑर्डर पाएं।' : 'Complete this quick 2-step form to receive your clothes with peace of mind.'}
        </p>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery Address & Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Address */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-neutral-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <div className="w-7 h-7 rounded-full bg-[#721B29] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-bold font-serif text-neutral-900">
                  {t.checkout.step1}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    value={address.full_name}
                    onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                    required
                    placeholder="उदा. सुनीता देवी / Ramesh Sharma"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.phone} *
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.addressLine} *
                  </label>
                  <input
                    type="text"
                    value={address.address_line}
                    onChange={(e) => setAddress({ ...address, address_line: e.target.value })}
                    required
                    placeholder="मकान संख्या, गली, सड़क या मोहल्ला"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.village}
                  </label>
                  <input
                    type="text"
                    value={address.village}
                    onChange={(e) => setAddress({ ...address, village: e.target.value })}
                    placeholder="गांव या कस्बा"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.town}
                  </label>
                  <input
                    type="text"
                    value={address.town}
                    onChange={(e) => setAddress({ ...address, town: e.target.value })}
                    placeholder="शहर या तहसील"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.district} *
                  </label>
                  <input
                    type="text"
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                    required
                    placeholder="उदा. सुल्तानपुर, लखनऊ, वाराणसी"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.pincode} *
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    required
                    maxLength={6}
                    placeholder="6 अंकों का पिन कोड"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    {t.checkout.landmark}
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="पास का मंदिर, स्कूल, अस्पताल या चौराहा"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Mode */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-neutral-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <div className="w-7 h-7 rounded-full bg-[#721B29] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h2 className="text-base font-bold font-serif text-neutral-900">
                  {t.checkout.step2}
                </h2>
              </div>

              <div className="space-y-3">
                {/* 1. Cash on Delivery (COD) - Most Popular */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#721B29] bg-[#721B29]/5'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#721B29] focus:ring-[#721B29]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-700" />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900">
                          {t.checkout.paymentCOD}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {language === 'hi'
                        ? 'सामान जब आपके हाथ में पहुंचे, तब नकद भुगतान करें। कोई अग्रिम पैसा नहीं चाहिए।'
                        : 'Zero risk. Pay in cash when the delivery agent arrives at your home.'}
                    </p>
                  </div>
                </label>

                {/* 2. UPI Payment */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#721B29] bg-[#721B29]/5'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 text-[#721B29] focus:ring-[#721B29]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-700" />
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {t.checkout.paymentUPI}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Google Pay, PhonePe, Paytm QR code instant payment.
                    </p>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                        <p className="text-[11px] font-semibold text-neutral-700">Enter UPI ID:</p>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okaxis / 9876543210@paytm"
                          className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Online Cards / Netbanking */}
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-[#721B29] bg-[#721B29]/5'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 text-[#721B29] focus:ring-[#721B29]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#8C6D23]" />
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {t.checkout.paymentOnline}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Visa, MasterCard, RuPay Debit/Credit cards and Netbanking.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary & Submit */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#D4AF37]/35 shadow-xl space-y-4">
            <h2 className="text-base font-bold font-serif text-neutral-900 pb-2 border-b border-neutral-100">
              {language === 'hi' ? 'ऑर्डर की समीक्षा' : 'Order Review'}
            </h2>

            {/* Items snippet */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-0">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-neutral-900 line-clamp-1">{it.product.name}</p>
                    <p className="text-[10px] text-neutral-500">Size: {it.selected_size} × {it.quantity}</p>
                  </div>
                  <span className="font-bold text-neutral-900">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
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

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#721B29] hover:bg-[#56131F] text-white text-sm font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'ऑर्डर दर्ज हो रहा है...' : t.checkout.placeOrder}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="pt-2 text-center text-[11px] text-neutral-500 space-y-1">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% सुरक्षित खरीदारी • 7 दिन में वापसी</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
