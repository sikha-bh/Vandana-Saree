import React, { useState } from 'react';
import { Sparkles, Flame, Clock } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../catalog/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

interface FeaturedSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onViewAll,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trending' | 'newArrivals'>('trending');

  const displayedProducts = products
    .filter((p) => (activeTab === 'trending' ? p.is_trending : p.is_new_arrival))
    .slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-[#FBF7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'hi' ? 'विशेष चयन' : 'Handpicked Spotlight'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
              {activeTab === 'trending'
                ? (language === 'hi' ? 'ट्रेंडिंग परिधान' : 'Trending Outfits')
                : (language === 'hi' ? 'नई आवक (New Arrivals)' : 'Fresh Arrivals')}
            </h2>
          </div>

          {/* Toggle Tabs */}
          <div className="p-1 bg-white border border-[#D4AF37]/30 rounded-2xl flex items-center shadow-xs">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'trending'
                  ? 'bg-[#721B29] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'ट्रेंडिंग कपड़े' : 'Trending'}</span>
            </button>

            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'newArrivals'
                  ? 'bg-[#721B29] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'नई आवक' : 'New Arrivals'}</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={onViewAll}
            className="px-8 py-3 bg-white hover:bg-neutral-50 text-[#721B29] border-2 border-[#721B29] rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all transform active:scale-95"
          >
            {language === 'hi' ? 'सभी कपड़े देखें (View Catalog)' : 'View Entire Catalog'}
          </button>
        </div>
      </div>
    </section>
  );
};
