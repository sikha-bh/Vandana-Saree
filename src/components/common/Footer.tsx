import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Truck, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const STORE_PHONE = import.meta.env.VITE_STORE_PHONE || '+91 98765 43210';
  const STORE_WHATSAPP = import.meta.env.VITE_STORE_WHATSAPP || '919876543210';

  return (
    <footer className="bg-[#1C1717] text-[#EDE7DF] border-t-2 border-[#D4AF37]/40 relative overflow-hidden">
      {/* Decorative top Indian motif line */}
      <div className="indian-border-top" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif text-[#F3E5AB]">
                {language === 'hi' ? 'वंदना साड़ी सेंटर' : 'Vandna Saree Center'}
              </span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              {t.brand.tagline}
            </p>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              {language === 'hi'
                ? 'पिछले 25 वर्षों से परिवारों के हर शुभ अवसर, शादी-विवाह और त्योहारों को सजाता आपका अपना वस्त्रालय। असली बनारसी साड़ियां, पारिवारिक परिधान और अटूट विश्वास।'
                : 'Celebrating Indian traditions and family milestones for over 25 years. Offering handwoven Banarasi silks, designer suits, elegant menswear, and joyful kids collections.'}
            </p>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`tel:${STORE_PHONE.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#721B29] text-white text-xs font-bold hover:bg-[#8A2234] transition-all shadow-md"
              >
                <Phone className="w-3.5 h-3.5 text-[#F3E5AB]" />
                <span>{language === 'hi' ? 'फोन पर बात करें' : 'Call Store'}</span>
              </a>

              <a
                href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent('नमस्ते वंदना साड़ी सेंटर!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4 font-serif">
              {language === 'hi' ? 'लोकप्रिय श्रेणियां' : 'Top Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button onClick={() => onNavigate('sarees')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'शाही बनारसी साड़ियां' : 'Royal Banarasi Sarees'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('women')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'अनारकली व पार्टी वियर सूट' : 'Anarkali & Designer Suits'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('men')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'कुर्ता पजामा व नेहरू जैकेट' : 'Kurta Pajamas & Nehru Jackets'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kids')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'बच्चों के लहंगे व धोती कुर्ता' : 'Kids Lehengas & Dhoti Sets'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('baby')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'नवजात शिशु के वस्त्र (झबला)' : 'Newborn Jhablas & Cotton Sets'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="text-amber-400 font-semibold hover:text-amber-300">
                  {language === 'hi' ? 'त्योहारों की विशेष छूट %' : 'Festive Offers & Coupons %'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Trust & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4 font-serif">
              {language === 'hi' ? 'ग्राहक सेवा व नीतियां' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Your Order'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guided-shopping')} className="hover:text-[#F3E5AB] transition-colors">
                  {language === 'hi' ? 'मुझे कपड़े चाहिए (गाइड)' : 'Guided Outfit Finder'}
                </button>
              </li>
              <li>
                <span className="block text-neutral-400">
                  {language === 'hi' ? 'डिलीवरी नीति (3-5 दिन)' : 'Shipping Policy (3-5 Days)'}
                </span>
              </li>
              <li>
                <span className="block text-neutral-400">
                  {language === 'hi' ? '7 दिन में आसान अदला-बदली' : '7-Day Easy Exchange'}
                </span>
              </li>
              <li>
                <span className="block text-neutral-400">
                  {language === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery terms'}
                </span>
              </li>
            </ul>
          </div>

          {/* Physical Store Address & Timings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4 font-serif">
              {language === 'hi' ? 'दुकान का पता व समय' : 'Store Location'}
            </h4>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {language === 'hi'
                    ? 'मेन मार्केट, स्टेशन रोड, घंटा घर के पास, सिटी सेंटर'
                    : 'Main Market, Station Road, Near Ghanta Ghar, City Center'}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {language === 'hi'
                    ? 'सोमवार - रविवार: सुबह 10:00 से रात 9:00 बजे तक'
                    : 'Monday - Sunday: 10:00 AM - 9:00 PM'}
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-neutral-400">
                  {language === 'hi'
                    ? 'दुकान पर आकर भी कपड़े देख और ट्राय कर सकते हैं।'
                    : 'You can also visit our physical shop to view & try outfits in person.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Trust Badges in Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
            <Truck className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-xs font-bold text-neutral-200">
                {language === 'hi' ? 'सुरक्षित डिलीवरी' : 'Fast & Safe Delivery'}
              </p>
              <p className="text-[10px] text-neutral-400">
                {language === 'hi' ? 'सीधे आपके घर के दरवाजे तक' : 'Directly to your doorstep'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-xs font-bold text-neutral-200">
                {language === 'hi' ? '100% असली कपड़ा' : '100% Genuine Fabrics'}
              </p>
              <p className="text-[10px] text-neutral-400">
                {language === 'hi' ? 'कारीगरों द्वारा तैयार बुनाई' : 'Authentic Indian handlooms'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
            <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-xs font-bold text-neutral-200">
                {language === 'hi' ? 'आसान एक्सचेंज' : 'Hassle-Free Exchange'}
              </p>
              <p className="text-[10px] text-neutral-400">
                {language === 'hi' ? 'साइज़ या पसंद न आने पर 7 दिन में' : 'Within 7 days of delivery'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>© {new Date().getFullYear()} Vandna Saree Center. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian Families</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
