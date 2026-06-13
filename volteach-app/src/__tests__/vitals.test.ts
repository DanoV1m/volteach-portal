import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { subscribeVitals, getVitalsSnapshot, initVitals } from '../utils/vitals';

// Mock every web-vitals observer so they don't try to use PerformanceObserver
vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}));

// Silence the [Web Vitals] console.log that fires in DEV mode
beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── subscribeVitals ──────────────────────────────────────────────────────────

describe('subscribeVitals', () => {
  it('returns an unsubscribe function', () => {
    const unsub = subscribeVitals(vi.fn());
    expect(typeof unsub).toBe('function');
    unsub();
  });

  it('unsubscribe function does not throw', () => {
    const unsub = subscribeVitals(vi.fn());
    expect(() => unsub()).not.toThrow();
  });

  it('does not call the subscriber immediately on registration', () => {
    const cb = vi.fn();
    subscribeVitals(cb);
    expect(cb).not.toHaveBeenCalled();
  });
});

// ─── getVitalsSnapshot ────────────────────────────────────────────────────────

describe('getVitalsSnapshot', () => {
  it('returns an array', () => {
    expect(Array.isArray(getVitalsSnapshot())).toBe(true);
  });

  it('returns the same array reference between calls when nothing changed', () => {
    const a = getVitalsSnapshot();
    const b = getVitalsSnapshot();
    expect(a).toBe(b);
  });
});

// ─── initVitals ───────────────────────────────────────────────────────────────

describe('initVitals', () => {
  it('registers all five web-vitals observers', () => {
    initVitals();
    expect(onLCP).toHaveBeenCalledTimes(1);
    expect(onINP).toHaveBeenCalledTimes(1);
    expect(onCLS).toHaveBeenCalledTimes(1);
    expect(onFCP).toHaveBeenCalledTimes(1);
    expect(onTTFB).toHaveBeenCalledTimes(1);
  });

  it('passes a function as the callback to every observer', () => {
    initVitals();
    for (const observer of [onLCP, onINP, onCLS, onFCP, onTTFB]) {
      const call = vi.mocked(observer).mock.calls[0];
      expect(call).toBeDefined();
      expect(typeof call![0]).toBe('function');
    }
  });

  it('notifies subscriber and updates snapshot when a metric arrives', () => {
    initVitals();

    // Grab the internal onMetric handler that was passed to onLCP
    const onMetric = vi.mocked(onLCP).mock.calls[0]?.[0];
    expect(onMetric).toBeTypeOf('function');

    const listener = vi.fn();
    const unsub = subscribeVitals(listener);

    // Simulate a real metric payload
    onMetric!({
      name: 'LCP',
      value: 2500,
      rating: 'needs-improvement',
      id: 'v3-test-lcp',
      navigationType: 'navigate',
      entries: [],
      delta: 2500,
    });

    expect(listener).toHaveBeenCalledOnce();

    // Snapshot must include the metric we just pushed
    const snapshot = getVitalsSnapshot();
    const lcpEntry = snapshot.find(e => e.name === 'LCP' && e.value === 2500);
    expect(lcpEntry).toBeDefined();
    expect(lcpEntry?.rating).toBe('needs-improvement');

    unsub();
  });

  it('stops notifying after unsubscribe', () => {
    initVitals();
    const onMetric = vi.mocked(onLCP).mock.calls[0]?.[0];

    const listener = vi.fn();
    const unsub = subscribeVitals(listener);

    // First metric — listener should fire
    onMetric!({ name: 'LCP', value: 1000, rating: 'good', id: 'a', navigationType: 'navigate', entries: [], delta: 1000 });
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();

    // Second metric — listener must NOT fire after unsubscribe
    onMetric!({ name: 'LCP', value: 2000, rating: 'needs-improvement', id: 'b', navigationType: 'navigate', entries: [], delta: 2000 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
