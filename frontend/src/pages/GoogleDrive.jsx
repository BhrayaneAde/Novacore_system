import React, { useState, useEffect } from 'react';
import { Upload, Folder, File, Download, Trash2, Plus, Search, Grid, List } from 'lucide-react';
import { useToast } from '../components/ui/useToast';
import Toast from '../components/ui/Toast';

const GoogleDrive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [storageInfo, setStorageInfo] = useState(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    loadFiles();
    loadStorageInfo();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive/files`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Erreur chargement fichiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive/storage-info`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStorageInfo(data);
      }
    } catch (error) {
      console.error('Erreur info stockage:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      if (response.ok) {
        showSuccess('Fichier uploadé avec succès');
        loadFiles();
      } else {
        showError('Erreur lors de l\'upload');
      }
    } catch (error) {
      showError('Erreur lors de l\'upload');
    }
  };

  const createFolder = async () => {
    const folderName = prompt('Nom du nouveau dossier:');
    if (!folderName) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive/create-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ folder_name: folderName })
      });

      if (response.ok) {
        showSuccess('Dossier créé avec succès');
        loadFiles();
      } else {
        showError('Erreur lors de la création');
      }
    } catch (error) {
      showError('Erreur lors de la création');
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm('Supprimer ce fichier ?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/google-drive/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        showSuccess('Fichier supprimé');
        loadFiles();
      } else {
        showError('Erreur lors de la suppression');
      }
    } catch (error) {
      showError('Erreur lors de la suppression');
    }
  };

  const getFileIcon = (type) => {
    if (type === 'folder') return <Folder className="w-8 h-8 text-blue-500" />;
    if (type.includes('pdf')) return <File className="w-8 h-8 text-red-500" />;
    if (type.includes('sheet') || type.includes('excel')) return <File className="w-8 h-8 text-green-500" />;
    if (type.includes('document') || type.includes('word')) return <File className="w-8 h-8 text-blue-600" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de Google Drive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Google Drive RH</h1>
                <p className="text-sm text-gray-600">Documents et fichiers NovaCore</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </label>
              
              <button
                onClick={createFolder}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Stockage</h3>
              {storageInfo && (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${storageInfo.usage_percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{storageInfo.used_space} utilisés sur {storageInfo.total_space}</p>
                    <p className="text-xs mt-1">NovaCore: {storageInfo.novacore_folder_size}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Dossiers rapides</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Contrats</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Folder className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Fiches de paie</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <Folder className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Photos équipe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and View Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des fichiers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Files Grid/List */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center text-center">
                        {getFileIcon(file.type)}
                        <h3 className="mt-2 text-sm font-medium text-gray-900 truncate w-full">{file.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{file.size}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Ouvrir"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
                          <p className="text-xs text-gray-500">Modifié le {new Date(file.modified).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{file.size}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Ouvrir"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun fichier trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default GoogleDrive;