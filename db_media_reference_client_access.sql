-- Allow clients to see completed work photos, but keep reference photos
-- available only to admins and authorized staff.
-- Run this in Supabase SQL editor.

-- MEDIA
drop policy if exists media_select on public.media;
create policy media_select on public.media
for select
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and (
    (public.is_staff_or_admin() and uploader_user_id = auth.uid())
    or exists (
      select 1
      from public.media_links ml
      where ml.media_id = media.id
        and ml.tenant_id = public.current_tenant_id()
        and (
          public.is_admin()
          or (
            public.is_staff_or_admin()
            and exists (
              select 1
              from public.tasks t
              where t.id = ml.task_id
                and t.assigned_user_id = auth.uid()
            )
          )
          or (
            ml.tag = 'reference'
            and public.is_staff_or_admin()
            and (
              exists (
                select 1
                from public.property_staff ps
                where ps.property_id = ml.property_id
                  and ps.staff_user_id = auth.uid()
              )
              or exists (
                select 1
                from public.tasks t
                where t.property_id = ml.property_id
                  and t.assigned_user_id = auth.uid()
              )
            )
          )
          or (
            ml.tag is distinct from 'reference'
            and exists (
              select 1
              from public.properties p
              where p.id = ml.property_id
                and p.owner_user_id = auth.uid()
            )
          )
          or (
            ml.tag is distinct from 'reference'
            and exists (
              select 1
              from public.tasks t
              join public.properties p on p.id = t.property_id
              where t.id = ml.task_id
                and p.owner_user_id = auth.uid()
            )
          )
        )
    )
  )
);

-- MEDIA LINKS
drop policy if exists media_links_select on public.media_links;
create policy media_links_select on public.media_links
for select
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and (
    public.is_admin()
    or (
      public.is_staff_or_admin()
      and exists (
        select 1 from public.tasks t
        where t.id = media_links.task_id and t.assigned_user_id = auth.uid()
      )
    )
    or (
      media_links.tag = 'reference'
      and public.is_staff_or_admin()
      and (
        exists (
          select 1 from public.property_staff ps
          where ps.property_id = media_links.property_id
            and ps.staff_user_id = auth.uid()
        )
        or exists (
          select 1 from public.tasks t
          where t.property_id = media_links.property_id
            and t.assigned_user_id = auth.uid()
        )
      )
    )
    or (
      media_links.tag is distinct from 'reference'
      and exists (
        select 1 from public.properties p
        where p.id = media_links.property_id
          and p.owner_user_id = auth.uid()
      )
    )
    or (
      media_links.tag is distinct from 'reference'
      and exists (
        select 1 from public.tasks t
        join public.properties p on p.id = t.property_id
        where t.id = media_links.task_id
          and p.owner_user_id = auth.uid()
      )
    )
  )
);

-- STORAGE OBJECTS (required for signed URLs to work)
-- Use a SECURITY DEFINER helper so storage policy checks are not affected by
-- RLS chaining on public.media / public.media_links. Keep the helper outside
-- the exposed public schema so it cannot be called through the Data API.
create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated;

create or replace function private.can_read_media_path(p_path text)
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select exists (
    select 1
    from public.media m
    join public.media_links ml on ml.media_id = m.id
    where m.path = p_path
      and ml.tenant_id = public.current_tenant_id()
      and (
        public.is_admin()
        or (
          public.is_staff_or_admin()
          and exists (
            select 1
            from public.tasks t
            where t.id = ml.task_id
              and t.assigned_user_id = auth.uid()
          )
        )
        or (
          ml.tag = 'reference'
          and public.is_staff_or_admin()
          and (
            exists (
              select 1
              from public.property_staff ps
              where ps.property_id = ml.property_id
                and ps.staff_user_id = auth.uid()
            )
            or exists (
              select 1
              from public.tasks t
              where t.property_id = ml.property_id
                and t.assigned_user_id = auth.uid()
            )
          )
        )
        or (
          ml.tag is distinct from 'reference'
          and exists (
            select 1
            from public.properties p
            where p.id = ml.property_id
              and p.owner_user_id = auth.uid()
          )
        )
        or (
          ml.tag is distinct from 'reference'
          and exists (
            select 1
            from public.tasks t
            join public.properties p on p.id = t.property_id
            where t.id = ml.task_id
              and p.owner_user_id = auth.uid()
          )
        )
      )
  );
$$;

revoke all on function private.can_read_media_path(text) from public;
revoke all on function private.can_read_media_path(text) from anon;
grant execute on function private.can_read_media_path(text) to authenticated;

drop policy if exists storage_media_select on storage.objects;
create policy storage_media_select on storage.objects
for select
to authenticated
using (
  bucket_id = 'media'
  and private.can_read_media_path(storage.objects.name)
);

drop function if exists public.can_read_media_path(text);
