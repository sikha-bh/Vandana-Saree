import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  MessageSquare,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Product, Order, Review, Coupon, OrderStatus, Category } from '../types';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';
import { couponService } from '../services/couponService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';

interface AdminPageProps {
  onNavigate: (route: string, params?: any) => void;
}

type AdminTab = 'overview' | 'products' | 'inventory' | 'orders' | 'reviews' | 'coupons';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { isAdmin, switchRole } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Search & Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Modal / Form States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_hi: '',
    price: 1499,
    original_price: 2499,
    fabric: 'Banarasi Silk',
    color: 'Red',
    occasion: 'Wedding',
    gender: 'women' as const,
    stock_quantity: 25,
    category_slug: 'sarees',
    category_id: 'c1',
    description: '',
    description_hi: '',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    is_trending: true,
  });

  // New coupon form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as const,
    discount_value: 15,
    minimum_order_amount: 1499,
    maximum_discount: 600,
  });

  const loadData = async () => {
    const [p, o, r, c, cats] = await Promise.all([
      productService.getProducts(),
      orderService.getOrders(),
      reviewService.getAllReviews(),
      couponService.getCoupons(),
      categoryService.getCategories(),
    ]);
    setProducts(p);
    setOrders(o);
    setReviews(r);
    setCoupons(c);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const lowStockCount = products.filter((p) => p.stock_quantity < 15).length;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    await productService.addProduct({
      ...newProduct,
      images: [newProduct.image_url],
    });

    showToast('नया प्रोडक्ट जोड़ा गया! Product added successfully.', 'success');
    setIsAddProductOpen(false);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await productService.deleteProduct(id);
      showToast('Product removed', 'info');
      loadData();
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    await productService.updateProductStock(id, newStock);
    showToast('स्टॉक अपडेट हुआ! Stock updated.', 'success');
    loadData();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to ${newStatus}`, 'success');
    loadData();
  };

  const handleModerateReview = async (reviewId: string, approved: boolean) => {
    await reviewService.moderateReview(reviewId, approved);
    showToast(approved ? 'समीक्षा स्वीकृत की गई (Review approved)' : 'Review rejected', 'info');
    loadData();
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    await couponService.createCoupon(newCoupon);
    showToast(`Coupon ${newCoupon.code} created!`, 'success');
    setIsAddCouponOpen(false);
    loadData();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name_hi.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.fabric && p.fabric.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredOrders = orders.filter((o) =>
    orderFilterStatus === 'all' ? true : o.order_status === orderFilterStatus
  );

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#721B29] text-white flex items-center justify-center font-bold shadow-md">
              VSC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#721B29]">
                  {language === 'hi' ? 'दुकान एडमिन पैनल' : 'Store Admin Dashboard'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Live Supabase
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Manage catalog, inventory, orders, customer feedback & coupons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 transition-colors"
            >
              View Storefront →
            </button>
            <button
              onClick={() => {
                switchRole('customer');
                onNavigate('home');
              }}
              className="px-4 py-2 bg-[#721B29] text-white rounded-xl text-xs font-bold hover:bg-[#56131F] transition-colors"
            >
              Switch to Customer
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'inventory', label: `Inventory (${lowStockCount} low)`, icon: Layers },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#721B29] text-white shadow-md'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 1. OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Total Sales
                </span>
                <p className="text-2xl font-extrabold text-[#721B29] mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18% this month
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Total Orders
                </span>
                <p className="text-2xl font-extrabold text-neutral-900 mt-1">{orders.length}</p>
                <span className="text-[11px] text-neutral-500">Across All Channels</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Active Products
                </span>
                <p className="text-2xl font-extrabold text-neutral-900 mt-1">{products.length}</p>
                <span className="text-[11px] text-neutral-500">5 Categories</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Low Stock Items
                </span>
                <p className={`text-2xl font-extrabold mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {lowStockCount}
                </p>
                <span className="text-[11px] text-neutral-500">&lt; 15 units remaining</span>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-sm font-bold font-serif text-neutral-900">
                  Recent Orders Pipeline
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#721B29] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                      <th className="py-2">Order #</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Items</th>
                      <th className="py-2">Total</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 font-mono font-bold text-[#721B29]">{ord.order_number}</td>
                        <td className="py-3 font-medium">{ord.shipping_address?.full_name || 'Guest'}</td>
                        <td className="py-3">{ord.items.length} items</td>
                        <td className="py-3 font-bold">{formatCurrency(ord.total_amount)}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200">
                            {ord.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. PRODUCT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search catalog by name or fabric..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#721B29] hover:bg-[#56131F] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Garment</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 uppercase tracking-wider border-b border-neutral-200">
                    <th className="py-3 px-2">Image</th>
                    <th className="py-3 px-2">Garment Name</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">Stock</th>
                    <th className="py-3 px-2">Occasion</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-2.5 px-2">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg border border-neutral-200"
                        />
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-neutral-900 max-w-xs truncate">
                        {p.name}
                        <span className="block text-[11px] text-neutral-400 font-normal">{p.name_hi}</span>
                      </td>
                      <td className="py-2.5 px-2 uppercase text-[11px] font-bold text-neutral-600">
                        {p.category_slug}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#721B29]">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`font-bold ${p.stock_quantity < 15 ? 'text-amber-600' : 'text-neutral-800'}`}>
                          {p.stock_quantity}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">{p.occasion}</td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. INVENTORY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold font-serif text-neutral-900">
                Real-Time Stock & Inventory Controller
              </h2>
              <p className="text-xs text-neutral-500">
                Quickly adjust stock units without opening full product forms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                    p.stock_quantity < 10
                      ? 'border-rose-300 bg-rose-50/50'
                      : p.stock_quantity < 20
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                    alt={p.name}
                    className="w-14 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{p.name}</h4>
                    <p className="text-[11px] text-neutral-500">{p.fabric} • {formatCurrency(p.price)}</p>
                    <p className="text-xs font-extrabold text-[#721B29] mt-0.5">
                      Units: {p.stock_quantity}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleUpdateStock(p.id, p.stock_quantity + 5)}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold rounded-md"
                      title="Add 5 units"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleUpdateStock(p.id, p.stock_quantity - 1)}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold rounded-md"
                      title="Reduce 1 unit"
                    >
                      -1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. ORDERS FULFILLMENT PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-serif text-neutral-900">
                  Customer Orders & Delivery Status
                </h2>
                <p className="text-xs text-neutral-500">
                  Update statuses to trigger live customer tracking timeline.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600">Filter:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="text-xs p-2 bg-neutral-50 border border-neutral-300 rounded-xl font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-4 sm:p-5 rounded-2xl bg-[#FCF9F5] border border-neutral-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#721B29]">{ord.order_number}</span>
                      <span className="text-xs text-neutral-400 ml-2">
                        {new Date(ord.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-neutral-800">
                        {formatCurrency(ord.total_amount)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded bg-neutral-200">
                        {ord.payment_method}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900">Customer & Destination:</p>
                      <p className="text-neutral-700">{ord.shipping_address?.full_name} ({ord.shipping_address?.phone})</p>
                      <p className="text-neutral-600">{ord.shipping_address?.address_line}, {ord.shipping_address?.district} - {ord.shipping_address?.pincode}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-900">Order Items:</p>
                      <p className="text-neutral-700">
                        {ord.items.map((i) => `${i.product_name} (×${i.quantity})`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Status Progression Dropdown */}
                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">Progress Status:</span>
                    <select
                      value={ord.order_status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="text-xs font-bold p-2 bg-white border border-neutral-300 rounded-xl focus:border-[#721B29]"
                    >
                      <option value="placed">Placed (प्राप्त हुआ)</option>
                      <option value="confirmed">Confirmed (कन्फर्म हुआ)</option>
                      <option value="packed">Packed (पैक हो गया)</option>
                      <option value="shipped">Shipped (दुकान से निकला)</option>
                      <option value="out_for_delivery">Out for Delivery (रास्ते में)</option>
                      <option value="delivered">Delivered (सफलतापूर्वक पहुंचा)</option>
                      <option value="cancelled">Cancelled (रद्द किया)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. REVIEWS MODERATION */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold font-serif text-neutral-900">Customer Reviews Moderation</h2>
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-[#FCF9F5] border border-neutral-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">{rev.user_name || 'Customer'}</span>
                      <span className="text-xs text-amber-500 font-bold">★ {rev.rating}/5</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${rev.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                        {rev.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700">"{rev.review_text}"</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!rev.is_approved ? (
                      <button
                        onClick={() => handleModerateReview(rev.id, true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateReview(rev.id, false)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. COUPONS & OFFERS */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-serif text-neutral-900">Promotional Coupons</h2>
                <p className="text-xs text-neutral-500">Create discount codes for festive campaigns</p>
              </div>

              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="px-4 py-2 bg-[#721B29] text-white text-xs font-bold rounded-xl hover:bg-[#56131F]"
              >
                + Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border-2 border-dashed border-[#D4AF37] bg-[#FAF4EB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#721B29] font-mono">{c.code}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700">{c.description}</p>
                  <p className="text-[11px] text-neutral-500">Min Order: ₹{c.minimum_order_amount}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#D4AF37]/50 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-base font-bold font-serif text-neutral-900">Add New Garment</h3>
              <button onClick={() => setIsAddProductOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Product Title (English):</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  placeholder="e.g. Royal Wine Banarasi Saree"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Product Title (हिंदी Devanagari):</label>
                <input
                  type="text"
                  value={newProduct.name_hi}
                  onChange={(e) => setNewProduct({ ...newProduct, name_hi: e.target.value })}
                  placeholder="उदा. शाही वाइन बनारसी साड़ी"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Price (₹):</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Original Price (₹):</label>
                  <input
                    type="number"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({ ...newProduct, original_price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Category:</label>
                  <select
                    value={newProduct.category_slug}
                    onChange={(e) => setNewProduct({ ...newProduct, category_slug: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  >
                    <option value="sarees">Sarees</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                    <option value="baby">Baby</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Fabric:</label>
                  <input
                    type="text"
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Stock:</label>
                  <input
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Image URL (Unsplash or Supabase Storage):</label>
                <input
                  type="text"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#721B29] text-white font-bold rounded-xl hover:bg-[#56131F]"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COUPON MODAL */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-base font-bold font-serif text-neutral-900">Create New Coupon</h3>
              <button onClick={() => setIsAddCouponOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Code (Uppercase):</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g. DIWALI20"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Description:</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="Flat 15% off on festive wear"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Discount %:</label>
                  <input
                    type="number"
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Min Order (₹):</label>
                  <input
                    type="number"
                    value={newCoupon.minimum_order_amount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minimum_order_amount: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#721B29] text-white font-bold rounded-xl hover:bg-[#56131F]"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
