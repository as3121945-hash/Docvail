const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

exports.analyzeSymptoms = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Please provide some text to analyze' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ msg: 'AI Service configuration missing. Please add GEMINI_API_KEY to .env' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `You are a medical symptom analyzer for Docvail.
Analyze the following user's input (which may be in English, Hindi, or Hinglish) and extract the intended medical specialty and city.
Return ONLY a valid JSON object with keys "specialty" and "city".
If a specialty cannot be clearly identified, default to 'General Physician'.
If a city cannot be identified, return an empty string for city.

Input: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean markdown formatting if Gemini adds it
    responseText = responseText.replace(/```json|```/gi, '').trim();
    
    const responseData = JSON.parse(responseText);

    res.json(responseData);
  } catch (err) {
    console.error('Gemini AI Analysis Error:', err);
    
    // Provide more specific error feedback
    let errorMsg = 'Failed to analyze symptoms';
    if (err.message.includes('API key')) errorMsg = 'Invalid Gemini API Key on server';
    if (err.message.includes('safety')) errorMsg = 'AI blocked this query for safety reasons';
    
    res.status(500).json({ msg: errorMsg, details: err.message });
  }
};
