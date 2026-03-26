-- Assessments table (placement matching results)
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  individual_name text not null,
  facility_name text not null,
  support_level text default '',
  overall_percentage integer not null default 0,
  date_completed timestamptz not null default now(),
  has_transition_plan boolean not null default false,
  assessment_data jsonb default '{}'::jsonb
);

alter table public.assessments enable row level security;

create policy "Authenticated users can view assessments"
  on public.assessments for select
  to authenticated
  using (true);

create policy "Authenticated users can insert assessments"
  on public.assessments for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update assessments"
  on public.assessments for update
  to authenticated
  using (true)
  with check (true);
