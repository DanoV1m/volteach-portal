import React, { useState } from 'react';
import { Zap, Cpu, Activity, RefreshCw, BarChart2, Compass, Binary, HelpCircle } from 'lucide-react';

export default function Calculators() {
  // Ohm's Law State
  const [ohmV, setOhmV] = useState('');
  const [ohmI, setOhmI] = useState('');
  const [ohmR, setOhmR] = useState('');
  const [ohmRes, setOhmRes] = useState('');

  // RC Time Constant State
  const [rcR, setRcR] = useState('');
  const [rcC, setRcC] = useState('');
  const [rcRes, setRcRes] = useState('');

  // dB Converter State
  const [dbVal, setDbVal] = useState('');
  const [dbType, setDbType] = useState<'voltage' | 'power'>('voltage');
  const [dbRes, setDbRes] = useState('');

  // Unit Prefix State
  const [prefVal, setPrefVal] = useState('');
  const [prefFrom, setPrefFrom] = useState('1');
  const [prefTo, setPrefTo] = useState('1');
  const [prefRes, setPrefRes] = useState('');

  // Frequency ↔ Period State
  const [ftVal, setFtVal] = useState('');
  const [ftMode, setFtMode] = useState<'f2t' | 't2f'>('f2t');
  const [ftUnit, setFtUnit] = useState('1');
  const [ftRes, setFtRes] = useState('');

  // Base Converter State
  const [baseVal, setBaseVal] = useState('');
  const [baseFrom, setBaseFrom] = useState('10');

  // Parallel Resistors State
  const [paraVal, setParaVal] = useState('');
  const [paraRes, setParaRes] = useState('');

  // Voltage Divider State
  const [divVin, setDivVin] = useState('');
  const [divR1, setDivR1] = useState('');
  const [divR2, setDivR2] = useState('');
  const [divRes, setDivRes] = useState('');

  // Categories open/close state
  const [openCat, setOpenCat] = useState<'circuits' | 'signals' | 'math' | null>('circuits');

  // Accordion open/close states
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Ohm's Law calculation
  const handleCalcOhm = () => {
    const V = parseFloat(ohmV);
    const I = parseFloat(ohmI);
    const R = parseFloat(ohmR);
    const filled = [!isNaN(V), !isNaN(I), !isNaN(R)].filter(Boolean).length;

    if (filled < 2) {
      setOhmRes('❌ הזן לפחות 2 ערכים');
      return;
    }

    if (isNaN(V)) {
      setOhmRes(`V = ${(I * R).toFixed(4)} V  |  P = ${(I * I * R).toFixed(4)} W`);
    } else if (isNaN(I)) {
      setOhmRes(`I = ${(V / R).toFixed(4)} A  |  P = ${(V * V / R).toFixed(4)} W`);
    } else if (isNaN(R)) {
      setOhmRes(`R = ${(V / I).toFixed(4)} Ω  |  P = ${(V * I).toFixed(4)} W`);
    } else {
      setOhmRes(`P = ${(V * I).toFixed(4)} W`);
    }
  };

  // RC Time Constant calculation
  const handleCalcRC = () => {
    const R = parseFloat(rcR);
    const C = parseFloat(rcC);
    if (isNaN(R) || isNaN(C)) {
      setRcRes('❌ הזן R ו-C');
      return;
    }
    const tau = R * C;
    const fc = 1 / (2 * Math.PI * tau);
    setRcRes(`τ = ${tau.toExponential(3)} s  |  fc = ${fc.toExponential(3)} Hz`);
  };

  // dB calculation
  const handleCalcDB = () => {
    const val = parseFloat(dbVal);
    if (isNaN(val) || val <= 0) {
      setDbRes('❌ הזן יחס חיובי');
      return;
    }
    const db = dbType === 'power' ? 10 * Math.log10(val) : 20 * Math.log10(val);
    setDbRes(`${db.toFixed(3)} dB (${dbType === 'power' ? 'הספק' : 'מתח'})`);
  };

  // Unit prefix conversion
  const handleCalcPrefix = () => {
    const val = parseFloat(prefVal);
    const from = parseFloat(prefFrom);
    const to = parseFloat(prefTo);
    if (isNaN(val)) {
      setPrefRes('❌ הזן ערך');
      return;
    }
    const result = (val * from) / to;
    setPrefRes(`${val} × ${(from / to).toExponential(0)} = ${result.toPrecision(6)}`);
  };

  // Frequency ↔ Period calculation
  const handleCalcFreqTime = () => {
    const val = parseFloat(ftVal);
    const unit = parseFloat(ftUnit);
    if (isNaN(val) || val <= 0) {
      setFtRes('❌ הזן ערך חיובי');
      return;
    }

    if (ftMode === 'f2t') {
      const f_hz = val * unit;
      const T_s = 1 / f_hz;
      const T_display = T_s * unit;
      const unitLabel = unit === 1 ? 's' : unit === 1e3 ? 'ms' : unit === 1e6 ? 'μs' : 'ns';
      const freqLabel = unit === 1 ? 'Hz' : unit === 1e3 ? 'kHz' : unit === 1e6 ? 'MHz' : 'GHz';
      setFtRes(`T = ${T_display.toPrecision(4)} ${unitLabel}  (f = ${val} ${freqLabel})`);
    } else {
      const T_s = val / unit;
      const f_hz = 1 / T_s;
      const f_disp = f_hz / unit;
      const unitLabel = unit === 1 ? 'Hz' : unit === 1e3 ? 'kHz' : unit === 1e6 ? 'MHz' : 'GHz';
      const tLabel = unit === 1 ? 's' : unit === 1e3 ? 'ms' : unit === 1e6 ? 'μs' : 'ns';
      setFtRes(`f = ${f_disp.toPrecision(4)} ${unitLabel}  (T = ${val} ${tLabel})`);
    }
  };

  // Base Converter values
  const getBaseConvContent = () => {
    const raw = baseVal.trim();
    if (!raw) return <span className="text-slate-400">הזן מספר למעלה</span>;
    const fromB = parseInt(baseFrom, 10);
    const num = parseInt(raw, fromB);
    if (isNaN(num)) return <span className="text-red-400">❌ ערך לא חוקי בבסיס זה</span>;
    return (
      <div className="space-y-1 text-right text-xs leading-relaxed">
        <div><strong className="text-cyan-400">DEC:</strong> {num}</div>
        <div><strong className="text-emerald-400">BIN:</strong> {num.toString(2)}</div>
        <div><strong className="text-amber-400">HEX:</strong> {num.toString(16).toUpperCase()}</div>
        <div><strong className="text-pink-400">OCT:</strong> {num.toString(8)}</div>
      </div>
    );
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => (prev === name ? null : name));
  };

  // Parallel resistors calculation
  const handleCalcParallel = () => {
    const vals = paraVal.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    if (vals.length < 2) {
      setParaRes('❌ הזן לפחות 2 ערכים מופרדים בפסיק');
      return;
    }
    const sumInverse = vals.reduce((acc, curr) => acc + (1 / curr), 0);
    if (sumInverse === 0) {
      setParaRes('❌ שגיאה: חלוקה באפס');
      return;
    }
    const req = 1 / sumInverse;
    setParaRes(`Req = ${req.toFixed(4)} Ω`);
  };

  // Voltage divider calculation
  const handleCalcDivider = () => {
    const vin = parseFloat(divVin);
    const r1 = parseFloat(divR1);
    const r2 = parseFloat(divR2);
    if (isNaN(vin) || isNaN(r1) || isNaN(r2)) {
      setDivRes('❌ הזן את כל הערכים');
      return;
    }
    if (r1 + r2 === 0) {
      setDivRes('❌ שגיאה: R1 + R2 = 0');
      return;
    }
    const vout = vin * (r2 / (r1 + r2));
    setDivRes(`Vout = ${vout.toFixed(4)} V`);
  };

  return (
    <div className="space-y-6">
      {/* CATEGORY 1: Circuits and Devices */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-2.5 space-y-2">
        <button
          onClick={() => setOpenCat(openCat === 'circuits' ? null : 'circuits')}
          className={`w-full p-2 text-right text-xs font-bold flex items-center justify-between rounded-xl transition-all ${
            openCat === 'circuits' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <span className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>מעגלים והתקנים</span>
          </span>
          <span>{openCat === 'circuits' ? '▲' : '▼'}</span>
        </button>

        {openCat === 'circuits' && (
          <div className="space-y-4 pt-2 border-t border-slate-900/60 animate-fadeIn px-1">
            {/* 1. Ohm's Law */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <Zap className="h-4 w-4 text-emerald-400" /> חוק אוהם
              </h4>
              <div className="space-y-2">
                <label htmlFor="ohmV" className="sr-only">מתח V [V]</label>
                <input
                  id="ohmV"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="מתח V [V]"
                  value={ohmV}
                  onChange={e => setOhmV(e.target.value)}
                />
                <label htmlFor="ohmI" className="sr-only">זרם I [A]</label>
                <input
                  id="ohmI"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="זרם I [A]"
                  value={ohmI}
                  onChange={e => setOhmI(e.target.value)}
                />
                <label htmlFor="ohmR" className="sr-only">נגדות R [Ω]</label>
                <input
                  id="ohmR"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="נגדות R [Ω]"
                  value={ohmR}
                  onChange={e => setOhmR(e.target.value)}
                />
                <button
                  onClick={handleCalcOhm}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  חשב
                </button>
                {ohmRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-200 word-break">
                    {ohmRes}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Parallel Resistors */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <Cpu className="h-4 w-4 text-emerald-400" /> נגדים במקביל (Req)
              </h4>
              <div className="space-y-2">
                <label htmlFor="paraVal" className="sr-only">ערכים מופרדים בפסיקים (לדוגמה: 10,20,30)</label>
                <input
                  id="paraVal"
                  type="text"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="ערכים מופרדים בפסיקים (לדוגמה: 10,20,30)"
                  value={paraVal}
                  onChange={e => setParaVal(e.target.value)}
                />
                <button
                  onClick={handleCalcParallel}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  חשב
                </button>
                {paraRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-250 word-break">
                    {paraRes}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Voltage Divider */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <Zap className="h-4 w-4 text-emerald-400" /> מחלק מתח
              </h4>
              <div className="space-y-2">
                <label htmlFor="divVin" className="sr-only">מתח כניסה Vin [V]</label>
                <input
                  id="divVin"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="מתח כניסה Vin [V]"
                  value={divVin}
                  onChange={e => setDivVin(e.target.value)}
                />
                <label htmlFor="divR1" className="sr-only">נגד עליון R1 [Ω]</label>
                <input
                  id="divR1"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="נגד עליון R1 [Ω]"
                  value={divR1}
                  onChange={e => setDivR1(e.target.value)}
                />
                <label htmlFor="divR2" className="sr-only">נגד תחתון R2 [Ω]</label>
                <input
                  id="divR2"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="נגד תחתון R2 [Ω]"
                  value={divR2}
                  onChange={e => setDivR2(e.target.value)}
                />
                <button
                  onClick={handleCalcDivider}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  חשב מתח מוצא
                </button>
                {divRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-250 word-break">
                    {divRes}
                  </div>
                )}
              </div>
            </div>

            {/* 4. RC Time Constant */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <Activity className="h-4 w-4 text-emerald-400" /> קבוע זמן RC
              </h4>
              <div className="space-y-2">
                <label htmlFor="rcR" className="sr-only">R [Ω]</label>
                <input
                  id="rcR"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="R [Ω]"
                  value={rcR}
                  onChange={e => setRcR(e.target.value)}
                />
                <label htmlFor="rcC" className="sr-only">C [F]</label>
                <input
                  id="rcC"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="C [F]"
                  value={rcC}
                  onChange={e => setRcC(e.target.value)}
                />
                <button
                  onClick={handleCalcRC}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  חשב
                </button>
                {rcRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-400 word-break">
                    {rcRes}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CATEGORY 2: Signals and Comm */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-2.5 space-y-2">
        <button
          onClick={() => setOpenCat(openCat === 'signals' ? null : 'signals')}
          className={`w-full p-2 text-right text-xs font-bold flex items-center justify-between rounded-xl transition-all ${
            openCat === 'signals' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <span className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-400" />
            <span>אותות ותקשורת</span>
          </span>
          <span>{openCat === 'signals' ? '▲' : '▼'}</span>
        </button>

        {openCat === 'signals' && (
          <div className="space-y-4 pt-2 border-t border-slate-900/60 animate-fadeIn px-1">
            {/* 5. dB Converter */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <BarChart2 className="h-4 w-4 text-emerald-400" /> ממיר dB
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label htmlFor="dbVal" className="sr-only">יחס</label>
                  <input
                    id="dbVal"
                    type="number"
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="יחס"
                    value={dbVal}
                    onChange={e => setDbVal(e.target.value)}
                  />
                  <label htmlFor="dbType" className="sr-only">סוג</label>
                  <select
                    id="dbType"
                    className="w-20 rounded-lg border border-slate-800 bg-slate-950 p-2 text-[10px] text-white focus:border-emerald-500 focus:outline-none"
                    value={dbType}
                    onChange={e => setDbType(e.target.value as any)}
                  >
                    <option value="voltage">מתח</option>
                    <option value="power">הספק</option>
                  </select>
                </div>
                <button
                  onClick={handleCalcDB}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  המר ל-dB
                </button>
                {dbRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-400 word-break">
                    {dbRes}
                  </div>
                )}
              </div>
            </div>

            {/* 6. Frequency ↔ Period */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <RefreshCw className="h-4 w-4 text-emerald-400" /> תדר ↔ זמן מחזור
              </h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label htmlFor="ftVal" className="sr-only">ערך</label>
                  <input
                    id="ftVal"
                    type="number"
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="ערך"
                    value={ftVal}
                    onChange={e => setFtVal(e.target.value)}
                  />
                  <label htmlFor="ftMode" className="sr-only">מצב המרה</label>
                  <select
                    id="ftMode"
                    className="w-20 rounded-lg border border-slate-800 bg-slate-950 p-2 text-[10px] text-white focus:border-emerald-500 focus:outline-none"
                    value={ftMode}
                    onChange={e => setFtMode(e.target.value as any)}
                  >
                    <option value="f2t">f → T</option>
                    <option value="t2f">T → f</option>
                  </select>
                </div>
                <label htmlFor="ftUnit" className="sr-only">יחידת מידה</label>
                <select
                  id="ftUnit"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-[10px] text-white focus:border-emerald-500 focus:outline-none"
                  value={ftUnit}
                  onChange={e => setFtUnit(e.target.value)}
                >
                  <option value="1">Hz / s</option>
                  <option value="1e3">kHz / ms</option>
                  <option value="1e6">MHz / μs</option>
                  <option value="1e9">GHz / ns</option>
                </select>
                <button
                  onClick={handleCalcFreqTime}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  המר
                </button>
                {ftRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-400 word-break">
                    {ftRes}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CATEGORY 3: Math and Digital Systems */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-2.5 space-y-2">
        <button
          onClick={() => setOpenCat(openCat === 'math' ? null : 'math')}
          className={`w-full p-2 text-right text-xs font-bold flex items-center justify-between rounded-xl transition-all ${
            openCat === 'math' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <span className="flex items-center gap-2">
            <Binary className="h-4 w-4 text-emerald-400" />
            <span>כלים מתמטיים וספרתיים</span>
          </span>
          <span>{openCat === 'math' ? '▲' : '▼'}</span>
        </button>

        {openCat === 'math' && (
          <div className="space-y-4 pt-2 border-t border-slate-900/60 animate-fadeIn px-1">
            {/* 7. Unit Prefix Converter */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <Compass className="h-4 w-4 text-emerald-400" /> המרת קידומות
              </h4>
              <div className="space-y-2">
                <label htmlFor="prefVal" className="sr-only">ערך להמרה</label>
                <input
                  id="prefVal"
                  type="number"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="ערך"
                  value={prefVal}
                  onChange={e => setPrefVal(e.target.value)}
                />
                <div className="flex gap-2">
                  <label htmlFor="prefFrom" className="sr-only">מקידומת</label>
                  <select
                    id="prefFrom"
                    className="flex-grow rounded-lg border border-slate-800 bg-slate-950 p-2 text-[10px] text-white focus:border-emerald-500/30 focus:outline-none"
                    value={prefFrom}
                    onChange={e => setPrefFrom(e.target.value)}
                  >
                    <option value="1e12">T (טרה)</option>
                    <option value="1e9">G (ג'יגה)</option>
                    <option value="1e6">M (מגה)</option>
                    <option value="1e3">k (קילו)</option>
                    <option value="1">— (בסיס)</option>
                    <option value="1e-3">m (מילי)</option>
                    <option value="1e-6">μ (מיקרו)</option>
                    <option value="1e-9">n (ננו)</option>
                    <option value="1e-12">p (פיקו)</option>
                  </select>
                  <label htmlFor="prefTo" className="sr-only">לקידומת</label>
                  <select
                    id="prefTo"
                    className="flex-grow rounded-lg border border-slate-800 bg-slate-950 p-2 text-[10px] text-white focus:border-emerald-500 focus:outline-none"
                    value={prefTo}
                    onChange={e => setPrefTo(e.target.value)}
                  >
                    <option value="1e12">T (טרה)</option>
                    <option value="1e9">G (ג'יגה)</option>
                    <option value="1e6">M (מגה)</option>
                    <option value="1e3">k (קילו)</option>
                    <option value="1">— (בסיס)</option>
                    <option value="1e-3">m (מילי)</option>
                    <option value="1e-6">μ (מיקרו)</option>
                    <option value="1e-9">n (ננו)</option>
                    <option value="1e-12">p (פיקו)</option>
                  </select>
                </div>
                <button
                  onClick={handleCalcPrefix}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-[10px] font-bold text-white hover:bg-emerald-550 transition-colors"
                >
                  המר
                </button>
                {prefRes && (
                  <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-xs text-emerald-400 word-break">
                    {prefRes}
                  </div>
                )}
              </div>
            </div>

            {/* 8. Base Converter */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-200">
                <Binary className="h-4 w-4 text-emerald-400" /> המרת בסיסים
              </h4>
              <div className="space-y-2">
                <label htmlFor="baseVal" className="sr-only">הזן מספר</label>
                <input
                  id="baseVal"
                  type="text"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="הזן מספר"
                  value={baseVal}
                  onChange={e => setBaseVal(e.target.value)}
                />
                <label htmlFor="baseFrom" className="sr-only">בסיס מוצא</label>
                <select
                  id="baseFrom"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-[10px] text-white focus:border-emerald-500 focus:outline-none"
                  value={baseFrom}
                  onChange={e => setBaseFrom(e.target.value)}
                >
                  <option value="10">עשרוני (DEC)</option>
                  <option value="2">בינארי (BIN)</option>
                  <option value="16">הקסדצימלי (HEX)</option>
                  <option value="8">אוקטלי (OCT)</option>
                </select>
                <div className="mt-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-3">
                  {getBaseConvContent()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
