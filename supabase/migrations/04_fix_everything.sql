-- COMPREHENSIVE FIX SCRIPT
-- Run this in the Supabase SQL Editor

-- 1. Fix Check Constraint for 'verified' status
alter table public.mint_requests drop constraint if exists mint_requests_status_check;
alter table public.mint_requests 
  add constraint mint_requests_status_check 
  check (status in ('pending', 'verified', 'approved', 'rejected'));

-- 2. Reset and Fix RLS Policies for Admin Updates
-- Drop existing policies to avoid conflicts
drop policy if exists "Admins can update mint requests." on public.mint_requests;
drop policy if exists "Admins can update sbts." on public.sbts;
drop policy if exists "Admins can insert notifications." on public.notifications;

-- Recreate Policies
create policy "Admins can update mint requests."
  on public.mint_requests for update
  using ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

create policy "Admins can update sbts."
  on public.sbts for update
  using ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

create policy "Admins can insert notifications."
  on public.notifications for insert
  with check ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- 3. MAKE YOURSELF ADMIN (IMPORTANT!)
-- Replace 'YOUR_EMAIL_HERE' with your actual email address
update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL_HERE';
