import React, { useState } from 'react';
import { Sparkles, ArrowRight, Filter } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../catalog/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

interface SareeSpotlightProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAllSarees: (filterParams?: any) => void;
}

export const SareeSpotlight: React.FC<SareeSpotlightProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onViewAllSarees,
}) => {
  const { language, t } = useLanguage();
  const [selectedFabric, setSelectedFabric] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');

  // Filter products for Sarees category
  const sareeProducts = products.filter((p) => p.category_slug === 'sarees');

  const filtered = sareeProducts.filter((p) => {
    if (selectedFabric !== 'All' && p.fabric !== selectedFabric) return false;
    if (selectedOccasion !== 'All' && p.occasion !== selectedOccasion) return false;
    return true;
  });

  const fabrics = ['All', 'Banarasi Silk', 'Chanderi', 'Georgette', 'Art Silk'];
  const occasions = ['All', 'Wedding', 'Festival', 'Party'];

  return (
    <section className="py-12 sm:py-16 bg-[#FCF9F5] border-b border-[#D4AF37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.sarees.title}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#721B29] font-serif">
              {language === 'hi' ? 'शाही बनारसी व हैंडलूम साड़ी संग्रह' : 'Royal Banarasi & Handloom Sarees'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
              {t.sarees.subtitle}
            </p>
          </div>

          <button
            onClick={() => onViewAllSarees()}
            className="self-start md:self-end flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#721B29] hover:text-[#56131F] border-b-2 border-[#721B29] pb-0.5"
          >
            <span>{t.sarees.allSarees}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Saree Filters Bar */}
        <div className="glass-card p-3 sm:p-4 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1 shrink-0">
              {t.sarees.fabrics}:
            </span>
            {fabrics.map((fab) => (
              <button
                key={fab}
                onClick={() => setSelectedFabric(fab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  selectedFabric === fab
                    ? 'bg-[#721B29] text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {fab === 'All' ? (language === 'hi' ? 'सभी साड़ियां' : 'All Fabrics') : fab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1 shrink-0">
              {language === 'hi' ? 'अवसर:' : 'Occasion:'}
            </span>
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  selectedOccasion === occ
                    ? 'bg-[#8C6D23] text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {occ === 'All' ? (language === 'hi' ? 'सभी अवसर' : 'All') : occ}
              </button>
            ))}
          </div>
        </div>

        {/* Sarees Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(filtered.length > 0 ? filtered : sareeProducts).slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
