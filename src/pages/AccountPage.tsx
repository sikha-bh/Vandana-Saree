import React, { useState } from 'react';
import { User, Package, Heart, ShieldCheck, LogOut, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';

interface AccountPageProps {
  onNavigate: (route: string, params?: any) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, role, isAdmin, switchRole, logout } = useAuth();
  const { language } = useLanguage();
  const { wishlistIds } = useWishlist();

  const [savedAddresses] = useState([
    {
      id: 'addr_1',
      title: 'Home Address (घर का पता)',
      full_name: user?.full_name || 'Priya Sharma',
      phone: user?.phone || '+91 98765 43210',
      address_line: 'मकान नं. 45, मेन मार्केट रोड',
      district: 'सुल्तानपुर (Sultanpur)',
      state: 'उत्तर प्रदेश (UP)',
      pincode: '228001',
    },
  ]);

  return (
    <div className="min-h-screen bg-[#FCF9F5] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#721B29] font-serif mb-6">
          {language === 'hi' ? 'मेरा खाता (Customer Account)' : 'My Account'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-[#D4AF37]/35 shadow-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center font-bold text-xl font-serif">
              {user?.full_name?.[0] || 'U'}
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-900">{user?.full_name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="truncate">{user?.email || 'customer@vandnasaree.com'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{user?.phone || '+91 98765 43210'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500">Account Type:</span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#721B29]/10 text-[#721B29]">
                {role}
              </span>
            </div>

            {/* Admin Switcher for rapid QA */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={() => {
                  const newRole = isAdmin ? 'customer' : 'admin';
                  switchRole(newRole);
                  if (newRole === 'admin') onNavigate('admin');
                }}
                className="w-full py-2.5 px-3 bg-[#FAF4EB] hover:bg-[#F2EBE0] text-[#721B29] border border-[#D4AF37]/50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAdmin ? 'Switch to Customer View' : 'Access Admin Suite'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Quick Shortcuts & Saved Addresses */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Links Banner */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('orders')}
                className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:border-[#721B29] hover:shadow-md transition-all text-left flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#721B29]/10 text-[#721B29] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-serif">
                    {language === 'hi' ? 'मेरे ऑर्डर्स' : 'My Orders'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">Track fulfillment status</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:border-[#721B29] hover:shadow-md transition-all text-left flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-serif">
                    {language === 'hi' ? 'पसंदीदा' : 'Wishlist'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">{wishlistIds.length} items saved</p>
                </div>
              </button>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#721B29]" />
                  <h3 className="text-sm font-bold font-serif text-neutral-900">
                    {language === 'hi' ? 'सहेजे गए पते (Saved Addresses)' : 'Saved Delivery Addresses'}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl bg-[#FCF9F5] border border-neutral-200/70 text-xs text-neutral-700 space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-900">{addr.title}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    </div>
                    <p className="font-semibold text-neutral-800">{addr.full_name} ({addr.phone})</p>
                    <p>{addr.address_line}</p>
                    <p>{addr.district}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
