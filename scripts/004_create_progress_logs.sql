-- Progress logs for tracking user metrics over time
create table if not exists public.progress_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_at date not null default current_date,
  weight_kg numeric(5,1),
  body_fat_pct numeric(4,1),
  energy_level int check (energy_level between 1 and 10),
  soreness_level int check (soreness_level between 1 and 10),
  sleep_hours numeric(3,1),
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_progress_logs_user on public.progress_logs(user_id, logged_at desc);

alter table public.progress_logs enable row level security;

create policy "progress_select_own" on public.progress_logs
  for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.progress_logs
  for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress_logs
  for update using (auth.uid() = user_id);
create policy "progress_delete_own" on public.progress_logs
  for delete using (auth.uid() = user_id);

-- Workout feedback for AI difficulty adjustment
create table if not exists public.workout_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  difficulty_rating int not null check (difficulty_rating between 1 and 5),
  completed boolean not null default false,
  exercises_completed int default 0,
  total_exercises int default 0,
  feedback_notes text,
  created_at timestamptz default now()
);

create index if not exists idx_workout_feedback_user on public.workout_feedback(user_id, created_at desc);

alter table public.workout_feedback enable row level security;

create policy "feedback_select_own" on public.workout_feedback
  for select using (auth.uid() = user_id);
create policy "feedback_insert_own" on public.workout_feedback
  for insert with check (auth.uid() = user_id);
create policy "feedback_update_own" on public.workout_feedback
  for update using (auth.uid() = user_id);
create policy "feedback_delete_own" on public.workout_feedback
  for delete using (auth.uid() = user_id);
