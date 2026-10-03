import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Category } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialData';

const LOCAL_STORAGE_CATEGORIES_KEY = 'vandna_local_categories_v1';

function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read categories:', e);
  }
  localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase categories fetch failed, using fallback', err);
      }
    }
    return getStoredCategories();
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const all = await this.getCategories();
    return all.find((c) => c.slug === slug) || null;
  },

  async addCategory(cat: Partial<Category>): Promise<Category> {
    const newCategory: Category = {
      id: 'c_' + Date.now(),
      name: cat.name || 'New Category',
      name_hi: cat.name_hi || 'नई श्रेणी',
      slug: (cat.name || 'new-category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      image_url: cat.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      is_active: true,
      display_order: cat.display_order || 10,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').insert([newCategory]);
      } catch (e) {
        console.warn('Supabase add category failed', e);
      }
    }

    const current = getStoredCategories();
    const updated = [...current, newCategory];
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(updated));
    return newCategory;
  },
};
