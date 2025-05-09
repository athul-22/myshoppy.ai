import React from 'react';

const ProductCard = ({ product }) => {
  const {
    title,
    price,
    imageUrl,
    productUrl,
    source
  } = product;

  const sourceColors = {
    'Amazon': 'bg-yellow-100 text-yellow-800',
    'Flipkart': 'bg-blue-100 text-blue-800',
    'Myntra': 'bg-pink-100 text-pink-800'
  };

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <a 
        href={productUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative pt-[100%]">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="absolute top-0 left-0 w-full h-full object-contain p-4"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${sourceColors[source] || 'bg-gray-100 text-gray-800'}`}>
            {source}
          </span>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
            {title}
          </h3>
          <p className="text-lg font-bold text-gray-900">
            {formattedPrice}
          </p>
        </div>
      </a>
      
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 rounded-lg transition-colors">
          Add to Compare
        </button>
      </div>
    </div>
  );
};

export default ProductCard;