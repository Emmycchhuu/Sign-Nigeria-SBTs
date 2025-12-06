-- Storage Bucket: announcements
insert into storage.buckets (id, name, public)
values ('announcements', 'announcements', true)
on conflict (id) do nothing;

-- Policy: Public Read Access
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'announcements' );

-- Policy: Admin Insert/Update Access
drop policy if exists "Authenticated Users can Insert" on storage.objects;
create policy "Authenticated Users can Insert"
  on storage.objects for insert
  with check ( bucket_id = 'announcements' and auth.role() = 'authenticated' );
