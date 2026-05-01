-- Profiles table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  age integer,
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric,
  weight_kg numeric,
  fitness_goal text check (fitness_goal in ('lose_weight', 'build_muscle', 'maintain', 'improve_endurance', 'general_fitness')),
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')) default 'beginner',
  activity_level text check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')) default 'sedentary',
  available_equipment text[] default '{}',
  dietary_preference text check (dietary_preference in ('none', 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten_free')) default 'none',
  injuries_notes text,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
