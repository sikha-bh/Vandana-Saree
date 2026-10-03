import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { OccasionSection } from '../components/home/OccasionSection';
import { GuidedShoppingModal } from '../components/home/GuidedShoppingModal';
import { FamilyShoppingSection } from '../components/home/FamilyShoppingSection';
import { SareeSpotlight } from '../components/home/SareeSpotlight';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { OffersSection } from '../components/home/OffersSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { StoreInfoSection } from '../components/home/StoreInfoSection';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product, Category, Coupon, Review } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { couponService } from '../services/couponService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';

interface HomePageProps {
  onNavigate: (route: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    productService.getProducts().then(setProducts);
    categoryService.getCategories().then(setCategories);
    couponService.getCoupons().then(setCoupons);
    reviewService.getReviews().then(setReviews);
  }, []);

  const handleProductSelect = (product: Product) => {
    onNavigate('product-detail', { slug: product.slug });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleBuyNow = (product: Product, size: string) => {
    addToCart(product, size, 1);
    onNavigate('checkout');
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        onShopNow={() => onNavigate('sarees')}
        onExploreSarees={() => onNavigate('sarees')}
        onOpenGuidedShopping={() => setIsGuidedOpen(true)}
      />

      {/* 2. Shop by Category */}
      <CategoryGrid
        categories={categories}
        onSelectCategory={(slug) => onNavigate(slug)}
      />

      {/* 3. Shop by Occasion */}
      <OccasionSection
        onSelectOccasion={(occ) => onNavigate('catalog', { occasion: occ })}
      />

      {/* 4. Family Shopping Combo Spotlight */}
      <FamilyShoppingSection
        products={products}
        onSelectProduct={handleProductSelect}
      />

      {/* 5. Dedicated Saree Experience */}
      <SareeSpotlight
        products={products}
        onSelectProduct={handleProductSelect}
        onQuickView={handleQuickView}
        onViewAllSarees={() => onNavigate('sarees')}
      />

      {/* 6. Featured & Trending Collections */}
      <FeaturedSection
        products={products}
        onSelectProduct={handleProductSelect}
        onQuickView={handleQuickView}
        onViewAll={() => onNavigate('catalog')}
      />

      {/* 7. Offers & Coupons */}
      <OffersSection
        coupons={coupons}
        onShopWithCoupon={(code) => {
          onNavigate('catalog');
        }}
      />

      {/* 8. Verified Customer Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 9. Physical Store Info & Direct Phone/WhatsApp Banner */}
      <StoreInfoSection />

      {/* Guided Shopping Wizard Modal ("मुझे कपड़े चाहिए") */}
      <GuidedShoppingModal
        isOpen={isGuidedOpen}
        onClose={() => setIsGuidedOpen(false)}
        onSelectProduct={handleProductSelect}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigateToDetail={(slug) => onNavigate('product-detail', { slug })}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};
