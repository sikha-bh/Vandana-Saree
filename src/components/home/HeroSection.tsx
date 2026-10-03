import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreSarees: () => void;
  onOpenGuidedShopping: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreSarees,
  onOpenGuidedShopping,
}) => {
  const { language, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EB] via-[#F7EDE0] to-[#FCF9F5] pt-6 sm:pt-10 pb-16 sm:pb-24 border-b border-[#D4AF37]/30">
      {/* Background Indian ornamental ambient circles & textures */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#721B29]/15 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/50 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs font-bold text-[#721B29] tracking-wide">
                {t.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#721B29] tracking-tight leading-[1.15] font-serif">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl font-semibold text-[#8C6D23] font-serif">
              {t.hero.subtitle}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              {t.hero.description}
            </p>

            {/* Buttons Group */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="px-6 sm:px-8 py-3.5 bg-[#721B29] hover:bg-[#56131F] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-95 flex items-center gap-2"
              >
                <span>{t.hero.shopNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSarees}
                className="px-5 sm:px-7 py-3.5 bg-white/90 hover:bg-white text-[#721B29] border-2 border-[#D4AF37] text-xs sm:text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
              >
                {t.hero.exploreSarees}
              </button>

              <button
                onClick={onOpenGuidedShopping}
                className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B38728] hover:from-[#C59B27] hover:to-[#996515] text-[#241E1C] text-xs sm:text-sm font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{t.hero.mujheKapdeChahiye}</span>
              </button>
            </div>

            {/* 3 Pillars of Trust */}
            <div className="pt-4 grid grid-cols-3 gap-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-neutral-200/60 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#721B29] shrink-0" />
                <span className="text-[11px] leading-tight">{t.hero.trust1}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-neutral-200/60 shadow-2xs">
                <Truck className="w-4 h-4 text-[#721B29] shrink-0" />
                <span className="text-[11px] leading-tight">{t.hero.trust2}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white/70 backdrop-blur-xs p-2 rounded-xl border border-neutral-200/60 shadow-2xs">
                <RefreshCw className="w-4 h-4 text-[#721B29] shrink-0" />
                <span className="text-[11px] leading-tight">{t.hero.trust3}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Layered Fashion Imagery & Showcase Card */}
          <div className="lg:col-span-5 relative perspective-1000">
            <div className="relative mx-auto max-w-sm sm:max-w-md transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Outer Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] to-[#721B29] rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />

              {/* Main Card */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 card-3d">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                    alt="Royal Banarasi Saree Showcase"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1717]/80 via-transparent to-transparent" />

                  {/* Floating Glass Feature Tag */}
                  <div className="absolute top-4 left-4 glass-card px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-extrabold text-[#721B29]">
                      {language === 'hi' ? 'विशेष शादी संग्रह' : 'Wedding Season Special'}
                    </span>
                  </div>

                  {/* Bottom overlay text */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass-card-dark rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                          {language === 'hi' ? 'शाही बनारसी कतान' : 'Pure Katan Handloom'}
                        </p>
                        <h4 className="text-sm sm:text-base font-bold font-serif text-[#FCF9F5]">
                          {language === 'hi' ? 'शाही लाल बनारसी सिल्क साड़ी' : 'Royal Crimson Banarasi Saree'}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-300 line-through">₹4,999</span>
                        <p className="text-lg font-bold text-[#F3E5AB]">₹2,499</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating 3D Mini Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 glass-card p-3 rounded-2xl shadow-xl border border-[#D4AF37]/40 items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-[#721B29] text-white flex items-center justify-center font-bold text-sm shadow-md">
                  50%
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 leading-tight">
                    {language === 'hi' ? 'धमाका छूट' : 'Special Festive Off'}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {language === 'hi' ? 'सीमित समय के लिए' : 'Limited time stock'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
