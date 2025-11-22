import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route, ExploreComponent } from '@routes/explore/index.lazy';
import { useNavigate } from '@tanstack/react-router';

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useNavigate: jest.fn(),
}));

jest.mock('@components/SearchBar/SearchBar', () => {
  return ({ searchText, onSearchChange }: { searchText: string, onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <input
      data-testid="search-input"
      value={searchText}
      onChange={onSearchChange}
    />
  );
});

jest.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, onRowClicked }: { rowData: any[], onRowClicked: (event: any) => void }) => (
    <div data-testid="ag-grid">
      {rowData.map((row, index) => (
        <div
          key={index}
          data-testid={`row-${index}`}
          onClick={() => onRowClicked({ node: { data: row } })}
        >
          {row.id}
        </div>
      ))}
    </div>
  ),
}));

describe('ExploreComponent', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Route, 'useLoaderData').mockReturnValue({
      rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      cols: [{ field: 'id' }],
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders the search bar and grid', () => {
    render(<ExploreComponent />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument();
  });

  it('filters rows based on search input', () => {
    render(<ExploreComponent />);
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: '2' } });

    expect(screen.queryByTestId('row-0')).not.toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.queryByTestId('row-2')).not.toBeInTheDocument();
  });

  it('navigates to entity page on row click', () => {
    render(<ExploreComponent />);
    const row = screen.getByTestId('row-0');
    fireEvent.click(row);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/entity/$id',
      params: { id: '1' },
    });
  });
}); 