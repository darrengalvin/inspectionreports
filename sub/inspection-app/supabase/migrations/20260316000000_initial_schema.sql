-- Enquiries table (contact form submissions)
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  organisation text default '',
  service text not null,
  country text default '',
  message text not null,
  submitted_at timestamptz not null default now(),
  read boolean not null default false
);

alter table public.enquiries enable row level security;

create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can view enquiries"
  on public.enquiries for select
  to authenticated
  using (true);

create policy "Authenticated users can update enquiries"
  on public.enquiries for update
  to authenticated
  using (true)
  with check (true);

-- Endorsed services table
create table if not exists public.endorsed_services (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique not null,
  audit_number text not null,
  service_name text not null,
  percentage integer not null,
  date_issued timestamptz not null default now(),
  country text default '',
  endorsed_by text default 'DPB Quality Management'
);

alter table public.endorsed_services enable row level security;

create policy "Anyone can view endorsed services"
  on public.endorsed_services for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert endorsed services"
  on public.endorsed_services for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update endorsed services"
  on public.endorsed_services for update
  to authenticated
  using (true)
  with check (true);

-- Audit history table
create table if not exists public.audit_history (
  id uuid primary key default gen_random_uuid(),
  audit_number text unique not null,
  service_name text not null,
  country text default '',
  percentage integer not null,
  date_completed timestamptz not null default now(),
  passed boolean not null default false,
  audit_data jsonb default '{}'::jsonb
);

alter table public.audit_history enable row level security;

create policy "Authenticated users can view audit history"
  on public.audit_history for select
  to authenticated
  using (true);

create policy "Authenticated users can insert audit history"
  on public.audit_history for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update audit history"
  on public.audit_history for update
  to authenticated
  using (true)
  with check (true);

-- Inspections table
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  property_name text not null,
  provider_name text default '',
  overall_score numeric not null,
  date_completed timestamptz not null default now(),
  report_data jsonb default '{}'::jsonb
);

alter table public.inspections enable row level security;

create policy "Authenticated users can view inspections"
  on public.inspections for select
  to authenticated
  using (true);

create policy "Authenticated users can insert inspections"
  on public.inspections for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update inspections"
  on public.inspections for update
  to authenticated
  using (true)
  with check (true);
