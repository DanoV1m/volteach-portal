import React, { useState } from 'react';
import { ShieldAlert, Check, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TermsAgreementModalProps {
  onAccept: () => Promise<void>;
  onDecline: () => void;
}

const TERMS = [
  {
    title: 'שימוש חינוכי בלבד',
    body: 'VOLTEACH היא פלטפורמה התנדבותית לסיוע בלימודים. התוכן מסופק AS-IS ללא אחריות לדיוק הנוסחאות. חל איסור להשתמש בחומרים לצורך הגשות, העתקות, או עבירות משמעת אקדמית.',
  },
  {
    title: 'זכויות יוצרים (DMCA)',
    body: 'חל איסור להעלות חומרים המוגנים בזכויות יוצרים ללא אישור. המפעיל אינו אחראי לתוכן שמועלה על ידי משתמשים. בקשות הסרה יטופלו מיידית דרך כפתור "צור קשר".',
  },
  {
    title: 'פרטיות',
    body: 'אנו שומרים כתובת דוא"ל ומזהה משתמש בלבד, לצורך תפעול השירות. המידע מוצפן בשרתי Google Firebase ולעולם לא יימכר לצדדים שלישיים.',
  },
];

export function TermsAgreementModal({ onAccept, onDecline }: TermsAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-right">
            <h2 className="text-sm font-black text-white">תנאי שימוש — VOLTEACH</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">נדרש אישור חד-פעמי לכניסה לפורטל</p>
          </div>
        </div>

        {/* Accordion ToS */}
        <div className="px-4 py-3 space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
          {TERMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-right text-xs font-bold text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                <span>{item.title}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform shrink-0 ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-3.5 pb-3 text-[11px] text-slate-400 leading-relaxed text-right border-t border-slate-800 pt-2">
                      {item.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-3 border-t border-slate-800 space-y-3">
          <div
            onClick={() => setAgreed(a => !a)}
            className="flex items-center gap-2.5 cursor-pointer group direction-rtl"
          >
            <div className={`h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 rounded border-2 flex items-center justify-center transition-all ${
              agreed ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900 border-slate-600 group-hover:border-slate-400'
            }`}>
              {agreed && <Check className="h-2.5 w-2.5 text-white" />}
            </div>
            <span className="text-[11px] text-slate-300 select-none">
              קראתי ומסכים/ה לתנאי השימוש
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={!agreed || loading}
              className={`flex-1 rounded-xl py-2.5 text-xs font-black text-white transition-all flex items-center justify-center gap-1.5 ${
                agreed && !loading
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading
                ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                : <><Check className="h-3.5 w-3.5" /><span>כניסה לפורטל</span></>
              }
            </button>
            <button
              onClick={onDecline}
              disabled={loading}
              className="flex items-center gap-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
