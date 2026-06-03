-- ============================================
-- Family Operating System — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Vision & Five-Year Plan (single row, updated in place)
create table if not exists vision (
  id integer primary key default 1,
  family_vision text default '',
  faith_vision text default '',
  financial_vision text default '',
  real_estate_vision text default '',
  entrepreneurship_vision text default '',
  target_year integer default 2031,
  income_goal text default '$300k–$500k+',
  net_worth_goal text default '+$1,000,000',
  milestone_property text default '',
  milestone_real_estate text default '',
  milestone_entrepreneurship text default '',
  milestone_family text default '',
  updated_at timestamptz default now()
);

-- Seed one row so there's always something to update
insert into vision (id) values (1) on conflict (id) do nothing;

-- Annual Plans (one per year)
create table if not exists annual_plans (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  season text default '',
  primary_objective text default '',
  objective_reason text default '',
  success_criteria text default '',
  notes text default '',
  status text default 'active', -- active | complete | incomplete
  completion_reflection text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quarterly Plans (up to 4 per year)
create table if not exists quarterly_plans (
  id uuid primary key default gen_random_uuid(),
  year integer not null,
  quarter integer not null check (quarter between 1 and 4),
  priority_1_title text default '',
  priority_1_why text default '',
  priority_1_bucket text default '',
  priority_1_milestone text default '',
  priority_1_date text default '',
  priority_1_status text default 'active',
  priority_2_title text default '',
  priority_2_why text default '',
  priority_2_bucket text default '',
  priority_2_milestone text default '',
  priority_2_date text default '',
  priority_2_status text default 'active',
  priority_3_title text default '',
  priority_3_why text default '',
  priority_3_bucket text default '',
  priority_3_milestone text default '',
  priority_3_date text default '',
  priority_3_status text default 'active',
  intentional_nos text default '',
  notes text default '',
  status text default 'active', -- active | complete | incomplete
  completion_reflection text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(year, quarter)
);

-- Weekly Plans
create table if not exists weekly_plans (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique, -- Monday of the week
  family_action text default '',
  income_action text default '',
  wealth_action text default '',
  freedom_action text default '',
  calendar_aligned text default '', -- 'yes' | 'partial' | 'no'
  drift_causes text default '',
  next_week_changes text default '',
  rating text default '', -- 'aligned' | 'partial' | 'drifted'
  end_of_week_notes text default '',
  status text default 'active', -- active | complete
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Disable RLS (single shared account, no auth needed)
alter table vision disable row level security;
alter table annual_plans disable row level security;
alter table quarterly_plans disable row level security;
alter table weekly_plans disable row level security;
