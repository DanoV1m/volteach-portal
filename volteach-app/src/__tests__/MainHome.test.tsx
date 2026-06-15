import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainHome from '../components/MainHome';

const defaultProps = {
  onSelectType: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MainHome – static rendering', () => {
  it('renders the VOLTEACH brand name', () => {
    render(<MainHome {...defaultProps} />);
    expect(screen.getByText('VOLTEACH')).toBeInTheDocument();
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
