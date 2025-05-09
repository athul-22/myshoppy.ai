import React from 'react';

const ChatMessage = ({ message }) => {
  const { text, sender } = message;
  
  const isSystem = sender === 'system';
  
  return (
    <div className={`flex ${isSystem ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-xs md:max-w-md py-2 px-4 rounded-2xl ${
          isSystem 
            ? 'bg-white text-gray-800 border border-gray-200' 
            : 'bg-blue-600 text-white'
        }`}
      >
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;