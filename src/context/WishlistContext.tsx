import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_WISHLIST_KEY = 'vandna_wishlist_ids_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      return saved ? JSON.parse(saved) : ['p1'];
    } catch {
      return ['p1'];
    }
  });

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }

    productService.getProducts().then((all) => {
      setWishlistProducts(all.filter((p) => wishlistIds.includes(p.id)));
    });
  }, [wishlistIds]);

  const toggleWishlist = (productId: string) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      showToast('Saved to wishlist! (पसंद में जोड़ा)', 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from wishlist', 'info');
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
