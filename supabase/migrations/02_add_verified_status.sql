-- Update mint_requests status check constraint to include 'verified'
alter table public.mint_requests drop constraint if exists mint_requests_status_check;

alter table public.mint_requests 
  add constraint mint_requests_status_check 
  check (status in ('pending', 'verified', 'approved', 'rejected'));
