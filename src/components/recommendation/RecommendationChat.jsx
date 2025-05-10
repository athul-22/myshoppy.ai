import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import AILoadingAnimation from '../common/AILoadingAnimation';
import ProductDetailPopup from './ProductDetailPopup';

const API_BASE_URL = 'http://localhost:5001/api';

const RecommendationChat = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInitialQuery = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/recommend`, { query });
      
      setConversation({
        id: response.data.conversationId,
        context: response.data.analysisResult,
        messages: [
          { role: 'assistant', content: 'Hi! I can help you find the perfect product. Let me ask a few questions to better understand what you need.' },
          { role: 'user', content: query },
          { role: 'assistant', content: 'Thanks for sharing what you\'re looking for. I need a bit more information to find the best options for you.' }
        ],
        clarificationQuestions: response.data.clarificationQuestions
      });
      setQuery('');
    } catch (err) {
      console.error('Error starting recommendation:', err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelection = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const isOptionSelected = (questionId, value) => {
    return selectedAnswers[questionId] === value;
  };

  const handleSubmitAnswers = async () => {
    if (!conversation || Object.keys(selectedAnswers).length === 0) return;
    
    setLoading(true);
    
    // Convert selected answers to an array of response objects
    const responses = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));
    
    // Format answers for display in chat
    let formattedResponses = '';
    Object.entries(selectedAnswers).forEach(([questionId, answer]) => {
      const question = conversation.clarificationQuestions.find(q => q.id === questionId);
      if (!question) return;
      
      let formattedAnswer = answer;
      if (question.options) {
        const option = question.options.find(o => o.value === answer);
        formattedAnswer = option ? option.label : answer;
      }
      
      formattedResponses += `${question.question} ${formattedAnswer}\n`;
    });
    
    const updatedMessages = [
      ...conversation.messages,
      {
        role: 'user',
        content: formattedResponses.trim()
      }
    ];
    
    try {
      // Add loading message
      updatedMessages.push({
        role: 'assistant',
        content: 'Looking for the best options based on your preferences...',
        isLoading: true
      });
      
      setConversation({
        ...conversation,
        messages: updatedMessages
      });
      
      // Send all responses in a single request
      const response = await axios.post(`${API_BASE_URL}/recommend/clarify`, {
        conversationId: conversation.id,
        context: conversation.context,
        responses: responses  // Send array of responses
      });
      
      // Remove loading message
      updatedMessages.pop();
      
      if (response.data.complete) {
        updatedMessages.push({
          role: 'assistant',
          content: 'Great! Based on your requirements, I\'ve found some excellent options for you. Here are my recommendations:'
        });
        
        setRecommendations(response.data.recommendations);
      } else {
        updatedMessages.push({
          role: 'assistant',
          content: 'I need a bit more information to find the perfect match for you.'
        });
      }
      
      setConversation({
        id: response.data.conversationId,
        context: response.data.context,
        messages: updatedMessages,
        clarificationQuestions: response.data.clarificationQuestions || []
      });
      
      // Reset selected answers
      setSelectedAnswers({});
      
    } catch (err) {
      console.error('Error handling clarification:', err);
      setError('Failed to process your responses. Please try again.');
      
      // Remove loading message if it exists
      if (updatedMessages[updatedMessages.length - 1].isLoading) {
        updatedMessages.pop();
      }
      
      setConversation({
        ...conversation,
        messages: updatedMessages
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };
  
  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
  };

  // Render initial search screen
  if (!conversation) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopy.AI Assistant</h1>
            <p className="text-lg text-gray-600">
              Tell me what you're looking for, and I'll find the perfect product for you.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <form onSubmit={handleInitialQuery} className="space-y-5">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                  What are you looking for?
                </label>
                <textarea
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Example: I want to buy a phone with good camera and battery life under ₹25,000..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-base"
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full py-3 text-base font-medium"
                disabled={loading || !query.trim()}
              >
                {loading ? 'Analyzing...' : 'Find Recommendations'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render chat interface once conversation has started
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 md:p-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {conversation.messages.map((message, idx) => (
              <MessageBubble 
                key={`msg-${idx}`} 
                message={message} 
                index={idx}
              />
            ))}
          </AnimatePresence>
          
          {/* Questions Panel */}
          {conversation.clarificationQuestions && conversation.clarificationQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="font-medium text-gray-700">Please help me understand your preferences:</h3>
              </div>
              
              <div className="p-4 space-y-6">
                {conversation.clarificationQuestions.map((question) => (
                  <div key={question.id} className="space-y-3">
                    <p className="font-medium text-gray-800">{question.question}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {question.options.map(option => (
                        <button
                          key={option.value}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isOptionSelected(question.id, option.value)
                              ? 'bg-blue-500 text-white shadow-md' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleOptionSelection(question.id, option.value)}
                          aria-pressed={isOptionSelected(question.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="pt-3">
                  <button
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                      Object.keys(selectedAnswers).length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={handleSubmitAnswers}
                    disabled={Object.keys(selectedAnswers).length === 0 || loading}
                  >
                    {loading ? 'Processing...' : 'Submit Selections'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-6"
            >
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </motion.div>
          )}
          
          {/* Loading indicator */}
          {loading && !conversation.clarificationQuestions && (
            <div className="flex justify-center py-10">
              <AILoadingAnimation />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Recommendations section (when available) */}
      {recommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-t border-gray-200 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Personalized Recommendations</h2>
            <p className="text-gray-600 mb-6">Based on your preferences, here are the best options I found.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product, idx) => (
                <ImprovedProductCard 
                  key={`product-${idx}`} 
                  product={product}
                  index={idx}
                  onViewDetails={() => handleProductSelect(product)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Product Detail Popup */}
      {showProductDetail && selectedProduct && (
        <ProductDetailPopup
          product={selectedProduct}
          onClose={handleCloseProductDetail}
        />
      )}
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, index }) => {
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M9 3h6m-6 16h6" />
          </svg>
        </div>
      )}
      
      <div 
        className={`max-w-xs sm:max-w-md md:max-w-lg p-4 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
        }`}
      >
        {isLoading ? (
          <div className="flex space-x-1 items-center">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

// Improved Product Card Component
const ImprovedProductCard = ({ product, index, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-md transition-all"
    >
      <div className="relative aspect-square bg-gray-50">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={`https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`} 
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
          {product.brand}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-lg">{product.name}</h3>
        
        {/* Price Range */}
        {product.priceRange && (
          <div className="mb-3 text-lg font-bold text-green-700">
            ₹{product.priceRange.min.toLocaleString()} 
            {product.priceRange.min !== product.priceRange.max && ` - ₹${product.priceRange.max.toLocaleString()}`}
          </div>
        )}
        
        {/* Key Features - Limited to 3 */}
        {product.keyFeatures && product.keyFeatures.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-1">
              {product.keyFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <svg className="w-4 h-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <button 
          onClick={onViewDetails}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationChat;