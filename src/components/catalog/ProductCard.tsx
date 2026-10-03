import React from 'react';
import { Heart, ShoppingBag, Star, Eye, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/currency';
import { createProductWhatsAppUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickView }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else onSelect(product);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = createProductWhatsAppUrl(product);
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer card-3d"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount Badge */}
        {product.discount_percentage && product.discount_percentage > 0 ? (
          <div className="absolute top-2.5 left-2.5 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white bg-[#721B29] rounded-md shadow-md">
            {product.discount_percentage}% छूट (OFF)
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-neutral-700 hover:text-[#721B29] hover:bg-white transition-all transform active:scale-90"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-[#721B29] text-[#721B29]' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <button
          onClick={handleQuickView}
          className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-1.5 px-3.5 py-1.5 bg-white/95 text-neutral-800 text-xs font-bold rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#721B29] hover:text-white"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.product.quickView}</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Fabric & Occasion */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 mb-1">
            {product.fabric && <span>{product.fabric}</span>}
            {product.fabric && product.occasion && <span>•</span>}
            {product.occasion && <span className="text-[#8A2234]">{product.occasion}</span>}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#721B29] transition-colors">
            {language === 'hi' ? product.name_hi || product.name : product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-neutral-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-[11px] text-neutral-400">({product.review_count})</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[#721B29]">
                {formatCurrency(product.price)}
              </span>
              {product.original_price > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* WhatsApp Quick Order */}
            <button
              onClick={handleWhatsApp}
              className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-[#721B29] hover:bg-[#56131F] rounded-xl shadow-xs transition-colors"
              title={t.product.addToCart}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.product.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
