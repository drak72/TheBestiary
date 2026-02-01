import React from 'react';
import { render, screen } from '@testing-library/react';
import { PreviousArrow } from '@components/buttons/PreviousArrow';

// Mock the Link component
jest.mock('@tanstack/react-router', () => ({
  Link: jest.fn(({ children, to, params }) => (
    <a href={`${to.replace('$id', params?.id)}`}>{children}</a>
  ))
}));

describe('PreviousArrow', () => {
  it('renders a Link when prevIdx is valid and >= 0', () => {
    render(<PreviousArrow prevIdx={1} />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/entity/1');
  });

  it('renders a span when prevIdx is undefined', () => {
    render(<PreviousArrow prevIdx={undefined} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('_')).toBeInTheDocument();
  });

  it('renders a span when prevIdx is negative', () => {
    render(<PreviousArrow prevIdx={-1} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('_')).toBeInTheDocument();
  });

  it('renders the arrow icon when Link is present', () => {
    render(<PreviousArrow prevIdx={1} />);
    
    const icon = document.querySelector('.arrow-btn');
    expect(icon).toBeInTheDocument();
  });
}); 