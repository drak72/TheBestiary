// src/components/buttons/__tests__/CopyButton.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CopyUrlButton } from '@components/buttons/CopyButton';

describe('CopyUrlButton', () => {
  it('renders the button', () => {
    render(<CopyUrlButton urlToShare="https://example.com" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('copies the URL to clipboard when button is clicked', async () => {
    render(<CopyUrlButton urlToShare="https://example.com" />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com');
    });
  });

  it('shows snackbar when URL is copied', async () => {
    render(<CopyUrlButton urlToShare="https://example.com" />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('URL copied to clipboard!')).toBeInTheDocument();
    });
  });

  it('hides snackbar after 3 seconds', async () => {
    jest.useFakeTimers();
    render(<CopyUrlButton urlToShare="https://example.com" />);
    const button = screen.getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('URL copied to clipboard!')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.queryByText('URL copied to clipboard!')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});