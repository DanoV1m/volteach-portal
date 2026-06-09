import { CourseEnrichment, TopicKnowledge } from '../types';

export const courseEnrichment: Record<string, CourseEnrichment> = {
  'חשבון אינפיניטסימלי 1': {
    description: 'קורס יסוד במתמטיקה — מכסה גבולות, רציפות, נגזרות ואינטגרלים. הבסיס לכל הנדסה מודרנית.',
    syllabus: ['גבולות ורציפות', 'נגזרות — כלל השרשרת, כלל המנה', 'אינטגרל מסוים ולא מסוים', 'שיטות אינטגרציה (חלקים, הצבה)', 'שיטות חישוב שטח ונפח', 'טור מקלורן ותיאור פולינומי'],
    youtube: [
      { title: 'Calculus 1 Full Course — Professor Leonard', channel: 'Professor Leonard', url: 'https://www.youtube.com/playlist?list=PLF797E961509B4EB5', emoji: '🎓' },
      { title: 'חשבון דיפרנציאלי — MIT 18.01', channel: 'MIT OpenCourseWare', url: 'https://www.youtube.com/playlist?list=PL590CCC2BC5AF3BC1', emoji: '🏛️' },
      { title: 'Essence of Calculus — 3Blue1Brown', channel: '3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr', emoji: '🌀' }
    ],
    links: [
      { icon: '📖', title: "Paul's Online Math Notes", desc: 'הסברים + תרגילים חינמיים', url: 'https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx' },
      { icon: '🧮', title: 'Khan Academy — Calculus', desc: 'סרטונים + תרגול אינטראקטיבי', url: 'https://www.khanacademy.org/math/calculus-1' },
      { icon: '📊', title: 'Wolfram Alpha', desc: 'מחשבון אינטגרלים ונגזרות', url: 'https://www.wolframalpha.com' }
    ]
  },
  'פיזיקה 1 — מכניקה': {
    description: 'מכניקה קלאסית — חוקי ניוטון, קינמטיקה, דינמיקה, עבודה ואנרגיה. הבסיס הפיזיקלי לכל מהנדס.',
    syllabus: ['קינמטיקה — תנועה קווית וסיבובית', 'חוקי ניוטון', 'חיכוך ותנועה מעגלית', 'עבודה, אנרגיה ותנע', 'שימור אנרגיה ותנע', 'גלים מכניים ותהודה'],
    youtube: [
      { title: 'Physics 1 Full Course — Michel van Biezen', channel: 'Michel van Biezen', url: 'https://www.youtube.com/c/MichelvanBiezen', emoji: '🔬' },
      { title: '8.01 Classical Mechanics — MIT', channel: 'MIT OpenCourseWare', url: 'https://www.youtube.com/playlist?list=PLyQSN7X0ro203puVhQsmCj9qhlFQ-As8e', emoji: '🏛️' },
      { title: 'AP Physics 1 — Khan Academy', channel: 'Khan Academy', url: 'https://www.khanacademy.org/science/physics', emoji: '📚' }
    ],
    links: [
      { icon: '🌐', title: 'HyperPhysics', desc: 'מפות מושגים פיזיקליות', url: 'http://hyperphysics.phy-astr.gsu.edu/' },
      { icon: '🎮', title: 'PhET Simulations', desc: 'סימולציות פיזיקה אינטראקטיביות', url: 'https://phet.colorado.edu/' },
      { icon: '📘', title: 'OpenStax University Physics', desc: 'ספר לימוד חינמי', url: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction' }
    ]
  },
  'אלגברה לינארית': {
    description: 'אלגברה לינארית — מטריצות, מרחבי וקטורים, ערכים עצמיים וטרנספורמציות לינאריות. כלי יסוד לדיגיטל עיבוד אותות, בקרה ולמידת מכונה.',
    syllabus: ['מערכות משוואות ואלימינציית גאוס', 'מטריצות ופעולות עליהן', 'דטרמיננטה ותכונות', 'מרחבי וקטורים ובסיסים', 'ערכים עצמיים ווקטורים עצמיים', 'דיאגונליזציה ופירוק SVD'],
    youtube: [
      { title: 'Essence of Linear Algebra — 3Blue1Brown', channel: '3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', emoji: '🌀' },
      { title: 'Linear Algebra Full Course — Gilbert Strang MIT', channel: 'MIT OpenCourseWare', url: 'https://www.youtube.com/playlist?list=PL49CF3715CB9EF31D', emoji: '🏛️' },
      { title: 'Linear Algebra — Khan Academy', channel: 'Khan Academy', url: 'https://www.khanacademy.org/math/linear-algebra', emoji: '📚' }
    ],
    links: [
      { icon: '📖', title: 'Interactive Linear Algebra', desc: 'ספר לימוד ויזואלי חינמי', url: 'https://textbooks.math.gatech.edu/ila/' },
      { icon: '🧮', title: 'Matrix Calculator', desc: 'מחשבון מטריצות מקוון', url: 'https://matrix.reshish.com/' },
      { icon: '📊', title: 'MIT 18.06 Gilbert Strang', desc: 'הקורס המפורסם ביותר', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' }
    ]
  }
};

export const topicKnowledge: Record<string, TopicKnowledge> = {
  "חשיבה הנדסית": {
    course: "מיומנויות וחשיבה הנדסית",
    explain: "הנושא חשיבה הנדסית מתוך הקורס מיומנויות וחשיבה הנדסית מהווה אבן יסוד אקדמית בתכנית הלימודים. נלמדים בו עקרונות תיאורטיים מעמיקים המאפשרים ניתוח מערכות מורכבות, בדגש על פיתוח חשיבה הנדסית ואנליטית. השיטות הנלמדות מאפשרות לפתור בעיות מעשיות בתעשייה, תוך הישענות על כלים מתמטיים חזקים.",
    formula: "\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_{S} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}",
    example: "**שאלה אקדמית לדוגמה:** נתח את הבעיה עבור המקרה של מערכת יציבה בהקשר של חשיבה הנדסית.\n\n**פתרון מפורט:**\nתחילה נגדיר את תנאי השפה של הבעיה. לאחר מכן נפעיל את האופרטור המתאים:\n$ f(t) = \\int_{-\\infty}^{\\infty} F(\\omega) e^{j\\omega t} d\\omega $\nבביצוע אינטגרציה בחלקים נקבל את התוצאה הסופית, המעידה על יציבות המערכת.",
    quizQuestion: "בהינתן המערכת המתוארת בדוגמה, מה תהיה התגובה בתדר אפס עבור חשיבה הנדסית?",
    quizAnswer: "תגובת ה-DC תהיה קבועה ויציבה בהתאם לתנאי ההתחלה של המערכת ולפי משפט הערך הסופי."
  },
  "גבולות ורציפות": {
    course: "חדו'א 1",
    explain: "הגדרת גבול לפי קושי (אפסילון-דלתא) והגדרת רציפות של פונקציה. חקר נקודות אי-רציפות מסוג ראשון, שני וסליקה.",
    formula: "\\lim_{x \\to x_0} f(x) = L \\iff \\forall \\varepsilon > 0 \\ \\exists \\delta > 0 : 0 < |x - x_0| < \delta \\implies |f(x) - L| < \\varepsilon",
    example: "**שאלה אקדמית לדוגמה:** הוכח בעזרת הגדרת הגבול כי:\n$\\lim_{x \\to 3} (2x + 1) = 7$\n\n**פתרון מפורט:**\nיהי $\\varepsilon > 0$. נחפש $\\delta > 0$ כך שמתקיים:\n$0 < |x - 3| < \\delta \\implies |(2x+1) - 7| < \\varepsilon$\nנפשט את הביטוי הימני:\n$|2x - 6| < \\varepsilon \\iff 2|x - 3| < \\varepsilon \\iff |x - 3| < \\frac{\\varepsilon}{2}$\nלכן נבחר $\\delta = \\frac{\\varepsilon}{2}$ וההוכחה מושלמת.",
    quizQuestion: "מהי הגדרת הרציפות של פונקציה $f(x)$ בנקודה $x_0$?",
    quizAnswer: "הפונקציה מוגדרת בנקודה, הגבול שלה בנקודה קיים, ושניהם שווים זה לזה."
  },
  "נגזרות וכלל השרשרת": {
    course: "חדו'א 1",
    explain: "שימושי נגזרת, כללי גזירה בסיסיים וכלל השרשרת לגזירת פונקציות מורכבות.",
    formula: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
    example: "**שאלה אקדמית לדוגמה:** גזור את הפונקציה $y = \\sin(x^2)$ בהתאם לכלל השרשרת.\n\n**פתרון מפורט:**\nנגדיר $u = x^2$ ו-$y = \\sin(u)$.\nהנגזרות הן:\n$\\frac{du}{dx} = 2x$\n$\\frac{dy}{du} = \\cos(u)$\nבהצבה בכלל השרשרת נקבל:\n$\\frac{dy}{dx} = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)$",
    quizQuestion: "מהי הנגזרת של $f(x) = e^{3x}$?",
    quizAnswer: "3e^{3x}"
  },
  "אינטגרלים": {
    course: "חדו'א 1",
    explain: "משפט היסוד של החשבון הדיפרנציאלי והאינטגרלי ושיטות אינטגרציה בסיסיות (הצבה והכללה).",
    formula: "\\int_{a}^{b} f(x) dx = F(b) - F(a)",
    example: "**שאלה אקדמית לדוגמה:** חשב את האינטגרל $\\int_{0}^{2} 3x^2 dx$.\n\n**פתרון מפורט:**\nהפונקציה הקדומה של $3x^2$ היא $F(x) = x^3$.\nנפעיל את משפט היסוד:\n$\\int_{0}^{2} 3x^2 dx = F(2) - F(0) = 2^3 - 0^3 = 8$",
    quizQuestion: "מהו האינטגרל הלא-מסוים $\\int e^{x} dx$?",
    quizAnswer: "e^x + C"
  },
  "מערכות משוואות ומרחבים וקטוריים": {
    course: "אלגברה ליניארית",
    explain: "פתרון מערכות משוואות לינאריות, מרחבים וקטוריים, תתי-מרחבים, פריסה (Span) ותלות לינארית.",
    formula: "A\\mathbf{x} = \\mathbf{b}",
    example: "**שאלה אקדמית לדוגמה:** קבע האם הווקטורים $(1,2)$ ו-$(2,4)$ תלויים לינארית.\n\n**פתרון מפורט:**\nנבדוק האם קיימים מקדמים לא אפסיים $c_1, c_2$ כך ששילובם הלינארי מאפס את הקבוצה:\n$c_1(1,2) + c_2(2,4) = (0,0)$\nניתן לראות שדי לבחור $c_1 = -2$ ו-$c_2 = 1$ כדי לקבל את השוויון, לכן הווקטורים תלויים לינארית.",
    quizQuestion: "האם הקבוצה Empty פריסה תמיד תת-מרחב לינארי?",
    quizAnswer: "כן"
  }
};
