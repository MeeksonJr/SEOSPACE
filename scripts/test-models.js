const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)/);
const apiKey = keyMatch ? keyMatch[1] : '';

const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey });

async function testModel(model) {
  const start = Date.now();
  try {
    const res = await ai.models.generateContent({
      model,
      contents: 'Respond with exactly: {"status":"operational"}',
      config: {
        responseMimeType: 'application/json'
      }
    });
    console.log(model, 'SUCCESS (' + (Date.now() - start) + 'ms):', res.text?.trim());
    return true;
  } catch (err) {
    console.log(model, 'FAILED (' + (Date.now() - start) + 'ms):', err.message);
    return false;
  }
}

async function run() {
  const models = [
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite'
  ];
  for (const m of models) {
    await testModel(m);
  }
}
run();
