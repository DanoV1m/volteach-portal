import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Award, Clock, HelpCircle, Loader2 } from 'lucide-react';
import { CourseEnrichment, Institution, TopicKnowledge } from '../types';
import { courseEnrichment, topicKnowledge } from '../data/enrichment';
import { PhysicsSimulation } from './PhysicsSimulation';

// Shared backend caller for all Gemini API calls
const queryBackend = async (promptMsg: string): Promise<string> => {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: promptMsg }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.text;
};

// ==========================================
// 1. CONTACT MODAL
// ==========================================
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionsList: Institution[];
  initialInstKey?: string | null;
}

export function ContactModal({ isOpen, onClose, institutionsList, initialInstKey }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [inst, setInst] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialInstKey) setInst(initialInstKey);
  }, [initialInstKey, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !type || !msg) {
      alert('אנא מלא את כל השדות הדרושים.');
      return;
    }
    const mailSubject = `[VOLTEACH] ${type} — ${name}`;
    const mailBody = `שם: ${name}\nאימייל: ${email}\nסוג פנייה: ${type}\nמוסד: ${inst || 'לא רלוונטי'}\n\n${msg}`;
    window.open(`mailto:volteach.contact@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`, '_blank');
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setName('');
    setEmail('');
    setType('');
    setMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 text-right shadow-2xl">
        <button onClick={handleClose} className="absolute left-4 top-4 rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
          <X className="h-4.5 w-4.5" />
        </button>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>✉️</span> צור קשר
              </h3>
              <p className="text-xs text-slate-400 mt-1">מצאת טעות בסילבוס? בעיה בדרייב? נשמח לשמוע ממך!</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">שם מלא *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="ישראל ישראלי" className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">אימייל *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="israel@gmail.com" className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">סוג פנייה *</label>
              <select required value={type} onChange={e => setType(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none">
                <option value="">בחר...</option>
                <option value="Syllabus Error">⚠️ טעות בסילבוס או בנוסחאות</option>
                <option value="Missing Material">📂 חומרי לימוד חסרים</option>
                <option value="Drive Issue">📁 שגיאת גישה בגוגל דרייב</option>
                <option value="Feature Request">💡 הצעת ייעול ותוכונות חדשות</option>
                <option value="General">💬 הערה כללית</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">מוסד לימוד רלוונטי (אופציונלי)</label>
              <select value={inst} onChange={e => setInst(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none">
                <option value="">לא רלוונטי</option>
                {institutionsList.map(i => <option key={i.key} value={i.key}>{i.emoji} {i.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">תוכן הפנייה *</label>
              <textarea required value={msg} onChange={e => setMsg(e.target.value)} placeholder="כתוב את הודעתך כאן בפירוט..." className="w-full h-24 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none" />
            </div>

            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/10 hover:opacity-95">
              שלח פנייה
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <span className="text-5xl">✅</span>
            <h3 className="text-xl font-bold text-white">הפנייה מוכנה לשליחה!</h3>
            <p className="text-sm text-slate-400">פתחנו עבורך הודעה ישירה אל תיבת הדואר שלנו.<br />מנציגי VOLTEACH יחזרו אליך בהקדם.</p>
            <button onClick={handleClose} className="w-full rounded-2xl bg-slate-850 p-3 text-xs font-bold text-white border border-slate-850 hover:border-slate-700">
              סגור חלון
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. ENRICHMENT MODAL
// ==========================================
interface EnrichmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
}

export function EnrichmentModal({ isOpen, onClose, courseTitle }: EnrichmentModalProps) {
  if (!isOpen) return null;
  const data = courseEnrichment[courseTitle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-right">
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute left-4 top-4 z-10 rounded-xl border border-slate-700/50 bg-black/40 p-2 text-white hover:bg-black/60">
          <X className="h-4.5 w-4.5" />
        </button>

        {/* TOP HERO */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 pt-10">
          <span className="text-5xl">📚</span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-3">{courseTitle}</h3>
          <p className="text-xs sm:text-sm text-white/80 mt-1">תוכן לימודי מקצועי, נושאים וסרטוני העשרה לתרגול ופתרון</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {!data ? (
            <div className="text-center py-12 text-slate-400">
              <span className="text-4xl text-slate-500 block mb-3">🔜</span>
              <p className="text-sm font-semibold text-white">תוכן העשרה לקורס זה נמצא בשלבי הכנה.</p>
              <p className="text-xs text-slate-500 mt-1">מערכי השיעור, YouTube וספרי הלימוד החינמיים יעודכנו בקרוב.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Descriptions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1">📝 תיאור הקורס</h4>
                <p className="text-sm text-slate-350 bg-slate-950/40 p-4 rounded-2xl border border-slate-850 leading-relaxed">{data.description}</p>
              </div>

              {/* Topics */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-1">📋 נושאי הליבה בסילבוס הארצי</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.syllabus.map(t => (
                    <span key={t} className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/15 transition-all text-xs font-semibold text-indigo-300 p-2.5 px-4">
                      📌 {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* YouTube Lists */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 border-b border-slate-800 pb-1">▶️ פלייליסטים מומלצים ב-YouTube</h4>
                <div className="grid gap-3">
                  {data.youtube.map(yt => (
                    <a key={yt.url} href={yt.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 p-3 px-4 transition-all">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-xl font-bold text-white shadow-md">
                        {yt.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{yt.title}</div>
                        <div className="text-xs text-slate-500">ערוץ לימוד: {yt.channel}</div>
                      </div>
                      <span className="text-red-400 font-mono text-xs">פלייליסט ↗</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Resources Web links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">🔗 ספרי לימוד ומחשבונים חיצוניים</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.links.map(lnk => (
                    <a key={lnk.url} href={lnk.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:bg-slate-950 hover:border-slate-700 transition-all">
                      <div className="text-2xl">{lnk.icon}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{lnk.title}</div>
                        <div className="text-xs text-slate-500 truncate">{lnk.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. EXAM TIMER & SIMULATOR MODAL
// ==========================================
interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
}

export function ExamModal({ isOpen, onClose, courseTitle }: ExamModalProps) {
  const [questions, setQuestions] = useState<{ topic: string; q: string; a: string }[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAiMode, setIsAiMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState<string | null>(null);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadLocalQuestions = () => {
    setSubmitted(false);
    setAnswers({});
    setGrading(null);
    setIsAiMode(false);
    
    // Find relevant topics in static base
    const topicsWithQuizzes = Object.keys(topicKnowledge).filter(
      t => topicKnowledge[t] && topicKnowledge[t].quizQuestion
    );

    // Select random questions
    const selected: { topic: string; q: string; a: string }[] = [];
    const pool = [...topicsWithQuizzes];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const rand = Math.floor(Math.random() * pool.length);
      const t = pool[rand];
      if (t === undefined) continue;
      selected.push({
        topic: t,
        q: topicKnowledge[t]?.quizQuestion ?? '',
        a: topicKnowledge[t]?.quizAnswer ?? ''
      });
      pool.splice(rand, 1);
    }
    setQuestions(selected);
  };

  const handleGenerateAiExam = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setGrading(null);
    try {
      const prompt = `אתה מרצה מומחה להנדסת חשמל ואלקטרוניקה בטכניון. עליך ליצור שאלון סימולציה מקיף, מאתגר ומקצועי המכיל בדיוק 3 שאלות חישוביות ותיאורטיות עבור הקורס "${courseTitle}".
      השאלות צריכות להיות ברמה של בחינת גמר אקדמית. השתמש בביטויי LaTeX עשירים לצורך סימונים, מעגלים או נוסחאות (עטוף כל ביטוי מתמטי קצר ב-$ וביטויים ארוכים ב-$$). אל תשתמש במונחים לא תקניים או תיאורים מיותרים.
      החזר אך ורק ביטוי JSON תקין, שלם ומדויק ללא עיטופים חיצוניים (ללא \`\`\`json או תגיות פוסט, פשוט מערך JSON חוקי המכיל בדיוק 3 אובייקטים):
      [
        {
          "topic": "שם הנושא המתאים",
          "q": "תוכן שאלה מפורטת, מאתגרת ומבוססת נתונים חישובים",
          "a": "הסבר מהלך הפתרון המלא, שלב אחר שלב כולל נוסחאות והתשובה הסופית"
        },
        {
          "topic": "שם הנושא השני",
          "q": "תוכן שאלה מפורטת",
          "a": "מהלך פתרון שלב אחר שלב"
        },
        {
          "topic": "שם הנושא השלישי",
          "q": "תוכן שאלת תפעול / מהלך בקרה / אוגר",
          "a": "מהלך פתרון והסבר"
        }
      ]`;

      const responseText = await queryBackend(prompt);
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
        setIsAiMode(true);
        showToast("מבחן סימולציה חדש נוצר במיוחד עבורך באמצעות Gemini!", "success");
      }
    } catch (e: any) {
      console.error(e);
      showToast("שגיאה ביצירת מבחן דינמי, נטען שאלות רגילות מהמאגר.", "error");
      loadLocalQuestions();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('focus-mode-active');
      setTimeRemaining(45 * 60);
      loadLocalQuestions();

      // Start Countdown
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      document.body.classList.remove('focus-mode-active');
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, courseTitle]);

  // Render Math in ExamModal
  useEffect(() => {
    setTimeout(() => {
      const container = document.getElementById('examModalBody');
      const win = window as any;
      if (container && win.renderMathInElement) {
        try {
          win.renderMathInElement(container, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {
          console.error(e);
        }
      }
    }, 150);
  }, [questions, submitted, isOpen, loading, grading]);

  if (!isOpen) return null;

  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    showToast('בחינת הסימולציה הוגשה בהצלחה! השווה את תשובותיך או שלח להערכת AI.', 'success');
  };

  const handleGradeWithAi = async () => {
    setCheckingAnswer(true);
    setGrading(null);
    try {
      const answersContent = questions.map((q, idx) => `
      שאלה ${idx + 1} (${q.topic}):
      תוכן השאלה: ${q.q}
      תשובת הסטודנט: ${answers[idx] || "לא הוקלדה תשובה"}
      הפתרון האנליטי: ${q.a}
      `).join('\n\n');

      const prompt = `אתה פרופסור בכיר להנדסת חשמל, המשמש כמעריך בחינות אקדמיות.
      הנה פתרונות שהגיש הסטודנט עבור סימולציית המבחן בקורס "${courseTitle}":
      
      ${answersContent}
      
      אנא נתח את הפתרונות של הסטודנט לעומק. החזר משוב מקצועי הבנוי מעולה בעברית ומכיל:
      - ציון משוער סופי מתוך 100 על סמך רמת הדיוק ודרך הפתרון שכתב.
      - התייחסות לכל שאלה בנפרד (דיוק החישובים, זיהוי שגיאות נפוצות, הבנה פיזיקלית).
      - רשימה של טיפים ונוסחאות מומלצות ב-LaTeX עשיר לשיפור מהיר לפערים שנחשפו.
      החזר בפורמט טקסט קריא ומסודר. אל תשתמש בסימני כוכביות כפולים בתוך ה-LaTeX.`;

      const response = await queryBackend(prompt);
      setGrading(response);
      showToast("ניתוח הביצועים והערכת הבחינה מול Gemini הושלמה!", "success");
    } catch (e: any) {
      console.error(e);
      showToast("שגיאה בניתוח המבחן עם סוכן ה-AI.", "error");
    } finally {
      setCheckingAnswer(false);
    }
  };

  const handleClose = () => {
    document.body.classList.remove('focus-mode-active');
    onClose();
  };

  const formatTime = () => {
    const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const s = (timeRemaining % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-right">
        {/* CLOSE CONTROL */}
        <button onClick={handleClose} className="absolute left-4 top-4 z-10 rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-650 p-8 pt-10 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-red-200">
              {isAiMode ? "🤖 שאלות ג'ונרטו ב-Vibe של Gemini" : "📚 שאלות מאגר קלאסיות"}
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1.5">סימולציית בחינה אקדמית</h3>
            <p className="text-xs sm:text-sm text-white/80 mt-1">{courseTitle} - פתור ללא סרגל כלים, מדמה תנאי אולפן בבחינה</p>
          </div>
          <div className="flex items-center gap-3 self-center rounded-2xl bg-black/20 p-4 px-6 text-center shadow-inner font-mono text-xl font-bold tracking-wider text-rose-200">
            <Clock className="h-5 w-5 text-rose-300" />
            <span>{formatTime()}</span>
          </div>
        </div>

        <div id="examModalBody" className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-950/60 p-4 rounded-2xl border border-slate-850 gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold block">סגנון מבחן נוכחי:</span>
              <span className="text-xs text-white font-bold">{isAiMode ? "🌟 מבחן מבוסס AI דינמי ומותאם" : "📚 מבחן קטלוג סילבוס קבוע"}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadLocalQuestions}
                disabled={loading}
                className="rounded-xl border border-slate-800 bg-slate-905 p-2 px-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 transition"
              >
                חזור למאגר הקלאסי 📂
              </button>
              <button
                onClick={handleGenerateAiExam}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 p-2 px-4.5 text-xs font-bold text-white shadow-md transition flex items-center gap-1"
              >
                {loading ? "מייצר..." : "ג'נרט מבחן AI חדש ✨"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-300">פרופסור ג'ימיני מחשב ומג'נרט סימולציית מבחן חדשה עבורך...</p>
              <p className="text-xs text-slate-500">זה עשוי לקחת מספר שניות, אנו בונים שאלות קשות ברמה אקדמית גבוהה.</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <span className="text-4xl block mb-2">🚧</span>
              <p className="text-sm font-semibold text-white">סימולציית המבחן עבור קורס זה תעודכן בקרוב.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-indigo-400">שאלה {idx + 1}: בהקשר של "{item.topic}"</h4>
                    <span className="text-[10px] text-slate-500 font-bold">ניקוד: {Math.round(100 / questions.length)}%</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed font-semibold">{item.q}</p>

                  <textarea
                    disabled={submitted}
                    value={answers[idx] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="הקלד כאן את דרך הפתרון, משוואות ושלבים לפתרון..."
                    className="w-full h-24 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-white placeholder-slate-650 focus:border-red-500 focus:outline-none"
                  />

                  {submitted && !grading && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs leading-relaxed text-emerald-350 animation-fadeIn">
                      <div className="font-extrabold text-emerald-400 mb-1 flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>מהלך פתרון בית ספר / מודל רשמי:</span>
                      </div>
                      <p className="font-mono text-xs whitespace-pre-line">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}

              {!submitted ? (
                <button
                  onClick={handleSubmitExam}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-650 to-pink-600 py-4 text-sm font-black text-white hover:opacity-95"
                >
                  הגש סימולציית מבחן 🏁
                </button>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-550/10 text-right space-y-2">
                    <p className="text-xs text-slate-350">
                      הגשת את הבחינה בהצלחה! כעת תוכל להשוות את הפתרון שלך עם הפתרונות של המאגר או לקבל משוב חי, מדויק ואישי מבוסס בינה מלאכותית על הצעדים שלך.
                    </p>
                    <button
                      onClick={handleGradeWithAi}
                      disabled={checkingAnswer}
                      className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white flex items-center justify-center gap-2"
                    >
                      {checkingAnswer ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          <span>Gemini סוקר ומעריך את שלבי הפתרון שלך...</span>
                        </>
                      ) : (
                        <span>נתח וקבל ציון לפתרון שלך ממרצה ה-AI 🎓 (מומלץ!)</span>
                      )}
                    </button>
                  </div>

                  {grading && (
                    <div className="rounded-3xl border border-indigo-550/30 bg-slate-950 p-6 space-y-4 animation-fadeIn text-right">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Award className="h-6 w-6 text-indigo-400" />
                        <h4 className="text-md font-bold text-indigo-400">ניתוח ביצועים וציון מוערך מִ-Gemini</h4>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {grading}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleClose}
                    className="w-full rounded-2xl bg-slate-800 py-3.5 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    סיים ובצע תיקון עצמי 🚪
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. AI TOPIC LEARNING + QUIZ MODAL
// ==========================================
interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  topicName: string;
}

export function AiModal({ isOpen, onClose, courseTitle, topicName }: AiModalProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'examples' | 'quiz' | 'simulation'>('explain');
  const [loading, setLoading] = useState(false);
  const [customKnowledge, setCustomKnowledge] = useState<TopicKnowledge | null>(null);

  // Quiz states
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [grading, setGrading] = useState<any>(null);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<'exam' | 'theory' | 'numerical' | 'conceptual'>('exam');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('explain');
      setCustomKnowledge(null);
      setQuizQuestion('');
      setQuizAnswer('');
      setUserSolution('');
      setGrading(null);
    }
  }, [isOpen, topicName]);

  const activeKnowledge = customKnowledge || topicKnowledge[topicName];

  const handleGenerateLive = async () => {
    setLoading(true);
    try {
      const prompt = `אתה מרצה בכיר להנדסת חשמל באוניברסיטה מובילה. צור הסבר מקיף, אקדמי ומבוסס נוסחאות עבור הנושא "${topicName}" מתוך הקורס המרכזי "${courseTitle}".
      החזר אך ורק אובייקט JSON תקני, שלם וחוקי עם 5 המפתחות המוגדרים למטה בלבד (ללא תגים מקדימים \`\`\`json או תגיות פוסט, פשוט אובייקט חוקי):
      {
        "course": "${courseTitle}",
        "explain": "הסבר תיאורטי מעמיק בעברית עם ביטויי עימות מתמטיים",
        "formula": "נוסחת מופת מפורטת ב-LaTeX עשיר ללא סוגרים או תגי $ סביב הנוסחה. אל תשתמש בזהויות csc או sec.",
        "example": "דוגמה פתורה לחלוטין ברמת קושי של מבחן אמיתי. כל משוואה וקוד נוסחאות בגוף הטקסט עטוף בקפידה ב-$, ולביטויי תצוגה מורחבים ב-$$",
        "quizQuestion": "שאלה קצרה ובוחנת ברמת יישום הנדסי",
        "quizAnswer": "תשובה קצרה ומדוייקת שימושית"
      }`;

      const resText = await queryBackend(prompt);
      const cleanJson = resText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      setCustomKnowledge(parsed);
      showToast("חומר הלימוד סונכרן וג'ונרט ברגע זה על ידי ה-AI!", "success");
    } catch (e: any) {
      console.error(e);
      showToast(`שגיאה בגישה ל-Gemini: ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAiQuiz = async (selectedDifficulty?: 'exam' | 'theory' | 'numerical' | 'conceptual') => {
    const diff = selectedDifficulty || quizDifficulty;
    setLoading(true);
    setGrading(null);
    setUserSolution('');

    let styleDescription = "מאתגרת ברמת בחינה סופית הכוללת שקלול וקונפיגורציה של מספר פרמטרים";
    if (diff === 'theory') {
      styleDescription = "הבנת מושגים ותיאוריה אקדמית (שאלת עקרונות פעולה או היסקים בלי צורך במחשבון)";
    } else if (diff === 'numerical') {
      styleDescription = "חישובית מבוססת מספרים מלאה ופתירה הדורשת שימוש בנוסחאות וחישוב נומרי מדויק";
    } else if (diff === 'conceptual') {
      styleDescription = "שאלת 'מה קורה אם' קונספטואלית הבוחנת שינוי פרמטרים במעגל או במערכת ואת השפעתו";
    }

    try {
      const prompt = `צור שאלת תרגול אחת בלבד בעלת אופי פדגוגי של ${styleDescription} בנושא "${topicName}" מתוך הקורס "${courseTitle}".
      השאלה צריכה לבחון רמה אקדמית גבוהה. השתמש ב-LaTeX עשיר (עטוף ב-$ או $$) לצורך סימונים מתמטיים.
      החזר את התשובה שלך אך ורק בתבנית הבאה בעברית (ללא תגים מקדימים וללא כוכביות בתוך ה-LaTeX):
      שאלה: [כאן רשום את השאלה]
      תשובה_נכונה: [כאן רשום את התשובה הסופית המצופה]`;

      const responseText = await queryBackend(prompt);
      const lines = responseText.split('\n').filter((l: string) => l.trim());
      const qLine = lines.find((l: string) => l.startsWith('שאלה:'));
      const aLine = lines.find((l: string) => l.startsWith('תשובה_נכונה:'));

      const quizQ = qLine ? qLine.replace('שאלה:', '').trim() : responseText;
      const quizA = aLine ? aLine.replace('תשובה_נכונה:', '').trim() : '';

      setQuizQuestion(quizQ);
      setQuizAnswer(quizA);
    } catch (e: any) {
      console.error(e);
      showToast(`שגיאה בהבאת שאלה מהסוכן: ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckQuizAnswer = async () => {
    if (!userSolution.trim()) {
      showToast('אנא הקלד את הפתרון שלך לפני הבדיקה', 'error');
      return;
    }

    setCheckingAnswer(true);
    setGrading(null);

    const qText = quizQuestion || activeKnowledge?.quizQuestion;

    const gradingPrompt = `אתה מרצה בוועדת הקבלה האקדמית. הנה שאלת מבחן שעליה ענה הסטודנט:
    
    השאלה: ${qText}
    הנושא: ${topicName} | הקורס: ${courseTitle}
    תשובת הסטודנט: ${userSolution}
    
    החזר אך ורק ביטוי JSON תקין (ללא עטיפות \`\`\`json) במבנה הבא:
    {
      "status": "correct" | "partial" | "incorrect",
      "feedback": "משוב מפורט ומכיל ביטויים ב-LaTex, המציין מה הסטודנט עשה נכון ואיפה טעה",
      "hint": "אם הסטודנט טעה, תן רמז פדגוגי ברור אך מנווט בדרכים מתקנות בלי לגלות ישירות את התוצאה הסופית."
    }`;

    try {
      const responseText = await queryBackend(gradingPrompt);
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const resultObj = JSON.parse(cleanJson);
      setGrading(resultObj);
    } catch (e: any) {
      console.error(e);
      showToast('שגיאה בבדיקת הפתרון.', 'error');
    } finally {
      setCheckingAnswer(false);
    }
  };

  // Render Math whenever component state adjustments occur
  useEffect(() => {
    setTimeout(() => {
      const container = document.getElementById('aiModalBody');
      const win = window as any;
      if (container && win.renderMathInElement) {
        try {
          win.renderMathInElement(container, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {
          console.error(e);
        }
      }
    }, 150);
  }, [activeTab, activeKnowledge, quizQuestion, grading, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-indigo-500/20 bg-slate-900 shadow-2xl shadow-indigo-500/5 text-right">
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute left-4 top-4 z-10 rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
          <X className="h-4.5 w-4.5" />
        </button>

        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-850 p-6 md:p-8 border-b border-indigo-500/20">
          <div className="inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-bold text-indigo-300">
            📚 {courseTitle}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">{topicName}</h3>
          <p className="text-xs text-indigo-300/80 mt-1">עוזר למידה ותירגול הנדסי מותאם AI בזמן אמת</p>
        </div>

        {/* TABS HEADER BAR */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4">
          <button
            onClick={() => setActiveTab('explain')}
            className={`px-5 py-4 text-xs font-bold transition-all border-b-2 ${activeTab === 'explain' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            📝 תיאוריה והסבר
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-5 py-4 text-xs font-bold transition-all border-b-2 ${activeTab === 'examples' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            💡 דוגמאות פתורות
          </button>
          <button
            onClick={() => {
              setActiveTab('quiz');
              if (!quizQuestion && !activeKnowledge?.quizQuestion) {
                // If static quiz available, initialize with it
                if (activeKnowledge?.quizQuestion) {
                  setQuizQuestion(activeKnowledge.quizQuestion);
                } else {
                  handleFetchAiQuiz();
                }
              }
            }}
            className={`px-5 py-4 text-xs font-bold transition-all border-b-2 ${activeTab === 'quiz' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            🧠 תרגול AI
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-5 py-4 text-xs font-bold transition-all border-b-2 ${activeTab === 'simulation' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            🧪 מעבדה דיגיטלית
          </button>
        </div>

        {/* BODY PANEL */}
        <div id="aiModalBody" className="p-6 md:p-8 space-y-6">
          {activeTab === 'simulation' ? (
             <PhysicsSimulation courseTitle={courseTitle} topicName={topicName} />
          ) : loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-350">מעבד תכנים מנווטים מול Gemini...</p>
            </div>
          ) : !activeKnowledge ? (
            <div className="text-center py-12 space-y-4">
              <HelpCircle className="h-12 w-12 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">נושא לימוד בהכנה</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                הנושא "<strong>{topicName}</strong>" טרם גומל אופליין. תרצה לג׳נרט לו חומר מפורט הכולל הסבר תיאורטי מושלם ודוגמאות אינטגרליות מבוססות AI כרגע?
              </p>
              <button
                onClick={handleGenerateLive}
                className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 p-3.5 px-6 text-xs font-bold text-white shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>✨</span>
                <span>ג׳נרט חומר ב-Live באמצעות AI</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* TAB 1: THEORY */}
              {activeTab === 'explain' && (
                <div className="space-y-6">
                  <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-2">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest leading-none">🧠 תיאוריה אקדמית</h4>
                    <p className="text-sm text-slate-300 leading-relaxed pt-1">{activeKnowledge.explain}</p>
                  </div>

                  {activeKnowledge.formula && (
                    <div className="bg-slate-950/40 border border-indigo-500/10 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none">📐 נוסחת הדגל של הנושא</h4>
                      <div className="rounded-xl bg-slate-950 p-4 text-center text-md font-mono text-indigo-200 overflow-x-auto direction-ltr max-w-full">
                        {`$$${activeKnowledge.formula}$$`}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const msg = prompt('תאר את הטעות או הנוסחה השגויה שמצאת:');
                      if (msg) {
                        const subject = encodeURIComponent(`[VOLTEACH] דיווח שגיאה — ${topicName} (${courseTitle})`);
                        const body = encodeURIComponent(`נושא: ${topicName}\nקורס: ${courseTitle}\n\nפרטי השגיאה:\n${msg}`);
                        window.open(`mailto:volteach.contact@gmail.com?subject=${subject}&body=${body}`, '_blank');
                        showToast('תודה! פתחנו עבורך חלון שליחת מייל לצוות VOLTEACH.', 'success');
                      }
                    }}
                    className="w-full rounded-2xl bg-slate-950/40 hover:bg-slate-950 border border-red-500/25 p-3 text-center text-xs font-bold text-red-400 hover:border-red-500 transition-colors"
                  >
                    מצאת טעות בהסבר או בנוסחה? לחץ כאן לדיווח מהיר לסוכן
                  </button>
                </div>
              )}

              {/* TAB 2: EXAMPLES */}
              {activeTab === 'examples' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest leading-none">💡 דוגמה פתורה לחלוטין</h4>
                    <div className="text-sm text-slate-300 leading-relaxed font-medium pt-1 whitespace-pre-line" style={{ direction: 'rtl' }}>
                      {activeKnowledge.example}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZ */}
              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none">✏️ שאלת תרגול אינטראקטיבית</h4>
                      <div className="flex gap-2 self-start sm:self-center">
                        <select
                          value={quizDifficulty}
                          onChange={(e) => {
                            const newDiff = e.target.value as any;
                            setQuizDifficulty(newDiff);
                            handleFetchAiQuiz(newDiff);
                          }}
                          className="bg-slate-900 text-[10px] text-indigo-300 font-bold border border-slate-850 rounded-xl p-1.5 focus:outline-none"
                        >
                          <option value="exam">🔥 רמת מבחן סופי</option>
                          <option value="theory">📚 הבנה מושגית תיאורטית</option>
                          <option value="numerical">🧮 תרגול חישובי מספרי</option>
                          <option value="conceptual">🧪 שאלת "מה קורה אם"</option>
                        </select>
                        <button
                          onClick={() => handleFetchAiQuiz(quizDifficulty)}
                          className="text-[10px] text-indigo-300 font-bold hover:text-white hover:underline transition-all bg-slate-900 border border-slate-850 rounded-xl p-1.5 px-3.5"
                        >
                          🔄 החלף שאלה
                        </button>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-white leading-relaxed font-bold pt-1">
                      {quizQuestion || activeKnowledge.quizQuestion}
                    </p>

                    <textarea
                      value={userSolution}
                      onChange={e => setUserSolution(e.target.value)}
                      placeholder="הקלד את דרך הפתרון והסבר קצר, ואז לחץ על בדוק פתרון..."
                      className="w-full h-24 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-white placeholder-slate-650 focus:border-indigo-500 focus:outline-none"
                    />

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={handleCheckQuizAnswer}
                        disabled={checkingAnswer}
                        className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 hover:opacity-95 flex items-center justify-center gap-1.5"
                      >
                        {checkingAnswer ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>בודק את הפתרון...</span>
                          </>
                        ) : (
                          <span>בדוק פתרון עם עוזר ההוראה 🔍</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SMART GRADING FEEDBACK */}
                  {grading && (
                    <div className={`rounded-3xl border p-5 space-y-3 animation-fadeIn ${
                      grading.status === 'correct'
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : grading.status === 'partial'
                        ? 'border-amber-500/30 bg-amber-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span className="text-xl">
                          {grading.status === 'correct' ? '✅' : grading.status === 'partial' ? '⚠️' : '❌'}
                        </span>
                        <h4 className={
                          grading.status === 'correct' ? 'text-emerald-400' : grading.status === 'partial' ? 'text-amber-400' : 'text-red-400'
                        }>
                          {grading.status === 'correct' ? 'תשובה מדוייקת ונכונה!' : grading.status === 'partial' ? 'תשובה חלקית זקוקה לדיוק' : 'הפתרון אינו תואם'}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                        {grading.feedback}
                      </p>

                      {grading.hint && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                          <strong>💡 רמז ללמידה בדרך נכונה:</strong> {grading.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Global Notification helper locally
const showToast = (msg: string, type: 'info' | 'error' | 'success') => {
  const customEvent = new CustomEvent('show-toast', { detail: { msg, type } });
  window.dispatchEvent(customEvent);
};

// ==========================================
// 5. UPLOAD RESOURCE MODAL
// ==========================================
interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  courseTitle: string;
  user: any;
  onSuccess: (msg: string) => void;
}

export function UploadResourceModal({ isOpen, onClose, institution, courseTitle, user, onSuccess }: UploadResourceModalProps) {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('exercise');
  const [link, setLink] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !link) {
      alert('אנא מלא את כל השדות');
      return;
    }
    
    if (!user) {
      alert('עליך להיות מחובר כדי לשתף חומרים');
      return;
    }

    setLoading(true);
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      
      await addDoc(collection(db, 'community_resources'), {
        title,
        category,
        webViewLink: link,
        institutionKey: institution.key,
        courseTitle,
        contributorName: user.displayName || 'סטודנט',
        contributorId: user.uid,
        upvotes: 0,
        upvotedBy: [],
        createdAt: serverTimestamp()
      });
      
      onSuccess('החומר שותף בהצלחה!');
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('שגיאה בהעלאת החומר: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 text-right shadow-2xl">
        <button onClick={onClose} className="absolute left-4 top-4 rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:bg-slate-900 hover:text-white">
          <X className="h-4.5 w-4.5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📤</span> שיתוף חומר לימוד
            </h3>
            <p className="text-xs text-slate-400 mt-1">שתף סיכומים, תרגילים ומבחנים עם חבריך לקורס {courseTitle}.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">כותרת החומר *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="לדוגמה: סיכום הרצאה 4 - מגברי שרת" className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">סוג החומר *</label>
            <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="exercise">✏️ תרגיל / מטלה</option>
              <option value="exam">📝 מבחן עבר</option>
              <option value="book">📘 סיכום / ספר</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">קישור לקובץ (Google Drive) *</label>
            <input type="url" required value={link} onChange={e => setLink(e.target.value)} placeholder="https://drive.google.com/..." className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none text-left" dir="ltr" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>שתף חומר</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
