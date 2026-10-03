import React from 'react';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { language } = useLanguage();
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D4AF37]/30 shadow-lg px-2 py-1.5 safe-bottom">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 min-h-[46px] rounded-xl transition-colors ${
            currentRoute === 'home' ? 'text-[#721B29] font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => onNavigate('categories')}
          className={`flex flex-col items-center justify-center py-1 min-h-[46px] rounded-xl transition-colors ${
            ['categories', 'sarees', 'women', 'men', 'kids', 'baby'].includes(currentRoute)
              ? 'text-[#721B29] font-bold'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === 'hi' ? 'श्रेणियां' : 'Categories'}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => {
            if (onOpenSearch) onOpenSearch();
            else onNavigate('search');
          }}
          className={`flex flex-col items-center justify-center py-1 min-h-[46px] rounded-xl transition-colors ${
            currentRoute === 'search' ? 'text-[#721B29] font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === 'hi' ? 'खोजें' : 'Search'}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 min-h-[46px] rounded-xl transition-colors text-neutral-500 hover:text-neutral-900"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#721B29]" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-[#721B29] rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{language === 'hi' ? 'थैला' : 'Cart'}</span>
        </button>

        {/* Account */}
        <button
          onClick={() => onNavigate('account')}
          className={`flex flex-col items-center justify-center py-1 min-h-[46px] rounded-xl transition-colors ${
            currentRoute === 'account' ? 'text-[#721B29] font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{language === 'hi' ? 'खाता' : 'Account'}</span>
        </button>
      </div>
    </div>
  );
};
