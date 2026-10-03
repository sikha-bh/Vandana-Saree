import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface OccasionSectionProps {
  onSelectOccasion: (occasion: string) => void;
}

const OCCASIONS = [
  {
    key: 'Wedding',
    title_en: 'Wedding Celebrations',
    title_hi: 'शादी के लिए कपड़े चाहिए?',
    desc_en: 'Heavy Banarasi sarees, wedding Anarkalis & Sherwani style sets',
    desc_hi: 'शादी-विवाह, बारात और सगाई के लिए भारी जरी वाले शाही परिधान',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    tag: 'शादी स्पेशल',
  },
  {
    key: 'Festival',
    title_en: 'Festivals & Puja',
    title_hi: 'त्योहार के लिए कुछ खास?',
    desc_en: 'Diwali, Chhath, Raksha Bandhan & Karwa Chauth collections',
    desc_hi: 'दीपावली, छठ, करवाचौथ और तीज-त्योहारों के पारंपरिक वस्त्र',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    tag: 'शुभ अवसर',
  },
  {
    key: 'Party',
    title_en: 'Party & Reception',
    title_hi: 'पार्टी व रिसेप्शन लुक',
    desc_en: 'Glamorous georgette sarees, western gowns and chic suits',
    desc_hi: 'शाम की पार्टी, रिसेप्शन व संगीत के लिए ट्रेंडी कपड़े',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    tag: 'ट्रेंडिंग स्टाइल',
  },
  {
    key: 'Daily Wear',
    title_en: 'Comfortable Daily Wear',
    title_hi: 'रोज़मर्रा के लिए आरामदायक',
    desc_en: 'Pure breathable cotton suits, daily sarees & soft fabrics',
    desc_hi: 'घर पर या बाज़ार जाने के लिए हल्के व आरामदायक सूती कपड़े',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80',
    tag: 'आरामदायक कॉटन',
  },
  {
    key: 'Casual',
    title_en: 'Casual & Office',
    title_hi: 'ऑफिस व सामान्य पहनावा',
    desc_en: 'Elegant Lucknowi kurtis, classic shirts & linen sets',
    desc_hi: 'दफ्तर, कॉलेज या मीटिंग के लिए सुरुचिपूर्ण शालीन परिधान',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80',
    tag: 'शालीन अंदाज',
  },
];

export const OccasionSection: React.FC<OccasionSectionProps> = ({ onSelectOccasion }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FCF9F5] to-[#F7F2E7] border-y border-[#D4AF37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.occasions.title}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#721B29] font-serif">
            {language === 'hi' ? 'हर शुभ अवसर के लिए मनपसंद कपड़े' : 'Curated Outfits for Every Celebration'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            {t.occasions.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {OCCASIONS.map((item, idx) => (
            <div
              key={item.key}
              onClick={() => onSelectOccasion(item.key)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 card-3d ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.title_en}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Corner Tag */}
                <div className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[11px] font-extrabold text-[#241E1C] bg-[#F3E5AB] rounded-lg shadow-sm">
                  {item.tag}
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white flex flex-col justify-end">
                  <h3 className="text-lg sm:text-xl font-bold font-serif leading-snug">
                    {language === 'hi' ? item.title_hi : item.title_en}
                  </h3>
                  <p className="text-xs text-neutral-200 mt-1 line-clamp-2 leading-relaxed">
                    {language === 'hi' ? item.desc_hi : item.desc_en}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F3E5AB] mt-3 group-hover:translate-x-1 transition-transform">
                    <span>{language === 'hi' ? 'इस अवसर के कपड़े देखें' : 'View Collection'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
