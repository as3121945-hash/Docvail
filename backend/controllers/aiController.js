const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

exports.analyzeSymptoms = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Please provide some text to analyze' });
  }

  // Robust key detection
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GEMINI_API || process.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    console.error('CRITICAL: GEMINI_API_KEY is missing from environment variables!');
    return res.status(500).json({ 
      msg: 'AI Service configuration missing on server.',
      tip: 'Please check Render Dashboard -> Environment -> GEMINI_API_KEY'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Try flash-latest first as it is the most robust name for new keys
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      await model.generateContent("ping");
    } catch (e) {
      console.warn("Standard flash failed, trying pro...");
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

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

exports.checkStatus = async (req, res) => {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GEMINI_API || '').trim();
  
  const status = {
    envKeyDetected: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  };

  if (!apiKey) {
    return res.status(500).json({ 
      status: 'FAIL', 
      message: 'No API key detected in environment variables.',
      ...status 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the older gemini-pro for the health check as it is the most widely available
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    await model.generateContent("ping");
    
    res.json({ 
      status: 'OK', 
      message: 'AI Service is connected and responding.',
      ...status 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'API Key found but Google rejected the connection.',
      error: err.message,
      ...status 
    });
  }
};
