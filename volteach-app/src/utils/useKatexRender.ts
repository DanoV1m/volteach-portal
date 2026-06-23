import { useEffect, type RefObject } from 'react';

type KatexDelimiter = { left: string; right: string; display: boolean };

const DEFAULT_DELIMITERS: KatexDelimiter[] = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
];

export function useKatexRender(
  ref: RefObject<HTMLElement | null>,
  deps: readonly unknown[],
  delimiters: KatexDelimiter[] = DEFAULT_DELIMITERS,
): void {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const frameId = requestAnimationFrame(() => {
      const win = window as any;
      if (win.renderMathInElement) {
        try {
          win.renderMathInElement(container, { delimiters, throwOnError: false });
        } catch { /* noop */ }
      }
    });
    return () => cancelAnimationFrame(frameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
}
