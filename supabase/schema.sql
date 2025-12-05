-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  bio text,
  twitter_handle text,
  wallet_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SBTS TABLE (The 777 Artifacts)
create table public.sbts (
  id integer primary key check (id >= 1 and id <= 777),
  owner_id uuid references public.profiles(id),
  name text not null,
  image_url text,
  status text default 'available' check (status in ('available', 'minted')),
  rarity text default 'Common',
  minted_at timestamp with time zone,
  metadata jsonb
);

-- MINT REQUESTS TABLE
create table public.mint_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  sbt_id integer references public.sbts(id), -- Nullable initially, assigned by Admin
  payment_proof_url text not null,
  orange_dynasty_username text, -- New column for payment verification
  amount text default '2000 Oranges',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.sbts enable row level security;
alter table public.mint_requests enable row level security;
alter table public.notifications enable row level security;

-- POLICIES

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- SBTs: Public read, Admin update (or system)
create policy "SBTs are viewable by everyone."
  on public.sbts for select
  using ( true );

-- Mint Requests: User see own, Admin see all
create policy "Users can see their own mint requests."
  on public.mint_requests for select
  using ( auth.uid() = user_id );

create policy "Admins can see all mint requests."
  on public.mint_requests for select
  using ( 
    exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
  );

create policy "Users can insert mint requests."
  on public.mint_requests for insert
  with check ( auth.uid() = user_id );

-- Notifications: User see own
create policy "Users can see their own notifications."
  on public.notifications for select
  using ( auth.uid() = user_id );

-- FUNCTIONS & TRIGGERS

-- Handle New User Signup -> Create Profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, username)
  values (
    new.id, 
    new.email, 
    coalesce(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'user_name'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url', 
      new.raw_user_meta_data->>'picture', 
      new.raw_user_meta_data->>'image'
    ),
    coalesce(
      new.raw_user_meta_data->>'username', 
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'preferred_username',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (Initialize the 777 SBTs)
do $$
begin
  for i in 1..777 loop
    insert into public.sbts (id, name, status, rarity)
    values (
      i, 
      'Artifact #' || lpad(i::text, 3, '0'), 
      'available',
      case 
        when random() > 0.9 then 'Legendary'
        when random() > 0.6 then 'Rare'
        else 'Common'
      end
    )
    on conflict (id) do nothing;
  end loop;
end;
$$;
-- STORAGE BUCKETS
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'proofs' );

create policy "Auth Upload"
  on storage.objects for insert
  with check ( bucket_id = 'proofs' and auth.role() = 'authenticated' );
