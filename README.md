# Vandna Saree Center (वंदना साड़ी सेंटर)
**आपकी पसंद, हमारा विश्वास** — *One Store. Every Style. Every Generation.*

A full-stack, production-quality Indian fashion e-commerce platform built with modern web technologies, 3D aesthetics, glassmorphism, bilingual support (Hindi & English), voice search, guided family shopping, and a Supabase backend.

---

## 🌟 Key Highlights & Features

### 🛍️ Customer Experience
- **Bilingual Interface**: Seamless switching between **हिंदी (Devanagari)** and **English**.
- **Voice Search (🎤 बोलकर खोजें)**: Speak natural requests like *"दो हजार रुपये के अंदर लाल साड़ी"* or *"boys kurta"* with automatic budget and category extraction.
- **Guided Shopping ("मुझे कपड़े चाहिए")**: Interactive 3-step glass modal helping rural and first-time shoppers pick clothing by recipient, occasion, and budget.
- **Family Shopping ("पूरे परिवार के लिए कपड़े")**: Build complete matching outfits for the whole family (Father, Mother, Son, Daughter) with 1-click **"Add Family Look to Cart"** and combo discount.
- **Dedicated Saree Experience**: Specialized filters for Banarasi, Chanderi, Kanjeevaram, Georgette, Zari work, and traditional occasions.
- **Multiple Ordering Modes**:
  - **Online Checkout**: 2-step quick form with Cash on Delivery (COD), UPI QR, and online card mock.
  - **WhatsApp Order (💬 WhatsApp पर ऑर्डर करें)**: Pre-fills order details and product specifications directly into WhatsApp.
  - **Call to Order (📞)**: Instant one-tap phone call to store owner.
- **Visual Order Tracking**: Step-by-step progress timeline (`Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`).
- **Wishlist & Cart**: Glassmorphic drawer, coupon code redemption (`VANDNA10`, `SHADI2026`).

### ⚙️ Admin Suite (`/admin`)
- **Executive Dashboard**: Real-time sales, order counts, customer insights, and low-stock alerts.
- **Product Management**: Create, edit, set discounts, tag as Featured/Trending/New, and manage fabric and color variations.
- **Live Inventory**: Track stock, restock products, and monitor low inventory.
- **Order Pipeline**: Progress orders across fulfillment stages in real time.
- **Reviews Moderation**: Approve or reject customer reviews.
- **Coupons Management**: Issue custom promotional discounts with minimum order thresholds.

### 🛡️ Architecture & Database
- **Supabase PostgreSQL**: 13 relational tables with constraints, indexes, and full Row Level Security (RLS).
- **Dual-Mode Persistence**: Runs seamlessly with real Supabase credentials or with an in-memory/LocalStorage fallback engine for local preview and instant testing.
- **Mobile-First UX**: Generous touch targets ($\ge 44\text{px}$), sticky bottom navigation for phones, bottom-sheet filters.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STORE_PHONE="+91 98765 43210"
VITE_STORE_WHATSAPP="919876543210"
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🗄️ Database Setup
See [`docs/supabase-setup.md`](./docs/supabase-setup.md) for running `supabase/migrations/001_initial_schema.sql` and seeding `supabase/seed.sql`.
