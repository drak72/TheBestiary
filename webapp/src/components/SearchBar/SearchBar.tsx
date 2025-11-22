import React from "react";

import '@components/SearchBar/SearchBar.css';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchChange,
}) => {
  return (
    <div className="search-bar">
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={onSearchChange}
      />
    </div>
  );
};
