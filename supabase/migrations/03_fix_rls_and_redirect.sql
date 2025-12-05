-- Fix RLS Policies for Admin Updates

-- 1. Allow Admins to UPDATE mint_requests
create policy "Admins can update mint requests."
  on public.mint_requests for update
  using ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- 2. Allow Admins to UPDATE sbts (for assignment)
create policy "Admins can update sbts."
  on public.sbts for update
  using ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

-- 3. Allow Admins to INSERT notifications (if not already allowed via service role, but good to have)
create policy "Admins can insert notifications."
  on public.notifications for insert
  with check ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );
