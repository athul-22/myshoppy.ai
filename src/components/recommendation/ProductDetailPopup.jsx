import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const ProductDetailPopup = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState('specs');
  const [loading, setLoading] = useState(false);
  const [summarizedInfo, setSummarizedInfo] = useState(null);
  
  useEffect(() => {
    if (product) {
      fetchSummarizedInfo();
    }
  }, [product]);
  
  const fetchSummarizedInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/product/summarize`, { 
        productName: product.name,
        brand: product.brand,
        features: product.keyFeatures
      });
      setSummarizedInfo(response.data);
    } catch (error) {
      console.error('Error fetching summarized info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this helper function inside your component
  const getPlatformIcon = (iconType) => {
    const iconSize = "w-5 h-5";
    
    switch(iconType.toLowerCase()) {
      case 'reddit':
        return (
          <svg className={`${iconSize} text-orange-600`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm-1.834 5.606c.996-.234 1.607 0 1.607 0s.423-.984 1.399-.984c.492 0 .877.202 1.092.46a1.55 1.55 0 0 1 .317.489c.156.427.062 1.122.004 1.489a.762.762 0 0 1-.228.422c.218.114.433.241.633.386 1.023.738 1.597 1.75 1.597 2.831 0 .575-.133 1.142-.388 1.661a3.88 3.88 0 0 1-1.134 1.333c-1.326.98-3.238 1.16-5.077 1.16-1.839 0-3.751-.18-5.077-1.16a3.88 3.88 0 0 1-1.134-1.333 3.736 3.736 0 0 1-.388-1.661c0-1.081.574-2.093 1.597-2.831.2-.145.415-.272.633-.386a.762.762 0 0 1-.228-.422c-.058-.367-.152-1.062.004-1.489.071-.195.178-.355.317-.489.215-.258.6-.46 1.092-.46.976 0 1.399.984 1.399.984s.611-.234 1.607 0C8.877 8.845 8 10.053 8 10.053s-.23.163-.436.734c-.128.357-.39 1.354.567 2.456.847.971 2.554 1.356 3.957 1.356 1.403 0 3.11-.385 3.957-1.356.957-1.102.695-2.099.567-2.456-.206-.571-.436-.734-.436-.734S15.123 8.845 13.5 9.606l.666-2z" />
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg className={`${iconSize} text-blue-400`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className={`${iconSize} text-red-600`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
          </svg>
        );
      case 'amazon':
        return (
          <svg className={`${iconSize} text-yellow-500`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.42 14.58c-.28-.3-.77-.4-1.09-.56-.33-.16-.77-.31-1.13-.46-.36-.14-.7-.28-1.02-.43-.33-.15-.65-.31-.93-.47-.27-.16-.51-.32-.71-.48-.2-.16-.35-.32-.46-.48-.12-.16-.18-.33-.18-.51v-.04c0-.17.05-.32.15-.46.1-.14.25-.25.45-.35.2-.1.44-.15.7-.15.27 0 .53.04.79.12.25.08.47.21.66.37.19.16.34.37.44.63.1.26.16.58.16.94h3.01c0-.81-.16-1.49-.46-2.06-.3-.58-.71-1.05-1.22-1.4-.52-.36-1.11-.61-1.77-.76-.67-.15-1.37-.23-2.09-.23-.83 0-1.6.1-2.3.3-.7.2-1.31.5-1.83.9-.52.4-.92.9-1.21 1.48-.29.59-.43 1.26-.43 2.02 0 .7.13 1.32.39 1.84.26.53.62.99 1.07 1.38s.96.72 1.53.99c.57.27 1.15.51 1.75.73.6.22 1.18.43 1.75.65.57.21 1.08.43 1.53.65.44.23.8.48 1.07.75.26.27.39.61.39 1.01 0 .27-.06.51-.18.72-.12.21-.29.39-.51.53-.22.14-.47.25-.77.32-.3.07-.62.11-.97.11-.28 0-.56-.04-.84-.12-.28-.08-.52-.21-.74-.39-.21-.18-.39-.41-.52-.69-.13-.28-.2-.63-.2-1.03h-3.01c0 .84.17 1.57.52 2.19.35.62.81 1.12 1.39 1.53.58.4 1.24.7 1.99.89.74.19 1.52.29 2.33.29.87 0 1.68-.1 2.44-.3.76-.2 1.42-.5 1.98-.9.56-.4.99-.91 1.31-1.52.32-.61.48-1.33.48-2.15 0-.76-.14-1.41-.42-1.98-.28-.57-.63-1.05-1.06-1.44zm5.04 4.61h-1.84l.25-1.33h-.03c-.17.46-.53.85-1.07 1.16-.55.31-1.26.46-2.13.46-.42 0-.83-.06-1.23-.17-.4-.11-.76-.29-1.07-.52-.31-.24-.56-.54-.75-.92-.19-.38-.28-.85-.28-1.39 0-.69.16-1.27.47-1.74.31-.47.73-.85 1.25-1.14.53-.29 1.14-.5 1.84-.62.7-.12 1.45-.19 2.23-.19h1.41c.03-.76-.17-1.3-.58-1.62-.41-.32-.95-.48-1.61-.48-.51 0-.96.1-1.35.31-.39.21-.67.48-.84.83h-2.12c.12-.51.34-.95.66-1.32.32-.37.7-.67 1.14-.9.44-.23.93-.4 1.46-.51.53-.11 1.08-.16 1.65-.16.68 0 1.3.07 1.86.21.56.14 1.05.36 1.47.68.41.31.74.71.98 1.2.24.49.36 1.09.36 1.8v4.36zm-2.48-2.93h-1.67c-.46 0-.86.05-1.21.16-.35.1-.64.24-.87.41-.23.17-.4.36-.51.58-.11.21-.17.42-.17.63 0 .44.17.78.51 1.02.34.24.79.36 1.33.36.31 0 .61-.05.89-.16.28-.11.52-.26.74-.46.21-.2.38-.43.51-.71.13-.27.19-.58.19-.93v-.91h.26v.01z" />
          </svg>
        );
      case 'techblog':
      case 'tech':
        return (
          <svg className={`${iconSize} text-purple-600`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.568 5.046a5.54 5.54 0 0 1 2.446 2.446l-3.467 3.467-1.425-1.425 2.714-2.714a3.693 3.693 0 0 0-1.432-1.431L10.69 8.103 9.265 6.678l3.467-3.467zM6.11 19.95l-2.12-2.12 5.093-5.094 3.536 3.536-5.094 5.093A1.5 1.5 0 0 1 6.11 19.95zm-2.828-4.242l1.414 1.414 1.414-1.414-1.414-1.414-1.414 1.414zm4.95 0l1.414 1.414L11.06 15.71l-1.414-1.414-1.415 1.413zm4.242-4.242l1.415 1.414 1.414-1.414-1.414-1.414-1.415 1.414z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconSize} text-gray-500`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-15a1 1 0 0 1 1 1v4.5a.5.5 0 0 0 1 0V8a2 2 0 1 0-4 0v4.5a.5.5 0 0 0 1 0V8a1 1 0 0 1 1-1zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        );
    }
  };
  
  const tabs = [
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'pricing', label: 'Price Compare' },
  ];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left Column - Image */}
            <div className="p-6 flex items-center justify-center bg-gray-50">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="max-w-full max-h-60 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              ) : (
                <img 
                  src={`https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="max-w-full max-h-60 object-contain"
                />
              )}
            </div>
            
            {/* Right Column - Details */}
            <div className="col-span-2 flex flex-col">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`py-3 px-4 font-medium text-sm border-b-2 ${
                        activeTab === tab.id ? 
                          'border-blue-600 text-blue-600' : 
                          'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-4 overflow-y-auto" style={{maxHeight: '50vh'}}>
                {activeTab === 'specs' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Key Features</h3>
                      <ul className="space-y-1">
                        {product.keyFeatures && product.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-1.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : summarizedInfo ? (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Product Summary</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700">{summarizedInfo.summary}</p>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Technical Specifications</h3>
                        <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                              {summarizedInfo.specifications && Object.entries(summarizedInfo.specifications).map(([key, value], idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                  <td className="px-4 py-2 text-sm font-medium text-gray-900 w-1/3">{key}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500">{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No detailed information available
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Review Summary</h3>
                    {product.reviewsAnalysis ? (
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <p className="text-gray-700">{product.reviewsAnalysis.summary}</p>
                        </div>
                        
                        {/* Overall Pros/Cons Summary */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">OVERALL PROS</h4>
                            <ul className="space-y-2">
                              {product.reviewsAnalysis.overallPros?.map((pro, idx) => (
                                <li key={idx} className="flex items-start">
                                  <svg className="w-5 h-5 text-green-500 mr-1.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">OVERALL CONS</h4>
                            <ul className="space-y-2">
                              {product.reviewsAnalysis.overallCons?.map((con, idx) => (
                                <li key={idx} className="flex items-start">
                                  <svg className="w-5 h-5 text-red-500 mr-1.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Platform Specific Reviews */}
                        {product.reviewsAnalysis.platforms && product.reviewsAnalysis.platforms.length > 0 ? (
                          <div className="space-y-6 mt-6">
                            <h4 className="text-lg font-medium text-gray-900">Platform Reviews</h4>
                            
                            {product.reviewsAnalysis.platforms.map((platform, idx) => (
                              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
                                  {getPlatformIcon(platform.iconType)}
                                  <h5 className="font-medium ml-2">{platform.name}</h5>
                                </div>
                                <div className="p-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <h6 className="font-medium text-green-700 mb-2 text-sm uppercase">What users liked</h6>
                                      <ul className="space-y-2">
                                        {platform.reviews.positive.map((item, i) => (
                                          <li key={i} className="text-sm flex items-start">
                                            <svg className="w-4 h-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                        {platform.reviews.positive.length === 0 && 
                                          <li className="text-sm text-gray-500">No positive points mentioned</li>
                                        }
                                      </ul>
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-red-700 mb-2 text-sm uppercase">What users disliked</h6>
                                      <ul className="space-y-2">
                                        {platform.reviews.negative.map((item, i) => (
                                          <li key={i} className="text-sm flex items-start">
                                            <svg className="w-4 h-4 text-red-500 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                        {platform.reviews.negative.length === 0 && 
                                          <li className="text-sm text-gray-500">No negative points mentioned</li>
                                        }
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No platform-specific reviews available
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <div className="animate-pulse flex flex-col items-center">
                          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <p className="mt-4">Loading review information...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'pricing' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Price Comparison</h3>
                    
                    {product.pricingInfo && product.pricingInfo.length > 0 ? (
                      <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {product.pricingInfo.map((pricing, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{pricing.platform}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-bold text-green-600">
                                    ₹{typeof pricing.price === 'number' 
                                      ? pricing.price.toLocaleString() 
                                      : pricing.price}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm text-gray-600">{pricing.rating || 'N/A'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  {pricing.url ? (
                                    <a
                                      href={pricing.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                      Visit Store
                                    </a>
                                  ) : (
                                    <span className="text-sm text-gray-400">No Link</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No pricing information available
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Note:</span> Prices may vary based on availability, promotions, and location.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer/Actions */}
              <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      {product.priceRange ? (
                        <>
                          ₹{product.priceRange.min.toLocaleString()}
                          {product.priceRange.min !== product.priceRange.max && 
                            ` - ₹${product.priceRange.max.toLocaleString()}`}
                        </>
                      ) : 'Price unavailable'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={onClose} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                      Close
                    </Button>
                    {product.productUrl && (
                      <a 
                        href={product.productUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailPopup;