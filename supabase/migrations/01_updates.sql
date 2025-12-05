-- Safe updates for Mint Requests and Storage

-- 1. Update mint_requests table columns safely
do $$
begin
  -- Add orange_dynasty_username if it doesn't exist
  if not exists (select 1 from information_schema.columns where table_name = 'mint_requests' and column_name = 'orange_dynasty_username') then
    alter table public.mint_requests add column orange_dynasty_username text;
  end if;

  -- Make sbt_id nullable if it isn't already
  alter table public.mint_requests alter column sbt_id drop not null;
end $$;

-- 2. Create Storage Bucket
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

-- 3. Update Storage Policies (Drop first to avoid conflicts)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Auth Upload" on storage.objects;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'proofs' );

create policy "Auth Upload"
  on storage.objects for insert
  with check ( bucket_id = 'proofs' and auth.role() = 'authenticated' );
