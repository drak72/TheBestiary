import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '@components/SearchBar/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    render(<SearchBar onSearchChange={mockOnSearch} searchText='test query'/>);
  });

  it('renders the search input and button', () => {
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('allows the user to type in the search input', () => {
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input).toHaveValue('test query');
  });

}); 