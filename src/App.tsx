import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';

interface RouteState {
  path: string;
  params?: Record<string, any>;
}

export function App() {
  const [routeState, setRouteState] = useState<RouteState>(() => {
    // Initial path from window.location
    const path = window.location.pathname.replace(/^\//, '') || 'home';
    const params: Record<string, any> = {};
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
    return { path, params };
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'home';
      const params: Record<string, any> = {};
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.forEach((val, key) => {
        params[key] = val;
      });
      setRouteState({ path, params });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string, newParams?: Record<string, any>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let url = '/' + (newPath === 'home' ? '' : newPath);
    if (newParams && newParams.q) {
      url += `?q=${encodeURIComponent(newParams.q)}`;
    }
    window.history.pushState({}, '', url);
    setRouteState({ path: newPath, params: newParams });
  };

  const renderContent = () => {
    const { path, params } = routeState;

    if (path === 'product-detail' && params?.slug) {
      return <ProductDetailPage slug={params.slug} onNavigate={navigate} />;
    }

    if (path.startsWith('products/') || path.startsWith('product/')) {
      const slug = path.split('/')[1];
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (path === 'cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (path === 'checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (path === 'orders' || path.startsWith('orders/')) {
      return <OrdersPage onNavigate={navigate} />;
    }

    if (path === 'wishlist') {
      return <WishlistPage onNavigate={navigate} />;
    }

    if (path === 'account' || path === 'login' || path === 'register') {
      return <AccountPage onNavigate={navigate} />;
    }

    if (path === 'admin' || path.startsWith('admin/')) {
      return <AdminPage onNavigate={navigate} />;
    }

    // Category / Catalog Routes
    const categoryRoutes = ['sarees', 'women', 'men', 'kids', 'baby', 'new-arrivals', 'offers', 'search', 'catalog'];
    if (categoryRoutes.includes(path)) {
      return (
        <CatalogPage
          currentCategorySlug={path === 'search' || path === 'catalog' ? undefined : path}
          initialSearchQuery={params?.q}
          initialOccasion={params?.occasion}
          onNavigate={navigate}
        />
      );
    }

    if (path === 'guided-shopping') {
      return <HomePage onNavigate={navigate} />;
    }

    // Default to Home
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col bg-[#FCF9F5] text-[#241E1C]">
                {/* Sticky Glass Header */}
                <Header
                  onNavigate={navigate}
                  currentRoute={routeState.path}
                />

                {/* Main Content View */}
                <main className="flex-1 pb-16 lg:pb-0">
                  {renderContent()}
                </main>

                {/* Footer */}
                <Footer onNavigate={navigate} />

                {/* Glass Slide-out Cart Drawer */}
                <CartDrawer
                  onProceedToCheckout={() => navigate('checkout')}
                  onContinueShopping={() => navigate('sarees')}
                />

                {/* Sticky Mobile Bottom Navigation */}
                <MobileNav
                  currentRoute={routeState.path}
                  onNavigate={navigate}
                  onOpenSearch={() => navigate('search')}
                />
              </div>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
