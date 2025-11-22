import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Appbar } from '@components/AppBar/Appbar';

// Mock the Link component
jest.mock('@tanstack/react-router', () => ({
  Link: jest.fn(({ children, to }) => (
    <a href={to}>{children}</a>
  ))
}));

describe('Appbar', () => {
  it('renders the brand title', () => {
    render(<Appbar />);
    expect(screen.getByText('TheBestiary.fyi')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Appbar />);
    expect(screen.getByText('A generative bestiary')).toBeInTheDocument();
  });

  it('renders navigation links when menu is opened', () => {
    render(<Appbar />);
    
    // Click hamburger menu
    const menuButton = screen.getByTestId('menu-toggle');
    fireEvent.click(menuButton);

    // Check for nav links
    const expectedLinks = ['Explore', 'Favorites', 'About'];
    expectedLinks.forEach(text => {
      expect(screen.getByRole('link', { name: text })).toBeInTheDocument();
    });
  });

  it('closes menu when clicking outside', () => {
    render(<Appbar />);
    
    // Open menu
    const menuButton = screen.getByTestId('menu-toggle');
    fireEvent.click(menuButton);
    
    // Click outside (the document body)
    fireEvent.click(document.body);
    
    // Menu should be closed (check CSS class)
    const menu = screen.getByRole('navigation');
    expect(menu).not.toHaveClass('open');
  });

  it('toggles menu open/closed when clicking hamburger', () => {
    render(<Appbar />);
    
    const menuButton = screen.getByTestId('menu-toggle');
    const menu = screen.getByTestId('navbar-menu');

    // Open menu
    fireEvent.click(menuButton);
    expect(menu).toHaveClass('navbar-menu', 'open');

    // Close menu
    fireEvent.click(menuButton);
    expect(menu).not.toHaveClass('open');
  });

  it('renders correct navigation links with proper hrefs', () => {
    render(<Appbar />);
    
    const menuButton = screen.getByTestId('menu-toggle');
    fireEvent.click(menuButton);

    const linkData = [
      ['Explore', '/explore'],
      ['Favorites', '/favorites'],
      ['About', '/about']
    ];

    linkData.forEach(([text, href]) => {
      const link = screen.getByRole('link', { name: text });
      expect(link).toHaveAttribute('href', href);
    });
  });
}); 