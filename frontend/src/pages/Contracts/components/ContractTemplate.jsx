import React from "react";

const ContractTemplate = ({ template, selected, onClick }) => {
  const getTypeColor = (type) => {
    const colors = {
      'CDI': 'bg-green-100 text-green-800 border-green-200',
      'CDD': 'bg-blue-100 text-blue-800 border-blue-200',
      'STAGE': 'bg-purple-100 text-purple-800 border-purple-200',
      'FREELANCE': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div
      onClick={onClick}
      className={`relative border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
        selected
          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      {/* Image d'aperçu */}
      <div className="h-32 bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type).split(' ').slice(0, 2).join(' ')}`}>
            {template.type}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {template.variables?.length || 0} variables
          </span>
          
          {selected && (
            <div className="flex items-center text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Sélectionné</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractTemplate;
