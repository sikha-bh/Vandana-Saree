# Vandna Saree Center — Technical Architecture

## 1. System Overview
Vandna Saree Center combines modern e-commerce capabilities with rural-friendly accessibility:
- **Presentation Layer**: React 19 + TypeScript + Tailwind CSS (v4) + Lucide Icons + Motion animations.
- **Data Access & State Layer**: Unified service abstractions (`productService`, `cartService`, `orderService`, `authService`, `reviewService`, `adminService`).
- **Persistence & Cloud Backend**: Supabase (PostgreSQL 15+, Supabase Auth, Storage & RLS) with a seamless browser-backed fallback engine when Supabase credentials are in development transit.
- **Multilingual & NLP Layer**: Centralized i18n dictionary (English and Hindi Devanagari) + Web Speech API voice search parser for Indian phrasing.
- **Ordering Channels**: Standard Online Checkout (COD, UPI QR, Online Gateway) + WhatsApp order generator + Direct store calling.

## 2. Directory Structure
```
vandna-saree-center/
├── PRD.md                       # Comprehensive Product Requirements Document
├── docs/
│   ├── architecture.md          # System architecture & data flow
│   └── supabase-setup.md        # Step-by-step Supabase cloud provisioning
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # 13 relational tables, indexes & RLS rules
│   └── seed.sql                 # Authentic initial inventory & categories
├── src/
│   ├── components/              # Modular UI components
│   │   ├── common/              # Header, Footer, Glass modals, Toasts, 3D cards
│   │   ├── home/                # Hero, Guided shopping, Family combo, Categories
│   │   ├── catalog/             # Product card, Saree filters, Sorting, QuickView
│   │   ├── cart/                # Slide-out glass drawer, Cart table, Order summary
│   │   ├── checkout/            # Delivery address form, Payment selection, Confirmation
│   │   └── admin/               # Admin dashboard, Products, Orders, Inventory, Reviews
│   ├── context/                 # AuthContext, CartContext, WishlistContext, LanguageContext
│   ├── lib/                     # Supabase client & dual-mode fallback adapter
│   ├── services/                # Decoupled data access service layer
│   ├── types/                   # Strict TypeScript domain interfaces
│   ├── utils/                   # Currency formatters, NLP search helpers, WhatsApp link generator
│   └── i18n/                    # English & Hindi translation dictionaries
```

## 3. Security & Row Level Security (RLS)
- Anonymous users can read active categories, products, and approved reviews.
- Authenticated customers have isolated access strictly to their own addresses, cart items, wishlist, and orders.
- Administrative roles (`role = 'admin'` in `profiles`) have full CRUD on products, categories, coupons, inventory, and order status transitions.
