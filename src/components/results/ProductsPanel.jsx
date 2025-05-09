import React from 'react';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import ProductSorter from './ProductSorter';

const ProductsPanel = ({ 
  products, 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange 
}) => {
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-sm text-gray-500">
          {products.length} products found
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <ProductFilters 
            filters={filters}
            onChange={onFilterChange}
          />
          
          <ProductSorter 
            value={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.externalId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPanel;