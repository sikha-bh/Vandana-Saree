import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResultsCount: number;
}

const FABRIC_OPTIONS = ['Banarasi Silk', 'Chanderi', 'Georgette', 'Cotton', 'Art Silk', 'Silk Blend', 'Organic Cotton', 'Jacquard Silk'];
const COLOR_OPTIONS = ['Red', 'Green', 'Black', 'Yellow', 'Blue', 'Pink', 'White', 'Maroon', 'Multicolor'];
const OCCASION_OPTIONS = ['Wedding', 'Festival', 'Party', 'Daily Wear', 'Casual'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  totalResultsCount,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const toggleFabric = (fab: string) => {
    const next = filters.fabrics.includes(fab)
      ? filters.fabrics.filter((f) => f !== fab)
      : [...filters.fabrics, fab];
    onFilterChange({ ...filters, fabrics: next });
  };

  const toggleColor = (col: string) => {
    const next = filters.colors.includes(col)
      ? filters.colors.filter((c) => c !== col)
      : [...filters.colors, col];
    onFilterChange({ ...filters, colors: next });
  };

  const toggleOccasion = (occ: string) => {
    const next = filters.occasions.includes(occ)
      ? filters.occasions.filter((o) => o !== occ)
      : [...filters.occasions, occ];
    onFilterChange({ ...filters, occasions: next });
  };

  const setPriceRange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-[#FCF9F5] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 bg-white flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-neutral-900">{t.filters.filterBy}</h3>
              <p className="text-xs text-neutral-500">{totalResultsCount} products found</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="text-xs text-[#721B29] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.filters.clearAll}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                {t.filters.priceRange}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'All Prices', min: undefined, max: undefined },
                  { label: 'Under ₹1,000', min: 0, max: 1000 },
                  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
                  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
                  { label: 'Above ₹5,000', min: 5000, max: undefined },
                ].map((p, idx) => {
                  const isActive = filters.minPrice === p.min && filters.maxPrice === p.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => setPriceRange(p.min, p.max)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        isActive
                          ? 'border-[#721B29] bg-[#721B29] text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabrics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                {language === 'hi' ? 'कपड़ा (Fabric)' : 'Fabric'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {FABRIC_OPTIONS.map((fab) => {
                  const isSelected = filters.fabrics.includes(fab);
                  return (
                    <button
                      key={fab}
                      onClick={() => toggleFabric(fab)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#721B29] bg-[#721B29] text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#F3E5AB]" />}
                      <span>{fab}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                {language === 'hi' ? 'रंग (Color)' : 'Color'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((col) => {
                  const isSelected = filters.colors.includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => toggleColor(col)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#8C6D23] bg-[#8C6D23] text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#F3E5AB]" />}
                      <span>{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                {language === 'hi' ? 'अवसर (Occasion)' : 'Occasion'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {OCCASION_OPTIONS.map((occ) => {
                  const isSelected = filters.occasions.includes(occ);
                  return (
                    <button
                      key={occ}
                      onClick={() => toggleOccasion(occ)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#721B29] bg-[#721B29] text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#F3E5AB]" />}
                      <span>{occ}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Stock Only Toggle */}
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800">{t.filters.inStockOnly}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  filters.inStockOnly ? 'bg-[#721B29]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    filters.inStockOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-white border-t border-neutral-200 shadow-lg">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#721B29] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-[#56131F] transition-colors"
            >
              {language === 'hi' ? `फ़िल्टर लागू करें (${totalResultsCount})` : `Show ${totalResultsCount} Results`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
