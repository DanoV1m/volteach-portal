import React from 'react';
import { BookOpen, LogIn, LogOut, Cloud, User } from 'lucide-react';
import LazyImage from './LazyImage';

interface MainHeaderProps {
  onGoHome: () => void;
  onOpenMyFormulas: () => void;
  breadcrumbContent: React.ReactNode;
  cacheLabel: string;
  cacheDotClass: string;
  onShowCacheInfo: () => void;
  user: any | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export default function MainHeader({
  onGoHome,
  onOpenMyFormulas,
  breadcrumbContent,
  cacheLabel,
  cacheDotClass,
  onShowCacheInfo,
  user,
  onOpenAuth,
  onLogout,
  onOpenProfile
}: MainHeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-xl md:px-12">
      <div className="flex items-center gap-6">
        {/* LOGO */}
        <button 
          onClick={onGoHome}
          className="flex cursor-pointer items-center gap-3 text-xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent border-none bg-transparent"
        >
          <LazyImage
            src="/logo.png"
            alt="VOLTEACH Logo"
            priority
            className="h-11 w-11 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          />
          <span>VOLTEACH</span>
        </button>

        {/* BREADCRUMB */}
        <div className="hidden items-center gap-2 text-sm md:flex">
          {breadcrumbContent}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* MY FORMULAS BUTTON */}
        <button
          onClick={onOpenMyFormulas}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">הנוסחאות שלי</span>
        </button>

        {/* CACHE / NETWORK STATE BADGE */}
        <button 
          onClick={onShowCacheInfo}
          className="hidden sm:flex cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-emerald-500/40 hover:text-slate-100"
          title="סטטוס חיבור ו-Cache"
        >
          <div className={`h-2.5 w-2.5 rounded-full ${cacheDotClass}`}></div>
          <span>{cacheLabel}</span>
        </button>

        {/* FIREBASE AUTH SECTION */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-none">{user.displayName || user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
                  <Cloud className="h-3 w-3" />
                  ענן מסונכרן
                </span>
              </div>
              
              <button
                onClick={onOpenProfile}
                className="h-9 w-9 rounded-xl border border-emerald-500/30 overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                title="צפייה בפרופיל האישי"
              >
                {user.photoURL ? (
                  <LazyImage
                    src={user.photoURL}
                    alt={user.displayName || 'תמונת פרופיל'}
                    className="h-full w-full"
                    fallback={
                      <span className="flex h-full w-full items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold text-sm">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </span>
                    }
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold text-sm">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors"
                title="התנתק מהחשבון"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">התחברות</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

