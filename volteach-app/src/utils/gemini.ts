import { queryBackend } from './aiClient';

export async function explainFormula(name: string, eq: string): Promise<string> {

  const prompt = `אתה מורה להנדסת חשמל. הסבר את הנוסחה הבאה בעברית בצורה קצרה וברורה לסטודנט.

שם הנוסחה: ${name}
משוואה: ${eq}

פרמט את התשובה כך — בדיוק בפורמט הזה:
💡 אינטואיציה: [משפט קצר מה המשוואה מייצגת]
📐 משתנים: [הסבר קצר של הסמלים]
🔧 שימוש: [מתי ואיך משתמשים בה]
🔢 דוגמה: [מספרים קונקרטיים קצרים]

היה תמציתי — 4 שורות קצרות בסך הכל.`;

  return queryBackend(prompt);
}
