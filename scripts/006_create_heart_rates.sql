-- Table to store heart rate sensor readings
CREATE TABLE IF NOT EXISTS public.heart_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bpm INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.heart_rates ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own heart rate data
CREATE POLICY "Users can view their own heart rates" 
    ON public.heart_rates FOR SELECT 
    USING (auth.uid() = user_id);

-- Enable Supabase Realtime for this table
-- This allows the frontend to listen to INSERT events
ALTER PUBLICATION supabase_realtime ADD TABLE public.heart_rates;
