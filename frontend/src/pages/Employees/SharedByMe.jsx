import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { employeesService, hrService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { ArrowLeft, Users, Clock, MessageSquare, Eye, Ban, BarChart3 } from "lucide-react";

const SharedByMe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShare, setSelectedShare] = useState(null);
  const [revokeDialog, setRevokeDialog] = useState({ isOpen: false, share: null });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeeData, employeesData, sharedData] = await Promise.all([
          employeesService.getById(parseInt(id)),
          employeesService.getAll(),
          hrService.documents.getSharedByMe(parseInt(id))
        ]);
        setEmployee(employeeData);
        setEmployees(employeesData.data || []);
        setSharedDocs(sharedData || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setSharedDocs([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p>Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

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
    const icons = {
      contract: '📄',
      policy: '📋',
      handbook: '📖',
      form: '📝',
      certificate: '🏆',
      other: '📎'
    };
    return icons[type] || '📎';
  };

  const getPermissionLabel = (permission) => {
    switch (permission) {
      case 'read': return 'Lecture seule';
      case 'download': return 'Téléchargement';
      case 'comment': return 'Commentaires';
      default: return permission;
    }
  };

  const handleRevoke = (share) => {
    setRevokeDialog({ isOpen: true, share });
  };

  const confirmRevoke = async () => {
    if (revokeDialog.share) {
      try {
        await hrService.documents.revokeShare(revokeDialog.share.id);
        setSharedDocs(prev => prev.filter(doc => doc.id !== revokeDialog.share.id));
      } catch (error) {
        console.error('Erreur lors de la révocation:', error);
      }
      setRevokeDialog({ isOpen: false, share: null });
    }
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

  const getAccessStats = (share) => {
    const totalViews = share.accessLog.filter(log => log.action === 'viewed').length;
    const totalDownloads = share.accessLog.filter(log => log.action === 'downloaded').length;
    const uniqueViewers = new Set(share.accessLog.map(log => log.employeeId)).size;
    
    return { totalViews, totalDownloads, uniqueViewers };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(`/app/employees/${id}/documents`)}>
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Documents que j'ai partagés</h1>
            <p className="text-gray-600">{employee.first_name} {employee.last_name}</p>
          </div>
        </div>

        <Card title={`Documents partagés (${sharedDocs.length})`}>
          {sharedDocs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Vous n'avez partagé aucun document</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedDocs.map((share) => {
                const expired = isExpired(share.expiryDate);
                const daysLeft = getDaysUntilExpiry(share.expiryDate);
                const stats = getAccessStats(share);
                
                return (
                  <div key={share.id} className={`p-4 border rounded-lg ${expired ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}>
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
                              <Users className="w-4 h-4" />
                              <span>{share.sharedWith.length} destinataires</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Le {new Date(share.shareDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <Badge variant="info" size="sm">{getPermissionLabel(share.permissions)}</Badge>
                          </div>
                          
                          {/* Statistiques d'accès */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span>{stats.uniqueViewers}/{share.sharedWith.length} ont consulté</span>
                            <span>{stats.totalViews} vues</span>
                            {stats.totalDownloads > 0 && <span>{stats.totalDownloads} téléchargements</span>}
                          </div>
                          
                          {/* Destinataires */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">Partagé avec:</span>
                            <div className="flex -space-x-1">
                              {share.sharedWith.slice(0, 3).map((person) => (
                                <img
                                  key={person.id}
                                  src={person.avatar}
                                  alt={person.name}
                                  className="w-6 h-6 rounded-full border-2 border-white"
                                  title={person.name}
                                />
                              ))}
                              {share.sharedWith.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                  +{share.sharedWith.length - 3}
                                </div>
                              )}
                            </div>
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
                          icon={BarChart3}
                          onClick={() => setSelectedShare(share)}
                        >
                          Stats
                        </Button>
                        {share.comments.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={MessageSquare}
                            onClick={() => setSelectedShare(share)}
                          >
                            {share.comments.length}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          icon={Ban}
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRevoke(share)}
                        >
                          Révoquer
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Modal de statistiques détaillées */}
        {selectedShare && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Statistiques de partage</h3>
                <button
                  onClick={() => setSelectedShare(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Statistiques générales */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600">{getAccessStats(selectedShare).uniqueViewers}</div>
                    <div className="text-sm text-gray-600">Personnes ayant consulté</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{getAccessStats(selectedShare).totalViews}</div>
                    <div className="text-sm text-gray-600">Vues totales</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{getAccessStats(selectedShare).totalDownloads}</div>
                    <div className="text-sm text-gray-600">Téléchargements</div>
                  </div>
                </div>

                {/* Log d'accès */}
                <div>
                  <h4 className="font-medium mb-3">Historique d'accès</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedShare.accessLog.map((log, index) => {
                      const employee = employees.find(emp => emp.id === log.employeeId);
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <img src={employee?.avatar} alt="" className="w-6 h-6 rounded-full" />
                            <span className="text-sm">{employee?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded text-xs ${
                              log.action === 'viewed' ? 'bg-secondary-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {log.action === 'viewed' ? 'Consulté' : 'Téléchargé'}
                            </span>
                            <span>{new Date(log.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Commentaires */}
                {selectedShare.comments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Commentaires</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
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
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedShare(null)} className="w-full">
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={revokeDialog.isOpen}
          onClose={() => setRevokeDialog({ isOpen: false, share: null })}
          onConfirm={confirmRevoke}
          title="Révoquer le partage"
          message={`Êtes-vous sûr de vouloir révoquer le partage de "${revokeDialog.share?.document?.name}" ? Les destinataires n'y auront plus accès.`}
          confirmText="Révoquer"
          type="warning"
        />
      </div>
    </DashboardLayout>
  );
};

export default SharedByMe;