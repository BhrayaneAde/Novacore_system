import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Eye, Download, MessageSquare, Clock, User } from "lucide-react";
import { documentTypes } from "../../data/mockData";

const SharedWithMe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, getSharedWithMe, logDocumentAccess } = useHRStore();
  const [selectedShare, setSelectedShare] = useState(null);
  
  const employee = employees.find(emp => emp.id === parseInt(id));
  const sharedDocs = getSharedWithMe(parseInt(id));
  
  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Employé non trouvé</h2>
          <Button onClick={() => navigate("/app/employees")}>
            Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getDocumentIcon = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.icon : '📎';
  };

  const getPermissionLabel = (permission) => {
    switch (permission) {
      case 'read': return 'Lecture seule';
      case 'download': return 'Téléchargement';
      case 'comment': return 'Commentaires';
      default: return permission;
    }
  };

  const handleView = (share) => {
    logDocumentAccess(share.id, parseInt(id), 'viewed');
    setSelectedShare(share);
  };

  const handleDownload = (share) => {
    if (share.permissions === 'read') return;
    logDocumentAccess(share.id, parseInt(id), 'downloaded');
    // Simulation du téléchargement
    const link = document.createElement('a');
    link.href = share.document?.url || '#';
    link.download = share.document?.name || 'document';
    link.click();
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(`/app/employees/${id}/documents`)}>
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Documents partagés avec moi</h1>
            <p className="text-gray-600">{employee.name}</p>
          </div>
        </div>

        <Card title={`Documents partagés (${sharedDocs.length})`}>
          {sharedDocs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun document partagé avec vous</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedDocs.map((share) => {
                const expired = isExpired(share.expiryDate);
                const daysLeft = getDaysUntilExpiry(share.expiryDate);
                
                return (
                  <div key={share.id} className={`p-4 border rounded-lg ${expired ? 'bg-red-50 border-red-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-2xl">{getDocumentIcon(share.document?.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{share.document?.name}</h4>
                            {expired && <Badge variant="danger" size="sm">Expiré</Badge>}
                            {!expired && daysLeft !== null && daysLeft <= 7 && (
                              <Badge variant="warning" size="sm">Expire dans {daysLeft}j</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>Par {share.owner?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Le {new Date(share.shareDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <Badge variant="info" size="sm">{getPermissionLabel(share.permissions)}</Badge>
                          </div>
                          
                          {share.message && (
                            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded mb-2">
                              "{share.message}"
                            </p>
                          )}
                          
                          {share.comments.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MessageSquare className="w-4 h-4" />
                              <span>{share.comments.length} commentaire(s)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Eye}
                          onClick={() => handleView(share)}
                          disabled={expired}
                        >
                          Voir
                        </Button>
                        {share.permissions !== 'read' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={Download}
                            onClick={() => handleDownload(share)}
                            disabled={expired}
                          >
                            Télécharger
                          </Button>
                        )}
                        {share.comments.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={MessageSquare}
                            onClick={() => setSelectedShare(share)}
                            disabled={expired}
                          >
                            {share.comments.length}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Modal de visualisation des commentaires */}
        {selectedShare && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Commentaires</h3>
                <button
                  onClick={() => setSelectedShare(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedShare.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{comment.employeeName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedShare(null)} className="w-full">
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SharedWithMe;