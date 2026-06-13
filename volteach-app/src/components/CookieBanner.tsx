import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('vt_cookie_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vt_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 bg-indigo-950/95 border-t border-indigo-900 shadow-[0_-10px_40px_-10px_rgba(79,70,229,0.3)] backdrop-blur-md"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 direction-rtl text-right">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-sm">שימוש בעוגיות (Cookies) והסכמה לתקנון</h4>
                <p className="text-xs text-slate-400 mt-1">
                  אנחנו משתמשים באחסון מקומי ובעוגיות טכניות בלבד כדי לשפר את חווית הלימודים שלך. המשך הגלישה באתר מהווה הסכמה ל<span className="text-indigo-400">תנאי השימוש ומדיניות הפרטיות</span> שלנו.
                </p>
              </div>
            </div>
            
            <div className="flex shrink-0">
              <button 
                onClick={handleAccept}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl transition-transform active:scale-95 shadow-lg shadow-indigo-600/20 text-sm whitespace-nowrap"
              >
                הבנתי, תודה!
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
