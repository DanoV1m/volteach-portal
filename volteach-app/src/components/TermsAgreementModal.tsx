import React, { useState } from 'react';
import { ShieldAlert, Check, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsAgreementModalProps {
  onAccept: () => Promise<void>;
  onDecline: () => void;
}

export function TermsAgreementModal({ onAccept, onDecline }: TermsAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-800 shrink-0 direction-rtl text-right">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">תנאי שימוש — נדרש אישור לכניסה לפורטל</h2>
            <p className="text-xs text-slate-400 mt-0.5">אנא קרא/י את התנאים ואשר/י את הסכמתך כדי להמשיך</p>
          </div>
        </div>

        {/* Scrollable ToS content */}
        <div className="p-6 overflow-y-auto direction-rtl text-right text-sm text-slate-300 space-y-4 custom-scrollbar">
          <p className="font-bold text-rose-400 mb-2">שימו לב: השימוש באתר מהווה הסכמה מלאה לתנאים הבאים. מטרתנו היא לעזור לסטודנטים נטו, ולכן אנו מגנים על עצמנו משפטית כדי שנוכל להמשיך להפעיל את הפלטפורמה.</p>

          <h3 className="text-white font-bold text-md mt-4">1. מטרת האתר ופטור מאחריות</h3>
          <p>אתר VOLTEACH הוקם כיוזמה התנדבותית ובמטרה חינוכית בלבד, כדי לעזור ולסייע לסטודנטים במהלך לימודיהם הקשים. מפעיל האתר מספק את הפלטפורמה "כמות שהיא" (AS-IS) ואינו נושא באחריות כלשהי לנזק, ישיר או עקיף, ציון נמוך, או עוגמת נפש שייגרמו כתוצאה מהסתמכות על התוכן באתר, שגיאות בנוסחאות או חומרים חסרים.</p>

          <h3 className="text-white font-bold text-md mt-4">2. תוכן גולשים, זכויות יוצרים ונוהל הסרה (DMCA Safe Harbor)</h3>
          <p>הפלטפורמה מאפשרת לסטודנטים לשתף "משאבי קהילה". <strong>מפעיל האתר משמש כספק שירות טכני בלבד ואינו נושא באחריות משפטית כלשהי לתוכן המועלה על ידי המשתמשים. האחריות הבלעדית על התוכן חלה על המשתמש שהעלה אותו.</strong></p>
          <p>חל איסור מוחלט על המשתמשים להעלות לאתר חומרים המוגנים בזכויות יוצרים של גורמי צד-שלישי ללא אישור מפורש מבעל הזכויות. אנו פועלים לפי נוהל "הודעה והסרה" (Notice and Takedown).</p>

          <h3 className="text-white font-bold text-md mt-4">3. טוהר המידות והגינות אקדמית</h3>
          <p>האתר נועד לשמש ככלי עזר ללמידה בלבד. חל איסור לעשות שימוש בחומרים באתר לשם ביצוע עבירות משמעת, העתקות במבחנים, או כל פעולה הנוגדת את תקנון ההגינות האקדמית של מוסד הלימודים שאליו אתה משתייך.</p>

          <h3 className="text-white font-bold text-md mt-4">4. פרטיות ואבטחת מידע</h3>
          <p>בעת ההרשמה אנו אוספים את כתובת הדוא"ל שלך ומזהה משתמש אנונימי לצורך תפעול השירות בלבד. המידע מאוחסן בשרתי Google Firebase תחת תקני הצפנה מחמירים. <strong>אנו לעולם לא נמכור, נשכיר, או נעביר את המידע האישי שלך לצדדים שלישיים.</strong></p>

          <h3 className="text-white font-bold text-md mt-4">5. שינוי תנאים וזמינות השירות</h3>
          <p>מפעיל האתר שומר לעצמו את הזכות המלאה לשנות את תנאי השימוש, להשעות את פעילות האתר, לחסום משתמשים המפירים כללים אלו או למחוק תכנים בכל עת, לפי שיקול דעתו הבלעדי וללא כל הודעה מוקדמת.</p>

          <p className="text-slate-500 text-xs mt-6 border-t border-slate-800 pt-4">VOLTEACH © {new Date().getFullYear()} — כל הזכויות שמורות. שימוש באתר מהווה הסכמה לתנאים לעיל.</p>
        </div>

        {/* Footer — checkbox + buttons */}
        <div className="p-5 border-t border-slate-800 space-y-3 shrink-0">
          <div
            onClick={() => setAgreed(a => !a)}
            className="flex items-start gap-3 cursor-pointer group direction-rtl text-right"
          >
            <div
              className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                agreed
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'bg-slate-900 border-slate-600 group-hover:border-slate-400'
              }`}
            >
              {agreed && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm text-slate-300 leading-relaxed select-none">
              קראתי את תנאי השימוש ואני מסכים/ה לכל הסעיפים המפורטים לעיל
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleAccept}
              disabled={!agreed || loading}
              className={`flex-1 rounded-xl py-3 text-sm font-black text-white transition-all flex items-center justify-center gap-2 ${
                agreed && !loading
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>אישור וכניסה לפורטל</span>
                </>
              )}
            </button>
            <button
              onClick={onDecline}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              title="לא מסכים — יציאה מהמערכת"
            >
              <LogOut className="h-4 w-4" />
              <span>יציאה</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
