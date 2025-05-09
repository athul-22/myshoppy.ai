import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder = '', 
  className = '', 
  error = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;