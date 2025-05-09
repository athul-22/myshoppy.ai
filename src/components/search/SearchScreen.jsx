import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Button from '../common/Button';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/results?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Shopy.AI</h1>
          <p className="text-lg text-gray-600">
            Find the best products across multiple e-commerce sites
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full">
          <SearchBar 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search for products..." 
          />
          
          <Button 
            type="submit" 
            className="w-full mt-4 py-3"
          >
            Search
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SearchScreen;