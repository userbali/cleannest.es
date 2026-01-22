-- Add invoice linkage + completion email marker for task automation
alter table public.tasks
  add column if not exists invoice_id uuid references public.invoices(id);

alter table public.tasks
  add column if not exists completion_email_sent_at timestamptz;

create index if not exists tasks_invoice_id_idx on public.tasks(invoice_id);
