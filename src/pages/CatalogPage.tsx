import React, { useState, useEffect } from 'react';
import { Filter, ArrowUpDown, Sparkles, X, RotateCcw } from 'lucide-react';
import { Product, FilterState } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/catalog/ProductCard';
import { FilterDrawer } from '../components/catalog/FilterDrawer';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface CatalogPageProps {
  currentCategorySlug?: string;
  initialSearchQuery?: string;
  initialOccasion?: string;
  onNavigate: (route: string, params?: any) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  currentCategorySlug,
  initialSearchQuery,
  initialOccasion,
  onNavigate,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    categorySlug: currentCategorySlug || '',
    minPrice: undefined,
    maxPrice: undefined,
    fabrics: [],
    colors: [],
    occasions: initialOccasion ? [initialOccasion] : [],
    genders: [],
    sizes: [],
    inStockOnly: false,
    sortBy: 'popular',
    searchQuery: initialSearchQuery || '',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categorySlug: currentCategorySlug || '',
      searchQuery: initialSearchQuery || '',
      occasions: initialOccasion ? [initialOccasion] : prev.occasions,
    }));
  }, [currentCategorySlug, initialSearchQuery, initialOccasion]);

  useEffect(() => {
    setLoading(true);
    productService
      .getProducts(filters)
      .then((data) => {
        setProducts(data);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const activeFiltersCount =
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    filters.fabrics.length +
    filters.colors.length +
    filters.occasions.length +
    (filters.inStockOnly ? 1 : 0);

  const handleResetFilters = () => {
    setFilters({
      categorySlug: currentCategorySlug || '',
      minPrice: undefined,
      maxPrice: undefined,
      fabrics: [],
      colors: [],
      occasions: [],
      genders: [],
      sizes: [],
      inStockOnly: false,
      sortBy: 'popular',
      searchQuery: '',
    });
  };

  const getPageTitle = () => {
    if (filters.searchQuery) {
      return language === 'hi'
        ? `खोज परिणाम: "${filters.searchQuery}"`
        : `Search Results: "${filters.searchQuery}"`;
    }
    if (currentCategorySlug === 'sarees') return language === 'hi' ? 'शाही साड़ियां (Sarees)' : 'Royal Sarees';
    if (currentCategorySlug === 'women') return language === 'hi' ? 'महिला परिधान (Women)' : "Women's Collection";
    if (currentCategorySlug === 'men') return language === 'hi' ? 'पुरुष परिधान (Men)' : "Men's Collection";
    if (currentCategorySlug === 'kids') return language === 'hi' ? 'बच्चों के कपड़े (Kids)' : "Kids' Wear";
    if (currentCategorySlug === 'baby') return language === 'hi' ? 'शिशु वस्त्र (Baby)' : 'Baby Care & Essentials';
    if (currentCategorySlug === 'new-arrivals') return language === 'hi' ? 'नई आवक (New Arrivals)' : 'New Arrivals';
    if (currentCategorySlug === 'offers') return language === 'hi' ? 'खास छूट वाले कपड़े (Offers)' : 'Festive Deals & Offers';
    return language === 'hi' ? 'संपूर्ण वस्त्र संग्रह' : 'Complete Clothing Collection';
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Heading */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <button onClick={() => onNavigate('home')} className="hover:text-[#721B29]">
              {t.nav.home}
            </button>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">{getPageTitle()}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#721B29] font-serif leading-tight">
                {getPageTitle()}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                {language === 'hi'
                  ? `कुल ${products.length} कपड़े उपलब्ध हैं। 100% असली व टिकाऊ सामग्री।`
                  : `Showing ${products.length} authentic handpicked garments with guaranteed quality.`}
              </p>
            </div>

            {/* Controls Bar (Filter Button & Sort Select) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D4AF37]/50 rounded-2xl text-xs font-bold text-[#721B29] shadow-xs hover:bg-[#721B29] hover:text-white transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>{t.filters.filterBy}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#721B29] text-white flex items-center justify-center text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="appearance-none bg-white border border-neutral-300 rounded-2xl py-2.5 pl-3 pr-8 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-[#721B29] shadow-xs cursor-pointer"
                >
                  <option value="popular">{t.filters.popular}</option>
                  <option value="newest">{t.filters.newest}</option>
                  <option value="price-low">{t.filters.priceAsc}</option>
                  <option value="price-high">{t.filters.priceDesc}</option>
                  <option value="rating">{t.filters.rating}</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-3 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <span className="text-xs font-bold text-neutral-500 mr-1">Active:</span>

            {filters.minPrice !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#721B29]/10 text-[#721B29] text-xs font-semibold">
                Price: ₹{filters.minPrice} - ₹{filters.maxPrice || '∞'}
                <button
                  onClick={() => setFilters({ ...filters, minPrice: undefined, maxPrice: undefined })}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.fabrics.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#721B29]/10 text-[#721B29] text-xs font-semibold"
              >
                {f}
                <button
                  onClick={() =>
                    setFilters({ ...filters, fabrics: filters.fabrics.filter((x) => x !== f) })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.colors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#8C6D23]/10 text-[#8C6D23] text-xs font-semibold"
              >
                {c}
                <button
                  onClick={() =>
                    setFilters({ ...filters, colors: filters.colors.filter((x) => x !== c) })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 underline ml-auto"
            >
              {t.filters.clearAll}
            </button>
          </div>
        )}

        {/* Product Grid / Empty State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 animate-pulse">
                <div className="aspect-[4/5] bg-neutral-200 rounded-xl mb-3" />
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4" />
                <div className="h-6 bg-neutral-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D4AF37]/30 shadow-md my-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#721B29]/10 text-[#721B29] mx-auto flex items-center justify-center mb-4">
              <RotateCcw className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold font-serif text-neutral-800 mb-2">
              {language === 'hi' ? 'कोई कपड़ा नहीं मिला' : 'No Garments Found'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              {language === 'hi'
                ? 'आपके द्वारा चुने गए फ़िल्टर या खोज शब्द में कोई कपड़ा नहीं मिला। कृपया फ़िल्टर हटाएं या दूसरा शब्द खोजें।'
                : 'Try adjusting your filters or search keywords to explore our wide collection.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#721B29] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#56131F] transition-colors"
            >
              {t.filters.clearAll}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => onNavigate('product-detail', { slug: p.slug })}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalResultsCount={products.length}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigateToDetail={(slug) => onNavigate('product-detail', { slug })}
        onBuyNow={(prod, size) => {
          addToCart(prod, size, 1);
          onNavigate('checkout');
        }}
      />
    </div>
  );
};
