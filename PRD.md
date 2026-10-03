# Product Requirements Document (PRD) — Vandna Saree Center

## 1. Executive Summary
- **Brand**: Vandna Saree Center
- **Tagline**: आपकी पसंद, हमारा विश्वास (Aapki Pasand, Hamara Vishwas)
- **Positioning**: One Store. Every Style. Every Generation.
- **Core Idea**: A friendly, trusted local clothing store combined with a modern, high-converting online shopping experience designed for rural, semi-urban, and urban customers alike.
- **Backend Architecture**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security, Realtime).

---

## 2. Target Audience & Design Philosophy
1. **Audience Segments**:
   - Rural & small-town customers (need extreme simplicity, clear pricing, Hindi support, voice search, WhatsApp/Call ordering, COD).
   - Semi-urban & urban families shopping for weddings, festivals, and daily essentials.
   - First-time online shoppers needing trust indicators and frictionless navigation.
2. **Guiding Principle**:
   > *"Modern technology behind the website, simple experience in front of the customer."*
3. **Design Aesthetic**:
   - Deep Wine / Maroon (`#721B29`), Champagne / Gold accents (`#D4AF37`), Warm Ivory (`#FCF9F5`), Dark Charcoal (`#241E1C`).
   - Subtle 3D depth, perspective hover effects, glassmorphic floating bars & cards, elegant Indian typography (Cinzel & Rozha One with Poppins & Noto Sans Devanagari).
   - Zero-pill discipline, generous mobile touch targets ($\ge 44\text{px}$), accessible contrast.

---

## 3. Scope of Features

### 3.1 Customer Experience
1. **Sticky Glass Header**:
   - Logo and brand tagline.
   - Instant Search Bar with mixed Hindi/English queries.
   - Voice Search modal (**"🎤 बोलकर खोजें"**) using Web Speech API with smart NLP parsing (extracts budget, category, color, occasion) + graceful text fallback.
   - Instant Language Switcher (**हिंदी / English**).
   - Wishlist counter, Cart counter with slide-out drawer, Account menu.
2. **Homepage Core Sections**:
   - **Hero Section**: 3D layered presentation with festive banner, tagline, "Shop Now" and "Explore Sarees" buttons, trust badges (100% Genuine, Cash on Delivery, Easy Exchange).
   - **Shop by Category**: Sarees, Women, Men, Kids, Baby with visual photography & 3D hover lift.
   - **Shop by Occasion**: Wedding (शादी), Festival (त्योहार), Party (पार्टी), Daily Wear (रोज़), Office (ऑफिस).
   - **"मुझे कपड़े चाहिए" (Guided Shopping)**: Multi-step interactive glass modal (Who is it for? -> For what occasion? -> What budget?) with instant matched product recommendations.
   - **Family Shopping ("पूरे परिवार के लिए कपड़े")**: Interactive family bundle builder (Father Kurta, Mother Saree, Son Kurta Pajama, Daughter Lehenga) with one-click **"Add Family Look to Cart"** and combo discount!
   - **Saree Dedicated Spotlight**: Rich filters by fabric (Banarasi, Chanderi, Georgette, Kanjeevaram, Cotton, Organza), work (Zari, Embroidered, Handloom), occasion, and color.
   - **New Arrivals & Trending Collections**: Staggered cards with discount badges, ratings, quick view, and one-tap cart addition.
   - **Offers & Festival Coupons**: Live discount codes (e.g. `VANDNA10`, `SHADI2026`).
   - **Customer Reviews & Testimonials**: Real customer feedback with star ratings and verified buyer tags.
   - **Direct Ordering Channels**: Floating & in-section **"Call to Order" (📞)** and **"WhatsApp Order" (💬)** generating ready-to-send bilingual order messages.
   - **Store Information & Timings**: Local address, timings (10:00 AM - 9:00 PM), landmark, and Google Maps location guide.
   - **Footer**: Comprehensive navigation, legal policies (Shipping, Return, Privacy, Terms), FAQ, and social handles.

3. **Catalog & Product Discovery**:
   - Dedicated Category & Product Listing pages (`/sarees`, `/women`, `/men`, `/kids`, `/baby`, `/new-arrivals`, `/offers`).
   - Filters: Price range, Fabric, Color, Size, Occasion, In-Stock only, Discount.
   - Sorting: Popular, Newest, Price: Low to High, Price: High to Low, Top Rated.
   - Mobile bottom-sheet filter panel.
   - Product Details Page (`/products/:slug`) with multi-image gallery, interactive zoom, size selector, fabric specs, delivery estimate by pincode, reviews, Add to Cart, Buy Now, and direct WhatsApp order button.

4. **Cart, Checkout & Orders**:
   - Cart Drawer & Dedicated Cart Page with item quantity adjustments, size/color variant display, coupon application, order summary.
   - 2-Step Streamlined Checkout:
     - Customer Details (Name, Phone, Village/Town, District, State, Pincode, Landmark).
     - Payment Method: Cash on Delivery (COD), UPI QR / Intent, Online Card/Netbanking mock integration.
   - Order Confirmation celebration with visual Confetti.
   - Visual Order Tracking Pipeline: `Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`.

5. **Customer Account**:
   - Profile management, saved delivery addresses.
   - Order History with live status tracking and reorder capability.
   - Wishlist with one-click move to cart.
   - Supabase Auth integration (Email & Password, guest checkout allowed).

---

### 3.2 Admin Management Dashboard (`/admin`)
1. **Overview & Analytics**:
   - Total Sales, Orders, Customers, Active Products, Low Stock count, Revenue trend charts.
2. **Product Catalog Management**:
   - Add new product with image URLs, fabric, occasion, sizes, stock, price, discount, Hindi & English titles.
   - Edit, delete, and toggle featured/trending status.
3. **Inventory Management**:
   - Real-time stock monitor, low stock threshold warnings, instant stock adjustment.
4. **Order Management**:
   - Status transitions (Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered / Cancelled).
   - View customer delivery address, phone number for verification, payment status.
5. **Customer Management**:
   - List of registered customers, contact numbers, order frequency, total spend.
6. **Reviews Moderation**:
   - Approve or reject customer reviews before they appear publicly.
7. **Coupon Management**:
   - Create, edit, toggle coupons with discount percentage or flat amount, minimum order limit.

---

## 4. Supabase Database Schema
- `profiles`: user accounts with `customer` / `admin` role.
- `categories`: hierarchical product categories with Hindi and English names.
- `products`: comprehensive catalog with fabric, color, occasion, price, stock, ratings.
- `product_images`: additional gallery images for products.
- `product_variants`: size and color SKUs.
- `addresses`: customer shipping addresses with rural fields (village, town, landmark).
- `carts` & `cart_items`: persistent shopping carts.
- `wishlist_items`: saved products.
- `orders` & `order_items`: immutable order history with customer address snapshot and status pipeline.
- `payments`: payment transactions (COD, UPI, Card).
- `reviews`: moderated customer feedback.
- `coupons`: promotional codes.
- `notifications`: customer and admin notification events.

---

## 5. Non-Functional Requirements
- **Performance**: Instant first paint, client caching, lazy loading images.
- **Responsiveness**: Mobile-first architecture with bottom navigation on phones.
- **Offline / Standalone Resilience**: Self-contained client repository with Supabase sync + offline fallback data store when database credentials are being connected.
