import React from 'react';

const Block = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

/** 2-column grid of resource card placeholders shown while community_resources loads */
export const ResourceCardSkeleton = () => (
  <div className="grid gap-2 sm:grid-cols-2">
    {[0, 1, 2, 3].map(i => (
      <div
        key={i}
        className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/30 p-3"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Block className="h-9 w-9 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <Block className="h-3 w-3/4" />
            <Block className="h-2.5 w-1/2" />
          </div>
        </div>
        <Block className="h-7 w-12 rounded-xl shrink-0 ml-2" />
      </div>
    ))}
  </div>
);

/** Full-page skeleton for the courses view (used as Suspense fallback) */
export const CoursePageSkeleton = () => (
  <section className="px-6 py-12 md:px-12">
    <Block className="mb-8 h-9 w-44 rounded-full" />

    <div className="mb-12 flex flex-col items-center gap-3">
      <Block className="h-6 w-56 rounded-full" />
      <Block className="mt-2 h-8 w-72 max-w-full" />
      <Block className="h-4 w-96 max-w-full" />
      <Block className="mt-4 h-5 w-full max-w-md rounded-full" />
    </div>

    <div className="mx-auto max-w-5xl space-y-10">
      {[0, 1, 2].map(i => (
        <div key={i} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-4 p-6 border-b border-slate-800/80">
            <Block className="h-10 w-10 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Block className="h-5 w-48" />
              <Block className="h-3 w-28" />
            </div>
          </div>
          <div className="p-6 space-y-0">
            {[0, 1, 2, 3, 4].map(j => (
              <div key={j} className="flex items-center gap-3 p-4 border-b border-slate-800/50">
                <Block className="h-5 w-5 rounded shrink-0" />
                <Block className={`h-3 ${j % 2 === 0 ? 'w-48' : 'w-64'} max-w-full`} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

/** Grid of folder-card placeholders shown while bookmarks load from Firestore */
export const FormulasPageSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2, 3].map(i => (
      <div
        key={i}
        className="flex flex-col items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/40 p-8"
      >
        <Block className="h-16 w-16 rounded-2xl" />
        <Block className="h-5 w-32" />
        <Block className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);
