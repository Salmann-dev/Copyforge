// Vercel Serverless Function
// Calls the Google Gemini API server-side so your API key is never exposed to visitors.
// Docs: https://ai.google.dev/gemini-api/docs

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { brandVoice, contentType, productInfo, platform } = req.body || {};

  if (!brandVoice || !contentType || !productInfo) {
    return res.status(400).json({
      error: 'Missing required fields: brandVoice, contentType, and productInfo are all required.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Set it in your Vercel project environment variables.'
    });
  }

  const contentTypeLabel = contentType === 'social_post' ? 'social media post' : 'product description';
  const platformLine = contentType === 'social_post' && platform
    ? `Platform: ${platform} (match the typical length and tone conventions of this platform).`
    : '';

  const systemPrompt = `You are a professional copywriter who writes tightly on-brand marketing copy for small businesses. You strictly follow the brand voice guidance you are given and never break character or add meta-commentary. Output only the final copy, nothing else — no preamble, no explanation, no quotation marks around the result.`;

  const userPrompt = `Write a ${contentTypeLabel} using the following brand voice and product details.

Brand voice / tone guidelines:
${brandVoice}

Product or topic details:
${productInfo}
${platformLine}

Write only the final copy.`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { maxOutputTokens: 500 }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(502).json({ error: 'The AI provider returned an error. Please try again shortly.' });
    }

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!result) {
      return res.status(502).json({ error: 'No text was returned by the model. Please try again.' });
    }

    return res.status(200).json({ result });
  } catch (err) {
    console.error('Request failed:', err);
    return res.status(500).json({ error: 'Something went wrong generating your copy. Please try again.' });
  }
}
