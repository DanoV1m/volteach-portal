import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  ResourceCardSkeleton,
  CoursePageSkeleton,
  FormulasPageSkeleton,
} from '../components/SkeletonUI';

// ─── ResourceCardSkeleton ─────────────────────────────────────────────────────

describe('ResourceCardSkeleton', () => {
  it('renders exactly 4 placeholder resource cards', () => {
    const { container } = render(<ResourceCardSkeleton />);
    const gridChildren = container.querySelector('.grid')?.children;
    expect(gridChildren?.length).toBe(4);
  });

  it('contains animated shimmer blocks', () => {
    const { container } = render(<ResourceCardSkeleton />);
    const shimmerBlocks = container.querySelectorAll('.skeleton-shimmer');
    expect(shimmerBlocks.length).toBeGreaterThan(0);
  });

  it('each card has an icon placeholder and a button placeholder', () => {
    const { container } = render(<ResourceCardSkeleton />);
    // Each card has a rounded-xl icon block + a rounded-xl action block
    const roundedXlBlocks = container.querySelectorAll('.rounded-xl');
    // 4 cards × 2 rounded-xl blocks (icon + button) = 8
    expect(roundedXlBlocks.length).toBeGreaterThanOrEqual(8);
  });
});

// ─── CoursePageSkeleton ───────────────────────────────────────────────────────

describe('CoursePageSkeleton', () => {
  it('renders exactly 3 course card skeletons', () => {
    const { container } = render(<CoursePageSkeleton />);
    const cards = container.querySelectorAll('.rounded-3xl');
    expect(cards.length).toBe(3);
  });

  it('contains animated shimmer blocks', () => {
    const { container } = render(<CoursePageSkeleton />);
    const shimmerBlocks = container.querySelectorAll('.skeleton-shimmer');
    expect(shimmerBlocks.length).toBeGreaterThan(0);
  });

  it('each course card contains 5 topic-row shimmer lines', () => {
    const { container } = render(<CoursePageSkeleton />);
    // Each card body has 5 topic rows; 3 cards × 5 rows = 15 border-b rows
    const topicRows = container.querySelectorAll('.border-b.border-slate-800\\/50');
    expect(topicRows.length).toBe(15);
  });

  it('renders a back-button skeleton at the top', () => {
    const { container } = render(<CoursePageSkeleton />);
    const backBtn = container.querySelector('.rounded-full.mb-8');
    expect(backBtn).not.toBeNull();
  });
});

// ─── FormulasPageSkeleton ─────────────────────────────────────────────────────

describe('FormulasPageSkeleton', () => {
  it('renders exactly 4 folder card placeholders', () => {
    const { container } = render(<FormulasPageSkeleton />);
    const gridChildren = container.querySelector('.grid')?.children;
    expect(gridChildren?.length).toBe(4);
  });

  it('contains animated shimmer blocks', () => {
    const { container } = render(<FormulasPageSkeleton />);
    const shimmerBlocks = container.querySelectorAll('.skeleton-shimmer');
    expect(shimmerBlocks.length).toBeGreaterThan(0);
  });

  it('each folder card has the correct rounded border style', () => {
    const { container } = render(<FormulasPageSkeleton />);
    const folderCards = container.querySelectorAll('.rounded-3xl');
    expect(folderCards.length).toBe(4);
  });
});
