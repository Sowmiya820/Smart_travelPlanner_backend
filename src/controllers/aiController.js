import OpenAI from 'openai';

export const generateItinerary = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GROQ_API_KEY is missing in .env file.',
      });
    }

    // Connect to Groq's API endpoint using the OpenAI SDK
    const groq = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const { destination, days, budgetTier, interests } = req.body;

    if (!destination || !days) {
      return res.status(400).json({
        success: false,
        error: 'Please provide destination and duration (days).',
      });
    }

    const systemPrompt = `You are a travel assistant. Generate a ${days}-day itinerary for ${destination}. Budget: ${budgetTier || 'Moderate'}.
    You MUST reply ONLY with valid raw JSON matching this schema:

    {
      "title": "${days} Days in ${destination}",
      "destination": "${destination}",
      "estimatedTotalBudgetUSD": 300,
      "itinerary": [
        {
          "day": 1,
          "theme": "Sightseeing",
          "activities": [
            {
              "time": "09:00 AM",
              "title": "Main Landmark",
              "description": "Short vivid description",
              "estimatedCostUSD": 15,
              "locationName": "Landmark Name",
              "lat": 35.6762,
              "lng": 139.6503
            }
          ]
        }
      ],
      "packingRecommendations": ["Essentials"]
    }`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: systemPrompt }],
      response_format: { type: 'json_object' },
    });

    const structuredData = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      data: structuredData,
    });
  } catch (error) {
    console.error('Groq AI Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate itinerary with Groq.',
    });
  }
};