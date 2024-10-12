import React from "react";

interface SearchBarProps {
  searchText: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchChange,
}) => {
  return (
    <div className="search-bar" style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={onSearchChange}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};
