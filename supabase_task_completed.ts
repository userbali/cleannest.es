import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function parseAmount(value: unknown) {
  if (value == null) return null;
  const raw = String(value).trim().replace(",", ".");
  const num = Number(raw);
  if (!Number.isFinite(num)) return null;
  return num;
}

function normalizeAddOns(raw: unknown) {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((row) => {
    const label = String((row as { label?: string }).label || "").trim();
    const amount = parseAmount((row as { amount?: unknown }).amount);
    if (!label) return null;
    return { label, amount: Number.isFinite(amount) ? amount : 0 };
  }).filter(Boolean) as Array<{ label: string; amount: number }>;
}

function packInvoiceCustomerAddress(address: string | null, taxId: string | null, country: string | null) {
  const safeAddress = address || "";
  const safeTaxId = taxId || "";
  const safeCountry = country || "";
  if (!safeTaxId && !safeCountry) {
    return safeAddress || null;
  }
  return JSON.stringify({
    address: safeAddress,
    tax_id: safeTaxId,
    country: safeCountry
  });
}

function buildInvoiceItems(task: any, property: any) {
  const items: Array<{ label: string; qty: number; unit_price: number; line_total: number }> = [];
  const taskPrice = parseAmount(task && task.price);
  const propPrice = parseAmount(property && property.price);
  const basePrice = Number.isFinite(taskPrice) ? taskPrice : (Number.isFinite(propPrice) ? propPrice : null);
  if (Number.isFinite(basePrice)) {
    items.push({
      label: "Cleaning service",
      qty: 1,
      unit_price: basePrice,
      line_total: basePrice
    });
  }
  const addOns = normalizeAddOns(task && task.add_ons);
  addOns.forEach((addon) => {
    items.push({
      label: addon.label,
      qty: 1,
      unit_price: addon.amount,
      line_total: addon.amount
    });
  });
  const total = items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0);
  return { items, total };
}

async function sendCompletionEmail(resendKey: string, from: string, to: string, name: string, address: string, completedAt: string) {
  const safeName = name || "there";
  const safeAddress = address || "your property";
  const completedDate = completedAt ? completedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
  const subject = "Cleaning";
  const text = [
    `Hi ${safeName},`,
    "",
    `Just a quick note to let you know that the cleaning for ${safeAddress} has been completed on ${completedDate}.`,
    "",
    "Best regards,",
    "Clean-Nest team"
  ].join("\n");
  const html = `
    <p>Hi ${safeName},</p>
    <p>Just a quick note to let you know that the cleaning for <strong>${safeAddress}</strong> has been completed on ${completedDate}.</p>
    <p>Best regards,<br/>Clean-Nest team</p>
  `;
  const payload = {
    from,
    to: [to],
    subject,
    text,
    html
  };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Resend error: ${msg}`);
  }
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendKey = Deno.env.get("RESEND_API_KEY") || "";
    const resendFrom = Deno.env.get("RESEND_FROM") || "info@cleannest.es";

    if (!supabaseUrl || !serviceRole) {
      return jsonResponse({ error: "Missing Supabase environment." }, 500);
    }

    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } }
    });

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      return jsonResponse({ error: "Unauthorized." }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const taskId = body && body.task_id ? String(body.task_id) : "";
    if (!taskId) {
      return jsonResponse({ error: "task_id is required." }, 400);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, tenant_id, role, is_active, email, name")
      .eq("id", authData.user.id)
      .single();
    if (profileError || !profile || !profile.is_active) {
      return jsonResponse({ error: "Profile not available." }, 403);
    }
    if (!["admin", "staff"].includes(profile.role)) {
      return jsonResponse({ error: "Forbidden." }, 403);
    }

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, tenant_id, status, completed_at, day_date, price, add_ons, invoice_id, completion_email_sent_at, property_id, property:properties(id, address, price, billing_contact_id, owner_user_id)")
      .eq("id", taskId)
      .single();
    if (taskError || !task) {
      return jsonResponse({ error: "Task not found." }, 404);
    }
    if (task.tenant_id !== profile.tenant_id) {
      return jsonResponse({ error: "Tenant mismatch." }, 403);
    }
    if (task.status !== "done") {
      return jsonResponse({ error: "Task is not completed." }, 400);
    }
    const property = task.property;
    if (!property) {
      return jsonResponse({ error: "Property not found." }, 404);
    }

    let invoiceId = task.invoice_id || null;
    let invoiceCreated = false;
    if (!invoiceId) {
      if (!property.billing_contact_id) {
        return jsonResponse({ error: "Billing contact is required for this property." }, 400);
      }
      const { data: billing, error: billingError } = await supabase
        .from("billing_contacts")
        .select("id, name, email, tax_id, country, address")
        .eq("id", property.billing_contact_id)
        .single();
      if (billingError || !billing || !billing.email) {
        return jsonResponse({ error: "Billing contact email is missing." }, 400);
      }

      const completedAt = task.completed_at || new Date().toISOString();
      const issueDate = (completedAt || task.day_date || new Date().toISOString()).slice(0, 10);
      const { data: invoiceNumber, error: invoiceNumberError } = await supabase.rpc("next_invoice_number", {
        p_tenant_id: task.tenant_id,
        p_issue_date: issueDate
      });
      if (invoiceNumberError || !invoiceNumber) {
        return jsonResponse({ error: "Failed to generate invoice number." }, 500);
      }

      const { items, total } = buildInvoiceItems(task, property);
      if (!items.length) {
        return jsonResponse({ error: "No price set for this task." }, 400);
      }

      const customerAddressPayload = packInvoiceCustomerAddress(
        billing.address || null,
        billing.tax_id || null,
        billing.country || null
      );
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          tenant_id: task.tenant_id,
          owner_user_id: profile.id,
          property_id: property.id,
          status: "draft",
          issue_date: issueDate,
          total,
          currency: "EUR",
          invoice_number: invoiceNumber,
          customer_name: billing.name || "Customer",
          customer_email: billing.email,
          customer_address: customerAddressPayload
        })
        .select("id")
        .single();
      if (invoiceError || !invoice) {
        return jsonResponse({ error: invoiceError?.message || "Failed to create invoice." }, 500);
      }
      const itemsPayload = items.map((item) => ({
        tenant_id: task.tenant_id,
        invoice_id: invoice.id,
        label: item.label,
        qty: item.qty,
        unit_price: item.unit_price,
        line_total: item.line_total
      }));
      const { error: itemError } = await supabase.from("invoice_items").insert(itemsPayload);
      if (itemError) {
        return jsonResponse({ error: itemError.message || "Failed to save invoice items." }, 500);
      }
      await supabase.from("tasks").update({ invoice_id: invoice.id }).eq("id", task.id);
      invoiceId = invoice.id;
      invoiceCreated = true;
    }

    let emailSent = false;
    let emailSkipped = false;
    if (!task.completion_email_sent_at) {
      if (!resendKey) {
        return jsonResponse({ error: "Missing RESEND_API_KEY." }, 500);
      }
      const { data: owner, error: ownerError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("id", property.owner_user_id)
        .single();
      if (ownerError || !owner || !owner.email) {
        return jsonResponse({ error: "Property owner email is missing." }, 400);
      }
      await sendCompletionEmail(
        resendKey,
        resendFrom,
        owner.email,
        owner.name || "",
        property.address || "",
        task.completed_at || new Date().toISOString()
      );
      await supabase.from("tasks").update({ completion_email_sent_at: new Date().toISOString() }).eq("id", task.id);
      emailSent = true;
    } else {
      emailSkipped = true;
    }

    return jsonResponse({
      ok: true,
      invoice_id: invoiceId,
      invoice_created: invoiceCreated,
      email_sent: emailSent,
      email_skipped: emailSkipped
    });
  } catch (e) {
    return jsonResponse({ error: e.message || String(e) }, 500);
  }
});
