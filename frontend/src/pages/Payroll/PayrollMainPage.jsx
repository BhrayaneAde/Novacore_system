import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PayrollNavigation from './PayrollNavigation';
import PayrollOverview from './PayrollOverview';
import PayrollVariablesManager from '../Settings/PayrollVariablesManager';
import PayrollCalculationEngine from './PayrollCalculationEngine';
import PayslipManagement from './PayslipManagement';
import PayrollAccounting from './PayrollAccounting';
import SocialDeclarations from './SocialDeclarations';
import AdvancedPayrollManagement from './AdvancedPayrollManagement';
import PayrollReporting from './PayrollReporting';
import PayrollWorkflow from './PayrollWorkflow';

const PayrollMainPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PayrollOverview setActiveTab={setActiveTab} />;
      case 'variables':
        return <PayrollVariablesManager />;
      case 'calculation':
        return <PayrollCalculationEngine />;
      case 'payslips':
        return <PayslipManagement />;
      case 'accounting':
        return <PayrollAccounting />;
      case 'social-declarations':
        return <SocialDeclarations />;
      case 'advanced-management':
        return <AdvancedPayrollManagement />;
      case 'reports':
        return <PayrollReporting />;
      case 'workflow':
        return <PayrollWorkflow />;
      default:
        return <PayrollOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Module de Paie Complet</h1>
          <p className="text-gray-600">Gestion complète de la paie et des déclarations sociales</p>
        </div>

        {/* Navigation */}
        <PayrollNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PayrollMainPage;