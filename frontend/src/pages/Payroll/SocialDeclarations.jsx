import React, { useState, useEffect } from 'react';
import { Building, FileText, Download, Send, Calendar, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { usePayroll } from '../../hooks/usePayroll';

const SocialDeclarations = () => {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-03');
  const [declarationType, setDeclarationType] = useState('all');
  const { getDeclarations, generateDeclaration, submitDeclaration, downloadDeclaration } = usePayroll();

  useEffect(() => {
    loadDeclarations();
  }, [selectedPeriod, declarationType]);

  const loadDeclarations = async () => {
    setLoading(true);
    try {
      const response = await getDeclarations({
        period: selectedPeriod,
        type: declarationType !== 'all' ? declarationType : undefined
      });
      
      setDeclarations(response.data || []);
    } catch (error) {
      console.error('Erreur chargement déclarations:', error);
      // Données simulées
      const mockDeclarations = [
        {
          id: 1,
          type: 'CNSS_MONTHLY',
          typeName: 'Bordereau CNSS Mensuel',
          period: selectedPeriod,
          status: 'draft',
          totalEmployees: 3,
          totalSalary: 4500000,
          totalCnssEmployee: 252000,
          totalCnssEmployer: 378000,
          dueDate: '2024-04-15',
          createdAt: '2024-03-01T10:00:00Z'
        },
        {
          id: 2,
          type: 'IRPP_MONTHLY',
          typeName: 'Déclaration IRPP Mensuelle',
          period: selectedPeriod,
          status: 'submitted',
          totalEmployees: 3,
          totalTaxableIncome: 3996000,
          totalIrpp: 274453,
          dueDate: '2024-04-15',
          createdAt: '2024-03-01T10:00:00Z'
        },
        {
          id: 3,
          type: 'DISA_ANNUAL',
          typeName: 'DISA (Déclaration Sociale Annuelle)',
          period: '2024',
          status: 'pending',
          totalEmployees: 3,
          totalAnnualSalary: 54000000,
          dueDate: '2025-01-31',
          createdAt: '2024-01-01T10:00:00Z'
        }
      ];
      
      const filtered = declarationType === 'all' 
        ? mockDeclarations 
        : mockDeclarations.filter(d => d.type === declarationType);
      
      setDeclarations(filtered);
    } finally {
      setLoading(false);
    }
  };

  const generateDeclarationHandler = async (type) => {
    try {
      const response = await generateDeclaration({
        type,
        period: selectedPeriod
      });
      
      if (response.data.success) {
        loadDeclarations();
        alert(`Déclaration ${type} générée avec succès`);
      }
    } catch (error) {
      console.error('Erreur génération déclaration:', error);
      alert('Erreur lors de la génération');
    }
  };

  const submitDeclarationHandler = async (declarationId) => {
    try {
      await submitDeclaration(declarationId);
      setDeclarations(declarations.map(d => 
        d.id === declarationId 
          ? { ...d, status: 'submitted', submittedAt: new Date().toISOString() }
          : d
      ));
      alert('Déclaration soumise avec succès');
    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('Erreur lors de la soumission');
    }
  };

  const downloadDeclarationHandler = async (declarationId) => {
    try {
      const response = await downloadDeclaration(declarationId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `declaration_${declarationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon', icon: FileText },
      generated: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Généré', icon: CheckCircle },
      submitted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Soumis', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente', icon: AlertTriangle }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Building className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Déclarations Sociales</h2>
              <p className="text-gray-600">CNSS, IRPP, DISA et autres déclarations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024-01">Janvier 2024</option>
              <option value="2024-02">Février 2024</option>
              <option value="2024-03">Mars 2024</option>
              <option value="2024">Année 2024</option>
            </select>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateDeclarationHandler('CNSS_MONTHLY')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900">Générer CNSS</div>
                <div className="text-sm text-blue-600">Bordereau mensuel</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => generateDeclarationHandler('IRPP_MONTHLY')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900">Générer IRPP</div>
                <div className="text-sm text-green-600">Déclaration mensuelle</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => generateDeclarationHandler('DISA_ANNUAL')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Building className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-purple-900">Générer DISA</div>
                <div className="text-sm text-purple-600">Déclaration annuelle</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select 
            value={declarationType} 
            onChange={(e) => setDeclarationType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les déclarations</option>
            <option value="CNSS_MONTHLY">CNSS Mensuel</option>
            <option value="IRPP_MONTHLY">IRPP Mensuel</option>
            <option value="DISA_ANNUAL">DISA Annuel</option>
          </select>
        </div>
      </div>

      {/* Liste des déclarations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : declarations.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {declarations.map((declaration) => (
              <div key={declaration.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {declaration.typeName}
                      </h3>
                      {getStatusBadge(declaration.status)}
                      {isOverdue(declaration.dueDate) && declaration.status !== 'submitted' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          En retard
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Période:</span> {declaration.period}
                      </div>
                      <div>
                        <span className="font-medium">Employés:</span> {declaration.totalEmployees}
                      </div>
                      <div>
                        <span className="font-medium">Échéance:</span> {new Date(declaration.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="font-medium">Créé le:</span> {new Date(declaration.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    {declaration.type === 'CNSS_MONTHLY' && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Total CNSS:</span> {((declaration.totalCnssEmployee || 0) + (declaration.totalCnssEmployer || 0)).toLocaleString()} FCFA
                      </div>
                    )}
                    
                    {declaration.type === 'IRPP_MONTHLY' && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Total IRPP:</span> {(declaration.totalIrpp || 0).toLocaleString()} FCFA
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => downloadDeclarationHandler(declaration.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {declaration.status === 'generated' && (
                      <button
                        onClick={() => submitDeclarationHandler(declaration.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Soumettre"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune déclaration trouvée</h3>
            <p className="text-gray-500">Générez vos déclarations sociales pour cette période</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialDeclarations;