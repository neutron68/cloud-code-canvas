import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const JUDGE0_API_KEY = Deno.env.get("JUDGE0_API_KEY");
  if (!JUDGE0_API_KEY) {
    return new Response(
      JSON.stringify({ error: "JUDGE0_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { source_code, language_id, stdin } = await req.json();

    if (!source_code || !language_id) {
      return new Response(
        JSON.stringify({ error: "source_code and language_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create submission
    const createRes = await fetch(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,status,time,memory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code,
          language_id,
          stdin: stdin || "",
        }),
      }
    );

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Judge0 API error [${createRes.status}]: ${errText}`);
    }

    const result = await createRes.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error executing code:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
