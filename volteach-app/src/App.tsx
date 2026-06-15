import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ChevronRight, ChevronLeft, Plus, Check, RefreshCw, Share2, Printer, Trash, X, Cloud, Cpu, Compass, Activity, Landmark, GraduationCap, BookOpen, Zap } from 'lucide-react';
import { institutions } from './data/institutions';
import { coursesData } from './data/courses';
import { FormulaBookmark } from './types';
import MainHeader from './components/MainHeader';
import { sanitizeFormulaInput } from './utils/security';
import MusicPlayer from './components/MusicPlayer';
import { handleSpotifyCallback } from './utils/spotify';
import { QuickFormulaInput } from './components/QuickFormulaInput';
import { LegalModal } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, query, onSnapshot, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { TermsAgreementModal } from './components/TermsAgreementModal';

import { CoursePageSkeleton, FormulasPageSkeleton } from './components/SkeletonUI';

// Lazily loaded views — each becomes its own chunk
const MainHome = lazy(() => import('./components/MainHome'));
const MainInstitutions = lazy(() => import('./components/MainInstitutions'));
const MainYears = lazy(() => import('./components/MainYears'));
const MainCourses = lazy(() => import('./components/MainCourses'));

// Lazily loaded sidebar — only rendered when sidebar is open
const Calculators = lazy(() => import('./components/Calculators'));

// Lazily loaded modals — named exports re-wrapped as default for React.lazy
const ContactModal = lazy(() =>
  import('./components/Modals').then(m => ({ default: m.ContactModal }))
);
const EnrichmentModal = lazy(() =>
  import('./components/Modals').then(m => ({ default: m.EnrichmentModal }))
);
const ExamModal = lazy(() =>
  import('./components/Modals').then(m => ({ default: m.ExamModal }))
);
const AiModal = lazy(() =>
  import('./components/Modals').then(m => ({ default: m.AiModal }))
);
const SignIn = lazy(() => import('./components/SignIn'));
const ProfileModal = lazy(() => import('./components/ProfileModal'));

const ViewFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
  </div>
);

interface ToastMessage {
  id: string;
  msg: string;
  type: 'info' | 'error' | 'success';
}

