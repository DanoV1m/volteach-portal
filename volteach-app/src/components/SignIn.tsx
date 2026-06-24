import React, { useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { Shield, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

interface SignInProps {
  onSuccess: (msg: string) => void;
}

export default function SignIn({ onSuccess }: SignInProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const syncUserProfile = async (userId: string, userEmail: string, name: string) => {
    const userRef = doc(db, 'users', userId);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: userId,
          email: userEmail,
          displayName: name || userEmail.split('@')[0],
          createdAt: serverTimestamp()
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await syncUserProfile(
          result.user.uid, 
          result.user.email || '', 
          result.user.displayName || ''
        );
        onSuccess(`ברוכים הבאים, ${result.user.displayName || 'סטודנט'}!`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'שגיאה בהתחברות באמצעות Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await syncUserProfile(
          result.user.uid, 
          result.user.email || '', 
          result.user.displayName || ''
        );
        onSuccess(`ברוכים הבאים, ${result.user.displayName || 'סטודנט'}!`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'שגיאה בהתחברות באמצעות GitHub');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(`התחברת בהצלחה לפורטל!`);
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          throw new Error('אנא הזן שם מלא');
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: fullName });
        await syncUserProfile(result.user.uid, email, fullName);
        onSuccess(`ההרשמה הושלמה בהצלחה! שלום ${fullName}`);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'שגיאה בביצוע הפעולה';
      if (err.code === 'auth/user-not-found') {
        msg = 'משתמש זה אינו קיים במערכת.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'הסיסמה שהוקלדה אינה נכונה.';
      } else if (err.code === 'auth/invalid-credential') {
        msg = 'האימייל או הסיסמה שגויים. אנא בדוק ונסה שנית.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'כתובת האימייל אינה תקינה.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'הסיסמה חלשה מדי. עלייה להכיל לפחות 6 תווים.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'כתובת אימייל זו כבר רשומה במערכת.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-right">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex justify-center mb-5">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Shield className="h-6 w-6" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {mode === 'signin' && 'התחברות לפורטל VOLTEACH'}
          {mode === 'signup' && 'יצירת חשבון סטודנט חדש'}
          {mode === 'forgot' && 'איפוס סיסמת כניסה'}
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          {mode === 'signin' && 'התחבר כדי לשמור נוסחאות אישיות ולסנכרן את מחברת הלימוד שלך לענן'}
          {mode === 'signup' && 'הירשם חינם ותהנה מסנכרון וניהול נוסחאות מלא מכל מכשיר'}
          {mode === 'forgot' && 'אנא הזן את כתובת הדואר האלקטרוני שלך לשליחת קישור איפוס'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2 leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {mode === 'forgot' && resetSent ? (
        <div className="text-center py-6 space-y-4">
          <div className="text-4xl">📧</div>
          <p className="text-sm font-bold text-emerald-400">קישור לאיפוס סיסמה נשלח בהצלחה!</p>
          <p className="text-xs text-slate-400 leading-relaxed">אנא בדוק את תיבת הדואר הנכנס שלך (או תיבת הספאם) ולחץ על הקישור כדי לקבוע סיסמה חדשה.</p>
          <button
            onClick={() => {
              setMode('signin');
              setResetSent(false);
              setError(null);
            }}
            className="text-xs text-indigo-400 hover:text-white underline font-bold mt-4"
          >
            חזרה לדף ההתחברות
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-bold text-slate-300">שם מלא</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3 pr-10 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-300">דואר אלקטרוני</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-3 flex items-center text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@technion.ac.il"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3 pr-10 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none direction-ltr"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold text-slate-300">סיסמה</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                    }}
                    className="text-[10px] text-indigo-400 hover:text-white"
                  >
                    שכחת סיסמה?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3 pr-10 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none direction-ltr"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>
                {mode === 'signin' && 'התחבר לחשבון'}
                {mode === 'signup' && 'צור חשבון חדש'}
                {mode === 'forgot' && 'שלח קישור לאיפוס סיסמה'}
              </span>
            )}
          </button>

          {mode !== 'forgot' && (
            <>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-900"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold">או בערוץ מהיר</span>
                <div className="flex-grow border-t border-slate-900"></div>
              </div>

              <div className="grid gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 py-3 text-xs font-bold text-white transition flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 1.621 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-11 0-.746-.08-1.32-.176-1.885H12.24z"/>
                  </svg>
                  <span>התחברות מהירה עם Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubSignIn}
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 py-3 text-xs font-bold text-white transition flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span>התחברות מהירה עם GitHub</span>
                </button>
              </div>
            </>
          )}

          <div className="text-center pt-4">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-400">
                אין לך חשבון עדיין?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-indigo-400 hover:text-white font-bold underline"
                >
                  הירשם כאן
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                כבר רשום במערכת?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-indigo-400 hover:text-white font-bold underline"
                >
                  התחבר כאן
                </button>
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
