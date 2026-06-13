import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LazyImage from '../components/LazyImage';

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('LazyImage – rendering', () => {
  it('renders a wrapper div with the caller-supplied className', () => {
    const { container } = render(
      <LazyImage src="/logo.png" alt="logo" className="h-11 w-11 rounded-xl" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.classList.contains('h-11')).toBe(true);
    expect(wrapper.classList.contains('rounded-xl')).toBe(true);
  });

  it('always adds relative and overflow-hidden to the wrapper', () => {
    const { container } = render(<LazyImage src="/test.png" alt="test" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.classList.contains('relative')).toBe(true);
    expect(wrapper.classList.contains('overflow-hidden')).toBe(true);
  });

  it('renders an <img> element with the correct src and alt', () => {
    render(<LazyImage src="/logo.png" alt="VOLTEACH Logo" />);
    const img = screen.getByAltText('VOLTEACH Logo') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/logo.png');
  });

  it('shows the shimmer placeholder before the image loads', () => {
    const { container } = render(<LazyImage src="/logo.png" alt="logo" />);
    const shimmer = container.querySelector('.skeleton-shimmer');
    expect(shimmer).not.toBeNull();
  });
});

// ─── Loading behaviour ────────────────────────────────────────────────────────

describe('LazyImage – load state', () => {
  it('image starts with opacity-0 and becomes opacity-100 after onLoad', () => {
    render(<LazyImage src="/logo.png" alt="logo" />);
    const img = screen.getByAltText('logo') as HTMLImageElement;

    // Before load: should be invisible
    expect(img.classList.contains('opacity-0')).toBe(true);

    // Simulate browser firing the load event
    fireEvent.load(img);

    expect(img.classList.contains('opacity-100')).toBe(true);
    expect(img.classList.contains('opacity-0')).toBe(false);
  });

  it('hides the shimmer after the image loads', () => {
    const { container } = render(<LazyImage src="/logo.png" alt="logo" />);
    const img = screen.getByAltText('logo') as HTMLImageElement;

    fireEvent.load(img);

    expect(container.querySelector('.skeleton-shimmer')).toBeNull();
  });
});

// ─── Error behaviour ──────────────────────────────────────────────────────────

describe('LazyImage – error state', () => {
  it('renders the default broken-image icon on load error', () => {
    const { container } = render(<LazyImage src="/missing.png" alt="missing" />);
    const img = screen.getByAltText('missing') as HTMLImageElement;

    fireEvent.error(img);

    // The <img> should be removed from the DOM
    expect(screen.queryByAltText('missing')).toBeNull();
    // An SVG fallback icon should appear
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders a custom fallback node on error', () => {
    render(
      <LazyImage
        src="/missing.png"
        alt="missing"
        fallback={<span data-testid="custom-fallback">broken</span>}
      />
    );
    fireEvent.error(screen.getByAltText('missing'));
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });

  it('hides the shimmer after an error', () => {
    const { container } = render(<LazyImage src="/missing.png" alt="missing" />);
    fireEvent.error(screen.getByAltText('missing'));
    expect(container.querySelector('.skeleton-shimmer')).toBeNull();
  });
});

// ─── Priority / LCP hints ─────────────────────────────────────────────────────
// jsdom does not implement img.loading / img.decoding as live DOM properties,
// so we read the HTML attribute values directly via getAttribute().

describe('LazyImage – priority prop', () => {
  it('sets loading="eager" when priority is true', () => {
    render(<LazyImage src="/logo.png" alt="logo" priority />);
    const img = screen.getByAltText('logo');
    expect(img.getAttribute('loading')).toBe('eager');
  });

  it('sets loading="lazy" when priority is false (default)', () => {
    render(<LazyImage src="/below-fold.png" alt="below" />);
    const img = screen.getByAltText('below');
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('sets decoding="sync" for priority images', () => {
    render(<LazyImage src="/logo.png" alt="logo" priority />);
    const img = screen.getByAltText('logo');
    expect(img.getAttribute('decoding')).toBe('sync');
  });

  it('sets decoding="async" for non-priority images', () => {
    render(<LazyImage src="/below-fold.png" alt="below" />);
    const img = screen.getByAltText('below');
    expect(img.getAttribute('decoding')).toBe('async');
  });
});
