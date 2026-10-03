import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, FilterState } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

const LOCAL_STORAGE_PRODUCTS_KEY = 'vandna_local_products_v1';

function getStoredLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read local products:', e);
  }
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save local products:', e);
  }
}

export const productService = {
  async getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('products').select('*, product_images(image_url), product_variants(*)').eq('is_active', true);

        if (filters?.categorySlug) {
          // get category ID or filter
          const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.categorySlug).single();
          if (cat) query = query.eq('category_id', cat.id);
        }

        if (filters?.minPrice !== undefined) query = query.gte('price', filters.minPrice);
        if (filters?.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);

        if (filters?.sortBy === 'price-low') query = query.order('price', { ascending: true });
        else if (filters?.sortBy === 'price-high') query = query.order('price', { ascending: false });
        else if (filters?.sortBy === 'rating') query = query.order('rating', { ascending: false });
        else if (filters?.sortBy === 'newest') query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((p) => ({
            ...p,
            images: p.product_images?.map((img: { image_url: string }) => img.image_url) || [p.image_url],
            variants: p.product_variants || [],
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local dataset', err);
      }
    }

    // Local / Fallback engine
    let products = getStoredLocalProducts();

    if (filters?.categorySlug) {
      products = products.filter((p) => p.category_slug === filters.categorySlug);
    }

    if (filters?.fabrics && filters.fabrics.length > 0) {
      products = products.filter((p) => p.fabric && filters.fabrics?.includes(p.fabric));
    }

    if (filters?.colors && filters.colors.length > 0) {
      products = products.filter((p) => p.color && filters.colors?.includes(p.color));
    }

    if (filters?.occasions && filters.occasions.length > 0) {
      products = products.filter((p) => p.occasion && filters.occasions?.includes(p.occasion));
    }

    if (filters?.genders && filters.genders.length > 0) {
      products = products.filter((p) => filters.genders?.includes(p.gender));
    }

    if (filters?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.inStockOnly) {
      products = products.filter((p) => p.stock_quantity > 0);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.name_hi.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q)) ||
          (p.occasion && p.occasion.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters?.sortBy === 'price-low') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'price-high') {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === 'rating') {
      products = [...products].sort((a, b) => b.rating - a.rating);
    } else if (filters?.sortBy === 'newest') {
      products = [...products].sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
    }

    return products;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(image_url), product_variants(*)')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          return {
            ...data,
            images: data.product_images?.map((img: { image_url: string }) => img.image_url) || [data.image_url],
            variants: data.product_variants || [],
          };
        }
      } catch (err) {
        console.warn('Supabase fetch failed for slug', err);
      }
    }

    const products = getStoredLocalProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.is_featured);
  },

  async getTrendingProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.is_trending);
  },

  async getNewArrivals(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.is_new_arrival);
  },

  async getSimilarProducts(product: Product): Promise<Product[]> {
    const all = await this.getProducts();
    return all
      .filter((p) => p.id !== product.id && (p.category_slug === product.category_slug || p.gender === product.gender))
      .slice(0, 4);
  },

  async addProduct(newProduct: Partial<Product>): Promise<Product> {
    const fullProduct: Product = {
      id: 'p_' + Date.now(),
      category_id: newProduct.category_id || 'c1',
      category_slug: newProduct.category_slug || 'sarees',
      name: newProduct.name || 'New Apparel Item',
      name_hi: newProduct.name_hi || 'नया वस्त्र',
      slug: (newProduct.name || 'new-item')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4),
      description: newProduct.description || '',
      description_hi: newProduct.description_hi || '',
      price: Number(newProduct.price) || 999,
      original_price: Number(newProduct.original_price) || Number(newProduct.price) || 1299,
      discount_percentage: newProduct.original_price && newProduct.price ? Math.round(((newProduct.original_price - newProduct.price) / newProduct.original_price) * 100) : 10,
      fabric: newProduct.fabric || 'Cotton',
      color: newProduct.color || 'Red',
      occasion: newProduct.occasion || 'Festival',
      gender: newProduct.gender || 'women',
      stock_quantity: Number(newProduct.stock_quantity) || 10,
      rating: 4.8,
      review_count: 1,
      is_featured: Boolean(newProduct.is_featured),
      is_trending: Boolean(newProduct.is_trending),
      is_new_arrival: true,
      is_active: true,
      images: newProduct.images?.length ? newProduct.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      variants: newProduct.variants || [{ id: 'v_' + Date.now(), product_id: 'p_' + Date.now(), size: 'Free Size', stock_quantity: 10, price: newProduct.price }],
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').insert([fullProduct]);
      } catch (e) {
        console.warn('Supabase insert failed, saving locally', e);
      }
    }

    const current = getStoredLocalProducts();
    const updated = [fullProduct, ...current];
    saveLocalProducts(updated);
    return fullProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase update failed', e);
      }
    }

    const current = getStoredLocalProducts();
    const index = current.findIndex((p) => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates };
      saveLocalProducts(current);
      return current[index];
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed', e);
      }
    }

    const current = getStoredLocalProducts();
    const updated = current.filter((p) => p.id !== id);
    saveLocalProducts(updated);
    return true;
  },

  async updateProductStock(id: string, newStock: number): Promise<boolean> {
    return (await this.updateProduct(id, { stock_quantity: Math.max(0, newStock) })) !== null;
  },
};
