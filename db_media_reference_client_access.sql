-- Allow property owners (client users) to see reference photos as well.
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
          or exists (
            select 1
            from public.tasks t
            where t.id = ml.task_id
              and t.assigned_user_id = auth.uid()
          )
          or (
            ml.tag = 'reference'
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
          or exists (
            select 1
            from public.properties p
            where p.id = ml.property_id
              and p.owner_user_id = auth.uid()
          )
          or exists (
            select 1
            from public.tasks t
            join public.properties p on p.id = t.property_id
            where t.id = ml.task_id
              and p.owner_user_id = auth.uid()
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
    or exists (
      select 1 from public.tasks t
      where t.id = media_links.task_id and t.assigned_user_id = auth.uid()
    )
    or (
      media_links.tag = 'reference'
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
    or exists (
      select 1 from public.properties p
      where p.id = media_links.property_id
        and p.owner_user_id = auth.uid()
    )
    or exists (
      select 1 from public.tasks t
      join public.properties p on p.id = t.property_id
      where t.id = media_links.task_id
        and p.owner_user_id = auth.uid()
    )
  )
);

-- STORAGE OBJECTS (required for signed URLs to work)
-- Use a SECURITY DEFINER helper so storage policy checks are not affected by
-- RLS chaining on public.media / public.media_links.
create or replace function public.can_read_media_path(p_path text)
returns boolean
language sql
stable
security definer
set search_path = public
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
        or exists (
          select 1
          from public.tasks t
          where t.id = ml.task_id
            and t.assigned_user_id = auth.uid()
        )
        or exists (
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
        or exists (
          select 1
          from public.properties p
          where p.id = ml.property_id
            and p.owner_user_id = auth.uid()
        )
        or exists (
          select 1
          from public.tasks t
          join public.properties p on p.id = t.property_id
          where t.id = ml.task_id
            and p.owner_user_id = auth.uid()
        )
      )
  );
$$;

drop policy if exists storage_media_select on storage.objects;
create policy storage_media_select on storage.objects
for select
to authenticated
using (
  bucket_id = 'media'
  and public.can_read_media_path(storage.objects.name)
);
