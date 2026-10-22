-- ============================================================================
-- TRUSTPULSE AI — PRODUCTION REPUTATION & REVIEWS SCHEMA (v1.0)
-- Tables: Workspaces, Reviews, Negative Shield Grievances, Embed Widgets
-- Compatible with Supabase PostgreSQL 17 + Row-Level Security (RLS)
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. CLIENT WORKSPACES (Synced with Google Maps intelligence)
create table if not exists public.trustpulse_workspaces (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null default 'Local Business',
  brand_color text not null default '#059669',
  address text,
  phone text,
  website text,
  google_review_url text,
  rating numeric(3, 2) not null default 5.00,
  total_reviews integer not null default 0,
  place_id text,
  cid text,
  star_threshold integer not null default 4,
  custom_headline text not null default 'How was your experience today?',
  custom_subheadline text not null default 'Your feedback directly helps our team improve.',
  owner_id uuid references public.profiles(id) on delete set null,
  stats jsonb not null default '{"averageRating": 5.0, "totalReviews": 0, "shieldedReviews": 0, "positiveRedirects": 0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tp_workspaces_slug on public.trustpulse_workspaces(slug);
create index if not exists idx_tp_workspaces_owner on public.trustpulse_workspaces(owner_id);
create index if not exists idx_tp_workspaces_created_at on public.trustpulse_workspaces(created_at desc);

-- 2. VERIFIED REVIEWS & AI AUTO-REPLIES
create table if not exists public.trustpulse_reviews (
  id text primary key,
  workspace_id text not null references public.trustpulse_workspaces(id) on delete cascade,
  author_name text not null,
  author_avatar text,
  author_role text not null default 'Verified Customer',
  author_location text,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text not null,
  platform text not null default 'google' check (platform in ('google', 'trustpilot', 'yelp', 'direct')),
  sentiment text not null default 'positive' check (sentiment in ('positive', 'neutral', 'negative')),
  is_verified boolean not null default true,
  is_featured boolean not null default false,
  ai_reply jsonb,
  review_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_tp_reviews_workspace on public.trustpulse_reviews(workspace_id);
create index if not exists idx_tp_reviews_rating on public.trustpulse_reviews(rating);
create index if not exists idx_tp_reviews_created on public.trustpulse_reviews(created_at desc);

-- 3. NEGATIVE REVIEW SHIELD GRIEVANCES (Private 1-3 Star Feedback Inbox)
create table if not exists public.trustpulse_grievances (
  id text primary key,
  workspace_id text not null references public.trustpulse_workspaces(id) on delete cascade,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  rating integer not null check (rating >= 1 and rating <= 5),
  grievance_text text not null,
  staff_member_involved text,
  status text not null default 'new' check (status in ('new', 'in_review', 'resolved', 'escalated')),
  resolution_notes text,
  customer_contacted boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_tp_grievances_workspace on public.trustpulse_grievances(workspace_id);
create index if not exists idx_tp_grievances_status on public.trustpulse_grievances(status);
create index if not exists idx_tp_grievances_created on public.trustpulse_grievances(created_at desc);

-- 4. EMBEDDABLE SOCIAL PROOF WIDGETS
create table if not exists public.trustpulse_widgets (
  id text primary key,
  workspace_id text not null references public.trustpulse_workspaces(id) on delete cascade,
  name text not null default 'Google Reviews Badge',
  widget_type text not null default 'badge' check (widget_type in ('badge', 'toast', 'wall', 'floating')),
  theme text not null default 'dark' check (theme in ('dark', 'light', 'glass')),
  position text not null default 'bottom-right',
  min_rating integer not null default 4,
  max_display integer not null default 6,
  is_active boolean not null default true,
  allowed_domains text[] default array['*'],
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tp_widgets_workspace on public.trustpulse_widgets(workspace_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.trustpulse_workspaces enable row level security;
alter table public.trustpulse_reviews enable row level security;
alter table public.trustpulse_grievances enable row level security;
alter table public.trustpulse_widgets enable row level security;

-- Open policies for development & hybrid service-role sync
drop policy if exists "Workspaces access policy" on public.trustpulse_workspaces;
create policy "Workspaces access policy"
  on public.trustpulse_workspaces for all
  using (true)
  with check (true);

drop policy if exists "Reviews access policy" on public.trustpulse_reviews;
create policy "Reviews access policy"
  on public.trustpulse_reviews for all
  using (true)
  with check (true);

drop policy if exists "Grievances access policy" on public.trustpulse_grievances;
create policy "Grievances access policy"
  on public.trustpulse_grievances for all
  using (true)
  with check (true);

drop policy if exists "Widgets access policy" on public.trustpulse_widgets;
create policy "Widgets access policy"
  on public.trustpulse_widgets for all
  using (true)
  with check (true);
