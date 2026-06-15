import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Landmark, GraduationCap, BookOpen, FlaskConical } from 'lucide-react';
import { institutions } from '../data/institutions';
import { coursesData } from '../data/courses';
import { formulasSheets } from '../data/formulas';

// ── Types ────────────────────────────────────────────────────────────────────

type ResultKind = 'institution' | 'course' | 'formula';

interface SearchResult {
  id: string;
  kind: ResultKind;
  primary: string;
  secondary: string;
  meta?: string;
  payload: Record<string, unknown>;
}

// ── Flatten search index once ────────────────────────────────────────────────

const INSTITUTIONS_INDEX: SearchResult[] = institutions.map(inst => ({
  id: `inst-${inst.key}`,
  kind: 'institution',
  primary: inst.name,
  secondary: inst.fullName,
  meta: inst.location,
  payload: { key: inst.key, type: inst.type },
}));

const COURSES_INDEX: SearchResult[] = (() => {
  const results: SearchResult[] = [];
  for (const [instKey, years] of Object.entries(coursesData)) {
    const inst = institutions.find(i => i.key === instKey || instKey.startsWith(i.key));
    const instName = inst?.name ?? instKey;
    for (const [yearStr, semesters] of Object.entries(years)) {
      for (const [semStr, courses] of Object.entries(semesters)) {
        for (const course of courses) {
          results.push({
            id: `course-${instKey}-${yearStr}-${semStr}-${course.title}`,
            kind: 'course',
            primary: course.title,
            secondary: course.subtitle,
            meta: `${instName} · שנה ${yearStr} · סמסטר ${semStr}`,
            payload: { institutionKey: instKey, year: Number(yearStr), semester: Number(semStr) },
          });
        }
      }
    }
  }
  return results;
})();

const FORMULAS_INDEX: SearchResult[] = Object.entries(formulasSheets).flatMap(([catId, sheet]) =>
  sheet.list.map(f => ({
    id: `formula-${catId}-${f.name}`,
    kind: 'formula' as ResultKind,
    primary: f.name,
    secondary: sheet.category,
    meta: `$$${f.eq}$$`,
    payload: { categoryId: catId },
  }))
);

const ALL_RESULTS = [...INSTITUTIONS_INDEX, ...COURSES_INDEX, ...FORMULAS_INDEX];

function search(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return ALL_RESULTS.filter(r =>
    r.primary.toLowerCase().includes(q) ||
    r.secondary.toLowerCase().includes(q) ||
    (r.meta?.toLowerCase().includes(q) ?? false)
  ).slice(0, 12);
}

// ── Props ────────────────────────────────────────────────────────────────────

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstitution: (key: string, type: 'uni' | 'college') => void;
  onSelectCourse: (institutionKey: string, year: number, semester: number) => void;
  onSelectFormula: (categoryId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const KIND_ICON: Record<ResultKind, React.ReactNode> = {
  institution: <Landmark className="h-3.5 w-3.5" />,
  course: <GraduationCap className="h-3.5 w-3.5" />,
  formula: <FlaskConical className="h-3.5 w-3.5" />,
};

const KIND_COLOR: Record<ResultKind, string> = {
  institution: 'text-indigo-400 bg-indigo-500/10',
  course: 'text-emerald-400 bg-emerald-500/10',
  formula: 'text-cyan-400 bg-cyan-500/10',
};

const KIND_LABEL: Record<ResultKind, string> = {
  institution: 'מוסד',
  course: 'קורס',
  formula: 'נוסחה',
};

export function SearchModal({ isOpen, onClose, onSelectInstitution, onSelectCourse, onSelectFormula }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const res = search(query);
    setResults(res);
    setActiveIdx(0);
  }, [query]);

  // Render KaTeX in results
  useEffect(() => {
    if (!results.length) return;
    const win = window as unknown as { renderMathInElement?: (el: Element, opts: unknown) => void };
    if (win.renderMathInElement && listRef.current) {
      try {
        win.renderMathInElement(listRef.current, {
          delimiters: [{ left: '$$', right: '$$', display: false }],
          throwOnError: false,
        });
      } catch { /* noop */ }
    }
  }, [results]);

  const handleSelect = useCallback((result: SearchResult) => {
    if (result.kind === 'institution') {
      onSelectInstitution(result.payload.key as string, result.payload.type as 'uni' | 'college');
    } else if (result.kind === 'course') {
      onSelectCourse(result.payload.institutionKey as string, result.payload.year as number, result.payload.semester as number);
    } else {
      onSelectFormula(result.payload.categoryId as string);
    }
    onClose();
  }, [onSelectInstitution, onSelectCourse, onSelectFormula, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIdx]) { handleSelect(results[activeIdx]!); }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="חפש קורס, נוסחה, מוסד..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none text-right"
            dir="rtl"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto">
          {!query && (
            <div className="flex flex-col items-center gap-2 py-10 text-slate-500">
              <Search className="h-8 w-8 opacity-30" />
              <p className="text-xs">חפש קורסים, נוסחאות ומוסדות</p>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-slate-500">
              <BookOpen className="h-8 w-8 opacity-30" />
              <p className="text-xs">לא נמצאו תוצאות עבור "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-1.5">
              {results.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-colors ${
                    i === activeIdx ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${KIND_COLOR[r.kind]}`}>
                    {KIND_ICON[r.kind]}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs font-bold text-white truncate">{r.primary}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {r.kind === 'formula' ? <span className="font-mono">{r.meta}</span> : r.meta}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${KIND_COLOR[r.kind]}`}>
                    {KIND_LABEL[r.kind]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-[10px] text-slate-600">
          <span>↑↓ ניווט · Enter בחר · Esc סגור</span>
          <span>{results.length > 0 ? `${results.length} תוצאות` : ''}</span>
        </div>
      </div>
    </div>
  );
}
