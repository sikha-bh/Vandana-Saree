// Domain types for Vandna Saree Center

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_hi: string;
  slug: string;
  description?: string;
  image_url: string;
  parent_id?: string;
  is_active: boolean;
  display_order: number;
}

export type GenderCategory = 'women' | 'men' | 'girls' | 'boys' | 'baby' | 'unisex';

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color?: string;
  sku?: string;
  stock_quantity: number;
  price?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  name: string;
  name_hi: string;
  slug: string;
  description: string;
  description_hi?: string;
  price: number;
  original_price: number;
  discount_percentage?: number;
  fabric?: string;
  color?: string;
  occasion?: string;
  gender: GenderCategory;
  stock_quantity: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  images?: string[];
  variants?: ProductVariant[];
  created_at?: string;
}

export interface Address {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address_line: string;
  village?: string;
  town?: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  is_default?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  selected_size: string;
  selected_color?: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'cod' | 'upi' | 'online';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  image_url?: string;
  quantity: number;
  price: number;
  total: number;
  selected_size?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  shipping_address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  tracking_updates?: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  user_name?: string;
  rating: number;
  review_text: string;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount?: number;
  expiry_date: string;
  is_active: boolean;
}

export interface FilterState {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  fabrics: string[];
  colors: string[];
  occasions: string[];
  genders: string[];
  sizes: string[];
  inStockOnly: boolean;
  sortBy: 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';
  searchQuery?: string;
}

export interface GuidedShoppingState {
  targetPerson: 'men' | 'women' | 'boys' | 'girls' | 'baby' | '';
  occasion: 'wedding' | 'festival' | 'party' | 'daily' | 'office' | '';
  budgetRange: 'under500' | 'under1000' | 'under2000' | 'under5000' | 'above5000' | '';
}

export interface FamilyMemberLook {
  role: 'Father' | 'Mother' | 'Son' | 'Daughter';
  role_hi: string;
  product: Product;
  selected_size: string;
  included: boolean;
}
