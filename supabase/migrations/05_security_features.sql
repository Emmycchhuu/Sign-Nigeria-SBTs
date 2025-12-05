-- Add security columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS device_fingerprint text,
ADD COLUMN IF NOT EXISTS country text;

-- Create an index on device_fingerprint for faster lookups
CREATE INDEX IF NOT EXISTS profiles_device_fingerprint_idx ON public.profiles(device_fingerprint);
CREATE INDEX IF NOT EXISTS profiles_ip_address_idx ON public.profiles(ip_address);

-- RPC function to check for existing accounts with same IP or Fingerprint
-- Returns true if a conflict is found
CREATE OR REPLACE FUNCTION check_security_conflict(
  check_ip text,
  check_fingerprint text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conflict_found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE ip_address = check_ip 
       OR device_fingerprint = check_fingerprint
  ) INTO conflict_found;

  RETURN conflict_found;
END;
$$;

-- Update handle_new_user to capture security metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    username,
    ip_address,
    device_fingerprint,
    country
  )
  VALUES (
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
    ),
    new.raw_user_meta_data->>'ip_address',
    new.raw_user_meta_data->>'device_fingerprint',
    new.raw_user_meta_data->>'country'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
