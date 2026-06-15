const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

let _runtimeKey: string | null = null;

export function setGeminiKey(key: string) {
  _runtimeKey = key;
}

export async function explainFormula(name: string, eq: string): Promise<string> {
  if (!_runtimeKey) throw new Error('NO_KEY');

  const prompt = `אתה מורה להנדסת חשמל. הסבר את הנוסחה הבאה בעברית בצורה קצרה וברורה לסטודנט.

שם הנוסחה: ${name}
משוואה: ${eq}

פרמט את התשובה כך — בדיוק בפורמט הזה:
💡 אינטואיציה: [משפט קצר מה המשוואה מייצגת]
📐 משתנים: [הסבר קצר של הסמלים]
🔧 שימוש: [מתי ואיך משתמשים בה]
🔢 דוגמה: [מספרים קונקרטיים קצרים]

היה תמציתי — 4 שורות קצרות בסך הכל.`;

  const res = await fetch(`${ENDPOINT}?key=${_runtimeKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'לא ניתן היה לקבל הסבר.';
}
