import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, platform, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a viral short-form content strategist. Your job is to generate highly engaging, scroll-stopping content optimized for maximum reach and engagement.`;

    const userPrompt = `Generate content for:
Platform: ${platform}
Topic: ${topic}
Tone: ${tone}

Output in this exact JSON format:
{
  "hooks": ["hook1", "hook2", ...],
  "captions": ["caption1", "caption2", ...],
  "hashtags": ["#hashtag1", "#hashtag2", ...],
  "ctas": ["cta1", "cta2", ...],
  "postingPlan": [
    {"day": "Day 1", "idea": "content idea"},
    ...
  ]
}

Requirements:
1. Generate exactly 30 scroll-stopping hooks (max 12 words each, no emojis, must create curiosity or strong emotion)
2. Generate exactly 5 high-converting captions (optimized for the platform's algorithm)
3. Generate exactly 15 relevant trending hashtags (include mix of popular and niche tags)
4. Generate exactly 3 strong CTA lines that drive engagement
5. Generate a 7-day posting plan with unique content ideas for each day

Rules:
- Hooks must create curiosity, shock, or emotional response
- All content must be optimized for short-form video growth
- Use simple, creator-friendly language
- Make content feel authentic, not salesy
- Match the selected tone throughout

Return ONLY the JSON object, no other text.`;

    console.log('Generating content for:', { topic, platform, tone });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    console.log('Raw AI response:', content);

    // Parse the JSON response
    let parsed;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      parsed = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    console.log('Successfully generated content');

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
