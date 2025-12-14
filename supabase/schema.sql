-- ============================================================================
-- EAT App Database Schema
-- Run this in your Supabase SQL Editor to create the required tables
-- ============================================================================

-- Enable Row Level Security
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create the project_submissions table
create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  
  -- User info
  user_id uuid references auth.users(id) on delete cascade not null,
  student_name text,
  class_name text,
  
  -- Species info
  species_slug text not null,
  
  -- Math inputs (stored as JSON)
  math_inputs jsonb not null default '{}'::jsonb,
  
  -- Narrative inputs (stored as JSON)
  narrative_inputs jsonb not null default '{}'::jsonb,
  
  -- Calculated results
  score integer not null check (score >= 0 and score <= 1000),
  tipping_point_label text not null
);

-- Create an index for faster queries by user
create index if not exists idx_project_submissions_user_id 
  on public.project_submissions(user_id);

-- Create an index for queries by species
create index if not exists idx_project_submissions_species 
  on public.project_submissions(species_slug);

-- Enable Row Level Security
alter table public.project_submissions enable row level security;

-- Policy: Users can view their own submissions
create policy "Users can view own submissions"
  on public.project_submissions
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own submissions
create policy "Users can insert own submissions"
  on public.project_submissions
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own submissions
create policy "Users can update own submissions"
  on public.project_submissions
  for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own submissions
create policy "Users can delete own submissions"
  on public.project_submissions
  for delete
  using (auth.uid() = user_id);

-- Auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_project_submissions_updated
  before update on public.project_submissions
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- DONE! Your table is ready.
-- ============================================================================



