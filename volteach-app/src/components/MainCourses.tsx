import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckSquare, Square, ThumbsUp, RefreshCw, ExternalLink, Award, Upload, FileText, Calendar, Link } from 'lucide-react';
import { Course, Institution, TopicKnowledge } from '../types';
import { collection, query, where, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UploadResourceModal } from './Modals';
import { ResourceCardSkeleton } from './SkeletonUI';

interface MainCoursesProps {
  institution: Institution;
  year: number;
  semester: number;
  coursesList: Course[];
  onBack: () => void;
  onOpenEnrichment: (courseTitle: string) => void;
  onOpenExam: (courseTitle: string) => void;
  onOpenTopic: (courseTitle: string, topicName: string) => void;
}

export default function MainCourses({
  institution,
  year,
  semester,
  coursesList,
  onBack,
  onOpenEnrichment,
  onOpenExam,
  onOpenTopic
}: MainCoursesProps) {
  const [topicKnowledge, setTopicKnowledge] = useState<Record<string, TopicKnowledge>>({});
  const [marathonCourse, setMarathonCourse] = useState<string | null>(null);
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [notebooks, setNotebooks] = useState<Record<string, { notes: string; formulas: string }>>({});
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const [resources, setResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [activeUploadCourse, setActiveUploadCourse] = useState<string | null>(null);

  useEffect(() => {
    import('../data/enrichment').then(m => setTopicKnowledge(m.topicKnowledge));
  }, []);

  // Subscribe to community resources
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    setResourcesLoading(true);
    try {
      const q = query(
        collection(db, 'community_resources'),
        where('institutionKey', '==', institution.key)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        // Sort by upvotes desc, then date desc
        list.sort((a, b) => {
          const diff = (b.upvotes || 0) - (a.upvotes || 0);
          if (diff !== 0) return diff;
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        });
        setResources(list);
        setResourcesLoading(false);
      }, (error) => {
        console.error('Firestore resources subscription error:', error);
        setResourcesLoading(false);
      });
    } catch (err) {
      console.error('Failed to set up community resources listener:', err);
      setResourcesLoading(false);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, [institution.key]);

  const handleUpvote = async (resourceId: string, currentUpvotes: number, upvotedBy: string[] = []) => {
    const curUser = auth.currentUser;
    if (!curUser) {
      showToast('עליך להתחבר כדי להצביע לחומרים לימודיים', 'error');
      return;
    }
    const resourceRef = doc(db, 'community_resources', resourceId);
    const hasUpvoted = upvotedBy.includes(curUser.uid);
    try {
      if (hasUpvoted) {
        await updateDoc(resourceRef, {
          upvotes: currentUpvotes - 1,
          upvotedBy: arrayRemove(curUser.uid)
        });
        showToast('הסרת את ההצבעה שלך', 'info');
      } else {
        await updateDoc(resourceRef, {
          upvotes: currentUpvotes + 1,
          upvotedBy: arrayUnion(curUser.uid)
        });
        showToast('תודה! הצבעתך נקלטה.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('שגיאה בעדכון ההצבעה', 'error');
    }
  };

  const YEAR_LABELS: Record<number, string> = { 1: "א'", 2: "ב'", 3: "ג'", 4: "ד'", 5: "ה'" };
  const SEM_LABELS: Record<number, string> = { 1: "א'", 2: "ב'" };

  // Load user configurations (completions, notebooks)
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('vt_progress');
      if (savedProgress) setCompletions(JSON.parse(savedProgress));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getNotebookKey = (courseTitle: string) => {
    return `${institution.key}_${courseTitle}_user_notebook`;
  };

  const getNotebookData = (courseTitle: string) => {
    if (notebooks[courseTitle]) return notebooks[courseTitle];
    try {
      const saved = localStorage.getItem(getNotebookKey(courseTitle));
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return { notes: '', formulas: '' };
  };

  const saveNotebookData = (courseTitle: string, notes: string, formulas: string) => {
    const updated = { notes, formulas };
    setNotebooks(prev => ({ ...prev, [courseTitle]: updated }));
    try {
      localStorage.setItem(getNotebookKey(courseTitle), JSON.stringify(updated));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        showToast('נפח האחסון המקומי מלא. לא ניתן לשמור את המחברת.', 'error');
      }
    }
  };

  const toggleTopic = (courseTitle: string, topic: string) => {
    const key = `${institution.key}_${courseTitle}_${topic}`;
    const nextVal = !completions[key];
    const updated = { ...completions, [key]: nextVal };
    setCompletions(updated);
    try {
      localStorage.setItem('vt_progress', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Compile Progress percentage
  const getProgressStats = () => {
    let total = 0;
    let completed = 0;
    coursesList.forEach(c => {
      c.topics.forEach(t => {
        total++;
        const key = `${institution.key}_${c.title}_${t}`;
        if (completions[key]) completed++;
      });
    });
    return {
      total,
      completed,
      pct: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  };

  const { pct, completed, total } = getProgressStats();

  // Render Math whenever component state adjustments occur
  useEffect(() => {
    setTimeout(() => {
      const win = window as any;
      if (win.renderMathInElement) {
        try {
          win.renderMathInElement(document.getElementById('coursesContainer'), {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {
          console.error(e);
        }
      }
    }, 100);
  }, [coursesList, marathonCourse, completions, notebooks, flippedCards]);

  const toggleMarathon = (courseTitle: string) => {
    setMarathonCourse(prev => (prev === courseTitle ? null : courseTitle));
  };

  const prefreshDrive = () => {
    const iframe = document.getElementById('driveIframe') as HTMLIFrameElement | null;
    if (iframe) {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    }
  };

  return (
    <section className="px-6 py-12 md:px-12">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>חזור לבחירת שנה וסמסטר</span>
      </button>

      {/* HEADER EXPOSITION */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-xs font-bold text-emerald-400">
          {institution.name} — שנה {YEAR_LABELS[year]} | סמסטר {SEM_LABELS[semester]}
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
          סנכרון תוכנית הלימודים
        </h2>
        <p className="mt-2 text-slate-400">
          בדוק את הנושאים שהשלמת ופתח סימולציות או חומרים מקוונים של הדרייב בתיקייה המוטמעת בסוף העמוד.
        </p>

        {/* PROGRESS METRIC BAR */}
        <div className="mx-auto mt-6 w-full max-w-md space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>התקדמות הסמסטר במוסד: {pct}%</span>
            <span>{completed} מתוך {total} נושאים</span>
          </div>
          <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* COURSES ITERATIVE LIST */}
      <div id="coursesContainer" className="mx-auto max-w-5xl space-y-12 mb-16">
        {coursesList.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
            <div className="text-4xl">📚</div>
            <h3 className="mt-2 text-lg font-bold text-white">חומרים בהכנה</h3>
            <p className="mt-1 text-sm">התוכנים למוסד זה וסמסטר זה יתווספו לקטלוג בקרוב.</p>
          </div>
        ) : (
          coursesList.map((c, idx) => {
            const nb = getNotebookData(c.title);
            const isMarathonActive = marathonCourse === c.title;

            return (
              <div
                key={c.title}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/20 shadow-xl"
              >
                {/* Course Header Banner */}
                <div className="relative flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{c.icon}</span>
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-white sm:text-xl">{c.title}</h3>
                      {c.subtitle && <p className="text-xs text-slate-500 font-mono mt-0.5">{c.subtitle}</p>}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* CHECKLIST OR EXTRA MARATHON FLASHCARDS */}
                  {isMarathonActive ? (
                    <div>
                      <div className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5" />
                        <span>קלפי שינון - מצב מרתון בחינה מקצועי (עבור על המושגים שלפני פתרון המבחן)</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {c.topics.map(t => {
                          const kb = topicKnowledge[t];
                          const flipped = flippedCards[`${c.title}_${t}`] || false;
                          return (
                            <div
                              key={t}
                              onClick={() => setFlippedCards(p => ({ ...p, [`${c.title}_${t}`]: !flipped }))}
                              className={`relative min-h-[160px] cursor-pointer rounded-2xl border transition-all duration-500 [transform-style:preserve-3d] ${
                                flipped ? '[transform:rotateY(180deg)] border-emerald-500 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/40'
                              }`}
                            >
                              {/* Front */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center [backface-visibility:hidden]">
                                <h4 className="text-sm font-bold text-white leading-relaxed">{t}</h4>
                                <span className="absolute bottom-3 text-[10px] text-cyan-400 font-semibold tracking-wide">לחץ להפיכה ›</span>
                              </div>

                              {/* Back */}
                              <div className="absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto">
                                <div>
                                  <h4 className="text-xs font-bold text-emerald-400 mb-1.5">{t}</h4>
                                  <div className="text-xs text-slate-300 leading-relaxed max-h-[100px] overflow-y-auto">
                                    {kb ? (
                                      kb.explain
                                    ) : (
                                      <div className="flex flex-col items-center justify-center space-y-3 mt-2">
                                        <p className="text-slate-400 text-center">הסבר טרם סוכם.</p>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenTopic(c.title, t);
                                          }}
                                          className="rounded-full bg-indigo-600 hover:bg-indigo-500 py-1.5 px-4 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
                                        >
                                          <span>✨</span>
                                          <span>ג'נרט הסבר AI</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {kb && kb.formula && (
                                  <div className="mt-2 text-center text-xs text-slate-100 font-mono bg-slate-950/40 py-1 rounded direction-ltr">
                                    {`$$${kb.formula}$$`}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        נושאי ליבה בסילבוס
                      </div>
                      <ul className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800/60 bg-slate-900/30">
                        {c.topics.map(t => {
                          const key = `${institution.key}_${c.title}_${t}`;
                          const isDone = completions[key] || false;
                          return (
                            <li
                              key={t}
                              className="group flex items-center justify-between p-4.5 hover:bg-slate-900/40 transition-all font-medium text-slate-350"
                            >
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTopic(c.title, t);
                                  }}
                                  className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                  aria-label={`סמן נושא ${t} כהושלם`}
                                >
                                  {isDone ? (
                                    <CheckSquare className="h-5 w-5 text-emerald-400" />
                                  ) : (
                                    <Square className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => onOpenTopic(c.title, t)}
                                  className={`text-sm text-right ${isDone ? 'line-through text-slate-550' : 'group-hover:text-white transition-colors'} cursor-pointer`}
                                >
                                  {t}
                                </button>
                              </div>
                              <button
                                onClick={() => onOpenTopic(c.title, t)}
                                className="text-xs text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                פתח הסבר ⚡
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* ACTION CONTROLS */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      onClick={() => onOpenEnrichment(c.title)}
                      className="rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-950/30 hover:bg-slate-950 p-3 text-xs font-bold text-white transition-all active:scale-95"
                    >
                      📚 תוכן אקדמי ויוטיוב חיצוני
                    </button>
                    <button
                      onClick={() => onOpenExam(c.title)}
                      className="rounded-2xl bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-500 hover:to-pink-400 p-3 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                    >
                      📝 פתח סימולטור בחינה
                    </button>
                    <button
                      onClick={() => toggleMarathon(c.title)}
                      className={`rounded-2xl border p-3 text-xs font-bold transition-all shadow-md active:scale-95 ${
                        isMarathonActive
                          ? 'bg-amber-500 border-amber-400 text-slate-950'
                          : 'bg-gradient-to-r from-emerald-700 to-teal-800 border-emerald-600/40 text-rose-100'
                      }`}
                    >
                      ⏱️ {isMarathonActive ? 'סגור קלפי שינון' : 'קלפי שינון למרתון'}
                    </button>
                  </div>

                  {/* COLLABORATIVE STUDY REPOSITORY (AI) */}
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="text-right">
                        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                          <FileText className="h-4.5 w-4.5 text-emerald-400" />
                          <span>מאגר חומרי לימוד שיתופי (קהילה & AI)</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">סיכומים, פתרונות ומטלות ששותפו על ידי הסטודנטים בקורס זה.</p>
                      </div>
                      <button
                        onClick={() => {
                          if (!auth.currentUser) {
                            showToast('אנא התחבר לחשבונך כדי לשתף חומרים', 'error');
                          } else {
                            setActiveUploadCourse(c.title);
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 py-1.5 px-3 text-[11px] font-bold text-white transition-all shadow-sm self-start sm:self-center"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>שתף קובץ מהדרייב</span>
                      </button>
                    </div>

                    {/* Resources list */}
                    {resourcesLoading ? (
                      <ResourceCardSkeleton />
                    ) : resources.filter(r => r.courseTitle === c.title).length === 0 ? (
                      <p className="text-xs text-slate-500 py-2 text-center">אין עדיין חומרים משותפים לקורס זה. היה הראשון לשתף! ⚡</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {resources.filter(r => r.courseTitle === c.title).map(r => {
                          const hasUpvoted = r.upvotedBy?.includes(auth.currentUser?.uid || '');
                          return (
                            <div key={r.id} className="flex items-center justify-between rounded-2xl border border-slate-850 bg-slate-900/30 p-3 hover:border-slate-800 transition-all">
                              <a
                                href={r.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 min-w-0 flex-1 hover:text-emerald-400 transition-colors"
                              >
                                <div className="text-xl shrink-0">
                                  {r.category === 'exam' ? '📝' : r.category === 'exercise' ? '✏️' : '📘'}
                                </div>
                                <div className="min-w-0 text-right">
                                  <p className="text-xs font-bold text-slate-200 truncate">{r.title}</p>
                                  <p className="text-[9px] text-slate-500 truncate">הועלה ע"י {r.contributorName}</p>
                                </div>
                              </a>

                              <button
                                onClick={() => handleUpvote(r.id, r.upvotes || 0, r.upvotedBy || [])}
                                className={`flex items-center gap-1 rounded-xl py-1 px-2.5 text-[10px] font-bold transition-all border ${
                                  hasUpvoted
                                    ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400'
                                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                <ThumbsUp className="h-3 w-3" />
                                <span>{r.upvotes || 0}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* USER NOTEBOOK PAD */}
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-emerald-400">
                        📖 פנקס למידה ונוסחאות מותאמות
                      </h4>
                      <span className="text-[10px] text-slate-500">נשמר באופן מקומי מיידית</span>
                    </div>

                    <textarea
                      placeholder="הערות אישיות לקורס, נושאים קשים לשיפור..."
                      value={nb.notes}
                      onChange={e => saveNotebookData(c.title, e.target.value, nb.formulas)}
                      className="w-full h-20 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="רשימת נוסחאות (לדוגמה: $$ V_{th} = V_{oc} $$)"
                        value={nb.formulas}
                        onChange={e => saveNotebookData(c.title, nb.notes, e.target.value)}
                        className="w-full rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                      />

                      {/* LIVE MATH PREVIEW WINDOW */}
                      {nb.formulas && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-3.5 text-center text-xs text-emerald-400 whitespace-preword direction-ltr">
                          {nb.formulas.includes('$') ? nb.formulas : `$$${nb.formulas}$$`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EMBED GOOGLE DRIVE DIRECTORY */}
      {coursesList.length > 0 && (
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/20 p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row">
            <div className="text-right">
              <h3 className="text-lg font-bold text-white">📁 חומרי לימוד וסמסטר — Google Drive</h3>
              <p className="text-xs text-slate-500">מצגות, תרגולים ומבחנים ישירים של הקורסים בסמסטר הנוכחי.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prefreshDrive}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 transition-all hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>רענן תצוגה</span>
              </button>
              <a
                href={`https://drive.google.com/drive/folders/${institution.driveId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:opacity-95"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>פתח בדרייב מלא</span>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
            <iframe
              src={`https://drive.google.com/embeddedfolderview?id=${institution.driveId}#grid`}
              className="w-full h-[500px]"
              frameBorder="0"
              id="driveIframe"
              title="תצוגת חומרי לימוד גוגל דרייב"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      )}
      {/* UPLOAD MODAL POPUP */}
      {activeUploadCourse && (
        <UploadResourceModal
          isOpen={!!activeUploadCourse}
          onClose={() => setActiveUploadCourse(null)}
          institution={institution}
          courseTitle={activeUploadCourse}
          user={auth.currentUser}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}
    </section>
  );
}

const showToast = (msg: string, type: 'info' | 'error' | 'success') => {
  const customEvent = new CustomEvent('show-toast', { detail: { msg, type } });
  window.dispatchEvent(customEvent);
};
