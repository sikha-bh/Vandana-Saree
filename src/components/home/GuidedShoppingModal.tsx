import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Product, GuidedShoppingState } from '../../types';
import { productService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

interface GuidedShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const GuidedShoppingModal: React.FC<GuidedShoppingModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<GuidedShoppingState>({
    targetPerson: '',
    occasion: '',
    budgetRange: '',
  });

  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAnswers({ targetPerson: '', occasion: '', budgetRange: '' });
      setMatchedProducts([]);
    }
  }, [isOpen]);

  const handleFetchMatches = async () => {
    setLoading(true);
    setStep(4);
    const all = await productService.getProducts();

    let filtered = all;

    // Filter by target Person
    if (answers.targetPerson) {
      if (answers.targetPerson === 'men') {
        filtered = filtered.filter((p) => p.gender === 'men' || p.category_slug === 'men');
      } else if (answers.targetPerson === 'women') {
        filtered = filtered.filter((p) => p.gender === 'women' || p.category_slug === 'women' || p.category_slug === 'sarees');
      } else if (answers.targetPerson === 'boys') {
        filtered = filtered.filter((p) => p.gender === 'boys' || (p.category_slug === 'kids' && p.gender !== 'girls'));
      } else if (answers.targetPerson === 'girls') {
        filtered = filtered.filter((p) => p.gender === 'girls' || (p.category_slug === 'kids' && p.gender !== 'boys'));
      } else if (answers.targetPerson === 'baby') {
        filtered = filtered.filter((p) => p.gender === 'baby' || p.category_slug === 'baby');
      }
    }

    // Filter by occasion
    if (answers.occasion) {
      const occMap: Record<string, string> = {
        wedding: 'Wedding',
        festival: 'Festival',
        party: 'Party',
        daily: 'Daily Wear',
        office: 'Casual',
      };
      const targetOcc = occMap[answers.occasion];
      if (targetOcc) {
        const withOcc = filtered.filter((p) => p.occasion === targetOcc);
        if (withOcc.length > 0) filtered = withOcc;
      }
    }

    // Filter by budget
    if (answers.budgetRange) {
      if (answers.budgetRange === 'under500') {
        filtered = filtered.filter((p) => p.price <= 500);
      } else if (answers.budgetRange === 'under1000') {
        filtered = filtered.filter((p) => p.price <= 1000);
      } else if (answers.budgetRange === 'under2000') {
        filtered = filtered.filter((p) => p.price <= 2000);
      } else if (answers.budgetRange === 'under5000') {
        filtered = filtered.filter((p) => p.price <= 5000);
      } else if (answers.budgetRange === 'above5000') {
        filtered = filtered.filter((p) => p.price > 5000);
      }
    }

    setMatchedProducts(filtered.slice(0, 6));
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FCF9F5] border border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#721B29] to-[#56131F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F3E5AB]" />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif">{t.guided.trigger}</h3>
              <p className="text-xs text-[#F3E5AB]/90">{t.guided.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-3 bg-neutral-200 h-1.5">
          <div className={`h-full bg-[#D4AF37] ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`h-full bg-[#D4AF37] ${step >= 2 ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`h-full bg-[#D4AF37] ${step >= 3 ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Step Contents */}
        <div className="p-5 sm:p-8">
          {/* STEP 1: For Whom? */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
                {t.guided.step1}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'women', label: t.guided.women, icon: '💃' },
                  { key: 'men', label: t.guided.men, icon: '🕺' },
                  { key: 'girls', label: t.guided.girls, icon: '👧' },
                  { key: 'boys', label: t.guided.boys, icon: '👦' },
                  { key: 'baby', label: t.guided.baby, icon: '👶' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setAnswers({ ...answers, targetPerson: item.key as any });
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col items-center justify-center gap-2 ${
                      answers.targetPerson === item.key
                        ? 'border-[#721B29] bg-[#721B29]/10 text-[#721B29] font-bold shadow-md'
                        : 'border-neutral-200 bg-white hover:border-[#D4AF37] hover:bg-amber-50/30'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Occasion? */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
                  {t.guided.step2}
                </h4>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'wedding', label: language === 'hi' ? 'शादी-विवाह (Wedding)' : 'Wedding Celebrations' },
                  { key: 'festival', label: language === 'hi' ? 'त्योहार व पूजा (Festival)' : 'Festivals & Puja' },
                  { key: 'party', label: language === 'hi' ? 'पार्टी व रिसेप्शन (Party)' : 'Party & Reception' },
                  { key: 'daily', label: language === 'hi' ? 'रोज़मर्रा के लिए (Daily Wear)' : 'Comfortable Daily Wear' },
                  { key: 'office', label: language === 'hi' ? 'ऑफिस / सामान्य (Office)' : 'Office & Formal' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setAnswers({ ...answers, occasion: item.key as any });
                      setStep(3);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      answers.occasion === item.key
                        ? 'border-[#721B29] bg-[#721B29]/10 text-[#721B29] font-bold shadow-md'
                        : 'border-neutral-200 bg-white hover:border-[#D4AF37] hover:bg-amber-50/30'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold block">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Budget Range? */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 font-serif">
                  {t.guided.step3}
                </h4>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'under500', label: t.guided.under500 },
                  { key: 'under1000', label: t.guided.under1000 },
                  { key: 'under2000', label: t.guided.under2000 },
                  { key: 'under5000', label: t.guided.under5000 },
                  { key: 'above5000', label: t.guided.above5000 },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setAnswers({ ...answers, budgetRange: item.key as any });
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
                      answers.budgetRange === item.key
                        ? 'border-[#721B29] bg-[#721B29] text-white font-bold shadow-md'
                        : 'border-neutral-200 bg-white hover:border-[#D4AF37] text-neutral-800'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleFetchMatches}
                  disabled={!answers.budgetRange}
                  className="px-6 py-3 bg-[#721B29] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-[#56131F] disabled:opacity-40 flex items-center gap-2 transition-all"
                >
                  <span>{t.guided.viewMatches}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h4 className="text-base font-bold text-neutral-900 font-serif">
                    {language === 'hi' ? 'आपके चयन के अनुसार कपड़े' : 'Matched Outfits for You'}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    {matchedProducts.length} items found
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#721B29] underline"
                >
                  {language === 'hi' ? 'दोबारा चुनें (Restart)' : 'Change filters'}
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-neutral-500">
                  खोज रहे हैं... Finding ideal clothes...
                </div>
              ) : matchedProducts.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-neutral-600 mb-3">{t.guided.noMatches}</p>
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-[#721B29] text-white text-xs font-bold rounded-xl"
                  >
                    Try broader budget
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                  {matchedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-neutral-200 rounded-2xl overflow-hidden p-2 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
                    >
                      <div
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="cursor-pointer"
                      >
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                          alt={p.name}
                          className="w-full aspect-[4/5] object-cover rounded-xl mb-2"
                        />
                        <h5 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {language === 'hi' ? p.name_hi || p.name : p.name}
                        </h5>
                        <p className="text-xs font-bold text-[#721B29] mt-0.5">
                          {formatCurrency(p.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => addToCart(p)}
                        className="w-full mt-2 py-1.5 px-2 bg-[#721B29]/10 hover:bg-[#721B29] text-[#721B29] hover:text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{t.product.addToCart}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
