-- Task-level checklist notes and flexible task completion.
-- This migration is additive and keeps every existing task and checklist row.

alter table public.tasks
  add column if not exists checklist_note text;

comment on column public.tasks.checklist_note is
  'Optional explanation for incomplete checklist items, visible to authorized clients.';

create or replace function public.staff_set_task_checklist_note(
  p_task_id uuid,
  p_checklist_note text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_profile record;
  v_task record;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select p.id, p.tenant_id, p.role, p.is_active
    into v_profile
  from public.profiles as p
  where p.id = v_uid;

  if not found
    or not v_profile.is_active
    or v_profile.role not in ('staff', 'admin') then
    raise exception 'Forbidden';
  end if;

  select t.id, t.tenant_id, t.assigned_user_id, t.status
    into v_task
  from public.tasks as t
  where t.id = p_task_id;

  if not found then
    raise exception 'Task not found';
  end if;
  if v_task.tenant_id <> v_profile.tenant_id then
    raise exception 'Forbidden';
  end if;
  if v_profile.role = 'staff'
    and v_task.assigned_user_id is distinct from v_uid then
    raise exception 'Forbidden';
  end if;
  if v_task.status = 'canceled' then
    raise exception 'Task canceled';
  end if;
  if char_length(coalesce(p_checklist_note, '')) > 2000 then
    raise exception 'Checklist note is too long';
  end if;

  update public.tasks
  set checklist_note = nullif(btrim(coalesce(p_checklist_note, '')), '')
  where id = p_task_id;
end;
$$;

revoke all on function public.staff_set_task_checklist_note(uuid, text) from public;
revoke all on function public.staff_set_task_checklist_note(uuid, text) from anon;
grant execute on function public.staff_set_task_checklist_note(uuid, text) to authenticated;

create or replace function public.staff_complete_task(p_task_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_profile record;
  v_task record;
  v_work_count integer := 0;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select p.id, p.tenant_id, p.role, p.is_active
    into v_profile
  from public.profiles as p
  where p.id = v_uid;

  if not found or v_profile.role <> 'staff' or not v_profile.is_active then
    raise exception 'Forbidden';
  end if;

  select t.id, t.tenant_id, t.assigned_user_id, t.status
    into v_task
  from public.tasks as t
  where t.id = p_task_id
  for update;

  if not found then
    raise exception 'Task not found';
  end if;
  if v_task.tenant_id <> v_profile.tenant_id then
    raise exception 'Forbidden';
  end if;
  if v_task.assigned_user_id is distinct from v_uid then
    raise exception 'Forbidden';
  end if;
  if v_task.status in ('done', 'canceled') then
    raise exception 'Task closed';
  end if;

  select count(*)
    into v_work_count
  from public.media_links as ml
  where ml.task_id = p_task_id
    and (ml.tag is null or ml.tag <> 'reference');

  if v_work_count = 0 then
    raise exception 'Add at least one work photo';
  end if;

  update public.tasks
  set status = 'done',
      completed_at = now(),
      started_at = coalesce(started_at, now())
  where id = p_task_id;
end;
$$;

revoke all on function public.staff_complete_task(uuid) from public;
revoke all on function public.staff_complete_task(uuid) from anon;
grant execute on function public.staff_complete_task(uuid) to authenticated;
