import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainHome from '../components/MainHome';

// ── Deterministic data so tests don't depend on the real large data files ─────

vi.mock('../data/courses', () => ({
  coursesData: {
    test_inst: {
      1: {
        1: [
          {
            title: 'מעגלים חשמליים',
            subtitle: 'Circuits',
            icon: '⚡',
            topics: ['חוק אוהם', 'חוק קירכהוף'],
          },
          {
            title: 'אינפי 1',
            subtitle: 'Calculus I',
            icon: '📐',
            topics: ['גבולות', 'נגזרות'],
          },
        ],
      },
    },
  },
}));

vi.mock('../data/enrichment', () => ({
  topicKnowledge: {
    'חוק אוהם': {
      course: 'מעגלים חשמליים',
      explain: 'מתח שווה לזרם כפול התנגדות',
      quizQuestion: 'מה נוסחת חוק אוהם?',
      quizAnswer: 'V=IR',
    },
  },
}));

// ─────────────────────────────────────────────────────────────────────────────

const defaultProps = {
  onSelectType: vi.fn(),
  onSelectSearchCourse: vi.fn(),
  onSelectSearchTopic: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Static rendering ─────────────────────────────────────────────────────────

describe('MainHome – static rendering', () => {
  it('renders the VOLTEACH brand name', () => {
    render(<MainHome {...defaultProps} />);
    expect(screen.getByText('VOLTEACH')).toBeInTheDocument();
  });

  it('renders a text input for search', () => {
    render(<MainHome {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the university selection button', () => {
    render(<MainHome {...defaultProps} />);
    expect(screen.getByText('אוניברסיטאות')).toBeInTheDocument();
  });

  it('renders the college selection button', () => {
    render(<MainHome {...defaultProps} />);
    expect(screen.getByText('מכללות אקדמיות')).toBeInTheDocument();
  });
});

// ─── Institution selection buttons ───────────────────────────────────────────

describe('MainHome – institution buttons', () => {
  it('calls onSelectType("uni") when the university button is clicked', async () => {
    const onSelectType = vi.fn();
    const user = userEvent.setup();
    render(<MainHome {...defaultProps} onSelectType={onSelectType} />);
    await user.click(screen.getByText('אוניברסיטאות'));
    expect(onSelectType).toHaveBeenCalledOnce();
    expect(onSelectType).toHaveBeenCalledWith('uni');
  });

  it('calls onSelectType("college") when the college button is clicked', async () => {
    const onSelectType = vi.fn();
    const user = userEvent.setup();
    render(<MainHome {...defaultProps} onSelectType={onSelectType} />);
    await user.click(screen.getByText('מכללות אקדמיות'));
    expect(onSelectType).toHaveBeenCalledOnce();
    expect(onSelectType).toHaveBeenCalledWith('college');
  });
});

// ─── Search functionality ─────────────────────────────────────────────────────

describe('MainHome – search', () => {
  it('does not show a dropdown for a single-character query', async () => {
    const user = userEvent.setup();
    render(<MainHome {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'מ');
    expect(screen.queryByText('📚 קורסים אקדמיים')).not.toBeInTheDocument();
    expect(screen.queryByText('⚡ נושאי ליבה ונוסחאות')).not.toBeInTheDocument();
  });

  it('shows a matching course title in the dropdown', async () => {
    const user = userEvent.setup();
    render(<MainHome {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'מעגל');
    expect(await screen.findByText('מעגלים חשמליים')).toBeInTheDocument();
  });

  it('shows a matching topic in the dropdown', async () => {
    const user = userEvent.setup();
    render(<MainHome {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'חוק');
    expect(await screen.findByText('חוק אוהם')).toBeInTheDocument();
  });

  it('calls onSelectSearchCourse when a course result is clicked', async () => {
    const onSelectSearchCourse = vi.fn();
    const user = userEvent.setup();
    render(
      <MainHome {...defaultProps} onSelectSearchCourse={onSelectSearchCourse} />
    );
    await user.type(screen.getByRole('textbox'), 'אינפי');
    await user.click(await screen.findByText('אינפי 1'));
    expect(onSelectSearchCourse).toHaveBeenCalledOnce();
    expect(onSelectSearchCourse).toHaveBeenCalledWith('אינפי 1');
  });

  it('calls onSelectSearchTopic when a topic result is clicked', async () => {
    const onSelectSearchTopic = vi.fn();
    const user = userEvent.setup();
    render(
      <MainHome {...defaultProps} onSelectSearchTopic={onSelectSearchTopic} />
    );
    await user.type(screen.getByRole('textbox'), 'אוהם');
    await user.click(await screen.findByText('חוק אוהם'));
    expect(onSelectSearchTopic).toHaveBeenCalledOnce();
    expect(onSelectSearchTopic).toHaveBeenCalledWith('מעגלים חשמליים', 'חוק אוהם');
  });

  it('closes the dropdown after selecting a course', async () => {
    const user = userEvent.setup();
    render(<MainHome {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'מעגל');
    await user.click(await screen.findByText('מעגלים חשמליים'));
    expect(screen.queryByText('📚 קורסים אקדמיים')).not.toBeInTheDocument();
  });
});
