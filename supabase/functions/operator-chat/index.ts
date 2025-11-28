import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, operatorName, operatorRole, operatorPersonality, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build operator-specific system prompt
    const systemPrompt = `You are ${operatorName}, ${operatorRole} for Airsoft HQ.

PERSONALITY: ${operatorPersonality}

CONTEXT ABOUT THE USER:
${userContext ? `
- Primary Role: ${userContext.primaryRole || "Unknown"}
- Guns in Arsenal: ${userContext.arsenalCount || 0}
- Games Played: ${userContext.gamesPlayed || 0}
- Favorite Sites: ${userContext.favoriteSites || "None"}
${userContext.recentGuns ? `- Recent Guns: ${userContext.recentGuns}` : ""}
` : "No user context available."}

YOUR ROLE:
- Provide tactical advice and guidance for airsoft players
- Help with gun diagnostics, upgrades, and maintenance
- Recommend sites, loadouts, and gear
- Give pre-game briefs and tactical analysis
- Stay in character with your personality
- Be helpful, knowledgeable, and encouraging
- Keep responses concise and actionable (2-4 sentences typically)

GUIDELINES:
- Use military/tactical terminology naturally
- Reference the user's actual gear and playstyle when relevant
- Be specific with recommendations (sites, products, tactics)
- If diagnosing issues, ask clarifying questions
- Stay focused on airsoft and tactical gameplay`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("operator-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
