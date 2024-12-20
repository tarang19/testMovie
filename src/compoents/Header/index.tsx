import React, { useState } from 'react';
import { debounce } from 'lodash';

interface HeaderProps {
  onSearch: (query: string) => void;
  onSortChange: (sortBy: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onSortChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('episode');

  // Debounce the search function to prevent too many re-renders
  const debouncedSearch = React.useCallback(
    debounce((query: string) => onSearch(query), 500),
    [] 
  );

  // Handle input change and update the search query
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    debouncedSearch(event.target.value); 
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = event.target.value;
    setSortBy(selectedSort);
    onSortChange(selectedSort); 
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl grid grid-cols-12 gap-4 items-center mx-auto p-4">
        <div className="col-span-2">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="episode">Sort by Episode</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>
        <div className="col-span-10 sm:col-span-12">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              value={searchQuery}
              onChange={handleSearchChange} 
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Movies..."
              required
            />
          </div>
        </div>

        
      </div>
    </nav>
  );
};

export default Header;
