import React from 'react';

const Tabs = ({ 
  tabs = [], 
  activeTab, 
  onTabChange,
  className = ''
}) => {
  return (
    <ul className={`flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 ${className}`}>
      {tabs.map((tab) => (
        <li key={tab.id} className="me-2">
          <button
            onClick={() => onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`inline-block p-4 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'text-secondary-600 bg-gray-100 active dark:bg-gray-800 dark:text-secondary-500'
                : tab.disabled
                ? 'text-gray-400 cursor-not-allowed dark:text-gray-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4 inline mr-2" />}
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-secondary-100 text-secondary-800 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Tabs;