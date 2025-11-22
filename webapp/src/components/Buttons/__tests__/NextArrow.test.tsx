import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextArrow } from '@components/Buttons/NextArrow';

// Mock the Link component
jest.mock('@tanstack/react-router', () => ({
  Link: jest.fn(({ children, to, params }) => (
    <a href={`${to.replace('$id', params?.id)}`}>{children}</a>
  ))
}));

describe('NextArrow', () => {
  it('renders a Link when nextIdx is valid and less than max', () => {
    render(<NextArrow nextIdx={1} max={2} />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/entity/1');
  });

  it('renders a span when nextIdx is undefined', () => {
    render(<NextArrow nextIdx={undefined} max={2} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('_')).toBeInTheDocument();
  });

  it('renders a span when nextIdx equals max', () => {
    render(<NextArrow nextIdx={2} max={2} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('_')).toBeInTheDocument();
  });

  it('renders a span when nextIdx is greater than max', () => {
    render(<NextArrow nextIdx={3} max={2} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('_')).toBeInTheDocument();
  });

  it('renders the arrow icon when Link is present', () => {
    render(<NextArrow nextIdx={1} max={2} />);
    
    const icon = document.querySelector('.arrow-btn');
    expect(icon).toBeInTheDocument();
  });
});
