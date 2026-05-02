-- Add dietary_notes column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dietary_notes text;
