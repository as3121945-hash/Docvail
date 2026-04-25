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
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            specialty: { type: SchemaType.STRING, description: "Detected Specialty (e.g., Cardiologist, Gastroenterologist, Neurologist, etc.)" },
            city: { type: SchemaType.STRING, description: "Detected City" }
          },
          required: ["specialty", "city"]
        }
      }
    });

    const prompt = `You are a medical symptom analyzer for Docvail.
Analyze the following user's input (which may be in English, Hindi, or Hinglish) and extract the intended medical specialty and city.
If a specialty cannot be clearly identified, default to 'General Physician'.
If a city cannot be identified, return an empty string for city.

Input: "${text}"`;

    const result = await model.generateContent(prompt);
    const responseData = JSON.parse(result.response.text());

    res.json(responseData);
  } catch (err) {
    console.error('Gemini AI Analysis Error:', err);
    res.status(500).json({ msg: 'Failed to analyze symptoms' });
  }
};
