-- Automatic retention for completed-work photos.
--
-- Safety rules:
--   * only media_links.tag = 'after'
--   * only photos linked to a completed task
--   * both the task completion and photo upload must be at least 30 days old
--   * reference photos and multiply-linked media are never selected
--   * Storage objects are deleted by the Edge Function via the Storage API

create extension if not exists pg_net;
create extension if not exists pg_cron;

do $$
begin
  if not exists (
    select 1
    from vault.secrets
    where name = 'work_photo_cleanup_token'
  ) then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'work_photo_cleanup_token',
      'Internal token used only by the completed-work photo retention job.'
    );
  end if;
end;
$$;

create or replace function public.verify_work_photo_cleanup_token(p_token text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from vault.decrypted_secrets secret
    where secret.name = 'work_photo_cleanup_token'
      and secret.decrypted_secret = p_token
  );
$$;

revoke all on function public.verify_work_photo_cleanup_token(text) from public;
revoke all on function public.verify_work_photo_cleanup_token(text) from anon;
revoke all on function public.verify_work_photo_cleanup_token(text) from authenticated;
grant execute on function public.verify_work_photo_cleanup_token(text) to service_role;

create or replace function public.list_expired_work_photos(
  p_retention_days integer default 30,
  p_limit integer default 500
)
returns table(media_id uuid, path text)
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select m.id as media_id, m.path
  from public.media m
  join public.media_links ml on ml.media_id = m.id
  join public.tasks t on t.id = ml.task_id
  where ml.tag::text = 'after'
    and ml.task_id is not null
    and t.status::text = 'done'
    and t.completed_at is not null
    and t.completed_at <= now() - make_interval(days => greatest(coalesce(p_retention_days, 30), 30))
    and m.created_at <= now() - make_interval(days => greatest(coalesce(p_retention_days, 30), 30))
    and ml.tenant_id = m.tenant_id
    and ml.tenant_id = t.tenant_id
    and m.path like ml.tenant_id::text || '/tasks/' || ml.task_id::text || '/work/%'
    and not exists (
      select 1
      from public.media_links other_link
      where other_link.media_id = m.id
        and other_link.id <> ml.id
    )
  order by greatest(t.completed_at, m.created_at), m.id
  limit least(greatest(coalesce(p_limit, 500), 1), 500);
$$;

revoke all on function public.list_expired_work_photos(integer, integer) from public;
revoke all on function public.list_expired_work_photos(integer, integer) from anon;
revoke all on function public.list_expired_work_photos(integer, integer) from authenticated;
grant execute on function public.list_expired_work_photos(integer, integer) to service_role;

create or replace function public.delete_expired_work_photo_records(
  p_media_ids uuid[],
  p_retention_days integer default 30
)
returns table(media_id uuid)
language sql
volatile
security definer
set search_path = ''
set row_security = off
as $$
  delete from public.media m
  where m.id = any(coalesce(p_media_ids, '{}'::uuid[]))
    and exists (
      select 1
      from public.media_links ml
      join public.tasks t on t.id = ml.task_id
      where ml.media_id = m.id
        and ml.tag::text = 'after'
        and ml.task_id is not null
        and t.status::text = 'done'
        and t.completed_at is not null
        and t.completed_at <= now() - make_interval(days => greatest(coalesce(p_retention_days, 30), 30))
        and m.created_at <= now() - make_interval(days => greatest(coalesce(p_retention_days, 30), 30))
        and ml.tenant_id = m.tenant_id
        and ml.tenant_id = t.tenant_id
        and m.path like ml.tenant_id::text || '/tasks/' || ml.task_id::text || '/work/%'
        and not exists (
          select 1
          from public.media_links other_link
          where other_link.media_id = m.id
            and other_link.id <> ml.id
        )
    )
  returning m.id as media_id;
$$;

revoke all on function public.delete_expired_work_photo_records(uuid[], integer) from public;
revoke all on function public.delete_expired_work_photo_records(uuid[], integer) from anon;
revoke all on function public.delete_expired_work_photo_records(uuid[], integer) from authenticated;
grant execute on function public.delete_expired_work_photo_records(uuid[], integer) to service_role;

create or replace function public.invoke_work_photo_cleanup(p_execute boolean default false)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  cleanup_token text;
  request_id bigint;
begin
  select secret.decrypted_secret
  into cleanup_token
  from vault.decrypted_secrets secret
  where secret.name = 'work_photo_cleanup_token'
  limit 1;

  if cleanup_token is null or cleanup_token = '' then
    raise exception 'work_photo_cleanup_token is not configured';
  end if;

  select net.http_post(
    url := 'https://fplhbxhxqtaxbdqmujvn.supabase.co/functions/v1/cleanup-work-photos',
    body := jsonb_build_object('execute', coalesce(p_execute, false)),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cleanup-token', cleanup_token
    ),
    timeout_milliseconds := 120000
  )
  into request_id;

  return request_id;
end;
$$;

revoke all on function public.invoke_work_photo_cleanup(boolean) from public;
revoke all on function public.invoke_work_photo_cleanup(boolean) from anon;
revoke all on function public.invoke_work_photo_cleanup(boolean) from authenticated;
grant execute on function public.invoke_work_photo_cleanup(boolean) to service_role;
