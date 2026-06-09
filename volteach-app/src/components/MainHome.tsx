import React, { useState, useRef, useEffect } from 'react';
import { Search, School, GraduationCap, BookOpen, Compass, Zap } from 'lucide-react';
import { coursesData } from '../data/courses';
import { topicKnowledge } from '../data/enrichment';

interface MainHomeProps {
  onSelectType: (type: 'uni' | 'college') => void;
  onSelectSearchCourse: (courseTitle: string) => void;
  onSelectSearchTopic: (courseTitle: string, topicName: string) => void;
}

export default function MainHome({
  onSelectType,
  onSelectSearchCourse,
  onSelectSearchTopic
}: MainHomeProps) {
  const [query, setQuery] = useState('');
  const [dropdownActive, setDropdownActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownActive(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple search indexing
  const getMatches = () => {
    if (query.trim().length < 2) return { courses: [], topics: [] };

    const q = query.toLowerCase();
    const matchedCoursesSet = new Set<string>();
    const matchedTopics: { topic: string; course: string }[] = [];

    // Search courses and topics in coursesData
    for (const inst in coursesData) {
      for (const year in coursesData[inst]) {
        for (const sem in coursesData[inst][year]) {
          const coursesList = coursesData[inst][year][sem];
          if (Array.isArray(coursesList)) {
            coursesList.forEach(course => {
              if (course.title.toLowerCase().includes(q)) {
                matchedCoursesSet.add(course.title);
              }
              if (course.topics) {
                course.topics.forEach(t => {
                  if (t.toLowerCase().includes(q)) {
                    matchedTopics.push({ topic: t, course: course.title });
                  }
                });
              }
            });
          }
        }
      }
    }

    // Fallback to static topicKnowledge
    for (const tKey in topicKnowledge) {
      if (tKey.toLowerCase().includes(q)) {
        if (!matchedTopics.some(item => item.topic === tKey)) {
          matchedTopics.push({ topic: tKey, course: topicKnowledge[tKey].course });
        }
      }
    }

    return {
      courses: Array.from(matchedCoursesSet).slice(0, 5),
      topics: matchedTopics.slice(0, 5)
    };
  };

  const { courses, topics } = getMatches();

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

        {/* SEARCH BLOCK */}
        <div ref={containerRef} className="relative mx-auto mt-8 w-full max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="חפש קורס או נושא (לדוגמה: אינפי, מעגלים, לפלס)..."
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setDropdownActive(true);
              }}
              onFocus={() => setDropdownActive(true)}
              className="w-full rounded-full border-none bg-slate-900/80 hover:bg-slate-900 p-5 px-8 pr-12 text-base text-white placeholder-slate-500 shadow-lg focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute right-5 top-5 h-5 w-5 text-slate-500" />
          </div>

          {/* SEARCH SUGGESTIONS DROPDOWN */}
          {dropdownActive && (courses.length > 0 || topics.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-3 max-h-[350px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl text-right z-50">
              {/* MATCHED COURSES */}
              {courses.length > 0 && (
                <div className="mb-4">
                  <div className="mb-2 border-b border-slate-900 pb-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    📚 קורסים אקדמיים
                  </div>
                  <div className="space-y-1">
                    {courses.map(title => (
                      <div
                        key={title}
                        onClick={() => {
                          onSelectSearchCourse(title);
                          setDropdownActive(false);
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900/40 p-3 hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-emerald-400" />
                          <div>
                            <div className="text-sm font-semibold text-white">{title}</div>
                            <div className="text-xs text-slate-500">קורס לימוד שלם</div>
                          </div>
                        </div>
                        <span className="text-emerald-400 text-xs font-mono">פתח ↗</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MATCHED TOPICS */}
              {topics.length > 0 && (
                <div>
                  <div className="mb-2 border-b border-slate-900 pb-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    ⚡ נושאי ליבה ונוסחאות
                  </div>
                  <div className="space-y-1">
                    {topics.map(({ topic, course }) => (
                      <div
                        key={topic}
                        onClick={() => {
                          onSelectSearchTopic(course, topic);
                          setDropdownActive(false);
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900/40 p-3 hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Compass className="h-5 w-5 text-cyan-400" />
                          <div>
                            <div className="text-sm font-semibold text-white">{topic}</div>
                            <div className="text-xs text-slate-500">{course}</div>
                          </div>
                        </div>
                        <span className="text-cyan-400 text-xs font-mono">מצב לימוד ↗</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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
