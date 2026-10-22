-- ============================================================================
-- SEOSPACE AI — PRODUCTION SUPABASE POSTGRESQL SCHEMA (v4.2)
-- 7 Core Tables + Indexes + Row-Level Security (RLS) + Auth Trigger
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. USER PROFILES & SUBSCRIPTION TIERS
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null default 'Growth Team',
  company_name text default 'Seospace Workspace',
  role text not null default 'user' check (role in ('user', 'agency', 'admin')),
  plan text not null default 'Pro Growth ($19/mo)',
  stripe_customer_id text,
  stripe_subscription_id text,
  monthly_audit_quota integer not null default 100,
  audits_used_this_month integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. SAVED-FIRST URL AUDITS & LIVE DNS / METADATA SNAPSHOTS
create table if not exists public.audits (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  url text not null,
  normalized_url text not null,
  domain text not null,
  overall_score integer not null check (overall_score >= 0 and overall_score <= 100),
  letter_grade text not null,
  status_label text not null,
  response_time_ms integer not null default 0,
  word_count integer not null default 0,
  seo_score integer not null default 0,
  cro_score integer not null default 0,
  geo_score integer not null default 0,
  a11y_score integer not null default 0,
  security_score integer not null default 0,
  executive_summary text not null,
  estimated_conversion_lift text not null,
  extraction_source text not null default 'RapidAPI + Cloudflare DoH + Live DOM',
  has_spf boolean not null default false,
  has_dmarc boolean not null default false,
  dmarc_policy text default 'missing',
  mail_provider text default 'Unknown',
  ipv6_support boolean not null default false,
  domain_first_seen_year integer,
  has_robots_txt boolean not null default false,
  has_sitemap_xml boolean not null default false,
  has_llms_txt boolean not null default false,
  has_json_ld boolean not null default false,
  pillars jsonb not null default '{}'::jsonb,
  checks jsonb not null default '[]'::jsonb,
  keywords jsonb not null default '[]'::jsonb,
  ai_rewrites jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  report_payload jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  last_scanned_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.audits add column if not exists report_payload jsonb not null default '{}'::jsonb;

create index if not exists idx_audits_normalized_url on public.audits(normalized_url);
create index if not exists idx_audits_domain on public.audits(domain);
create index if not exists idx_audits_created_at on public.audits(created_at desc);

-- 3. AI-OPTIMIZED SEO ARTICLES & CONTENT STUDIO DOCS
create table if not exists public.articles (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  linked_audit_id text,
  linked_domain text,
  title text not null,
  focus_keyword text not null,
  keywords jsonb not null default '[]'::jsonb,
  meta_description text not null,
  content text not null,
  word_count integer not null default 0,
  seo_score integer not null default 90,
  status text not null default 'Ready to Publish',
  published_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles add column if not exists keywords jsonb not null default '[]'::jsonb;

create index if not exists idx_articles_linked_domain on public.articles(linked_domain);
create index if not exists idx_articles_updated_at on public.articles(updated_at desc);

-- 4. HEAD-TO-HEAD COMPETITOR DOMAIN COMPARISONS (/compare)
create table if not exists public.domain_comparisons (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  primary_url text not null,
  competitor_url text not null,
  primary_domain text not null,
  competitor_domain text not null,
  primary_score integer not null,
  competitor_score integer not null,
  winner_domain text not null,
  score_delta integer not null,
  comparison_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_comparisons_domains on public.domain_comparisons(primary_domain, competitor_domain);

-- 5. AGENCY WHITE-LABEL BRANDING CONFIGURATIONS
create table if not exists public.agency_whitelabel (
  id text primary key default 'default',
  user_id uuid references public.profiles(id) on delete cascade,
  agency_name text not null default 'Apex Digital Growth',
  logo_text text not null default 'APEX GROWTH',
  primary_color text not null default '#2563EB',
  accent_color text not null default '#0F172A',
  cta_text text not null default 'Book Your Free 15-Min Growth Audit Call',
  cta_url text not null default 'https://calendly.com',
  contact_email text not null default 'strategy@apexgrowth.io',
  footer_note text not null default 'Prepared exclusively by Apex Digital Growth Agency.',
  hide_powered_by boolean not null default true,
  config_payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 6. EMBEDDABLE WIDGET CAPTURED LEADS CRM
create table if not exists public.captured_leads (
  id text primary key,
  agency_user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  website_url text not null,
  audit_score integer not null default 0,
  status text not null default 'New',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_captured_leads_status on public.captured_leads(status);

-- 7. DEVELOPER API KEYS & OUTBOUND WEBHOOK SUBSCRIPTIONS (/docs)
create table if not exists public.api_keys_webhooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  key_prefix text not null default 'sk_live_seospace_',
  key_hash text not null,
  label text not null default 'Production API Key',
  webhook_url text,
  webhook_events text[] default array['audit.completed', 'lead.captured', 'article.generated'],
  requests_count integer not null default 0,
  is_active boolean not null default true,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.audits enable row level security;
alter table public.articles enable row level security;
alter table public.domain_comparisons enable row level security;
alter table public.agency_whitelabel enable row level security;
alter table public.captured_leads enable row level security;
alter table public.api_keys_webhooks enable row level security;

drop policy if exists "Public access for profiles" on public.profiles;
create policy "Public access for profiles"
  on public.profiles for all
  using (true)
  with check (true);

drop policy if exists "Public read access for shared audits" on public.audits;
drop policy if exists "Anyone can insert or update audits" on public.audits;
create policy "Anyone can insert or update audits"
  on public.audits for all
  using (true)
  with check (true);

drop policy if exists "Public read and write for articles" on public.articles;
create policy "Public read and write for articles"
  on public.articles for all
  using (true)
  with check (true);

drop policy if exists "Public read and write for domain comparisons" on public.domain_comparisons;
create policy "Public read and write for domain comparisons"
  on public.domain_comparisons for all
  using (true)
  with check (true);

drop policy if exists "Public read and write for agency whitelabel" on public.agency_whitelabel;
create policy "Public read and write for agency whitelabel"
  on public.agency_whitelabel for all
  using (true)
  with check (true);

drop policy if exists "Public read and write for captured leads" on public.captured_leads;
create policy "Public read and write for captured leads"
  on public.captured_leads for all
  using (true)
  with check (true);

drop policy if exists "Public read and write for api keys" on public.api_keys_webhooks;
create policy "Public read and write for api keys"
  on public.api_keys_webhooks for all
  using (true)
  with check (true);
