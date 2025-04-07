import React from 'react';

const Card = ({ 
  children, 
  title,
  icon,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          {title && <h3 className="text-lg font-medium">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
