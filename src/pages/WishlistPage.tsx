import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/catalog/ProductCard';

interface WishlistPageProps {
  onNavigate: (route: string, params?: any) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlistProducts } = useWishlist();
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
              {language === 'hi' ? 'पसंदीदा कपड़े (Wishlist)' : 'Saved Favorites'}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {wishlistProducts.length} {language === 'hi' ? 'वस्त्र सहेजे गए हैं' : 'items saved for your next celebration'}
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

        {wishlistProducts.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#D4AF37]/30 shadow-md text-center my-8">
            <Heart className="w-12 h-12 text-[#721B29] mx-auto mb-3" />
            <h2 className="text-lg font-bold font-serif text-neutral-900 mb-2">
              {language === 'hi' ? 'विशलिस्ट अभी खाली है' : 'Your Wishlist is Empty'}
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Tap the heart icon on any saree or outfit to save it here for later.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="w-full py-3 bg-[#721B29] text-white text-xs font-bold rounded-xl shadow-md"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => onNavigate('product-detail', { slug: p.slug })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
