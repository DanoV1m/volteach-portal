import React from 'react';
import { Institution } from '../types';
import { ArrowLeft, ExternalLink, HardDrive } from 'lucide-react';

interface MainInstitutionsProps {
  type: 'uni' | 'college';
  institutionsList: Institution[];
  onBack: () => void;
  onSelectInstitution: (instKey: string) => void;
}

export default function MainInstitutions({
  type,
  institutionsList,
  onBack,
  onSelectInstitution
}: MainInstitutionsProps) {
  const filtered = institutionsList.filter(i => i.type === type);

  return (
    <section className="px-6 py-12 md:px-12">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>חזור לבחירה</span>
      </button>

      {/* SECTION HEADER */}
      <div className="mb-12 text-center">
        <div className="inline-block rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1 text-xs font-bold text-amber-400">
          {type === 'uni' ? '🏛️ אוניברסיטאות מובילות' : '🎓 מכללות מובילות'}
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
          בחר את מוסד הלימודים שלך
        </h2>
        <p className="mt-2 text-slate-400">
          לחץ על כפתור המוסד כדי לגשת למבנה תוכנית הלימודים, השנים והקורסים הספציפיים.
        </p>
      </div>

      {/* GRID */}
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((inst, idx) => (
          <div
            key={inst.key}
            onClick={() => onSelectInstitution(inst.key)}
            className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:shadow-2xl"
            style={{
              animation: 'slideUpFade 0.5s ease-out forwards',
              animationDelay: `${idx * 0.05}s`
            }}
          >
            <div>
              <div className="mb-4 text-4xl leading-none">{inst.emoji}</div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                {inst.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">📍 {inst.location}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {inst.programs.map(p => (
                  <span
                    key={p}
                    className="rounded bg-slate-950 px-2 py-1 text-[10px] text-slate-400"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2" onClick={e => e.stopPropagation()}>
              {/* MOODLE LOGO */}
              <a
                href={inst.moodleUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white transition-opacity hover:opacity-90"
                title="כניסה לפורטל Moodle"
              >
                <ExternalLink className="h-4.5 w-4.5" />
              </a>

              {/* DRIVE LINK */}
              <a
                href={`https://drive.google.com/drive/folders/${inst.driveId}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 py-2.5 text-xs font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                title="תיקיית גוגל דרייב"
              >
                <HardDrive className="h-4 w-4" />
                <span>GOOGLE DRIVE</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
