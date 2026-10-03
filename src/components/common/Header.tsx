import React, { useState } from 'react';
import {
  Search,
  Mic,
  Heart,
  ShoppingBag,
  User,
  Phone,
  MessageCircle,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { VoiceSearchModal } from './VoiceSearchModal';

interface HeaderProps {
  onNavigate: (route: string, params?: any) => void;
  currentRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentRoute }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { totalCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, isAdmin, switchRole } = useAuth();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const STORE_PHONE = import.meta.env.VITE_STORE_PHONE || '+91 98765 43210';
  const STORE_WHATSAPP = import.meta.env.VITE_STORE_WHATSAPP || '919876543210';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { q: searchQuery.trim() });
    }
  };

  const handleVoiceSearchResult = (query: string, parsedFilters?: any) => {
    setSearchQuery(query);
    onNavigate('search', { q: query, filters: parsedFilters });
  };

  return (
    <>
      {/* Top Announcement & Direct Contact Bar */}
      <div className="bg-[#56131F] text-[#FBF7EE] text-xs py-1.5 px-4 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2 tracking-wide font-medium text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span>
              {language === 'hi'
                ? '✨ पूरे भारत में ₹799 से अधिक पर मुफ्त डिलीवरी • 100% शुद्ध असली कपड़ा • कैश ऑन डिलीवरी उपलब्ध'
                : '✨ Free Delivery across India on orders above ₹799 • 100% Genuine Handcrafted Silks • COD Available'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href={`tel:${STORE_PHONE.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden xs:inline">कॉल करें:</span>
              <span>{STORE_PHONE}</span>
            </a>
            <span className="text-white/40">|</span>
            <a
              href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent('नमस्ते वंदना साड़ी सेंटर! मुझे कपड़ों के बारे में जानकारी चाहिए।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors text-[#98E29A]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp ऑर्डर</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Glass Header */}
      <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-800 hover:text-[#721B29] transition-colors rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="text-left group focus:outline-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#721B29] font-serif group-hover:text-[#56131F] transition-colors">
                  {language === 'hi' ? 'वंदना साड़ी सेंटर' : 'Vandna Saree Center'}
                </span>
                <Sparkles className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] opacity-80 group-hover:rotate-12 transition-transform" />
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#8C6D23] tracking-wider uppercase font-sans">
                {t.brand.tagline}
              </p>
            </button>
          </div>

          {/* Center: Search & Voice Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full py-2.5 pl-10 pr-24 text-sm glass-input rounded-full focus:outline-none text-neutral-800 placeholder-neutral-500 shadow-sm"
              />
              <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="absolute right-2 px-2.5 py-1 flex items-center gap-1 text-xs font-semibold bg-[#721B29]/10 hover:bg-[#721B29] text-[#721B29] hover:text-white rounded-full transition-all duration-200"
                title="बोलकर खोजें"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                <span className="hidden lg:inline">{language === 'hi' ? 'बोलकर खोजें' : 'Voice'}</span>
              </button>
            </form>
          </div>

          {/* Right: Actions (Language, Voice on mobile, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Voice Search Button */}
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="md:hidden p-2 text-[#721B29] bg-[#721B29]/10 rounded-full hover:bg-[#721B29]/20 transition-colors"
              aria-label="बोलकर खोजें"
            >
              <Mic className="w-5 h-5 text-[#D4AF37]" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 text-xs font-bold rounded-full border border-[#D4AF37] bg-white text-[#721B29] hover:bg-[#721B29] hover:text-white transition-all shadow-xs"
              title="Change Language"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-neutral-700 hover:text-[#721B29] transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'text-[#721B29] fill-[#721B29]' : ''}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#721B29] rounded-full">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-[#FBF7EE] bg-[#721B29] hover:bg-[#56131F] rounded-full shadow-md transition-all duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#F3E5AB]" />
              <span className="hidden sm:inline text-xs font-bold">
                {t.nav.cart}
              </span>
              {totalCount > 0 && (
                <span className="flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold text-[#721B29] bg-[#F3E5AB] rounded-full">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Account / Admin Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1 p-2 text-neutral-700 hover:text-[#721B29] transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Account Menu"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 p-2 bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 animate-fade-in"
                  onClick={() => setIsAccountMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-xs text-neutral-500">{language === 'hi' ? 'नमस्ते' : 'Signed in as'}</p>
                    <p className="text-sm font-bold text-neutral-900 truncate">{user?.full_name || 'Customer'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-[#721B29]/10 text-[#721B29]">
                      {user?.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => onNavigate('account')}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      {language === 'hi' ? '👤 मेरा प्रोफाइल व ऑर्डर्स' : '👤 Profile & Orders'}
                    </button>
                    <button
                      onClick={() => onNavigate('orders')}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      {language === 'hi' ? '📦 ऑर्डर ट्रैक करें' : '📦 Track Orders'}
                    </button>
                    <button
                      onClick={() => onNavigate('wishlist')}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      {language === 'hi' ? '❤️ पसंदीदा कपड़े' : '❤️ Wishlist'}
                    </button>

                    <div className="my-1 border-t border-neutral-100" />

                    {/* Admin Switcher for Full-Stack Verification */}
                    <button
                      onClick={() => {
                        const newRole = isAdmin ? 'customer' : 'admin';
                        switchRole(newRole);
                        if (newRole === 'admin') {
                          onNavigate('admin');
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#721B29] hover:bg-[#721B29]/10 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        {isAdmin ? 'Switch to Customer View' : 'Open Admin Suite'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-neutral-200 rounded font-mono">
                        {isAdmin ? 'Admin' : 'Demo'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <div className="hidden lg:block border-t border-[#D4AF37]/20 bg-white/70">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm font-semibold">
            <nav className="flex items-center gap-8 py-2.5">
              {[
                { label: t.nav.home, slug: 'home' },
                { label: t.nav.sarees, slug: 'sarees' },
                { label: t.nav.women, slug: 'women' },
                { label: t.nav.men, slug: 'men' },
                { label: t.nav.kids, slug: 'kids' },
                { label: t.nav.baby, slug: 'baby' },
                { label: t.nav.newArrivals, slug: 'new-arrivals' },
                { label: t.nav.offers, slug: 'offers' },
              ].map((item) => (
                <button
                  key={item.slug}
                  onClick={() => onNavigate(item.slug)}
                  className={`relative py-1 transition-colors hover:text-[#721B29] ${
                    currentRoute === item.slug
                      ? 'text-[#721B29] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#721B29]'
                      : 'text-neutral-700'
                  }`}
                >
                  {item.label}
                  {item.slug === 'sarees' && (
                    <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[#721B29] text-white uppercase tracking-wider">
                      Hot
                    </span>
                  )}
                  {item.slug === 'offers' && (
                    <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#241E1C] uppercase font-bold">
                      Sale
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <button
              onClick={() => onNavigate('guided-shopping')}
              className="px-3.5 py-1 text-xs font-bold text-[#721B29] bg-[#F7EEDD] border border-[#D4AF37]/50 rounded-full hover:bg-[#721B29] hover:text-[#F3E5AB] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.hero.mujheKapdeChahiye}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        <div className="md:hidden px-4 pb-2.5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full py-2 pl-9 pr-10 text-xs glass-input rounded-full focus:outline-none"
            />
            <Search className="absolute left-3 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </form>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FCF9F5] border-t border-neutral-200 px-4 py-4 space-y-2 animate-fade-in shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-200">
              <button
                onClick={() => {
                  onNavigate('guided-shopping');
                  setIsMobileMenuOpen(false);
                }}
                className="col-span-2 py-2.5 px-3 text-xs font-bold text-[#721B29] bg-[#F7EEDD] rounded-xl border border-[#D4AF37]/50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.hero.mujheKapdeChahiye}</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-medium text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => {
                  onNavigate('sarees');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-bold text-[#721B29] text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.sarees} ✨
              </button>
              <button
                onClick={() => {
                  onNavigate('women');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-medium text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.women}
              </button>
              <button
                onClick={() => {
                  onNavigate('men');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-medium text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.men}
              </button>
              <button
                onClick={() => {
                  onNavigate('kids');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-medium text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.kids}
              </button>
              <button
                onClick={() => {
                  onNavigate('baby');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-medium text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.baby}
              </button>
              <button
                onClick={() => {
                  onNavigate('new-arrivals');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-medium text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.newArrivals}
              </button>
              <button
                onClick={() => {
                  onNavigate('offers');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 text-xs font-bold text-amber-700 text-left px-3 rounded-lg hover:bg-neutral-100"
              >
                {t.nav.offers} %
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={`tel:${STORE_PHONE.replace(/[^0-9+]/g, '')}`}
                className="text-xs font-bold text-[#721B29] flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {STORE_PHONE}
              </a>
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Admin Panel 🔒
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSearch={handleVoiceSearchResult}
      />
    </>
  );
};
