-- ============================================================================
-- SEOSPACE / AUDITPULSE AI — SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Run this script once in your Supabase SQL Editor (https://supabase.com)
-- ============================================================================

create extension if not exists "uuid-ossp";

-- 1. User Profiles & Subscription Plans
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'agency')),
  stripe_customer_id text,
  stripe_subscription_id text,
  credits_used integer not null default 0,
  credits_limit integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Audited Website Reports
create table if not exists public.audits (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  url text not null,
  domain text not null,
  overall_score integer not null,
  letter_grade text not null,
  report_payload jsonb not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.audits enable row level security;

create policy "Anyone can view public audit reports"
  on public.audits for select
  using (is_public = true or auth.uid() = user_id);

create policy "Authenticated users can insert audits"
  on public.audits for insert
  with check (true);

-- 3. Agency White-Label Branding Config
create table if not exists public.agency_whitelabel (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  agency_name text not null default 'Apex Digital Growth',
  logo_text text not null default 'APEX GROWTH',
  primary_color text not null default '#2563EB',
  cta_text text not null default 'Book Your Free 15-Min Growth Audit Call',
  cta_url text not null default 'https://calendly.com',
  contact_email text,
  footer_note text,
  hide_powered_by boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.agency_whitelabel enable row level security;

create policy "Users manage own white-label settings"
  on public.agency_whitelabel for all
  using (auth.uid() = user_id);

-- 4. Captured Agency Widget Leads (CRM)
create table if not exists public.captured_leads (
  id uuid default uuid_generate_v4() primary key,
  agency_user_id uuid references public.profiles(id) on delete cascade,
  prospect_name text not null,
  prospect_email text not null,
  website_url text not null,
  audit_score integer not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

alter table public.captured_leads enable row level security;

create policy "Agencies can view their captured leads"
  on public.captured_leads for select
  using (auth.uid() = agency_user_id);

create policy "Public widget can insert leads"
  on public.captured_leads for insert
  with check (true);
