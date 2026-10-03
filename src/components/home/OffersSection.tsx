import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check } from 'lucide-react';
import { Coupon } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

interface OffersSectionProps {
  coupons: Coupon[];
  onShopWithCoupon: (code: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ coupons, onShopWithCoupon }) => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`कूपन कोड "${code}" कॉपी हो गया!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF4EB] border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'hi' ? 'विशेष छूट व कूपन' : 'Festive Offers & Coupons'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
            {language === 'hi' ? 'हर खरीदारी पर बचत ही बचत' : 'Extra Savings on Every Order'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            {language === 'hi'
              ? 'चेकआउट करते समय नीचे दिए गए कूपन कोड का उपयोग करें।'
              : 'Apply these coupon codes at checkout to unlock instant discounts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative bg-white rounded-3xl p-5 border-2 border-dashed border-[#D4AF37] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="px-3 py-1 bg-[#721B29]/10 text-[#721B29] rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{coupon.code}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-neutral-800 mt-2">
                  {coupon.description}
                </p>

                <p className="text-[11px] text-neutral-500 mt-1">
                  {language === 'hi'
                    ? `न्यूनतम खरीदारी: ₹${coupon.minimum_order_amount}`
                    : `Minimum Order: ₹${coupon.minimum_order_amount}`}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{language === 'hi' ? 'कोड कॉपी करें' : 'Copy Code'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onShopWithCoupon(coupon.code)}
                  className="py-2 px-4 text-xs font-bold text-white bg-[#721B29] hover:bg-[#56131F] rounded-xl transition-colors"
                >
                  {language === 'hi' ? 'खरीदें' : 'Shop Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
