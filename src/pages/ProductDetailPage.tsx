import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  MessageCircle,
  Phone,
  Truck,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Share2,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Product, Review } from '../types';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { createProductWhatsAppUrl } from '../utils/whatsapp';
import { ProductCard } from '../components/catalog/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (route: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  // New review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const STORE_PHONE = import.meta.env.VITE_STORE_PHONE || '+91 98765 43210';
  const cleanPhone = STORE_PHONE.replace(/[^0-9+]/g, '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    productService.getProductBySlug(slug).then((found) => {
      if (found) {
        setProduct(found);
        setSelectedImage(found.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
        setSelectedSize(found.variants?.[0]?.size || 'Free Size');
        reviewService.getReviews(found.id).then(setReviews);
        productService.getSimilarProducts(found).then(setSimilarProducts);
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCF9F5] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#721B29] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-neutral-600">वस्त्र लोड हो रहा है... (Loading product)</p>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  const sizes = product.variants?.map((v) => v.size) || ['Free Size'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    onNavigate('checkout');
  };

  const handleWhatsAppOrder = () => {
    const url = createProductWhatsAppUrl(product, selectedSize, quantity);
    window.open(url, '_blank');
  };

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeMessage(language === 'hi' ? 'कृपया 6 अंकों का सही पिन कोड दर्ज करें' : 'Please enter a valid 6-digit PIN code');
      return;
    }
    setPincodeMessage(
      language === 'hi'
        ? `पिन कोड ${pincode} पर डिलीवरी उपलब्ध है! 3-4 दिनों में आपके घर पहुंचेगा। (COD भी उपलब्ध)`
        : `Delivery is available to ${pincode}! Expected in 3-4 days. Cash on Delivery is available.`
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Vandna Saree Center:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied!', 'info');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewName.trim()) return;
    setReviewSubmitting(true);
    const created = await reviewService.addReview({
      productId: product.id,
      rating: reviewRating,
      reviewText: reviewText.trim(),
      userName: reviewName.trim(),
    });
    setReviews([created, ...reviews]);
    setReviewText('');
    setReviewName('');
    setReviewSubmitting(false);
    showToast(language === 'hi' ? 'आपकी समीक्षा दर्ज हो गई है!' : 'Review submitted successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 overflow-x-auto">
          <button onClick={() => onNavigate('home')} className="hover:text-[#721B29] shrink-0">
            {t.nav.home}
          </button>
          <span>/</span>
          <button onClick={() => onNavigate(product.category_slug || 'sarees')} className="hover:text-[#721B29] shrink-0 capitalize">
            {product.category_slug || 'Sarees'}
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 border border-[#D4AF37]/35 shadow-xl">
          {/* Left: Gallery (Thumbnails + Main View) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[500px] shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-[#721B29] scale-102 shadow-sm' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image with Zoom container */}
            <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-inner group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 cursor-crosshair"
              />

              {/* Badges on Image */}
              {product.discount_percentage && product.discount_percentage > 0 && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#721B29] text-white text-xs font-bold rounded-lg shadow-md">
                  {product.discount_percentage}% OFF (छूट)
                </div>
              )}

              <button
                onClick={handleShare}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md text-neutral-700 hover:text-[#721B29] transition-colors"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Occasion */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                <span className="uppercase font-semibold tracking-wider text-[#8C6D23]">
                  {product.fabric || 'Genuine Fabric'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#721B29]/10 text-[#721B29] font-bold">
                  {product.occasion || 'Festival'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif leading-tight">
                {language === 'hi' ? product.name_hi || product.name : product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-neutral-900 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-neutral-500">({product.review_count} ग्राहक समीक्षाएं)</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {product.stock_quantity > 0 ? t.product.inStock : t.product.outOfStock}
                </span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 mt-4 p-3.5 bg-[#FAF4EB] rounded-2xl border border-[#D4AF37]/30">
                <span className="text-3xl font-extrabold text-[#721B29]">
                  {formatCurrency(product.price)}
                </span>
                {product.original_price > product.price && (
                  <span className="text-base text-neutral-400 line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-bold ml-auto">
                  {language === 'hi' ? 'सभी टैक्स सहित (Inclusive of Taxes)' : 'All Taxes Included'}
                </span>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  {t.product.description}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {language === 'hi' ? product.description_hi || product.description : product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-800">{t.product.size}:</span>
                  <span className="text-xs text-[#8C6D23] font-medium">Standard Fit</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                        selectedSize === sz
                          ? 'border-[#721B29] bg-[#721B29] text-white shadow-sm'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-800">मात्रा (Quantity):</span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Pincode Delivery Checker */}
              <div className="mt-5 pt-4 border-t border-neutral-200">
                <form onSubmit={checkDelivery} className="flex gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="पिन कोड दर्ज करें (Enter PIN)"
                      className="w-full py-2 pl-9 pr-3 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                      maxLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-xl hover:bg-neutral-900"
                  >
                    Check
                  </button>
                </form>
                {pincodeMessage && (
                  <p className="text-xs font-semibold text-[#721B29] mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pincodeMessage}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Core Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 bg-white text-[#721B29] border-2 border-[#721B29] hover:bg-[#721B29]/5 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.product.addToCart}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 bg-[#721B29] hover:bg-[#56131F] text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform transform active:scale-95"
                >
                  <Zap className="w-4 h-4 text-[#F3E5AB]" />
                  <span>{t.product.buyNow}</span>
                </button>
              </div>

              {/* Direct WhatsApp and Phone Ordering Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleWhatsAppOrder}
                  className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#A7F3D0]" />
                  <span>{t.product.whatsappOrder}</span>
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className="py-3 px-4 bg-[#F7EEDD] hover:bg-[#ECE0C8] text-[#721B29] border border-[#D4AF37] text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t.product.callToOrder}</span>
                </a>
              </div>

              <div className="pt-2 flex items-center justify-center">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
                    isFavorited ? 'text-[#721B29] bg-rose-50' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#721B29]' : ''}`} />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Store Reassurance Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100 text-center text-[11px] text-neutral-600">
              <div className="p-2 bg-neutral-50 rounded-xl">
                <Truck className="w-4 h-4 text-[#721B29] mx-auto mb-1" />
                <span className="font-semibold block">{t.product.freeDelivery}</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#721B29] mx-auto mb-1" />
                <span className="font-semibold block">{t.product.cashOnDelivery}</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-xl">
                <RefreshCw className="w-4 h-4 text-[#721B29] mx-auto mb-1" />
                <span className="font-semibold block">{t.product.easyReturns}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section with Review Submission */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#721B29]">
                {t.product.reviews} ({reviews.length})
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Verified customer experiences with this clothing item
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-neutral-800">{product.rating} / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-neutral-500 italic py-6">
                  पहला रिव्यू आप लिखें! Be the first to share your thoughts on this garment.
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-[#FCF9F5] border border-neutral-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{rev.user_name || 'Customer'}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{rev.review_text}</p>
                    <p className="text-[10px] text-neutral-400">{rev.created_at}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Box */}
            <div className="lg:col-span-5 bg-[#FAF4EB] p-5 rounded-2xl border border-[#D4AF37]/40">
              <h3 className="text-sm font-bold font-serif text-[#721B29] mb-3">
                {t.product.writeReview}
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    आपका नाम (Your Name):
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    placeholder="उदा. सुनीता देवी"
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    रेटिंग (Rating):
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    समीक्षा (Your Feedback):
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={3}
                    placeholder="कपड़े की गुणवत्ता, फिटिंग और अनुभव साझा करें..."
                    className="w-full text-xs p-2.5 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-2.5 bg-[#721B29] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#56131F] disabled:opacity-50 transition-colors"
                >
                  {reviewSubmitting ? '...' : t.product.submitReview}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Outfits Grid */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#721B29] mb-6">
              {t.product.similarProducts}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={(item) => onNavigate('product-detail', { slug: item.slug })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
