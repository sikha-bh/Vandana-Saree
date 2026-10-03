import React from 'react';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Review } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-[#FCF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.product.reviews}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
            {language === 'hi' ? 'ग्राहकों का अटूट विश्वास' : 'Loved by Families Across India'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            {language === 'hi'
              ? 'देखें हमारे सम्मानित ग्राहक वंदना साड़ी सेंटर के बारे में क्या कहते हैं।'
              : 'Real verified feedback from customers who celebrate life in our clothes.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">{rev.created_at}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed mb-4">
                  "{rev.review_text}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{rev.user_name || 'Customer'}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{language === 'hi' ? 'सत्यापित खरीदार' : 'Verified Buyer'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
