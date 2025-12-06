-- Notifications Table
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Schema Migration: Ensure columns exist (Fix for "column 'type' does not exist" error)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='type') then
        alter table public.notifications add column type text check (type in ('info', 'success', 'warning', 'error', 'broadcast')) default 'info';
    end if;
    
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='title') then
        alter table public.notifications add column title text default 'Notification';
    end if;

    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='message') then
        alter table public.notifications add column message text default '';
    end if;

    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='link') then
        alter table public.notifications add column link text;
    end if;

    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='notifications' and column_name='is_read') then
        alter table public.notifications add column is_read boolean default false;
    end if;
end $$;

-- RLS for Notifications
alter table public.notifications enable row level security;

drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications"
    on public.notifications for select
    using (auth.uid() = user_id);

drop policy if exists "Admins can view all notifications" on public.notifications;
create policy "Admins can view all notifications"
    on public.notifications for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid() and profiles.role = 'admin'
        )
    );

drop policy if exists "System/Admins can insert notifications" on public.notifications;
create policy "Enable insert for authenticated users"
    on public.notifications for insert
    with check (auth.role() = 'authenticated'); -- Allow triggers to fire correctly with user context

drop policy if exists "Users can update their own notifications (mark read)" on public.notifications;
create policy "Users can update their own notifications (mark read)"
    on public.notifications for update
    using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------------

-- 1. Welcome Message
create or replace function public.handle_new_user_welcome()
returns trigger as $$
begin
    insert into public.notifications (user_id, type, title, message)
    values (
        new.id,
        'info',
        'Welcome to Signigeria!',
        'Your journey to the Orange Dynasty starts here. Explore our exclusive artifacts and start collecting.'
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_welcome on public.profiles;
create trigger on_auth_user_created_welcome
    after insert on public.profiles
    for each row execute procedure public.handle_new_user_welcome();


-- 2. New Mint Request (Insert)
create or replace function public.handle_new_mint_request()
returns trigger as $$
declare
    admin_record record;
begin
    -- A. Notify the User
    insert into public.notifications (user_id, type, title, message)
    values (
        new.user_id,
        'info',
        'Mint Request Received',
        'We have received your payment proof. An Admin is reviewing it now.'
    );

    -- B. Notify All Admins
    for admin_record in select id from public.profiles where role = 'admin' loop
        insert into public.notifications (user_id, type, title, message, link)
        values (
            admin_record.id,
            'info',
            'New Mint Request',
            'A user has submitted a new mint request.',
            '/admin/requests'
        );
    end loop;

    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_mint_request_created on public.mint_requests;
create trigger on_mint_request_created
    after insert on public.mint_requests
    for each row execute procedure public.handle_new_mint_request();


-- 3. Status Update (Available -> Verified -> Rejected -> Approved)
create or replace function public.handle_mint_request_update()
returns trigger as $$
begin
    if old.status <> new.status then
        if new.status = 'verified' then
            insert into public.notifications (user_id, type, title, message)
            values (new.user_id, 'success', 'Payment Verified', 'Your payment has been verified. The Admin will assign your artifact shortly.');
        elsif new.status = 'rejected' then
            insert into public.notifications (user_id, type, title, message)
            values (new.user_id, 'error', 'Request Rejected', 'Your mint request was rejected. Please check your details and try again.');
        elsif new.status = 'approved' then
            insert into public.notifications (user_id, type, title, message)
            values (new.user_id, 'success', 'Artifact Assigned!', 'Congratulations! An SBT has been assigned to your vault.');
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_mint_request_status_change on public.mint_requests;
create trigger on_mint_request_status_change
    after update on public.mint_requests
    for each row execute procedure public.handle_mint_request_update();


-- 4. Public Broadcast (SBT Minted)
create table if not exists public.public_activity (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    action_type text,
    message text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.public_activity enable row level security;
drop policy if exists "Anyone can read public activity" on public.public_activity;
create policy "Anyone can read public activity"
    on public.public_activity for select
    using (true);

create or replace function public.log_public_mint_activity()
returns trigger as $$
declare
    user_name text;
begin
    select full_name into user_name from public.profiles where id = new.owner_id;
    if user_name is null then user_name := 'A Collector'; end if;

    if old.status <> 'minted' and new.status = 'minted' then
        insert into public.public_activity (user_id, action_type, message)
        values (new.owner_id, 'mint', user_name || ' just secured a new artifact from the collection!');
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_sbt_minted_public on public.sbts;
create trigger on_sbt_minted_public
    after update on public.sbts
    for each row execute procedure public.log_public_mint_activity();
