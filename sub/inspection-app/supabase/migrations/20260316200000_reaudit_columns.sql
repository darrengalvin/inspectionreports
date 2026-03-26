-- Add re-audit tracking columns to audit_history
alter table public.audit_history
  add column if not exists parent_audit_id uuid references public.audit_history(id),
  add column if not exists follow_up_date date,
  add column if not exists action_plan_items jsonb default '[]'::jsonb;

-- Drop the unique constraint on audit_number so re-audits can reference the same service
-- (Each re-audit gets its own unique audit_number with a suffix like EN-101-R1)
