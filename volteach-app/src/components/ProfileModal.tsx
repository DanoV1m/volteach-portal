import React from 'react';
import { X, Mail, Calendar, BookOpen, Shield, LogOut, User } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import LazyImage from './LazyImage';

interface ProfileModalProps {
  user: FirebaseUser | null;
  formulasCount: number;
  onClose: () => void;
  onLogout: () => void;
  onViewFormulas: () => void;
}

export default function ProfileModal({ user, formulasCount, onClose, onLogout, onViewFormulas }: ProfileModalProps) {
  if (!user) return null;

  const creationDate = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'לא ידוע';

  const initial = user.displayName 
    ? user.displayName.charAt(0).toUpperCase() 
    : (user.email ? user.email.charAt(0).toUpperCase() : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header Background */}
        <div className="h-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Avatar */}
        {user.photoURL ? (
          <LazyImage
            src={user.photoURL}
            alt={user.displayName || 'תמונת פרופיל'}
            className="absolute top-12 right-6 h-20 w-20 rounded-2xl border-4 border-slate-900 shadow-lg"
            fallback={
              <span className="flex h-full w-full items-center justify-center bg-emerald-500 text-3xl font-black text-white">
                {initial || <User className="h-10 w-10" />}
              </span>
            }
          />
        ) : (
          <div className="absolute top-12 right-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-slate-900 bg-emerald-500 text-3xl font-black text-white shadow-lg">
            {initial ? initial : <User className="h-10 w-10" />}
          </div>
        )}

        {/* Profile Details */}
        <div className="pt-12 pb-6 px-6">
          <h2 className="text-2xl font-black text-white">{user.displayName || 'משתמש סטודנט'}</h2>
          <p className="flex items-center gap-2 text-sm text-slate-400 mt-1">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>

          <div className="mt-8 space-y-4">
            <button 
              onClick={onViewFormulas}
              className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition-all hover:bg-slate-800 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer group text-right"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">דפי נוסחאות שמורות</div>
                  <div className="text-xs text-slate-400">נוסחאות ששמרת מקורסים שונים</div>
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">{formulasCount}</div>
            </button>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">תאריך הצטרפות</div>
                  <div className="text-xs text-slate-400">מתי התחלת ללמוד איתנו</div>
                </div>
              </div>
              <div className="text-sm font-bold text-cyan-400">{creationDate}</div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">סטטוס חשבון</div>
                  <div className="text-xs text-slate-400">גישה מלאה למערכת הלמידה</div>
                </div>
              </div>
              <div className="text-sm font-bold text-indigo-400">פעיל</div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-bold text-red-500 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            התנתק מהחשבון
          </button>
        </div>
      </div>
    </div>
  );
}
