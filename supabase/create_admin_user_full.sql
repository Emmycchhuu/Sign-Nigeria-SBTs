-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $do$
DECLARE
  new_user_id uuid := gen_random_uuid();
  user_email text := 'accbombb@gmail.com';
  user_password text := 'c';
  user_username text := 'SignNigeria';
  encrypted_pw text;
BEGIN
  -- 2. Generate hashed password
  encrypted_pw := crypt(user_password, gen_salt('bf'));

  -- 1. Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    RAISE NOTICE 'User % already exists. Updating password and role to admin...', user_email;
    
    UPDATE auth.users
    SET encrypted_password = encrypted_pw
    WHERE email = user_email;

    UPDATE public.profiles
    SET role = 'admin'
    WHERE email = user_email;
    
    RETURN;
  END IF;

  -- 3. Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    is_super_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    now(), -- Auto confirm
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('username', user_username, 'full_name', user_username),
    now(),
    now(),
    '',
    '',
    false
  );

  -- 4. Insert into auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id, -- distinct identity id
    new_user_id,
    jsonb_build_object('sub', new_user_id, 'email', user_email),
    'email',
    new_user_id::text, -- user_id as provider_id for email provider
    now(),
    now(),
    now()
  );

  -- 5. Force Profile Creation / Update to Admin
  -- Using ON CONFLICT in case a trigger already created the profile
  INSERT INTO public.profiles (id, email, username, full_name, role, avatar_url)
  VALUES (
    new_user_id,
    user_email,
    user_username,
    user_username,
    'admin',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || user_username
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = 'admin',
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name;

  RAISE NOTICE 'Admin user created successfully: %', user_email;
END $do$;
