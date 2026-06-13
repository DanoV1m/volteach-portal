const { GoogleGenAI } = require('@google/genai');
async function run() {
  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
  const response = await ai.models.list();
  for (const m of response.models) {
    console.log(m.name);
  }
}
run().catch(console.error);
