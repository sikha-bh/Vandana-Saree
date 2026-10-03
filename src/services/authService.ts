import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

const LOCAL_STORAGE_USER_KEY = 'vandna_auth_user_v1';

const DEFAULT_DEMO_CUSTOMER: UserProfile = {
  id: 'usr_customer_demo',
  full_name: 'Priya Sharma (प्रिया शर्मा)',
  phone: '+91 98765 43210',
  email: 'priya.sharma@example.com',
  role: 'customer',
  created_at: new Date().toISOString(),
};

const DEFAULT_DEMO_ADMIN: UserProfile = {
  id: 'usr_admin_demo',
  full_name: 'Vandna Store Admin (वंदना स्टोर प्रबंधक)',
  phone: '+91 98765 00000',
  email: 'admin@vandnasareecenter.com',
  role: 'admin',
  created_at: new Date().toISOString(),
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read auth user', e);
    }
    // Default to customer role for effortless browsing
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEFAULT_DEMO_CUSTOMER));
    return DEFAULT_DEMO_CUSTOMER;
  },

  async login(email: string, _password?: string): Promise<UserProfile> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: _password || 'password123',
        });
        if (!error && data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || 'Customer',
            role: data.user.email?.includes('admin') ? 'admin' : 'customer',
            created_at: data.user.created_at,
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          return profile;
        }
      } catch (e) {
        console.warn('Supabase auth failed, fallback to demo user', e);
      }
    }

    const isAdmin = email.toLowerCase().includes('admin');
    const user: UserProfile = isAdmin ? DEFAULT_DEMO_ADMIN : {
      id: 'usr_' + Date.now(),
      full_name: email.split('@')[0],
      email: email,
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  },

  async register(name: string, email: string, phone?: string): Promise<UserProfile> {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      full_name: name,
      email: email,
      phone: phone || '',
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  switchRole(role: UserRole): UserProfile {
    const target = role === 'admin' ? DEFAULT_DEMO_ADMIN : DEFAULT_DEMO_CUSTOMER;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(target));
    return target;
  },
};
