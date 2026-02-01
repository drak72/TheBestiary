import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButton } from '@components/buttons/ShareButton';

describe('ShareButton', () => {
  const urlToShare = 'https://example.com/entity/1';

  it('renders share button with dropdown', () => {
    render(<ShareButton urlToShare={urlToShare} />);
    expect(screen.getByTestId('share-dropdown-btn')).toBeInTheDocument();
  });

  it('shows dropdown content when clicked', () => {
    render(<ShareButton urlToShare={urlToShare} />);
    const button = screen.getByTestId('share-dropdown-btn');
    fireEvent.click(button);
    
    expect(screen.getByTestId('facebook-share')).toHaveAttribute(
      'href',
      expect.stringContaining('facebook.com/sharer.php')
    );
    expect(screen.getByTestId('reddit-share')).toHaveAttribute(
      'href',
      expect.stringContaining('reddit.com/submit')
    );
  });

  it('includes copy button in dropdown', () => {
    render(<ShareButton urlToShare={urlToShare} />);
    const button = screen.getByTestId('share-dropdown-btn');
    fireEvent.click(button);
    
    expect(screen.getByTestId('copy-url-btn')).toBeInTheDocument();
  });

  it('opens social links in new tab', () => {
    render(<ShareButton urlToShare={urlToShare} />);
    const button = screen.getByTestId('share-dropdown-btn');
    fireEvent.click(button);
    
    const fbLink = screen.getByTestId('facebook-share');
    const redditLink = screen.getByTestId('reddit-share');
    
    [fbLink, redditLink].forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
}); 