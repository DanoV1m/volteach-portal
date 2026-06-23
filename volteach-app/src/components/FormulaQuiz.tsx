import React, { useState, useEffect, useCallback } from 'react';
import { useKatexRender } from '../utils/useKatexRender';
import { X, ChevronRight, ChevronLeft, RotateCcw, Check, BookOpen } from 'lucide-react';
import { formulasSheets } from '../data/formulas';

interface Card {
  categoryId: string;
  categoryLabel: string;
  name: string;
  eq: string;
}

function buildDeck(categoryId: string): Card[] {
  const entries = categoryId === 'all'
    ? Object.entries(formulasSheets)
    : Object.entries(formulasSheets).filter(([id]) => id === categoryId);

  const cards: Card[] = [];
  for (const [id, sheet] of entries) {
    for (const f of sheet.list) {
      cards.push({ categoryId: id, categoryLabel: sheet.category, name: f.name, eq: f.eq });
    }
  }
  return cards.sort(() => Math.random() - 0.5);
}


interface FormulaQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormulaQuiz({ isOpen, onClose }: FormulaQuizProps) {
  const [categoryId, setCategoryId] = useState('all');
  const [deck, setDeck] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const restart = useCallback((catId = categoryId) => {
    const d = buildDeck(catId);
    setDeck(d);
    setIdx(0);
    setRevealed(false);
    setScore({ correct: 0, wrong: 0 });
    setFinished(false);
  }, [categoryId]);

  useEffect(() => {
    if (isOpen) restart(categoryId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useKatexRender(cardRef, [revealed, idx], [{ left: '$$', right: '$$', display: true }]);

  const handleCategory = (catId: string) => {
    setCategoryId(catId);
    restart(catId);
  };

  const advance = (correct: boolean) => {
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
    if (idx + 1 >= deck.length) {
      setFinished(true);
    } else {
      setIdx(i => i + 1);
      setRevealed(false);
    }
  };

  if (!isOpen) return null;

  const card = deck[idx];
  const total = deck.length;
  const progress = total > 0 ? ((idx) / total) * 100 : 0;

  const categories = [
    { id: 'all', label: 'הכל' },
    ...Object.entries(formulasSheets).map(([id, s]) => ({
      id,
      label: s.category.replace(/[✀-➿]|[-]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[‑-⛿]|\uD83E[\uDC00-\uDFFF]/g, '').trim(),
    })),
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800">
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
          <div className="text-right">
            <h2 className="text-sm font-black text-white">בוחן נוסחאות</h2>
            <p className="text-[10px] text-slate-500">{idx}/{total} · ✓ {score.correct} · ✗ {score.wrong}</p>
          </div>
          <BookOpen className="h-4 w-4 text-indigo-400" />
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 px-4 py-3 overflow-x-auto">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => handleCategory(c.id)}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                categoryId === c.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-800 mx-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card area */}
        <div className="px-5 py-6 min-h-[220px] flex flex-col items-center justify-center gap-4">
          {finished ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <p className="text-lg font-black text-white">סיימת!</p>
              <p className="text-sm text-slate-400">
                <span className="text-emerald-400 font-bold">{score.correct} נכונות</span>
                {' · '}
                <span className="text-red-400 font-bold">{score.wrong} שגיאות</span>
                {' · '}
                {Math.round((score.correct / total) * 100)}% הצלחה
              </p>
              <button
                onClick={() => restart()}
                className="flex items-center gap-2 mx-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-black text-white transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                שחק שוב
              </button>
            </div>
          ) : card ? (
            <>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{card.categoryLabel}</p>

              {/* Card */}
              <div ref={cardRef} className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-6 text-center space-y-4 min-h-[100px] flex flex-col items-center justify-center">
                <p className="text-lg font-black text-white">{card.name}</p>
                {revealed ? (
                  <div className="text-cyan-300 font-mono text-base direction-ltr">
                    {`$$${card.eq}$$`}
                  </div>
                ) : (
                  <button
                    onClick={() => setRevealed(true)}
                    className="rounded-xl bg-slate-700 hover:bg-slate-600 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all"
                  >
                    גלה נוסחה
                  </button>
                )}
              </div>

              {/* Actions */}
              {revealed && (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => advance(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 py-2.5 text-xs font-bold text-red-400 transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    לא ידעתי
                  </button>
                  <button
                    onClick={() => advance(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 py-2.5 text-xs font-bold text-emerald-400 transition-all"
                  >
                    ידעתי!
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-500 text-sm">אין נוסחאות בקטגוריה זו</p>
          )}
        </div>

        {/* Footer nav */}
        {!finished && total > 0 && (
          <div className="flex items-center justify-between px-5 pb-4">
            <button
              onClick={() => restart()}
              className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              אפס
            </button>
            <span className="text-[10px] text-slate-600">{idx + 1} / {total}</span>
            <button
              onClick={() => { setIdx(i => Math.min(i + 1, total - 1)); setRevealed(false); }}
              className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-white transition-colors"
            >
              דלג
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
