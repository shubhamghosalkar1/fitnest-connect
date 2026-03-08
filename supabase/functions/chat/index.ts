import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are FitNest AI Assistant — a knowledgeable, friendly fitness industry expert. You help visitors with:

1. **Platform Questions**: How FitNest works, how to register as a trainer, how to find trainers, gym listings, pricing, etc.
2. **Fitness & Training**: General fitness advice, workout tips, nutrition basics, training methodologies.
3. **Certification Guidance**: Information about recognized certifications (NASM, ACE, ISSA, NSCA, ACSM, NESTA, AFAA, CSCS) and how to get certified.
4. **Gym & Business**: Tips for gym owners, trainer management, client retention strategies.
5. **Health & Wellness**: General wellness advice (always recommend consulting a healthcare professional for medical concerns).

Key FitNest features to mention when relevant:
- Trainers can register with verified certifications and government IDs
- AI-powered verification of credentials
- Clients can find verified trainers filtered by specialty, location
- Gyms can list their facilities and find trainers
- Pricing is in Indian Rupees (₹)
- Supported certifications: NASM, ACE, ISSA, NSCA, ACSM, NESTA, AFAA, CSCS
- Supported government IDs: Driver's License, Passport, PAN Card, Aadhar Card

Keep responses concise (2-4 sentences unless detailed explanation needed). Be encouraging and professional. Use emojis sparingly for warmth.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
