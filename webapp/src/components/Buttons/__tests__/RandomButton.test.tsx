import React from 'react';
import { render, screen } from '@testing-library/react';
import { RandomButton } from '@components/Buttons/RandomButton';

describe('RandomButton', () => {
  beforeEach(() => {
    // Mock Math.random to return a consistent value
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with correct href', () => {
    const max = 10;
    render(<RandomButton max={max} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/entity/5'); // 0.5 * 10 = 5
  });

  it('renders with sync icon', () => {
    render(<RandomButton max={10} />);
    const icon = document.querySelector('.card-btn');
    expect(icon).toBeInTheDocument();
  });
}); 