-- Fix Foreign Keys to allow User Deletion (Cascade)

-- 1. Fix SBTs table (owner_id)
ALTER TABLE public.sbts 
DROP CONSTRAINT IF EXISTS sbts_owner_id_fkey,
ADD CONSTRAINT sbts_owner_id_fkey 
    FOREIGN KEY (owner_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

-- 2. Fix Mint Requests table (user_id)
ALTER TABLE public.mint_requests
DROP CONSTRAINT IF EXISTS mint_requests_user_id_fkey,
ADD CONSTRAINT mint_requests_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;

-- 3. Fix Notifications table (user_id)
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
