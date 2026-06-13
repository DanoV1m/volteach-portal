import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | null;
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && type && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[85vh]"
          >
            
            {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            {type === 'terms' ? <ShieldAlert className="h-5 w-5 text-indigo-400" /> : <FileText className="h-5 w-5 text-emerald-400" />}
            <h2 className="text-lg font-bold text-white direction-rtl">
              {type === 'terms' ? 'תקנון ותנאי שימוש' : 'מדיניות פרטיות'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="סגור חלון"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto direction-rtl text-right text-sm text-slate-300 space-y-4 custom-scrollbar">
          {type === 'terms' && (
            <>
              <p className="font-bold text-rose-400 mb-2">שימו לב: השימוש באתר מהווה הסכמה מלאה לתנאים הבאים. מטרתנו היא לעזור לסטודנטים נטו, ולכן אנו מגנים על עצמנו משפטית כדי שנוכל להמשיך להפעיל את הפלטפורמה.</p>
              
              <h3 className="text-white font-bold text-md mt-4">1. מטרת האתר ופטור מאחריות</h3>
              <p>אתר VOLTEACH הוקם כיוזמה התנדבותית ובמטרה חינוכית בלבד, כדי לעזור ולסייע לסטודנטים במהלך לימודיהם הקשים. מפעיל האתר מספק את הפלטפורמה "כמות שהיא" (AS-IS) ואינו נושא באחריות כלשהי לנזק, ישיר או עקיף, ציון נמוך, או עוגמת נפש שייגרמו כתוצאה מהסתמכות על התוכן באתר, שגיאות בנוסחאות או חומרים חסרים.</p>
              
              <h3 className="text-white font-bold text-md mt-4">2. תוכן גולשים, זכויות יוצרים ונוהל הסרה (DMCA Safe Harbor)</h3>
              <p>הפלטפורמה מאפשרת לסטודנטים לשתף "משאבי קהילה". <strong>מפעיל האתר משמש כספק שירות טכני בלבד. מפעיל האתר אינו בודק, אינו מאשר מראש, ואינו נושא באחריות משפטית כלשהי לתוכן המועלה על ידי המשתמשים. האחריות הבלעדית על התוכן חלה על המשתמש שהעלה אותו.</strong></p>
              <p>חל איסור מוחלט על המשתמשים להעלות לאתר חומרים המוגנים בזכויות יוצרים של גורמי צד-שלישי (כגון מבחנים פנימיים, ספרי לימוד סרוקים, סיכומים רשמיים של מוסדות לימוד או מרצים) ללא אישור מפורש מבעל הזכויות.</p>
              <p>אנו פועלים לפי נוהל "הודעה והסרה" (Notice and Takedown). אם אתה סבור כי תוכן כלשהו באתר מפר את זכויות היוצרים שלך או של המוסד שלך, אנא פנה אלינו מיד דרך כפתור "צור קשר" (המעטפה) עם פרטי ההפרה, והתוכן יוסר מהשרתים שלנו לאלתר וללא דיחוי.</p>

              <h3 className="text-white font-bold text-md mt-4">3. טוהר המידות והגינות אקדמית</h3>
              <p>האתר נועד לשמש ככלי עזר ללמידה בלבד. חל איסור לעשות שימוש בחומרים באתר לשם ביצוע עבירות משמעת, העתקות במבחנים, או כל פעולה הנוגדת את תקנון ההגינות האקדמית של מוסד הלימודים שאליו אתה משתייך.</p>

              <h3 className="text-white font-bold text-md mt-4">4. שינוי תנאים וזמינות השירות</h3>
              <p>מפעיל האתר שומר לעצמו את הזכות המלאה לשנות את תנאי השימוש, להשעות את פעילות האתר, לחסום משתמשים המפירים כללים אלו או למחוק תכנים בכל עת, לפי שיקול דעתו הבלעדי וללא כל הודעה מוקדמת או חובת פיצוי.</p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>אנו ב-VOLTEACH מכבדים את פרטיותך ומתחייבים להגן עליה. מדיניות זו מסבירה איזה מידע נאסף וכיצד נעשה בו שימוש בשקיפות מלאה.</p>

              <h3 className="text-white font-bold text-md mt-4">1. איסוף מידע</h3>
              <p>בעת ההרשמה לאתר (אשר נועדה רק כדי לשמור עבורך נתונים), אנו אוספים את כתובת הדוא"ל שלך ומזהה משתמש אנונימי (UID). אם תבחר להעלות נוסחאות, לשמור מועדפים או להוסיף חומרים לקהילה, הם יישמרו במסד הנתונים שלנו ויקושרו לחשבונך.</p>

              <h3 className="text-white font-bold text-md mt-4">2. שימוש במידע - שקיפות מלאה</h3>
              <p>המידע נאסף אך ורק לצורך תפעול תקין של האתר (מתן אפשרות להתחבר למערכת ממכשירים שונים ולשמור את סביבת העבודה שלך). <strong>אנו לעולם לא נמכור, נשכיר, או נעביר את המידע האישי או כתובת המייל שלך לצדדים שלישיים למטרות שיווק, פרסום או ספאם.</strong></p>

              <h3 className="text-white font-bold text-md mt-4">3. אבטחת מידע</h3>
              <p>המידע מאוחסן באופן מאובטח בשרתי חברת Google (תשתית Firebase) תחת תקני האבטחה וההצפנה המחמירים ביותר בתעשייה (GDPR Compliance). גישה לנתונים הפרטיים שלך (כגון הנוסחאות האישיות ששמרת במחברת שלך) חסומה לחלוטין ברמת השרת (Security Rules) למשתמשים אחרים.</p>

              <h3 className="text-white font-bold text-md mt-4">4. עוגיות (Cookies) ואחסון מקומי</h3>
              <p>האתר משתמש באחסון מקומי (Local Storage) ובעוגיות (Cookies) פנימיות טכניות בלבד. העוגיות משמשות רק כדי לזכור שאתה מחובר למערכת וכדי לאפשר חווית שימוש מהירה (כמו שמירת המוסד האחרון שבחרת). איננו משתמשים בעוגיות מעקב צד-שלישי מסוג פיקסלים שיווקיים.</p>

              <h3 className="text-white font-bold text-md mt-4">5. זכותך למחיקת מידע וחשבון ("הזכות להישכח")</h3>
              <p>בכל עת, עומדת לך הזכות המלאה לבקש את מחיקת חשבונך וכל המידע המקושר אליו ממסדי הנתונים שלנו. ניתן לעשות זאת בקלות על ידי פנייה דרך כפתור יצירת הקשר באתר, והמידע שלך ימחק לצמיתות וללא עיכובים.</p>
            </>
          )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
