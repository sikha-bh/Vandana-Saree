import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/initialData';

const LOCAL_STORAGE_COUPONS_KEY = 'vandna_local_coupons_v1';

function getStoredCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COUPONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read coupons:', e);
  }
  localStorage.setItem(LOCAL_STORAGE_COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
  return INITIAL_COUPONS;
}

function saveCoupons(coupons: Coupon[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_COUPONS_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error('Failed to save coupons:', e);
  }
}

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('coupons').select('*').eq('is_active', true);
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase coupons fetch failed', e);
      }
    }
    return getStoredCoupons();
  },

  async validateCoupon(code: string, cartTotal: number): Promise<{ isValid: boolean; discountAmount: number; message: string; coupon?: Coupon }> {
    const coupons = await this.getCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.is_active);

    if (!found) {
      return { isValid: false, discountAmount: 0, message: 'Invalid or expired coupon code' };
    }

    if (cartTotal < found.minimum_order_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Coupon requires minimum shopping of ₹${found.minimum_order_amount}`,
      };
    }

    let discount = 0;
    if (found.discount_type === 'percentage') {
      discount = (cartTotal * found.discount_value) / 100;
      if (found.maximum_discount) {
        discount = Math.min(discount, found.maximum_discount);
      }
    } else {
      discount = found.discount_value;
    }

    return {
      isValid: true,
      discountAmount: Math.round(discount),
      message: `Coupon ${found.code} applied successfully!`,
      coupon: found,
    };
  },

  async createCoupon(newCoupon: Partial<Coupon>): Promise<Coupon> {
    const coupon: Coupon = {
      id: 'coup_' + Date.now(),
      code: (newCoupon.code || 'SAVE10').toUpperCase().trim(),
      description: newCoupon.description || 'Special store discount',
      discount_type: newCoupon.discount_type || 'percentage',
      discount_value: Number(newCoupon.discount_value) || 10,
      minimum_order_amount: Number(newCoupon.minimum_order_amount) || 500,
      maximum_discount: newCoupon.maximum_discount ? Number(newCoupon.maximum_discount) : 500,
      expiry_date: newCoupon.expiry_date || '2027-12-31',
      is_active: true,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('coupons').insert([coupon]);
      } catch (e) {
        console.warn('Supabase create coupon failed', e);
      }
    }

    const current = getStoredCoupons();
    saveCoupons([coupon, ...current]);
    return coupon;
  },

  async toggleCoupon(id: string, active: boolean): Promise<boolean> {
    const current = getStoredCoupons();
    const idx = current.findIndex((c) => c.id === id);
    if (idx !== -1) {
      current[idx].is_active = active;
      saveCoupons(current);
      return true;
    }
    return false;
  },
};
