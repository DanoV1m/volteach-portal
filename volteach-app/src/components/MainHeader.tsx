import React from 'react';
import { BookOpen, LogIn, User, Search } from 'lucide-react';
import LazyImage from './LazyImage';

interface MainHeaderProps {
  onGoHome: () => void;
  onOpenMyFormulas: () => void;
  breadcrumbContent: React.ReactNode;
  user: any | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
}

export default function MainHeader({
  onGoHome,
  onOpenMyFormulas,
  breadcrumbContent,
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenSearch,
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
        {/* SEARCH BUTTON */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 px-3 py-2 text-xs text-slate-400 hover:text-white transition-all"
          title="חיפוש גלובלי (Ctrl+K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-slate-500">חפש קורס...</span>
        </button>

        {/* MY FORMULAS BUTTON */}
        <button
          onClick={onOpenMyFormulas}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">הנוסחאות שלי</span>
        </button>

{/* FIREBASE AUTH SECTION */}
        <div className="flex items-center gap-2 border-r border-slate-800 pr-2">
          {user ? (
            <button
              onClick={onOpenProfile}
              className="h-9 w-9 rounded-xl border border-emerald-500/30 overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              title="פרופיל אישי"
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

