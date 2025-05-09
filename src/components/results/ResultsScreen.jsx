import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../services/api';
import ChatPanel from '../chat/ChatPanel';
import ProductsPanel from './ProductsPanel';
import AILoadingAnimation from '../common/AILoadingAnimation';

const ResultsScreen = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    source: 'all',
    priceRange: [0, 1000000],
    category: 'all'
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const getProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching products with query:', query);
        // Important: This is the key part - explicitly pass the query as productName
        const data = await fetchProducts(query);
        console.log('Received products:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again.');
      } finally {
        // Use a shorter timeout for better UX during testing
        setTimeout(() => setLoading(false), 1000);
      }
    };

    // Call it immediately
    getProducts();
  }, [query]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    if (filters.source !== 'all' && product.source !== filters.source) return false;
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    if (filters.category !== 'all' && product.category !== filters.category) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'popularity':
        return b.popularity - a.popularity;
      default: // relevance
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 border-b">
        <h1 className="text-xl font-semibold text-gray-900">
          Results for "{query || 'unknown'}"
        </h1>
      </header>
      
      <main className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className="hidden md:block w-1/4 bg-white border-r">
          <ChatPanel query={query} />
        </div>
        
        {/* Products Panel */}
        <div className="w-full md:w-3/4 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <AILoadingAnimation />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>{error}</p>
              <button 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : products.length > 0 ? (
            <ProductsPanel 
              products={sortedProducts} 
              filters={filters}
              onFilterChange={handleFilterChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p>No products found for "{query}". Try a different search term.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile chat toggle button */}
      <div className="md:hidden fixed bottom-4 right-4">
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;