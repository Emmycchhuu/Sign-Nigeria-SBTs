-- Run this in the Supabase SQL Editor to make a user an Admin
-- Replace 'YOUR_EMAIL_HERE' with the email address of the user you want to promote

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the change
SELECT * FROM public.profiles WHERE role = 'admin';
