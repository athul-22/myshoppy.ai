import React from 'react';

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
          <span className="text-xs font-bold text-blue-600">AI</span>
        </div>
      )}
      
      <div 
        className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
          <span className="text-xs font-bold text-white">You</span>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;