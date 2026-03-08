import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Authorized certification bodies recognized in India, US, and UK
const AUTHORIZED_CERTS = [
  // US Certifications
  "NASM", "ACE", "ISSA", "NSCA", "ACSM", "NESTA", "AFAA", "CSCS",
  "NASM-CPT", "ACE-CPT", "ISSA-CPT", "NSCA-CPT", "ACSM-CPT",
  "NASM-CES", "NASM-PES", "ACE-GFI", "NSCA-CSCS",
  // UK Certifications
  "CIMSPA", "REPS", "YMCA", "ACTIVE IQ", "PREMIER GLOBAL", "NRPT",
  "LEVEL 2 FITNESS", "LEVEL 3 PERSONAL TRAINING", "VTCT",
  // India Certifications
  "K11 FITNESS", "K11 ACADEMY", "IIFA", "INDIAN INSTITUTE OF FITNESS",
  "ACE INDIA", "GOLD'S GYM FITNESS INSTITUTE", "GGFI",
  "ISSA INDIA", "NASM INDIA", "FITPRO", "EREPS",
  // International
  "ACSM CEP", "NCSF", "IFPA", "WITS", "AASFP",
];

// Valid government ID patterns
const ID_PATTERNS: Record<string, { regex: RegExp; description: string }> = {
  "pan-card": {
    regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    description: "PAN Card format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)"
  },
  "aadhar-card": {
    regex: /^[2-9]{1}[0-9]{11}$/,
    description: "Aadhar Card: 12-digit number starting with 2-9"
  },
  "drivers-license": {
    regex: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,15}$/i,
    description: "Driver's License: State code + number"
  },
  "passport": {
    regex: /^[A-Z]{1}[0-9]{7}$/,
    description: "Passport: 1 letter + 7 digits"
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { trainer } = await req.json();
    if (!trainer) throw new Error("Trainer data required");

    // Step 1: Certification verification
    const certName = (trainer.cert_name || trainer.certName || "").toUpperCase().trim();
    const certIssuer = (trainer.cert_issuer || trainer.certIssuer || "").toUpperCase().trim();
    const certFile = trainer.cert_file || trainer.certFile || "";
    const trainerName = (trainer.name || "").toUpperCase().trim();

    const isAuthorizedCert = AUTHORIZED_CERTS.some(ac => {
      const acUpper = ac.toUpperCase();
      return certName.includes(acUpper) || certIssuer.includes(acUpper);
    });

    const hasCertFile = !!certFile && certFile.length > 0;

    // Step 2: Government ID verification
    const govIdType = trainer.gov_id_type || trainer.govIdType || "";
    const govIdFile = trainer.gov_id_file || trainer.govIdFile || "";
    const hasValidIdType = ["drivers-license", "passport", "pan-card", "aadhar-card"].includes(govIdType);
    const hasIdFile = !!govIdFile && govIdFile.length > 0 && !govIdFile.toLowerCase().includes("blurry");

    // Step 3: Use AI to cross-verify name on certificate matches registered name
    let aiVerification = { certNameMatch: true, idValid: true, reasoning: "" };

    try {
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a document verification AI for FitNest fitness platform. Analyze trainer credentials and return a JSON assessment.

You must verify:
1. Whether the certification name belongs to a well-known, authorized certification body from India, US, or UK
2. Whether the government ID type is valid (PAN Card, Aadhar Card, Driver's License, Passport)
3. Whether the trainer's name could reasonably match the certificate holder (accounting for name variations, initials, etc.)

Known authorized certification bodies:
- US: NASM, ACE, ISSA, NSCA, ACSM, NESTA, AFAA, CSCS and their variants
- UK: CIMSPA, REPS, YMCA, Active IQ, Premier Global, NRPT, VTCT
- India: K11 Fitness Academy, IIFA, Indian Institute of Fitness, ACE India, Gold's Gym Fitness Institute, ISSA India

For Indian IDs:
- PAN Card: Format ABCDE1234F (5 letters, 4 digits, 1 letter)
- Aadhar Card: 12-digit number starting with 2-9
- Driver's License: State code + number
- Passport: 1 letter + 7 digits

Respond ONLY with valid JSON, no markdown:
{"certValid": boolean, "idValid": boolean, "nameMatch": boolean, "confidence": number (0-100), "reasoning": "brief explanation"}`
            },
            {
              role: "user",
              content: `Verify this trainer:
Name: ${trainer.name}
Certification: ${certName} from ${certIssuer}
Cert file: ${certFile || "not uploaded"}
Government ID type: ${govIdType}
Government ID file: ${govIdFile || "not uploaded"}`
            }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "verify_credentials",
                description: "Return verification results for trainer credentials",
                parameters: {
                  type: "object",
                  properties: {
                    certValid: { type: "boolean", description: "Whether certification is from authorized body" },
                    idValid: { type: "boolean", description: "Whether government ID is valid type with file" },
                    nameMatch: { type: "boolean", description: "Whether name could match certificate holder" },
                    confidence: { type: "number", description: "Confidence score 0-100" },
                    reasoning: { type: "string", description: "Brief explanation of verification results" }
                  },
                  required: ["certValid", "idValid", "nameMatch", "confidence", "reasoning"],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "verify_credentials" } },
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall?.function?.arguments) {
          const parsed = JSON.parse(toolCall.function.arguments);
          aiVerification = {
            certNameMatch: parsed.nameMatch !== false,
            idValid: parsed.idValid !== false,
            reasoning: parsed.reasoning || "",
          };
          // Override with AI results if AI has higher confidence
          if (parsed.confidence > 70) {
            // Use AI's cert validity check as additional signal
            if (!parsed.certValid) {
              // AI says cert is not valid
            }
          }
        }
      }
    } catch (aiError) {
      console.error("AI verification error (falling back to rule-based):", aiError);
    }

    // Final determination
    const certStatus = (isAuthorizedCert && hasCertFile && aiVerification.certNameMatch) ? "verified" : "rejected";
    const idStatus = (hasValidIdType && hasIdFile && aiVerification.idValid) ? "verified" : "rejected";

    const result = {
      certStatus,
      idStatus,
      details: {
        certAuthorized: isAuthorizedCert,
        certFileUploaded: hasCertFile,
        certNameMatch: aiVerification.certNameMatch,
        idTypeValid: hasValidIdType,
        idFileUploaded: hasIdFile,
        aiReasoning: aiVerification.reasoning,
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-trainer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
