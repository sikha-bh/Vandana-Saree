import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, Heart, MessageCircle, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/currency';
import { createProductWhatsAppUrl } from '../../utils/whatsapp';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigateToDetail: (slug: string) => void;
  onBuyNow: (product: Product, size: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onNavigateToDetail,
  onBuyNow,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return product?.variants?.[0]?.size || 'Free Size';
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  const sizes = product.variants?.map((v) => v.size) || ['Free Size'];

  const handleAdd = () => {
    addToCart(product, selectedSize);
    onClose();
  };

  const handleBuy = () => {
    onBuyNow(product, selectedSize);
    onClose();
  };

  const handleWhatsApp = () => {
    const url = createProductWhatsAppUrl(product, selectedSize);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FCF9F5] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-500 hover:text-neutral-900 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="p-4 sm:p-6 bg-neutral-100/60 flex flex-col justify-between">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-200 shadow-inner">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#721B29] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span>{product.fabric || 'Premium Fabric'}</span>
                <span className="font-semibold text-[#721B29]">{product.occasion}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold font-serif text-neutral-900 leading-snug">
                {language === 'hi' ? product.name_hi || product.name : product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-neutral-800 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-neutral-400">({product.review_count} reviews)</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  {product.stock_quantity > 0 ? t.product.inStock : t.product.outOfStock}
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-[#721B29]">
                  {formatCurrency(product.price)}
                </span>
                {product.original_price > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
                {product.discount_percentage && (
                  <span className="text-xs font-bold text-white bg-[#721B29] px-2 py-0.5 rounded">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>

              {/* Description snippet */}
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 line-clamp-3 leading-relaxed">
                {language === 'hi' ? product.description_hi || product.description : product.description}
              </p>

              {/* Size Selector */}
              <div className="mt-4">
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                  {t.product.size}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selectedSize === sz
                          ? 'border-[#721B29] bg-[#721B29] text-white shadow-sm'
                          : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-200/80 text-[11px] text-neutral-600">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#721B29]" />
                  <span>Free Shipping &gt; ₹799</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#721B29]" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-[#721B29]" />
                  <span>7-Day Exchange</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-[#721B29] bg-white border border-[#721B29] rounded-xl hover:bg-[#721B29]/5 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.product.addToCart}</span>
                </button>

                <button
                  onClick={handleBuy}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#721B29] hover:bg-[#56131F] rounded-xl shadow-md transition-colors"
                >
                  <Zap className="w-4 h-4 text-[#F3E5AB]" />
                  <span>{t.product.buyNow}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t.product.whatsappOrder}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border border-neutral-300 hover:border-[#721B29] transition-colors ${
                    isFavorited ? 'text-[#721B29] bg-rose-50' : 'text-neutral-700 bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#721B29]' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToDetail(product.slug);
                  }}
                  className="text-xs font-semibold text-neutral-600 hover:text-[#721B29] px-2 py-1 underline"
                >
                  Full Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
