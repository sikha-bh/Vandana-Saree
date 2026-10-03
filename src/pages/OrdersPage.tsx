import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

interface OrdersPageProps {
  onNavigate: (route: string, params?: any) => void;
}

const ORDER_STAGES: { key: OrderStatus; label_en: string; label_hi: string }[] = [
  { key: 'placed', label_en: 'Placed', label_hi: 'ऑर्डर प्राप्त हुआ' },
  { key: 'confirmed', label_en: 'Confirmed', label_hi: 'कन्फर्म हुआ' },
  { key: 'packed', label_en: 'Packed', label_hi: 'पैक हो गया' },
  { key: 'shipped', label_en: 'Shipped', label_hi: 'दुकान से निकला' },
  { key: 'out_for_delivery', label_en: 'Out for Delivery', label_hi: 'डिलीवरी के लिए निकला' },
  { key: 'delivered', label_en: 'Delivered', label_hi: 'सफलतापूर्वक पहुंचा' },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders(user?.id).then((data) => {
      setOrders(data);
      if (data.length > 0) {
        setExpandedOrderId(data[0].id);
      }
      setLoading(false);
    });
  }, [user]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStageIndex = (status: OrderStatus) => {
    const idx = ORDER_STAGES.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F5] flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#721B29] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCF9F5] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#D4AF37]/30 shadow-lg text-center">
          <Package className="w-12 h-12 text-[#721B29] mx-auto mb-3" />
          <h2 className="text-xl font-bold font-serif text-neutral-900 mb-2">
            {language === 'hi' ? 'अभी तक कोई ऑर्डर नहीं है' : 'No Orders Yet'}
          </h2>
          <p className="text-xs text-neutral-500 mb-6">
            When you purchase clothes from Vandna Saree Center, track their live delivery progress here.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 bg-[#721B29] text-white text-xs font-bold rounded-xl shadow-md"
          >
            {t.cart.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
              {t.tracking.title}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'hi' ? 'आपके सभी वस्त्र ऑर्डर्स की लाइव स्थिति' : 'Live tracking timeline for your family clothing orders'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-[#721B29] hover:underline"
          >
            {t.cart.continueShopping}
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStageIndex = getStageIndex(order.order_status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#D4AF37]/35 shadow-md overflow-hidden transition-all"
              >
                {/* Order Summary Header Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 sm:p-6 bg-gradient-to-r from-white via-white to-[#FAF4EB] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#721B29] font-mono">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-neutral-900">
                      {order.items.map((it) => it.product_name).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                        Total Amount
                      </p>
                      <p className="text-base sm:text-lg font-extrabold text-[#721B29]">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
                        {order.order_status.replace(/_/g, ' ')}
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Tracking Timeline & Order Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-8 bg-[#FCF9F5] space-y-8 animate-fade-in">
                    {/* Visual 6-Stage Timeline */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">
                        {language === 'hi' ? 'ऑर्डर प्रगति (Delivery Timeline)' : 'Delivery Progress'}
                      </h3>

                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                          {ORDER_STAGES.map((stage, idx) => {
                            const isCompleted = idx <= currentStageIndex;
                            const isCurrent = idx === currentStageIndex;

                            return (
                              <div
                                key={stage.key}
                                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                              >
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                                    isCurrent
                                      ? 'bg-[#721B29] text-white ring-4 ring-[#D4AF37]/40 scale-110'
                                      : isCompleted
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-neutral-400 border border-neutral-300'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                <div>
                                  <p
                                    className={`text-xs font-bold ${
                                      isCurrent
                                        ? 'text-[#721B29]'
                                        : isCompleted
                                        ? 'text-neutral-900'
                                        : 'text-neutral-400'
                                    }`}
                                  >
                                    {language === 'hi' ? stage.label_hi : stage.label_en}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Order Items & Shipping Address Snapshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
                      {/* Products */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                          Ordered Items
                        </h4>
                        <div className="divide-y divide-neutral-100">
                          {order.items.map((it) => (
                            <div key={it.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-semibold text-neutral-900">{it.product_name}</p>
                                <p className="text-[11px] text-neutral-500">
                                  Qty: {it.quantity} {it.selected_size ? `• Size: ${it.selected_size}` : ''}
                                </p>
                              </div>
                              <span className="font-bold text-[#721B29]">{formatCurrency(it.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                          Shipping Address
                        </h4>
                        <div className="text-xs text-neutral-700 space-y-1">
                          <p className="font-bold text-neutral-900">{order.shipping_address.full_name}</p>
                          <p>{order.shipping_address.phone}</p>
                          <p>{order.shipping_address.address_line}</p>
                          {order.shipping_address.village && <p>गांव: {order.shipping_address.village}</p>}
                          {order.shipping_address.town && <p>कस्बा: {order.shipping_address.town}</p>}
                          <p>{order.shipping_address.district}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                          {order.shipping_address.landmark && (
                            <p className="text-neutral-500">लैंडमार्क: {order.shipping_address.landmark}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
