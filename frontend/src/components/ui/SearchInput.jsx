import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = "Search...",
  showButton = false,
  buttonText = "Search",
  className = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form className={`max-w-md mx-auto ${className}`} onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="search"
          id="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary-500 focus:border-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-500 dark:focus:border-secondary-500 ${
            showButton ? 'pe-24' : ''
          }`}
          placeholder={placeholder}
          required
        />
        {showButton && (
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-secondary-700 hover:bg-secondary-800 focus:ring-4 focus:outline-none focus:ring-secondary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-secondary-600 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800"
          >
            {buttonText}
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;