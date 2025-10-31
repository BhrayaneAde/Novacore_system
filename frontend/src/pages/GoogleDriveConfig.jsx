import React, { useState, useEffect } from 'react';
import { Save, ExternalLink } from 'lucide-react';

const GoogleDriveConfig = () => {
  const [config, setConfig] = useState({
    client_id: '359829676018-ch0vmgq8csqrcogjpl9ubdphbltf6350.apps.googleusercontent.com',
    client_secret: '',
    folder_id: ''
  });
  const [currentConfig, setCurrentConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive-config/config`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentConfig(data);
      }
    } catch (error) {
      console.error('Erreur chargement config:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive-config/configure-oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Configuration sauvegardée ! Cliquez sur le lien pour autoriser l\'accès.');
        setCurrentConfig({ ...data, is_configured: true, type: 'oauth' });
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive-config/oauth-callback?code=${code}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        alert('Google Drive connecté avec succès !');
        loadCurrentConfig();
      }
    } catch (error) {
      alert('Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuration Google Drive</h1>
          
          {currentConfig?.is_configured && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✅ Google Drive configuré 
                {currentConfig.is_active ? ' et actif' : ' (non autorisé)'}
              </p>
              {currentConfig.auth_url && (
                <a 
                  href={currentConfig.auth_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Autoriser l'accès à Google Drive
                </a>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID Google
              </label>
              <input
                type="text"
                value={config.client_id}
                onChange={(e) => setConfig({...config, client_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre Client ID Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret (optionnel)
              </label>
              <input
                type="password"
                value={config.client_secret}
                onChange={(e) => setConfig({...config, client_secret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre Client Secret Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID du dossier racine (optionnel)
              </label>
              <input
                type="text"
                value={config.folder_id}
                onChange={(e) => setConfig({...config, folder_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID du dossier Google Drive"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading || !config.client_id}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Instructions :</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Votre Client ID est déjà pré-rempli</li>
              <li>2. Cliquez sur "Sauvegarder la configuration"</li>
              <li>3. Cliquez sur le lien "Autoriser l'accès" qui apparaîtra</li>
              <li>4. Autorisez NovaCore à accéder à votre Google Drive</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveConfig;