# Supabase Setup Guide — Vandna Saree Center

Follow these step-by-step instructions to connect your Supabase project to **Vandna Saree Center**.

---

## Step 1: Create a Supabase Project
1. Log in to [Supabase Console](https://supabase.com/dashboard).
2. Click **New Project**.
3. Choose your organization, set project name to `vandna-saree-center`, generate a secure database password, and pick the closest region (e.g. `ap-south-1` Mumbai).

---

## Step 2: Retrieve API Keys & URL
1. In the Supabase project sidebar, go to **Project Settings** > **API**.
2. Copy the **Project URL** (e.g. `https://xyzcompany.supabase.co`).
3. Copy the **anon / public** key (`eyJh...`).

---

## Step 3: Configure Environment Variables
In your local environment or deployment dashboard, create a `.env` file (or copy from `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STORE_PHONE="+91 98765 43210"
VITE_STORE_WHATSAPP="919876543210"
```

> **Note**: If `VITE_SUPABASE_URL` is omitted, the frontend automatically activates its built-in dual-mode storage engine. You can browse, test cart, checkout, switch roles, and try the entire admin suite without setup interruptions!

---

## Step 4: Run Database Migrations
1. In your Supabase dashboard, click on **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`.
4. Click **Run**.
5. This creates all 13 core tables, indexes, relations, and Row Level Security (RLS) policies.

---

## Step 5: Populate Seed Data
1. In **SQL Editor**, open another **New Query**.
2. Copy and paste the contents of `supabase/seed.sql`.
3. Click **Run**.
4. This seeds the authentic Indian apparel catalog, categories (Sarees, Women, Men, Kids, Baby), reviews, and promotional coupons (`VANDNA10`, `SHADI2026`).

---

## Step 6: Create Storage Buckets
1. In the Supabase dashboard, navigate to **Storage**.
2. Click **New Bucket** and create the following buckets:
   - `product-images` (Public bucket: **ON**)
   - `category-images` (Public bucket: **ON**)
   - `review-images` (Public bucket: **ON**)
   - `site-assets` (Public bucket: **ON**)

---

## Step 7: Create Admin Account
1. Go to **Authentication** > **Users** > **Add User** (or register via the `/register` customer screen).
2. To grant Admin privileges, go to **SQL Editor** and run:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@vandnasareecenter.com';
```

---

## Step 8: Verify Live Features
- **Catalog & Search**: Test natural language searches like `"red saree under 2000"` or voice search.
- **Cart & COD Checkout**: Place an order using Cash on Delivery.
- **Admin Dashboard**: Visit `/admin` to verify live sales, inventory management, status transitions, and review moderation.
