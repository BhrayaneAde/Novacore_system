import React, { useState } from "react";
import { FileText, Share2, Upload, Users, Eye, Download, Plus, Send } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { managerDocuments, users } from "../../../data/mockData";

const ManagerDocumentsPage = () => {
  const { currentUser } = useAuthStore();
  const [documents, setDocuments] = useState(managerDocuments);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Obtenir les membres de l'équipe
  const teamMembers = users.filter(user => user.reportsTo === currentUser?.id);

  const handleShare = (docId, memberIds, message) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, isShared: true, sharedWith: memberIds }
        : doc
    ));
    setShowShareModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Documents</h1>
        <p className="text-gray-600">Gérez et partagez vos documents avec votre équipe</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Télécharger
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {documents.length} document(s)
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <div key={doc.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{doc.size}</span>
                      <span>{doc.uploadDate}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full">{doc.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {doc.isShared && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Partagé</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowShareModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {doc.isShared && doc.sharedWith.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Partagé avec: {doc.sharedWith.map(id => {
                      const user = users.find(u => u.id === id);
                      return user ? `${user.firstName} ${user.lastName}` : '';
                    }).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de partage */}
      {showShareModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Partager "{selectedDoc.name}"
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partager avec mon équipe
                </label>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <label key={member.id} className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <img
                        src={member.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-900">
                        {member.firstName} {member.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="3"
                  placeholder="Ajoutez un message pour votre équipe..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleShare(selectedDoc.id, [teamMembers[0]?.id], "")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Partager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDocumentsPage;