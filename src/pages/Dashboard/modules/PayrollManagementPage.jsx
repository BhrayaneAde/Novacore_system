import React, { useState } from "react";
import { Wallet, Calculator, FileText, Download, Plus, Edit3, Eye, AlertCircle } from "lucide-react";
import { salaryData, employees, defaultCurrency } from "../../../data/mockData";

const PayrollManagementPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const calculateNetSalary = (salary) => {
    const totalAllowances = Object.values(salary.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(salary.deductions).reduce((sum, val) => sum + val, 0);
    return salary.baseSalary + totalAllowances - totalDeductions;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + defaultCurrency;
  };

  const totalPayroll = salaryData.reduce((sum, salary) => sum + calculateNetSalary(salary), 0);

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: Wallet },
    { id: "salaries", label: "Gestion Salaires", icon: Calculator },
    { id: "payslips", label: "Fiches de Paie", icon: FileText },
  ];

  const PayslipModal = ({ employee, salary, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Fiche de Paie</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* En-tête fiche de paie */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">FICHE DE PAIE</h1>
            <p className="text-gray-600">Période: Janvier 2025</p>
          </div>

          {/* Informations employé */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Employé</h3>
              <p className="text-gray-700">{employee?.firstName} {employee?.lastName}</p>
              <p className="text-gray-600 text-sm">ID: {employee?.id}</p>
              <p className="text-gray-600 text-sm">Poste: {employee?.position}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Entreprise</h3>
              <p className="text-gray-700">TechCorp SARL</p>
              <p className="text-gray-600 text-sm">123 Rue de la Paix</p>
              <p className="text-gray-600 text-sm">Dakar, Sénégal</p>
            </div>
          </div>

          {/* Détail salaire */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Libellé</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">Salaire de base</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(salary.baseSalary)}</td>
                </tr>
                
                <tr className="bg-green-50">
                  <td className="px-4 py-3 text-sm font-medium text-green-800" colSpan="2">INDEMNITÉS</td>
                </tr>
                {Object.entries(salary.allowances).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                      {key === 'transport' ? 'Indemnité transport' :
                       key === 'meal' ? 'Indemnité repas' :
                       key === 'housing' ? 'Indemnité logement' :
                       key === 'management' ? 'Prime management' : key}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 text-right">+{formatCurrency(value)}</td>
                  </tr>
                ))}
                
                <tr className="bg-red-50">
                  <td className="px-4 py-3 text-sm font-medium text-red-800" colSpan="2">DÉDUCTIONS</td>
                </tr>
                {Object.entries(salary.deductions).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-4 py-3 text-sm text-gray-700 pl-8">
                      {key === 'tax' ? 'Impôt sur le revenu' :
                       key === 'socialSecurity' ? 'Sécurité sociale' :
                       key === 'pension' ? 'Caisse de retraite' : key}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right">-{formatCurrency(value)}</td>
                  </tr>
                ))}
                
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-4 py-3 text-sm text-blue-900">SALAIRE NET</td>
                  <td className="px-4 py-3 text-sm text-blue-900 text-right">{formatCurrency(calculateNetSalary(salary))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête avec guide */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion de la Paie</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Gestion des Salaires</h3>
              <p className="text-blue-700 text-sm">
                Gérez les salaires de vos employés, calculez automatiquement les indemnités et déductions, 
                générez les fiches de paie et suivez les coûts salariaux. Tous les montants sont en {defaultCurrency}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Masse salariale totale</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employés payés</p>
                  <p className="text-2xl font-bold text-gray-900">{salaryData.length}</p>
                </div>
                <Calculator className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Salaire moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(Math.round(totalPayroll / salaryData.length))}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fiches générées</p>
                  <p className="text-2xl font-bold text-gray-900">{salaryData.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Résumé par employé */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Résumé des salaires</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salaire de base</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indemnités</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Déductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salaire net</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salaryData.map((salary) => {
                    const employee = employees.find(emp => emp.id === salary.employeeId);
                    const totalAllowances = Object.values(salary.allowances).reduce((sum, val) => sum + val, 0);
                    const totalDeductions = Object.values(salary.deductions).reduce((sum, val) => sum + val, 0);
                    
                    return (
                      <tr key={salary.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={`https://images.unsplash.com/photo-${salary.employeeId === 1 ? '1507003211169-0a1dd7228f2d' : '1472099645785-5658abf4ff4e'}?w=40&h=40&fit=crop`}
                              alt=""
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee?.firstName} {employee?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{employee?.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(salary.baseSalary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          +{formatCurrency(totalAllowances)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          -{formatCurrency(totalDeductions)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(calculateNetSalary(salary))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowPayslipModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Gestion des salaires */}
      {activeTab === "salaries" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Configuration des salaires</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un salaire
            </button>
          </div>
          
          <div className="text-center py-12">
            <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Fonctionnalité de configuration des salaires en cours de développement.
              <br />
              Vous pourrez ici modifier les salaires de base, indemnités et déductions.
            </p>
          </div>
        </div>
      )}

      {/* Fiches de paie */}
      {activeTab === "payslips" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Fiches de paie</h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Générer toutes les fiches
            </button>
          </div>
          
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Génération automatique des fiches de paie en cours de développement.
              <br />
              Vous pourrez ici générer, télécharger et envoyer les fiches de paie par email.
            </p>
          </div>
        </div>
      )}

      {/* Modal fiche de paie */}
      {showPayslipModal && selectedEmployee && (
        <PayslipModal
          employee={selectedEmployee}
          salary={salaryData.find(s => s.employeeId === selectedEmployee.id)}
          onClose={() => {
            setShowPayslipModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default PayrollManagementPage;