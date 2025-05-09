import React from 'react';

const AILoadingAnimation = () => {
  // Apple Intelligence-inspired colors
  const colors = [
    '#FF2D55', // Pink
    '#5AC8FA', // Blue
    '#FFCC00', // Yellow
    '#34C759', // Green
    '#AF52DE'  // Purple
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-24 h-24">
        {colors.map((color, index) => (
          <div
            key={index}
            className="absolute w-full h-full rounded-full"
            style={{
              border: `3px solid ${color}`,
              borderTopColor: 'transparent',
              animation: `spin ${2 + index * 0.2}s linear infinite`,
              top: 0,
              left: 0,
              transformOrigin: 'center',
              transform: `scale(${1 - index * 0.15})`,
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-xl font-medium text-gray-700">Searching across stores...</p>
      <p className="mt-2 text-sm text-gray-500">Finding the best products for you</p>
    </div>
  );
};

export default AILoadingAnimation;