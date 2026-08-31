-- Enable the daily cleanup only after the Edge Function dry run succeeds.

do $$
declare
  existing_job_id bigint;
begin
  select jobid
  into existing_job_id
  from cron.job
  where jobname = 'cleanup-completed-work-photos'
  limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;
end;
$$;

select cron.schedule(
  'cleanup-completed-work-photos',
  '15 3 * * *',
  $cron$select public.invoke_work_photo_cleanup(true);$cron$
);
