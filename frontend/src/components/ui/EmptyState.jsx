import React from 'react';

const EmptyState = ({ 
  icon: Icon,
  image,
  heading,
  title, // alias pour heading
  description,
  children,
  action,
  fullWidth = false,
  className = ''
}) => {
  const displayTitle = heading || title;
  
  return (
    <div className={`text-center py-12 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {image && (
        <img 
          src={image} 
          alt={displayTitle} 
          className="w-32 h-32 mx-auto mb-6 object-contain"
        />
      )}
      {Icon && !image && (
        <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      )}
      {displayTitle && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{displayTitle}</h3>
      )}
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {children && (
        <div className="text-gray-600 mb-4">{children}</div>
      )}
      {action && (
        <div className="mt-6">
          {typeof action === 'object' && action.content ? (
            <button className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors">
              {action.content}
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;