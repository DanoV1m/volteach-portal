import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { explainFormula } from '../utils/gemini';

interface FormulaExplainerProps {
  formula: { name: string; eq: string } | null;
  onClose: () => void;
}

export function FormulaExplainer({ formula, onClose }: FormulaExplainerProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'NO_KEY' | 'ERROR' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevFormulaRef = useRef<string>('');

  useEffect(() => {
    if (!formula) return;
    const key = `${formula.name}::${formula.eq}`;
    if (key === prevFormulaRef.current) return;
    prevFormulaRef.current = key;

    setText('');
    setError(null);
    setLoading(true);

    explainFormula(formula.name, formula.eq)
      .then(result => setText(result))
      .catch(err => {
        if (err.message === 'NO_KEY') setError('NO_KEY');
        else setError('ERROR');
      })
      .finally(() => setLoading(false));
  }, [formula]);

  // Render KaTeX after text loads
  useEffect(() => {
    if (!text || !containerRef.current) return;
    const win = window as unknown as { renderMathInElement?: (el: Element, opts: unknown) => void };
    if (win.renderMathInElement) {
      try {
        win.renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: false },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        });
      } catch { /* noop */ }
    }
  }, [text]);

  if (!formula) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] w-80 print:hidden">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-slate-800">
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2 text-right">
            <div className="text-right">
              <p className="text-xs font-black text-white">{formula.name}</p>
              <p className="text-[9px] text-indigo-400 font-mono direction-ltr">{formula.eq.length > 30 ? formula.eq.slice(0, 30) + '…' : formula.eq}</p>
            </div>
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={containerRef} className="px-4 py-3 min-h-[80px]">
          {loading && (
            <div className="flex items-center gap-2 py-4 justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <p className="text-xs text-slate-400">Gemini חושב...</p>
            </div>
          )}

          {error === 'NO_KEY' && (
            <div className="flex items-start gap-2 py-2">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-right">
                <p className="text-xs font-bold text-amber-400">שירות AI בהגדרה</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  הסברי נוסחאות יהיו זמינים בקרוב. אם הבעיה נמשכת, פנה למנהל האתר.
                </p>
              </div>
            </div>
          )}

          {error === 'ERROR' && (
            <div className="flex items-center gap-2 py-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-xs text-red-400">שגיאה בקריאה ל-Gemini</p>
            </div>
          )}

          {text && !loading && (
            <div className="space-y-1.5 text-right" dir="rtl">
              {text.split('\n').filter(Boolean).map((line, i) => (
                <p key={i} className="text-[11px] text-slate-300 leading-relaxed">{line}</p>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pb-3 text-[9px] text-slate-600 text-right">
          מופעל על ידי Gemini 2.0 Flash · VOLTEACH AI
        </div>
      </div>
    </div>
  );
}
