import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

export type VitalRating = 'good' | 'needs-improvement' | 'poor';

export interface VitalEntry {
  name: string;
  value: number;
  rating: VitalRating;
  unit: string;
}

const UNITS: Record<string, string> = {
  LCP: 'ms', INP: 'ms', FCP: 'ms', TTFB: 'ms', CLS: '',
};

// Stable snapshot cache — avoids referential churn for subscribers
let cachedSnapshot: VitalEntry[] = [];
const store = new Map<string, VitalEntry>();
const listeners = new Set<() => void>();

export const subscribeVitals = (cb: () => void): (() => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const getVitalsSnapshot = (): VitalEntry[] => cachedSnapshot;

function onMetric(metric: Metric): void {
  const entry: VitalEntry = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    unit: UNITS[metric.name] ?? '',
  };

  store.set(metric.name, entry);
  cachedSnapshot = Array.from(store.values());
  listeners.forEach(cb => cb());

  if (import.meta.env.DEV) {
    const color =
      metric.rating === 'good' ? '#10b981' :
      metric.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444';
    const badge =
      metric.rating === 'good' ? '✅' :
      metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(
      `%c[Web Vitals] %c${metric.name}%c  ${UNITS[metric.name] === 'ms' ? `${Math.round(metric.value)} ms` : metric.value.toFixed(3)}  ${badge}`,
      'color:#6366f1;font-weight:bold',
      `color:${color};font-weight:bold;font-size:13px`,
      'color:#94a3b8',
    );
  }

  // Production: send to /api/vitals via sendBeacon (non-blocking, best-effort)
  if (!import.meta.env.DEV && navigator.sendBeacon) {
    const payload = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      path: location.pathname,
    });
    navigator.sendBeacon(
      '/api/vitals',
      new Blob([payload], { type: 'application/json' }),
    );
  }
}

export function initVitals(): void {
  onLCP(onMetric);
  onINP(onMetric);
  onCLS(onMetric);
  onFCP(onMetric);
  onTTFB(onMetric);
}
