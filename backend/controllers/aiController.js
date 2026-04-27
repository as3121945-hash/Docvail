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
    // Using gemini-2.5-flash as it is confirmed available for this key
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a medical symptom analyzer for Docvail.
Analyze the following user's input (which may be in English, Hindi, or Hinglish) and extract the intended medical specialty and city.

CRITICAL RULES:
1. Return ONLY a valid JSON object with keys "specialty" and "city".
2. Use 'Specialist' names (e.g., Cardiologist, Dermatologist, Pediatrician, Gynecologist, Ophthalmologist) instead of fields (e.g., Cardiology, Dermatology).
3. If a specialty is unclear, use 'General Physician'.
4. If a city is not found, return "".

Examples: 
"sine m dard h" -> {"specialty": "Cardiologist", "city": ""}
"skin rash in Delhi" -> {"specialty": "Dermatologist", "city": "Delhi"}

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
    
    // 1. List available models
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const modelsData = await modelsResponse.json();
    const availableModels = modelsData.models ? modelsData.models.map(m => m.name.replace('models/', '')) : [];

    // 2. Perform a TEST analysis to see the output format
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const testPrompt = `You are a medical symptom analyzer. Return ONLY a JSON object with keys "specialty" and "city" for this input: "sine m dard ho rha h"`;
    const testResult = await model.generateContent(testPrompt);
    const testResponse = await testResult.response;
    const testOutput = testResponse.text().replace(/```json|```/gi, '').trim();

    res.json({ 
      status: 'DIAGNOSTIC', 
      message: 'Scanning system...',
      testAnalysis: {
        input: "sine m dard ho rha h",
        output: JSON.parse(testOutput)
      },
      availableModels,
      ...status 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Failed to scan models.',
      error: err.message,
      ...status 
    });
  }
};
