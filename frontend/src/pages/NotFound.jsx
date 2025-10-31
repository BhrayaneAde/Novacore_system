import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-9xl font-bold text-blue-100 -z-10 transform translate-x-2 translate-y-2">
              404
            </div>
          </div>
        </div>

        {/* Message principal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Oups ! La page que vous cherchez n'existe pas.
          </p>
          <p className="text-sm text-gray-500">
            Elle a peut-être été déplacée, supprimée ou vous avez saisi une URL incorrecte.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          
          <button
            onClick={() => navigate('/app')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Accueil
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <button
              onClick={() => navigate('/app/employees')}
              className="p-3 text-left bg-white rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
            >
              <div className="font-medium">Employés</div>
              <div className="text-gray-500">Gestion des employés</div>
            </button>
            
            <button
              onClick={() => navigate('/app/tasks')}
              className="p-3 text-left bg-white rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
            >
              <div className="font-medium">Tâches</div>
              <div className="text-gray-500">Suivi des tâches</div>
            </button>
            
            <button
              onClick={() => navigate('/app/leaves')}
              className="p-3 text-left bg-white rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
            >
              <div className="font-medium">Congés</div>
              <div className="text-gray-500">Demandes de congés</div>
            </button>
            
            <button
              onClick={() => navigate('/app/settings')}
              className="p-3 text-left bg-white rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
            >
              <div className="font-medium">Paramètres</div>
              <div className="text-gray-500">Configuration</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          NovaCore - Solution RH moderne
        </div>
      </div>
    </div>
  );
};

export default NotFound;