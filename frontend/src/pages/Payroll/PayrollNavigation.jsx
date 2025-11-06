import React from 'react';
import { 
  Calculator, 
  FileText, 
  Settings, 
  TrendingUp, 
  Users, 
  CreditCard,
  PieChart,
  Calendar,
  Building,
  Receipt,
  DollarSign,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

const PayrollNavigation = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    {
      id: 'overview',
      name: 'Vue d\'ensemble',
      icon: TrendingUp,
      description: 'Tableau de bord principal'
    },
    {
      id: 'variables',
      name: 'Variables de Paie',
      icon: Settings,
      description: 'Configuration des variables'
    },
    {
      id: 'calculation',
      name: 'Calcul de Paie',
      icon: Calculator,
      description: 'Moteur de calcul'
    },
    {
      id: 'payslips',
      name: 'Bulletins de Paie',
      icon: FileText,
      description: 'Génération et gestion'
    },
    {
      id: 'accounting',
      name: 'Comptabilité',
      icon: BookOpen,
      description: 'Écritures comptables'
    },
    {
      id: 'social-declarations',
      name: 'Déclarations Sociales',
      icon: Building,
      description: 'CNSS, DISA, etc.'
    },
    {
      id: 'advanced-management',
      name: 'Gestion Avancée',
      icon: CreditCard,
      description: 'Prêts, avances, saisies'
    },
    {
      id: 'reports',
      name: 'Reporting',
      icon: PieChart,
      description: 'Analyses et rapports'
    },
    {
      id: 'workflow',
      name: 'Workflow',
      icon: AlertTriangle,
      description: 'Processus et validations'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <IconComponent className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                <div>
                  <div className={`font-medium text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PayrollNavigation;