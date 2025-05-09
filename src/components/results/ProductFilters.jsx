import React from 'react';

const ProductFilters = ({ filters, onChange }) => {
  const sources = ['all', 'Amazon', 'Flipkart', 'Myntra'];
  const categories = ['all', 'electronics', 'fashion', 'home'];
  
  const handleSourceChange = (e) => {
    onChange({ source: e.target.value });
  };
  
  const handleCategoryChange = (e) => {
    onChange({ category: e.target.value });
  };
  
  return (
    <div className="flex flex-wrap gap-3">
      <select 
        value={filters.source}
        onChange={handleSourceChange}
        className="py-2 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option disabled>Source</option>
        {sources.map(source => (
          <option key={source} value={source}>
            {source === 'all' ? 'All Sources' : source}
          </option>
        ))}
      </select>
      
      <select 
        value={filters.category}
        onChange={handleCategoryChange}
        className="py-2 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option disabled>Category</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilters;