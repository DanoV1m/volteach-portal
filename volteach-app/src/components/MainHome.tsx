import React from 'react';
import { School, GraduationCap, Zap } from 'lucide-react';

interface MainHomeProps {
  onSelectType: (type: 'uni' | 'college') => void;
}

export default function MainHome({ onSelectType }: MainHomeProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12 md:px-12">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* HERO BADGE */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-sm font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>המדריך המקיף להנדסת חשמל בישראל</span>
        </div>

        {/* HERO HEADER */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.15]">
          ברוכים הבאים ל-
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            VOLTEACH
          </span>
        </h1>

        <p className="mt-4 text-lg text-slate-400 max-w-lg mx-auto">
          מערכת אחת, מוסד לימודים אחד — כל החומרים, הסימולטורים והנוסחאות שאתה צריך כדי לעבור.
        </p>

        {/* DECISION / BENTO BARS */}
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <button
            onClick={() => onSelectType('uni')}
            className="group flex w-full max-w-xs cursor-pointer flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/40 p-8 hover:bg-slate-900/90 transition-all hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <School className="h-12 w-12 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="mt-4 text-xl font-bold text-white">אוניברסיטאות</div>
            <div className="mt-2 text-xs text-slate-500">בחירה מתוך 6 אוניברסיטאות מובילות בישראל</div>
          </button>

          <button
            onClick={() => onSelectType('college')}
            className="group flex w-full max-w-xs cursor-pointer flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/40 p-8 hover:bg-slate-900/90 transition-all hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <GraduationCap className="h-12 w-12 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="mt-4 text-xl font-bold text-white">מכללות אקדמיות</div>
            <div className="mt-2 text-xs text-slate-500">בחירה מתוך 8 מכללות מובילות בישראל</div>
          </button>
        </div>
      </div>
    </section>
  );
}
