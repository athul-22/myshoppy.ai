import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatPanel = ({ query }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add initial system message when query changes
    if (query) {
      setMessages([
        { 
          id: 'welcome', 
          text: `Hi! I'm your shopping assistant. I can help you find information about ${query}. What would you like to know?`, 
          sender: 'system' 
        }
      ]);
    }
  }, [query]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Set loading state
    setLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        `I found several ${query} options for you. The prices range from ₹1,999 to ₹15,999.`,
        `Based on reviews, the top-rated ${query} is from Amazon with 4.5 stars.`,
        `Would you like to compare different brands of ${query}?`,
        `The best deals for ${query} are currently available on Flipkart.`
      ];
      
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      const systemMessage = { id: Date.now() + 1, text: responseText, sender: 'system' };
      
      setMessages(prevMessages => [...prevMessages, systemMessage]);
      setLoading(false);
    }, 1500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Shopping Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <ChatMessage 
              key={message.id}
              message={message}
            />
          ))}
          
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="bg-white border-t p-4">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatPanel;