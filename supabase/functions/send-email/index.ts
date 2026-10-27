import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Only a signed-in user may send, and only to their own address. Every
    // email the app sends (welcome, achievements, reminders) goes to the
    // current user, so this costs nothing — and without it, anyone holding
    // the public anon key could send arbitrary mail through this account.
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.email) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { to, subject, html, text }: SendEmailRequest = await req.json();

    if (!to || !subject || !html) {
      return jsonResponse({ error: "Missing required fields: to, subject, html" }, 400);
    }

    if (to.trim().toLowerCase() !== user.email.toLowerCase()) {
      return jsonResponse({ error: "You can only send email to your own address" }, 403);
    }

    // The sender comes from server configuration only, never from the request.
    const fromAddress = `${Deno.env.get("EMAIL_FROM_NAME") || "AdaptLearn"} <${
      Deno.env.get("EMAIL_FROM_ADDRESS") || "onboarding@resend.dev"
    }>`;

    // Without a verified sending domain, Resend only delivers to the account
    // owner's address, so in that "testing mode" mail is redirected there.
    let recipientEmail = to;
    let finalSubject = subject;
    if (!Deno.env.get("EMAIL_FROM_ADDRESS")) {
      const verifiedEmail = Deno.env.get("RESEND_VERIFIED_EMAIL");
      if (!verifiedEmail) {
        throw new Error("Set EMAIL_FROM_ADDRESS, or RESEND_VERIFIED_EMAIL for testing mode");
      }
      if (to !== verifiedEmail) {
        console.log(`Testing mode: redirecting email for ${to} to the verified address`);
        recipientEmail = verifiedEmail;
        finalSubject = `[TEST for ${to}] ${subject}`;
      }
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipientEmail],
        subject: finalSubject,
        html,
        text: text || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    return jsonResponse({ success: true, id: data.id }, 200);
  } catch (error) {
    console.error("Error sending email:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500,
    );
  }
});
