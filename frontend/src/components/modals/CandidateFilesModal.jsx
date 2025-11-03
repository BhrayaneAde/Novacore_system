import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Image, File, Eye } from 'lucide-react';

const CandidateFilesModal = ({ isOpen, onClose, candidate }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (isOpen && candidate) {
      loadFiles();
    }
  }, [isOpen, candidate]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Token manquant');
        return;
      }
      
      const realId = candidate.id.replace('auto_', '');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${realId}/attachments`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        console.error('Token expiré, reconnexion nécessaire');
        window.location.href = '/login';
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        console.error('Erreur API:', response.status);
      }
    } catch (error) {
      console.error('Erreur chargement fichiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileId, filename) => {
    try {
      const token = localStorage.getItem('access_token');
      const realId = candidate.id.replace('auto_', '');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${realId}/attachments/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  const previewFileContent = async (fileId, filename, fileType) => {
    if (!['pdf', 'jpg', 'jpeg', 'png', 'txt', 'doc', 'docx'].includes(fileType)) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const realId = candidate.id.replace('auto_', '');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}/auto-recruitment/candidates/${realId}/attachments/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewFile({ url, filename, fileType });
      }
    } catch (error) {
      console.error('Erreur aperçu:', error);
    }
  };

  const getFileIcon = (fileType) => {
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      return <Image className="w-8 h-8 text-green-500" />;
    } else if (['pdf', 'doc', 'docx'].includes(fileType)) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            Fichiers de {candidate?.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun fichier trouvé
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    {getFileIcon(file.file_type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {file.filename}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {file.file_type?.toUpperCase()} • {formatFileSize(file.file_size)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    {['pdf', 'jpg', 'jpeg', 'png', 'txt', 'doc', 'docx'].includes(file.file_type) && (
                      <button
                        onClick={() => previewFileContent(file.id, file.filename, file.file_type)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Aperçu</span>
                      </button>
                    )}
                    <button
                      onClick={() => downloadFile(file.id, file.filename)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal d'aperçu */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">{previewFile.filename}</h3>
              <button 
                onClick={() => setPreviewFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {previewFile.fileType === 'pdf' ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-96 border"
                  title="Aperçu PDF"
                />
              ) : ['jpg', 'jpeg', 'png', 'gif'].includes(previewFile.fileType) ? (
                <img
                  src={previewFile.url}
                  alt="Aperçu"
                  className="max-w-full h-auto mx-auto"
                />
              ) : ['doc', 'docx'].includes(previewFile.fileType) ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <p className="text-gray-600">Document Word: {previewFile.filename}</p>
                  <p className="text-sm text-gray-500 mt-2">Cliquez "Télécharger" pour ouvrir le document</p>
                </div>
              ) : previewFile.fileType === 'txt' ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <p className="text-gray-600">Fichier texte: {previewFile.filename}</p>
                  <p className="text-sm text-gray-500 mt-2">Contenu textuel disponible</p>
                </div>
              ) : ['jpg', 'jpeg', 'png', 'gif'].includes(previewFile.fileType) ? (
                <img
                  src={previewFile.url}
                  alt="Aperçu"
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aperçu non disponible pour ce type de fichier
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateFilesModal;