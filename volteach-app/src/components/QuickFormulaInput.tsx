import React, { useState } from 'react';
import { sanitizeFormulaInput } from '../utils/security';

interface Props {
  onAdd: (title: string, eq: string) => void;
  addToast: (msg: string, type: 'error' | 'success') => void;
}

export function QuickFormulaInput({ onAdd, addToast }: Props) {
  const [title, setTitle] = useState('');
  const [eq, setEq] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eq.trim()) {
      addToast("נא למלא את כל השדות", "error");
      return;
    }
    
    const safeTitle = sanitizeFormulaInput(title);
    const safeEq = sanitizeFormulaInput(eq);
    const formattedEq = safeEq.includes('$') ? safeEq : `$$${safeEq}$$`;
    
    onAdd(safeTitle, formattedEq);
    setTitle('');
    setEq('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2 text-right">
      <input 
        type="text" 
        placeholder="שם הנוסחה (למשל: חוק אוהם)" 
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-emerald-500 transition-colors duration-300"
      />
      <input 
        type="text" 
        placeholder="נוסחה ב-LaTeX (למשל: V = I * R)" 
        value={eq}
        onChange={e => setEq(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-emerald-500 font-mono direction-ltr transition-colors duration-300"
      />
      <button 
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-550 text-white rounded-lg py-1.5 text-[10px] font-bold transition-transform duration-300 active:scale-95 shadow-lg shadow-emerald-900/50"
      >
        שמור נוסחה מהירה
      </button>
    </form>
  );
}
