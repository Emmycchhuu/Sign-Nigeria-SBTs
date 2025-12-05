-- Clean up the failed user creation
-- Run this in Supabase SQL Editor

DELETE FROM auth.users WHERE email = 'accbombb@gmail.com';

-- Verify deletion (should return 0 rows)
SELECT * FROM auth.users WHERE email = 'accbombb@gmail.com';
