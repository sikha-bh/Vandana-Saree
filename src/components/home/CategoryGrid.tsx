import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-[#FCF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'hi' ? 'दुकान की मुख्य श्रेणियां' : 'Shop by Category'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif">
              {language === 'hi' ? 'हर पीढ़ी और परिवार के लिए वस्त्र' : 'Clothing for Every Generation'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mt-2 sm:mt-0">
            {language === 'hi'
              ? 'साड़ियों से लेकर बच्चों के कपड़ों तक, सब कुछ एक ही छत के नीचे।'
              : 'From royal heritage sarees to cozy baby essentials, all under one roof.'}
          </p>
        </div>

        {/* 5-Card Grid: Sarees takes featured spotlight */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer bg-white border border-[#D4AF37]/30 shadow-md hover:shadow-2xl transition-all duration-300 card-3d"
            >
              {/* Image Container with Zoom & Gradient */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-[#721B29]/90" />

                {/* Highlight Badge */}
                {idx === 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white bg-[#721B29] rounded-md shadow-md">
                    {language === 'hi' ? 'विशेष संग्रह' : 'Most Popular'}
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold font-serif leading-tight">
                    {language === 'hi' ? cat.name_hi : cat.name}
                  </h3>
                  <p className="text-[11px] text-neutral-200 line-clamp-1 mt-0.5 opacity-90 group-hover:opacity-100">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#F3E5AB] mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                    <span>{language === 'hi' ? 'कपड़े देखें' : 'Explore'}</span>
                    <ArrowRight className="w-3 h-3" />
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
