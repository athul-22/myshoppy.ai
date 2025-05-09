import React from 'react';

const ProductSorter = ({ value, onChange }) => {
  const options = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Popularity' }
  ];
  
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <select 
      value={value}
      onChange={handleChange}
      className="py-2 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      <option disabled>Sort By</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ProductSorter;