export default function App() {
  // Navigation State
  const [view, setView] = useState<'home' | 'institutions' | 'years' | 'courses' | 'my-formulas'>('home');
  const [selectedType, setSelectedType] = useState<'uni' | 'college' | null>(null);
  const [selectedInstitutionKey, setSelectedInstitutionKey] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'regular' | 'spread'>('regular');

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<FormulaBookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // Modals state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEnrichmentOpen, setIsEnrichmentOpen] = useState(false);
  const [enrichmentCourse, setEnrichmentCourse] = useState('');
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [examCourse, setExamCourse] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiCourse, setAiCourse] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [activeFormulaFolder, setActiveFormulaFolder] = useState<string | null>(null);

  // Legal State
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  // Daily Toast notifications list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Quick formulas state
  const [quickFormulas, setQuickFormulas] = useState<{ id: string; title: string; eq: string }[]>(() => {
    const defaultFormulas = [
      { id: "q1", title: "חוק אוהם", eq: "$$V=I \\cdot R$$" },
      { id: "q2", title: "הספק", eq: "$$P=V \\cdot I=I^2 R$$" },
      { id: "q3", title: "תדר תהודה", eq: "$$\\omega_0=\\frac{1}{\\sqrt{LC}}$$" },
      { id: "q4", title: "מתח תרמי", eq: "$$V_T \\approx 26\\text{mV}$$" }
    ];
    try {
      const saved = localStorage.getItem('vt_quick_formulas');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultFormulas;
  });

  const [isAddingQuick, setIsAddingQuick] = useState(false);

  const handleAddQuickFormula = (safeTitle: string, formattedEq: string) => {
    const newFormula = {
      id: `custom_q_${Date.now()}`,
      title: safeTitle,
      eq: formattedEq
    };
    const updated = [...quickFormulas, newFormula];
    setQuickFormulas(updated);
    try {
      localStorage.setItem('vt_quick_formulas', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setIsAddingQuick(false);
    addToast(`הנוסחה "${safeTitle}" נוספה לנוסחאות המהירות!`, "success");
  };

  const handleDeleteQuickFormula = (id: string, title: string) => {
    const updated = quickFormulas.filter(f => f.id !== id);
    setQuickFormulas(updated);
    try {
      localStorage.setItem('vt_quick_formulas', JSON.stringify(updated));
      addToast(`הנוסחה "${title}" הוסרה מהנוסחאות המהירות`, "info");
    } catch (err) {
      console.error(err);
    }
  };

  // Auth State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tosAccepted, setTosAccepted] = useState<boolean | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Monitor Auth Changes + ToS check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          setTosAccepted(snap.exists() && snap.data().tosAccepted === true);
        } catch {
          setTosAccepted(false);
        }
      } else {
        setTosAccepted(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync formulas from Firestore (if logged in) or LocalStorage (if guest)
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    if (user) {
      setBookmarksLoading(true);
      const path = `users/${user.uid}/formulas`;
      try {
        const q = query(collection(db, path));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const formulasList: FormulaBookmark[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            formulasList.push({
              id: data.id,
              title: data.title,
              latex: data.latex
            });
          });
          setBookmarks(formulasList);
          setBookmarksLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
          setBookmarksLoading(false);
        });
      } catch (err) {
        console.error(err);
        setBookmarksLoading(false);
      }
    } else {
      // Guest local storage fallback — synchronous, no loading state needed
      setBookmarksLoading(false);
      try {
        const saved = localStorage.getItem('vt_my_formulas');
        if (saved) setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Handle Spotify OAuth callback (?code=... in URL after redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    if (error) {
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    if (code) {
      window.history.replaceState({}, '', window.location.pathname);
      handleSpotifyCallback(code)
        .then(() => addToast('חוברת בהצלחה ל-Spotify! 🎵', 'success'))
        .catch(() => addToast('שגיאה בהתחברות ל-Spotify', 'error'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to the custom toast event from sub-components
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ msg: string; type: 'info' | 'error' | 'success' }>;
      if (customEvent.detail) {
        addToast(customEvent.detail.msg, customEvent.detail.type);
      }
    };
    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, []);

  // Sync KaTeX equations on view/tab changes
  useEffect(() => {
    setTimeout(() => {
      const win = window as any;
      if (win.renderMathInElement) {
        try {
          win.renderMathInElement(document.body, {
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
    }, 100);
  }, [view, openAccordion, bookmarks, isSidebarCollapsed, quickFormulas]);

  const addToast = (msg: string, type: 'info' | 'error' | 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const acceptTos = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        await setDoc(userRef, {
          ...snap.data(),
          tosAccepted: true,
          tosAcceptedAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          createdAt: serverTimestamp(),
          tosAccepted: true,
          tosAcceptedAt: serverTimestamp()
        });
      }
      setTosAccepted(true);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
      addToast('שגיאה בשמירת הסכמה לתנאי שימוש', 'error');
    }
  };

  const selectedInstitution = institutions.find(i => i.key === selectedInstitutionKey);

  // Toggle saving of formula bookmarks (supporting both local memory & persistent Firestore DB)
  const toggleBookmark = async (id: string, title: string, latex: string) => {
    const isBookmarked = bookmarks.some(b => b.id === id);

    if (user) {
      const path = `users/${user.uid}/formulas/${id}`;
      try {
        if (isBookmarked) {
          await deleteDoc(doc(db, 'users', user.uid, 'formulas', id));
          addToast(`הוסרה הנוסחה "${title}"`, "error");
        } else {
          await setDoc(doc(db, 'users', user.uid, 'formulas', id), {
            id,
            title,
            latex,
            userId: user.uid,
            createdAt: serverTimestamp()
          });
          addToast(`הנוסחה "${title}" נשמרה בענן ☁️`, "success");
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
        addToast("שגיאה בסנכרון לענן", "error");
      }
    } else {
      const exists = bookmarks.some(f => f.id === id);
      let updated: FormulaBookmark[];
      if (exists) {
        updated = bookmarks.filter(f => f.id !== id);
        addToast(`הוסרה הנוסחה "${title}"`, "error");
      } else {
        updated = [...bookmarks, { id, title, latex }];
        addToast(`הנוסחה "${title}" נשמרה במכשיר מקומית`, "success");
      }
      setBookmarks(updated);
      try {
        localStorage.setItem('vt_my_formulas', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Nav Breadcrumbs Generator
  const getBreadcrumbs = () => {
    const sn: Record<number, string> = { 1: "א'", 2: "ב'" };
    const yn: Record<number, string> = { 1: "א'", 2: "ב'", 3: "ג'", 4: "ד'", 5: "ה'" };

    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        {selectedType && (
          <>
            <button 
              onClick={() => {
                setSelectedInstitutionKey(null);
                setSelectedYear(null);
                setSelectedSemester(null);
                setView('institutions');
              }}
              className="hover:text-indigo-400 cursor-pointer transition-colors"
            >
              {selectedType === 'uni' ? 'אוניברסיטאות' : 'מכללות'}
            </button>
          </>
        )}
        {selectedInstitution && (
          <>
            <span className="text-slate-600">›</span>
            <button 
              onClick={() => {
                setSelectedYear(null);
                setSelectedSemester(null);
                setView('years');
              }}
              className="hover:text-indigo-400 cursor-pointer transition-colors font-semibold"
            >
              {selectedInstitution.name}
            </button>
          </>
        )}
        {selectedYear && (
          <>
            <span className="text-slate-600">›</span>
            <button 
              onClick={() => {
                setSelectedSemester(null);
                setView('courses');
              }}
              className="hover:text-indigo-400 cursor-pointer transition-colors"
            >
              שנה {yn[selectedYear]}
            </button>
          </>
        )}
        {selectedSemester && (
          <>
            <span className="text-slate-600">›</span>
            <span className="text-white font-bold">סמסטר {sn[selectedSemester]}</span>
          </>
        )}
      </div>
    );
  };

  const handleShareFormulas = () => {
    if (bookmarks.length === 0) {
      addToast("אין נוסחאות לשיתוף. דפדף ושמור נוסחאות תחילה!", "error");
      return;
    }
    try {
      const keys = bookmarks.map(f => f.id);
      const encoded = btoa(encodeURIComponent(JSON.stringify(keys)));
      const shareUrl = `${window.location.origin}${window.location.pathname}?sharedFormulas=${encoded}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        addToast("הקישור הועתק בהצלחה! שלח לחברי כיתתך.", "success");
      }).catch(() => {
        prompt("העתק את כתובת השיתוף הזו:", shareUrl);
      });
    } catch (e) {
      addToast("שגיאה ביצירת קישור השיתוף.", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Static Formula Sheets Lists
  const formulasSheets: Record<string, { category: string; list: { name: string; eq: string }[] }> = {
    circuits: {
      category: "🔌 מעגלים חשמליים",
      list: [
        { name: "תבנין", eq: "V_{th}=V_{oc}" },
        { name: "נורטון", eq: "I_N=I_{sc}" },
        { name: "אימפדנס קבל", eq: "Z_c=\\frac{1}{j\\omega C}" },
        { name: "אימפדנס סליל", eq: "Z_l=j\\omega L" },
        { name: "מחלק מתח", eq: "V_x=V\\frac{R_x}{\\sum R}" },
        { name: "הספק ריאקטיבי", eq: "Q=VI\\sin(\\phi)" },
        { name: "גורם הספק", eq: "PF=\\cos(\\phi)" }
      ]
    },
    electronics: {
      category: "💡 אלקטרוניקה",
      list: [
        { name: "דיודה", eq: "I_d=I_s \\cdot e^{\\frac{V}{nV_T}}" },
        { name: "BJT (זרם)", eq: "I_c=\\beta \\cdot I_b" },
        { name: "MOSFET Sat", eq: "I_d=\\frac{1}{2}\\mu_n C_{ox} \\frac{W}{L} (V_{gs}-V_t)^2" },
        { name: "OpAmp מהפך", eq: "A_v=-\\frac{R_f}{R_{in}}" },
        { name: "OpAmp עוקב", eq: "A_v=1+\\frac{R_f}{R_1}" },
        { name: "CMRR", eq: "CMRR=\\frac{A_d}{A_{cm}}" }
      ]
    },
    signals: {
      category: "📶 אותות ומערכות",
      list: [
        { name: "פורייה CT", eq: "X(j\\omega)=\\int x(t)e^{-j\\omega t}dt" },
        { name: "לפלס", eq: "X(s)=\\int x(t)e^{-st}dt" },
        { name: "Z-Transform", eq: "X(z)=\\sum x[n]z^{-n}" },
        { name: "קונבולוציה", eq: "y=x*h" },
        { name: "Nyquist", eq: "f_s \\ge 2f_{max}" },
        { name: "DFT", eq: "X[k]=\\sum x[n]e^{-j\\frac{2\\pi}{N}kn}" }
      ]
    },
    comms: {
      category: "📡 תקשורת",
      list: [
        { name: "קיבולת שאנון", eq: "C=B\\log_2(1+SNR)" },
        { name: "AM", eq: "s(t)=A_c[1+m(t)]\\cos(\\omega_c t)" },
        { name: "FM Deviation", eq: "\\Delta f=k_f \\cdot A_m" },
        { name: "Friis", eq: "P_r=P_t G_t G_r \\left(\\frac{\\lambda}{4\\pi d}\\right)^2" },
        { name: "SNR", eq: "SNR=\\frac{P_s}{P_n}" }
      ]
    },
    control: {
      category: "🎛️ בקרה",
      list: [
        { name: "PID", eq: "u=K_p e+K_i\\int e+K_d \\dot{e}" },
        { name: "זמן עלייה", eq: "t_r \\approx \\frac{1.8}{\\omega_n}" },
        { name: "Overshoot", eq: "OS=e^{-\\frac{\\pi\\zeta}{\\sqrt{1-\\zeta^2}}}" },
        { name: "יציבות ראוס", eq: "\\text{יציב} \\iff \\text{עמודה} > 0" },
        { name: "שגיאה מצב", eq: "e_{ss}=\\frac{1}{1+K_p}" }
      ]
    },
    trig: {
      category: "📐 זהויות טריגונומטריות",
      list: [
        { name: "זהות פיתגורס", eq: "\\sin^2(x)+\\cos^2(x)=1" },
        { name: "זווית כפולה סינוס", eq: "\\sin(2x)=2\\sin(x)\\cos(x)" },
        { name: "זווית כפולה קוסינוס", eq: "\\cos(2x)=\\cos^2(x)-\\sin^2(x)" },
        { name: "טנגנס", eq: "\\tan(x)=\\frac{\\sin(x)}{\\cos(x)}" },
        { name: "סכום זוויות סינוס", eq: "\\sin(a \\pm b)=\\sin(a)\\cos(b) \\pm \\cos(a)\\sin(b)" },
        { name: "סכום זוויות קוסינוס", eq: "\\cos(a \\pm b)=\\cos(a)\\cos(b) \\mp \\sin(a)\\sin(b)" }
      ]
    }
  };

  // Auth loading — wait for Firebase to resolve session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-400" />
          <p className="text-xs text-slate-500">מאמת זהות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans antialiased overflow-x-hidden pt-20">
      {/* Terms of Service blocking modal for users who haven't accepted yet */}
      {tosAccepted === false && (
        <TermsAgreementModal
          onAccept={acceptTos}
          onDecline={() => {
            signOut(auth);
            addToast('התנתקת מהמערכת', 'info');
          }}
        />
      )}
      
      {/* GLOBAL TOAST BANNER */}
      <div className="fixed bottom-6 left-6 z-55 flex flex-col gap-3 pointer-events-none max-w-sm w-full vt-toast-container print:hidden">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border bg-slate-950/95 p-4 px-5 text-sm shadow-xl shadow-black/40 border-l-4 transition-all duration-300 animate-slideIn ${
              t.type === 'error' ? 'border-red-500 border-l-red-500' : t.type === 'success' ? 'border-emerald-500 border-l-emerald-500' : 'border-emerald-500 border-l-emerald-500'
            }`}
          >
            <span>{t.type === 'error' ? '⚠️' : t.type === 'success' ? '✅' : '💡'}</span>
            <p className="font-semibold text-slate-100 pr-1">{t.msg}</p>
          </div>
        ))}
      </div>

      {/* HEADER NAVBAR */}
      <MainHeader
        onGoHome={() => {
          setSelectedType(null);
          setSelectedInstitutionKey(null);
          setSelectedYear(null);
          setSelectedSemester(null);
          setView('home');
        }}
        onOpenMyFormulas={() => {
          setActiveFormulaFolder(null);
          setView('my-formulas');
        }}
        breadcrumbContent={getBreadcrumbs()}
        cacheLabel={navigator.onLine ? "מחובר ומאותחל" : "מצב ללא חיבור (Offline)"}
        cacheDotClass={navigator.onLine ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500 shadow-[0_0_8px_#f59e0b]"}
        onShowCacheInfo={() => addToast('אחסון המידע פועל במצב אופליין ובשילוב סימולטור הקידוד המהיר.', 'info')}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          signOut(auth).then(() => {
            addToast('התנתקת בהצלחה מהמערכת', 'info');
          });
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* APP LAYOUT */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)]">
        
        {/* Floating Sidebar Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(p => !p)}
          className={`fixed top-24 z-50 flex h-10 w-10 items-center justify-center rounded-l-xl bg-slate-900 border-y border-l border-slate-800 text-emerald-400 hover:bg-slate-850 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-transform duration-350 ${
            isSidebarCollapsed ? 'translate-x-0' : '-translate-x-80'
          }`}
          style={{ right: 0 }}
          title={isSidebarCollapsed ? "פתח סרגל כלים" : "כווץ סרגל כלים"}
          aria-label={isSidebarCollapsed ? "פתח סרגל כלים" : "כווץ סרגל כלים"}
          aria-expanded={!isSidebarCollapsed}
        >
          {isSidebarCollapsed ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </button>

        {/* Mobile Sidebar Backdrop */}
        {!isSidebarCollapsed && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarCollapsed(true)}
            aria-hidden="true"
          />
        )}

        {/* SIDEBAR FOR MATHEMATICAL FORMULAS & CALCULATORS */}
        <aside 
          className={`fixed right-0 top-20 bottom-0 z-40 bg-slate-950 border-l border-slate-900/80 transition-transform duration-350 overflow-y-auto w-80 shadow-2xl ${
            isSidebarCollapsed ? 'translate-x-full' : 'translate-x-0'
          }`}
        >

          {!isSidebarCollapsed && (
            <div className="p-4 space-y-6 animate-fadeIn pb-16">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3.5 pr-2">
                <span className="text-xs font-black tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>כלי עזר ונוסחאות</span>
                </span>
              </div>

               {/* Quick Formulas List */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex justify-between items-center pr-1">
                  <span>נוסחאות מהירות:</span>
                  <button 
                    onClick={() => setIsAddingQuick(p => !p)} 
                    className="text-[10px] text-emerald-400 hover:text-white underline cursor-pointer"
                  >
                    {isAddingQuick ? "ביטול" : "+ הוסף נוסחה"}
                  </button>
                </div>

                {isAddingQuick && (
                  <QuickFormulaInput 
                    onAdd={handleAddQuickFormula} 
                    addToast={addToast} 
                  />
                )}

                <div className="grid gap-1.5">
                  {quickFormulas.map(f => {
                    const isBookmarked = bookmarks.some(b => b.id === f.id);
                    const isCustom = f.id.startsWith('custom_q_');
                    return (
                      <div key={f.id} className="group relative flex flex-col rounded-xl border border-slate-900 bg-slate-900/40 p-3 hover:border-slate-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-semibold">{f.title}</span>
                          <div className="flex items-center gap-1.5">
                            {isCustom && (
                              <button 
                                onClick={() => handleDeleteQuickFormula(f.id, f.title)}
                                className="text-[10px] text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="מחק נוסחה אישית"
                              >
                                ✕
                              </button>
                            )}
                            <button 
                              onClick={() => toggleBookmark(f.id, f.title, f.eq)}
                              className={`text-xs hover:text-white transition-colors ${isBookmarked ? 'text-emerald-400' : 'text-slate-600'}`}
                            >
                              {isBookmarked ? '★' : '+'}
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-center text-sm font-mono text-cyan-300 pointer-events-none direction-ltr">
                          {f.eq}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accordion Lists */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">דפי נוסחאות רגילים:</div>
                {Object.entries(formulasSheets).map(([key, data]) => {
                  const isOpen = openAccordion === key;
                  const categoryIcons: Record<string, React.ReactNode> = {
                    circuits: <Cpu className="h-4 w-4 text-emerald-400" />,
                    electronics: <Cpu className="h-4 w-4 text-emerald-400" />,
                    signals: <Compass className="h-4 w-4 text-cyan-400" />,
                    comms: <Compass className="h-4 w-4 text-cyan-400" />,
                    control: <Activity className="h-4 w-4 text-emerald-400" />,
                    trig: <Compass className="h-4 w-4 text-cyan-400" />
                  };
                  const cleanCategoryName = data.category.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '').trim();

                  return (
                    <div key={key} className="rounded-xl border border-slate-900 overflow-hidden">
                      <button 
                        onClick={() => setOpenAccordion(isOpen ? null : key)}
                        className={`w-full p-3 text-right text-xs font-bold text-slate-350 hover:bg-slate-900 flex items-center justify-between ${
                          isOpen ? 'bg-slate-900/60 text-white' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {categoryIcons[key]}
                          <span>{cleanCategoryName}</span>
                        </span>
                        <span>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div className="bg-slate-950/65 divide-y divide-slate-900 border-t border-slate-900">
                          {data.list.map((f, i) => {
                            const fid = `${key}_${i}`;
                            const isBookmarked = bookmarks.some(b => b.id === fid);
                            return (
                              <div key={fid} className="p-3 hover:bg-slate-900/20 flex flex-col gap-1 text-right">
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                  <span>{f.name}</span>
                                  <button 
                                    onClick={() => toggleBookmark(fid, f.name, `$$${f.eq}$$`)}
                                    className={`text-xs font-bold hover:text-white transition-colors ${isBookmarked ? 'text-emerald-400' : 'text-slate-600'}`}
                                  >
                                    {isBookmarked ? '★' : '+'}
                                  </button>
                                </div>
                                <div className="text-center font-mono text-xs text-cyan-300 pointer-events-none direction-ltr pt-1">
                                  {`$$${f.eq}$$`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calculations Block */}
              <div className="border-t border-slate-900 pt-6">
                <div className="mb-4 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">מחשבונים הנדסיים מובנים:</div>
                <Suspense fallback={<div className="h-24 flex items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" /></div>}>
                  <Calculators />
                </Suspense>
              </div>
            </div>
          )}
        </aside>

        {/* REPORT BUG FLOATING BUTTON */}
        <button 
          onClick={() => setIsContactOpen(true)}
          className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-xl shadow-lg border border-slate-700 hover:bg-slate-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300"
          title="צור קשר / דווח על תקלה"
          aria-label="דווח על תקלה או צור קשר"
        >
          ✉️
        </button>

        {/* MAIN BODY AREA */}
        <main 
          className={`flex-1 min-h-[calc(100vh-80px)] transition-all duration-350 ${
            isSidebarCollapsed ? 'mr-0' : 'mr-0 md:mr-80'
          }`}
        >
          {/* VIEW ROUTING ROUTER */}
          <div className="relative">
            {/* VIEW 1: HOME */}
            {view === 'home' && (
              <Suspense fallback={<ViewFallback />}>
                <MainHome
                  onSelectType={type => {
                    setSelectedType(type);
                    setView('institutions');
                  }}
                  onSelectSearchCourse={courseTitle => {
                    setEnrichmentCourse(courseTitle);
                    setIsEnrichmentOpen(true);
                  }}
                  onSelectSearchTopic={(course, topic) => {
                    setAiCourse(course);
                    setAiTopic(topic);
                    setIsAiOpen(true);
                  }}
                />
              </Suspense>
            )}

            {/* VIEW 2: INSTITUTIONS LIST */}
            {view === 'institutions' && selectedType && (
              <Suspense fallback={<ViewFallback />}>
                <MainInstitutions
                  type={selectedType}
                  institutionsList={institutions}
                  onBack={() => {
                    setSelectedType(null);
                    setView('home');
                  }}
                  onSelectInstitution={instKey => {
                    setSelectedInstitutionKey(instKey);
                    setView('years');
                  }}
                />
              </Suspense>
            )}

            {/* VIEW 3: YEARS & SEMESTERS LIST */}
            {view === 'years' && selectedInstitution && (
              <Suspense fallback={<ViewFallback />}>
                <MainYears
                  institution={selectedInstitution}
                  selectedTrack={selectedTrack}
                  onTrackChange={(track) => setSelectedTrack(track)}
                  onBack={() => {
                    setSelectedInstitutionKey(null);
                    setSelectedTrack('regular');
                    setView('institutions');
                  }}
                  onSelectYearSemester={(year, sem) => {
                    setSelectedYear(year);
                    setSelectedSemester(sem);
                    setView('courses');
                  }}
                  cacheBadgeInfo={{ ageText: "מעודכן ברשת חברתית", isFresh: true }}
                  onRefreshCache={() => addToast('תכני הלימוד רעננו מהרכיב המרכזי.', 'success')}
                />
              </Suspense>
            )}

            {/* VIEW 4: COURSES SEMESTER DASHBOARD */}
            {view === 'courses' && selectedInstitution && selectedYear && selectedSemester && (
              <Suspense fallback={<CoursePageSkeleton />}>
                <MainCourses
                  institution={selectedInstitution}
                  year={selectedYear}
                  semester={selectedSemester}
                  coursesList={(coursesData[selectedInstitution.key === 'ruppin' && selectedTrack === 'spread' ? 'ruppin_spread' : selectedInstitution.key]?.[selectedYear]?.[selectedSemester]) || []}
                  onBack={() => {
                    setSelectedYear(null);
                    setSelectedSemester(null);
                    setView('years');
                  }}
                  onOpenEnrichment={courseTitle => {
                    setEnrichmentCourse(courseTitle);
                    setIsEnrichmentOpen(true);
                  }}
                  onOpenExam={courseTitle => {
                    setExamCourse(courseTitle);
                    setIsExamOpen(true);
                  }}
                  onOpenTopic={(courseTitle, topicName) => {
                    setAiCourse(courseTitle);
                    setAiTopic(topicName);
                    setIsAiOpen(true);
                  }}
                />
              </Suspense>
            )}

            {/* VIEW 5: PRIVATE FORMULAS LIST */}
            {view === 'my-formulas' && (
              <section className="px-6 py-12 md:px-12 max-w-4xl mx-auto space-y-8 animate-fadeIn">
                {/* PRINT-ONLY HEADER BRANDING */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-emerald-500 pb-4 mb-6 direction-rtl text-right">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">VOLTEACH ⚡</h1>
                    <p className="text-xs text-slate-600 mt-1">פורטל הלמידה המקיף לסטודנטים בהנדסת חשמל — volteach-portal.web.app</p>
                  </div>
                  <div className="text-left font-sans">
                    <p className="text-[10px] text-slate-500">הופק באמצעות מחברת הנוסחאות האישית של VOLTEACH</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
                  <div className="text-right">
                    <h2 className="text-2xl font-black text-white sm:text-3xl">מחברת הנוסחאות האישית שלי</h2>
                    <p className="text-xs text-slate-400 mt-1">נהל, שמור, וייצא את רשימת המשוואות החשמליות שלך.</p>
                  </div>
                  <div className="flex gap-2 self-start sm:self-center">
                    <button 
                      onClick={handleShareFormulas}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-2.5 px-4 text-xs font-bold text-white transition-opacity hover:opacity-95"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>שתף דף קישור</span>
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-4 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-850 hover:text-white"
                    >
                      <Printer className="h-4 w-4" />
                      <span>הדפס דף נוסחאות (PDF)</span>
                    </button>
                  </div>
                </div>

                {bookmarksLoading ? (
                  <FormulasPageSkeleton />
                ) : bookmarks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/20 p-12 text-center text-slate-400">
                    <span className="text-4xl block mb-2">📄</span>
                    <h3 className="text-lg font-bold text-white">מחברת הנוסחאות ריקה</h3>
                    <p className="text-xs text-slate-500 mt-1">שמור נוסחאות בסרגל הצידי או בקורסים בלחיצה על כפתור (+).</p>
                  </div>
                ) : (
                  <>
                    {!activeFormulaFolder ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
                        {Object.entries(
                          bookmarks.reduce((acc, curr) => {
                            const prefix = curr.id.split('_')[0] ?? '';
                            const catName = formulasSheets[prefix]?.category || "⭐ קורסים אחרים";
                            if (!acc[catName]) acc[catName] = [];
                            acc[catName].push(curr);
                            return acc;
                          }, {} as Record<string, typeof bookmarks>)
                        ).map(([folderName, formulas]) => (
                          <button
                            key={folderName}
                            onClick={() => setActiveFormulaFolder(folderName)}
                            className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 transition-all hover:-translate-y-2 hover:border-emerald-500/50 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-emerald-500/10 group"
                          >
                            <div className="rounded-2xl bg-emerald-500/10 p-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                              <BookOpen className="h-10 w-10" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition-colors text-center">
                              {folderName}
                            </h3>
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400">
                              {formulas.length} נוסחאות
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="animate-slideIn">
                        <button
                          onClick={() => setActiveFormulaFolder(null)}
                          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <span className="text-lg">←</span> חזור לתיקיות
                        </button>
                        
                        <div className="mb-6 flex items-center gap-3">
                          <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <h3 className="text-xl font-black text-white">{activeFormulaFolder}</h3>
                        </div>

                        <div id="myFormulasList" className="grid gap-4 sm:grid-cols-2">
                          {bookmarks
                            .filter(f => {
                              const prefix = f.id.split('_')[0] ?? '';
                              const catName = formulasSheets[prefix]?.category || "⭐ קורסים אחרים";
                              return catName === activeFormulaFolder;
                            })
                            .map(f => (
                              <div key={f.id} className="relative rounded-2xl border border-slate-800 bg-slate-900/30 p-5 pr-14 text-right transition-colors hover:border-slate-700 hover:bg-slate-900/60">
                                <button 
                                  onClick={() => toggleBookmark(f.id, f.title, f.latex)}
                                  className="absolute right-4 top-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 p-1.5 text-red-400 transition-colors"
                                  aria-label="מחק ממחברת הנוסחאות"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </button>
                                <h4 className="text-xs font-bold text-slate-400 pr-1">{f.title}</h4>
                                <div className="mt-3 text-center text-md text-cyan-300 font-mono direction-ltr">
                                  {f.latex}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            )}
            
            {/* FOOTER BIO */}
            <footer className="w-full py-8 border-t border-slate-900/50 mt-16 text-center text-[10px] text-slate-500 max-w-4xl mx-auto px-6">
              <p className="leading-relaxed">
                נוצר בגאווה על ידי מהנדס חשמל בתחילת דרכו ⚡
              </p>
              <p className="mt-1 text-slate-650">
                VOLTEACH © {new Date().getFullYear()} — כל הזכויות שמורות
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                <button onClick={() => { setLegalType('terms'); setIsLegalOpen(true); }} className="hover:text-indigo-400 hover:underline transition-colors">תנאי שימוש (TOS)</button>
                <button onClick={() => { setLegalType('privacy'); setIsLegalOpen(true); }} className="hover:text-emerald-400 hover:underline transition-colors">מדיניות פרטיות</button>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* OVERLAY MODAL LISTINGS */}
      <Suspense fallback={null}>
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          institutionsList={institutions}
          initialInstKey={selectedInstitutionKey}
        />
      </Suspense>

      <Suspense fallback={null}>
        <EnrichmentModal
          isOpen={isEnrichmentOpen}
          onClose={() => setIsEnrichmentOpen(false)}
          courseTitle={enrichmentCourse}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ExamModal
          isOpen={isExamOpen}
          onClose={() => setIsExamOpen(false)}
          courseTitle={examCourse}
        />
      </Suspense>

      <Suspense fallback={null}>
        <AiModal
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          courseTitle={aiCourse}
          topicName={aiTopic}
        />
      </Suspense>

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        type={legalType}
      />

      <CookieBanner />

      <MusicPlayer />

      {/* SIGN IN MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 left-4 z-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="סגור"
            >
              <X className="h-4 w-4" />
            </button>
            <Suspense fallback={null}>
              <SignIn
                onSuccess={(msg) => {
                  setIsAuthOpen(false);
                  addToast(msg, 'success');
                }}
              />
            </Suspense>
          </div>
        </div>
      )}


{isProfileOpen && (
        <Suspense fallback={null}>
          <ProfileModal
            user={user}
            formulasCount={quickFormulas.length + bookmarks.length}
            onClose={() => setIsProfileOpen(false)}
            onLogout={() => {
              signOut(auth);
              addToast("התנתקת מהחשבון בהצלחה", "info");
            }}
            onViewFormulas={() => {
              setIsProfileOpen(false);
              setView('my-formulas');
              setSelectedType(null);
              setSelectedInstitutionKey(null);
              setSelectedYear(null);
              setSelectedSemester(null);
            }}
          />
        </Suspense>
      )}

    </div>
  );
}
