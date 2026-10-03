import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, CheckSquare, Square } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

interface FamilyShoppingSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface FamilyMemberConfig {
  roleKey: 'father' | 'mother' | 'son' | 'daughter';
  title_en: string;
  title_hi: string;
  defaultProductId: string;
  selectedSize: string;
  included: boolean;
}

export const FamilyShoppingSection: React.FC<FamilyShoppingSectionProps> = ({
  products,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();

  const [members, setMembers] = useState<FamilyMemberConfig[]>([
    {
      roleKey: 'father',
      title_en: 'Father (पिता जी)',
      title_hi: 'पिता जी (कुर्ता व नेहरू जैकेट)',
      defaultProductId: 'p7', // Royal Silk Kurta with Nehru Jacket
      selectedSize: '40 (L)',
      included: true,
    },
    {
      roleKey: 'mother',
      title_en: 'Mother (माता जी)',
      title_hi: 'माता जी (शाही बनारसी साड़ी)',
      defaultProductId: 'p1', // Royal Crimson Banarasi Saree
      selectedSize: 'Free Size',
      included: true,
    },
    {
      roleKey: 'son',
      title_en: 'Son (बेटा)',
      title_hi: 'बेटा (फेस्टिव ब्रोकेड कुर्ता धोती)',
      defaultProductId: 'p9', // Boys Festive Dhoti Kurta
      selectedSize: '4-5 Yrs',
      included: true,
    },
    {
      roleKey: 'daughter',
      title_en: 'Daughter (बेटी)',
      title_hi: 'बेटी (गोल्डन जरी लहंगा चोली)',
      defaultProductId: 'p10', // Girls Flared Lehenga
      selectedSize: '5-6 Yrs',
      included: true,
    },
  ]);

  const toggleMember = (index: number) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, included: !m.included } : m))
    );
  };

  const updateMemberSize = (index: number, size: string) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, selectedSize: size } : m))
    );
  };

  // Calculate bundle total
  const selectedItems = members
    .filter((m) => m.included)
    .map((m) => {
      const prod = products.find((p) => p.id === m.defaultProductId) || products[0];
      return { config: m, product: prod };
    });

  const rawTotal = selectedItems.reduce((sum, item) => sum + (item.product?.price || 0), 0);
  const bundleDiscount = Math.round(rawTotal * 0.1); // 10% Family combo discount
  const finalBundlePrice = rawTotal - bundleDiscount;

  const handleAddBundleToCart = () => {
    selectedItems.forEach((item) => {
      if (item.product) {
        addToCart(item.product, item.config.selectedSize, 1);
      }
    });
    setIsCartOpen(true);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FBF7EE] border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#721B29] to-[#450C16] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold ornamental accents */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.family.title}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#FCF9F5]">
              {language === 'hi' ? 'शादी व त्योहारों के लिए मैचिंग पारिवारिक कॉम्बो' : 'Coordinated Festive Harmony for the Entire Family'}
            </h2>
            <p className="text-xs sm:text-sm text-[#EADDC9] mt-2">
              {t.family.subtitle}
            </p>
          </div>

          {/* Family Look Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {members.map((m, idx) => {
              const product = products.find((p) => p.id === m.defaultProductId) || products[0];
              if (!product) return null;

              return (
                <div
                  key={m.roleKey}
                  className={`bg-white rounded-2xl p-3.5 sm:p-4 text-neutral-900 border-2 transition-all ${
                    m.included
                      ? 'border-[#D4AF37] shadow-lg'
                      : 'border-white/30 opacity-60 bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#721B29]">
                      {language === 'hi' ? m.title_hi.split(' ')[0] + ' ' + (m.title_hi.split(' ')[1] || '') : m.title_en}
                    </span>
                    <button
                      onClick={() => toggleMember(idx)}
                      className="text-[#721B29] p-0.5 hover:scale-110 transition-transform"
                      aria-label="Toggle inclusion"
                    >
                      {m.included ? (
                        <CheckSquare className="w-5 h-5 text-[#721B29] fill-[#721B29]/15" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden mb-2.5 cursor-pointer bg-neutral-100"
                  >
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                      {formatCurrency(product.price)}
                    </div>
                  </div>

                  <h4
                    onClick={() => onSelectProduct(product)}
                    className="text-xs font-semibold line-clamp-1 cursor-pointer hover:text-[#721B29]"
                  >
                    {language === 'hi' ? product.name_hi || product.name : product.name}
                  </h4>

                  {/* Size Selector */}
                  <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-500 font-medium">Size:</span>
                    <select
                      value={m.selectedSize}
                      onChange={(e) => updateMemberSize(idx, e.target.value)}
                      disabled={!m.included}
                      className="text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 font-semibold text-neutral-800 focus:outline-none"
                    >
                      {product.variants?.map((v) => (
                        <option key={v.size} value={v.size}>
                          {v.size}
                        </option>
                      )) || <option value="Free Size">Free Size</option>}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bundle Summary Bar & 1-Click Action */}
          <div className="mt-8 pt-6 border-t border-white/20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-black/25 p-4 sm:p-6 rounded-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                  {t.family.totalBundle} ({selectedItems.length} items):
                </span>
                <span className="text-xs text-neutral-300 line-through">
                  {formatCurrency(rawTotal)}
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#F3E5AB]">
                  {formatCurrency(finalBundlePrice)}
                </span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                🎉 {t.family.comboDiscount} (-{formatCurrency(bundleDiscount)})
              </p>
            </div>

            <button
              onClick={handleAddBundleToCart}
              disabled={selectedItems.length === 0}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B38728] hover:from-[#C59B27] hover:to-[#996515] text-[#241E1C] font-extrabold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4 text-[#241E1C]" />
              <span>{t.family.addCombo}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
