import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from '../utils/useFocusTrap';

// ── Test fixture component ────────────────────────────────────────────────────

function TrapFixture({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="trap">
      <button data-testid="btn1">First</button>
      <button data-testid="btn2">Second</button>
      <button data-testid="btn3">Last</button>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// The hook listens on `document` for keydown. Fire there without target
// override (jsdom doesn't allow setting the read-only target property).

function tabForward() {
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
}

function tabBackward() {
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useFocusTrap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('moves focus to the first focusable element when activated', () => {
    const { getByTestId } = render(<TrapFixture active />);
    expect(document.activeElement).toBe(getByTestId('btn1'));
  });

  it('does not steal focus when inactive', () => {
    const before = document.activeElement;
    render(<TrapFixture active={false} />);
    expect(document.activeElement).toBe(before);
  });

  it('wraps Tab from last element back to first', () => {
    const { getByTestId } = render(<TrapFixture active />);
    const last = getByTestId('btn3');
    last.focus();
    expect(document.activeElement).toBe(last);

    tabForward();
    expect(document.activeElement).toBe(getByTestId('btn1'));
  });

  it('wraps Shift+Tab from first element back to last', () => {
    const { getByTestId } = render(<TrapFixture active />);
    const first = getByTestId('btn1');
    first.focus();

    tabBackward();
    expect(document.activeElement).toBe(getByTestId('btn3'));
  });

  it('does not interfere with Tab when focus is on a middle element', () => {
    const { getByTestId } = render(<TrapFixture active />);
    const middle = getByTestId('btn2');
    middle.focus();
    expect(() => tabForward()).not.toThrow();
    // focus stays on middle (no wrapping for non-boundary elements)
    expect(document.activeElement).toBe(middle);
  });

  it('ignores non-Tab keys', () => {
    const { getByTestId } = render(<TrapFixture active />);
    const first = getByTestId('btn1');
    first.focus();
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(document.activeElement).toBe(first);
  });
});
