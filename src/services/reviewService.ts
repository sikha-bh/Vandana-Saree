import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/initialData';

const LOCAL_STORAGE_REVIEWS_KEY = 'vandna_local_reviews_v1';

function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read reviews:', e);
  }
  localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
  return INITIAL_REVIEWS;
}

function saveReviews(reviews: Review[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews:', e);
  }
}

export const reviewService = {
  async getReviews(productId?: string): Promise<Review[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
        if (productId) query = query.eq('product_id', productId);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase reviews fetch failed', e);
      }
    }
    const all = getStoredReviews().filter((r) => r.is_approved);
    if (productId) return all.filter((r) => r.product_id === productId);
    return all;
  },

  async getAllReviews(): Promise<Review[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getAllReviews failed', e);
      }
    }
    return getStoredReviews();
  },

  async addReview(reviewData: { productId: string; rating: number; reviewText: string; userName: string }): Promise<Review> {
    const newRev: Review = {
      id: 'rev_' + Date.now(),
      product_id: reviewData.productId,
      user_name: reviewData.userName,
      rating: reviewData.rating,
      review_text: reviewData.reviewText,
      is_approved: true, // auto-approve in demo mode
      created_at: new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('reviews').insert([
          {
            product_id: newRev.product_id,
            rating: newRev.rating,
            review_text: newRev.review_text,
            is_approved: true,
          },
        ]);
      } catch (e) {
        console.warn('Supabase add review failed', e);
      }
    }

    const current = getStoredReviews();
    saveReviews([newRev, ...current]);
    return newRev;
  },

  async moderateReview(reviewId: string, approved: boolean): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('reviews').update({ is_approved: approved }).eq('id', reviewId);
      } catch (e) {
        console.warn('Supabase moderateReview failed', e);
      }
    }

    const reviews = getStoredReviews();
    const idx = reviews.findIndex((r) => r.id === reviewId);
    if (idx !== -1) {
      reviews[idx].is_approved = approved;
      saveReviews(reviews);
      return true;
    }
    return false;
  },
};
