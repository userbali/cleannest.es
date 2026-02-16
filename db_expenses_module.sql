-- Expenses module schema + RLS for Clean-Nest
-- Run in Supabase SQL editor.

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  expense_date date not null default current_date,
  amount numeric not null check (amount >= 0),
  description text not null default '',
  created_by_user_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expenses_tenant_date_idx on public.expenses(tenant_id, expense_date desc);
create index if not exists expenses_property_idx on public.expenses(property_id);
create index if not exists expenses_creator_idx on public.expenses(created_by_user_id);

create or replace function public.set_expenses_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
before update on public.expenses
for each row
execute function public.set_expenses_updated_at();

alter table public.expenses enable row level security;

drop policy if exists expenses_select on public.expenses;
create policy expenses_select on public.expenses
for select
to authenticated
using (
  public.is_admin()
  and tenant_id = public.current_tenant_id()
);

drop policy if exists expenses_admin_write on public.expenses;
create policy expenses_admin_write on public.expenses
for all
to authenticated
using (
  public.is_admin()
  and tenant_id = public.current_tenant_id()
)
with check (
  public.is_admin()
  and tenant_id = public.current_tenant_id()
);

-- Enable the module for existing tenants.
insert into public.tenant_modules (tenant_id, module_key, is_enabled)
select t.id, 'expenses', true
from public.tenants t
on conflict (tenant_id, module_key) do nothing;
