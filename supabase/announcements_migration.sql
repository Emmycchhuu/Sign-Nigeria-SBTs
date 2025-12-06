-- 1. Add image_url to notifications if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='image_url') then
        alter table public.notifications add column image_url text;
    end if;
end $$;

-- 2. Create Broadcast Function
-- Efficiently inserts a notification for ALL users (or filtered if we wanted, but broadcast implies all)
create or replace function public.broadcast_notification(
    title text,
    message text,
    image_url text default null,
    link text default null
)
returns void as $$
begin
    insert into public.notifications (user_id, type, title, message, image_url, link)
    select id, 'broadcast', title, message, image_url, link
    from auth.users;
end;
$$ language plpgsql security definer;

-- 3. Fix Settings: Allow users to view their own profile (already likely exists, but ensuring)
-- (Profiles table usually has RLS, but standard is readable by owner or public depending on setup)
