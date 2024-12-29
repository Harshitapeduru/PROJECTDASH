// src/components/ui/card.js
import React from 'react';

// Card component to wrap content
const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {children}
    </div>
  );
};

// CardHeader component for the card's header section
export const CardHeader = ({ children, className }) => {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  );
};

// CardTitle component for the card's title
export const CardTitle = ({ children, className }) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

// CardContent component for the card's body/content
export const CardContent = ({ children }) => {
  return (
    <div className="px-6 py-4">
      {children}
    </div>
  );
};

// Make Card a default export
export default Card;
