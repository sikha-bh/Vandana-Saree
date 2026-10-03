import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, HelpCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { createInquiryWhatsAppUrl } from '../../utils/whatsapp';

export const StoreInfoSection: React.FC = () => {
  const { language, t } = useLanguage();
  const STORE_PHONE = import.meta.env.VITE_STORE_PHONE || '+91 98765 43210';
  const cleanPhone = STORE_PHONE.replace(/[^0-9+]/g, '');

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF4EB] to-[#F2EBE0] border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Direct Ordering Callouts */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'hi' ? 'फोन व व्हाट्सएप पर आसान ऑर्डर' : 'Direct Order Over Phone'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#721B29] font-serif leading-tight">
                {language === 'hi'
                  ? 'ऑनलाइन समझ न आए? सीधा कॉल या व्हाट्सएप करें!'
                  : 'Prefer Speaking to Us Directly? Just Call or WhatsApp!'}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {language === 'hi'
                  ? 'यदि आपको ऑनलाइन ऑर्डर करने में कोई भी कठिनाई हो रही है, तो चिंता न करें। हमारे दुकानदार भाई से सीधे फोन पर बात करें या व्हाट्सएप पर कपड़े की फोटो भेजकर ऑर्डर दें।'
                  : 'If you are ordering online for the first time or need assistance choosing fabrics, our store experts are ready to assist you by phone or WhatsApp.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-6 py-3.5 bg-[#721B29] hover:bg-[#56131F] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-transform transform active:scale-95"
                >
                  <Phone className="w-4 h-4 text-[#F3E5AB]" />
                  <span>{t.store.callNow}: {STORE_PHONE}</span>
                </a>

                <a
                  href={createInquiryWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-transform transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-[#A7F3D0]" />
                  <span>{t.store.chatWhatsApp}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Physical Address & Timings */}
            <div className="lg:col-span-5 bg-[#FCF9F5] p-6 rounded-2xl border border-neutral-200 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8C6D23] font-serif">
                {t.store.heading}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#721B29] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {language === 'hi' ? 'दुकान का पता:' : 'Store Address:'}
                    </p>
                    <p className="text-neutral-600">{t.store.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#721B29] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {language === 'hi' ? 'दुकान खुलने का समय:' : 'Store Timings:'}
                    </p>
                    <p className="text-neutral-600">{t.store.timings}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {language === 'hi' ? 'दुकान पर सुविधा:' : 'In-Store Trial:'}
                    </p>
                    <p className="text-neutral-600">
                      {language === 'hi'
                        ? 'आराम से बैठकर कपड़े देखें, ट्राय करें और पारिवारिक खरीदारी का आनंद लें।'
                        : 'Spacious trial rooms, dedicated assistants, and complimentary tea for families.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
