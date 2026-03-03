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
