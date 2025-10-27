import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import PermissionGuard from "../../components/auth/PermissionGuard";
import { BarChart3, Download, Calendar, Users, DollarSign, Clock, TrendingUp, FileText } from "lucide-react";

const ReportsCenter = () => {
  const { currentCompany, hasPermission } = useAuthStore();
  const { getCompanyEmployees, getEmployeeStats } = useHRStore();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const companyEmployees = getCompanyEmployees(currentCompany?.id);
  const stats = getEmployeeStats(currentCompany?.id);

  const reportCategories = [
    {
      id: "hr",
      name: "Ressources Humaines",
      icon: Users,
      color: "blue",
      reports: [
        {
          id: "employee-overview",
          name: "Vue d'ensemble des employés",
          description: "Statistiques générales sur les effectifs",
          permission: "employees.view"
        },
        {
          id: "turnover-analysis",
          name: "Analyse du turnover",
          description: "Taux de rotation et tendances",
          permission: "reports.view"
        },
        {
          id: "diversity-report",
          name: "Rapport de diversité",
          description: "Répartition par genre, âge, département",
          permission: "reports.view"
        }
      ]
    },
    {
      id: "attendance",
      name: "Présences & Temps",
      icon: Clock,
      color: "green",
      reports: [
        {
          id: "attendance-summary",
          name: "Résumé des présences",
          description: "Taux de présence par département",
          permission: "attendance.view"
        },
        {
          id: "overtime-report",
          name: "Rapport heures supplémentaires",
          description: "Analyse des heures supplémentaires",
          permission: "timetracking.view"
        },
        {
          id: "leave-analysis",
          name: "Analyse des congés",
          description: "Utilisation des congés par type",
          permission: "leaves.view"
        }
      ]
    },
    {
      id: "payroll",
      name: "Paie & Coûts",
      icon: DollarSign,
      color: "purple",
      reports: [
        {
          id: "payroll-summary",
          name: "Résumé de paie",
          description: "Coûts salariaux par département",
          permission: "payroll.view"
        },
        {
          id: "cost-analysis",
          name: "Analyse des coûts RH",
          description: "Évolution des coûts RH",
          permission: "payroll.view"
        },
        {
          id: "benefits-usage",
          name: "Utilisation des avantages",
          description: "Statistiques sur les avantages sociaux",
          permission: "payroll.view"
        }
      ]
    },
    {
      id: "performance",
      name: "Performance",
      icon: TrendingUp,
      color: "orange",
      reports: [
        {
          id: "goals-progress",
          name: "Progression des objectifs",
          description: "Suivi des objectifs individuels et d'équipe",
          permission: "performance.view"
        },
        {
          id: "review-summary",
          name: "Résumé des évaluations",
          description: "Synthèse des évaluations de performance",
          permission: "performance.view"
        },
        {
          id: "training-effectiveness",
          name: "Efficacité des formations",
          description: "Impact des formations sur la performance",
          permission: "performance.view"
        }
      ]
    }
  ];

  const quickStats = [
    {
      title: "Employés actifs",
      value: stats.active,
      change: "+5%",
      changeType: "positive",
      icon: Users
    },
    {
      title: "Taux de présence",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: Clock
    },
    {
      title: "Coût salarial mensuel",
      value: "€284K",
      change: "+3.2%",
      changeType: "neutral",
      icon: DollarSign
    },
    {
      title: "Satisfaction moyenne",
      value: "4.3/5",
      change: "+0.2",
      changeType: "positive",
      icon: TrendingUp
    }
  ];

  const generateReport = async (reportId) => {
    try {
      setLoading(true);
      
      // Utiliser le vrai endpoint de génération de rapports
      const reportData = await systemService.reports.generate(reportId, {
        period: selectedPeriod,
        company_id: currentCompany?.id,
        filters: getReportFilters(reportId)
      });
      
      // Afficher les données dans une nouvelle fenêtre
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(`
        <html>
          <head>
            <title>Rapport ${reportId}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Rapport généré - ${reportId}</h1>
            <p>Période: ${selectedPeriod}</p>
            <div id="content">
              ${formatReportData(reportData.data)}
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération du rapport');
    } finally {
      setLoading(false);
    }
  };

  const formatReportData = (data) => {
    if (!data || data.length === 0) return '<p>Aucune donnée disponible</p>';
    
    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = data.map(row => 
      `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
    ).join('');
    
    return `
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${dataRows}</tbody>
      </table>
    `;
  };

  const exportReport = async (reportId, format) => {
    try {
      setLoading(true);
      
      // Utiliser le vrai endpoint d'export
      const blob = await systemService.reports.export(reportId, format, {
        period: selectedPeriod,
        company_id: currentCompany?.id
      });
      
      // Télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportId}_${selectedPeriod}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export du rapport');
    } finally {
      setLoading(false);
    }
  };

  const getReportFilters = (reportId) => {
    const baseFilters = {
      departments: [],
      employees: [],
      date_range: {
        start: getStartDate(selectedPeriod),
        end: getEndDate(selectedPeriod)
      }
    };
    
    // Filtres spécifiques par type de rapport
    switch (reportId) {
      case 'attendance-summary':
        return { ...baseFilters, include_overtime: true, include_breaks: true };
      case 'payroll-summary':
        return { ...baseFilters, include_taxes: true, include_benefits: true };
      case 'turnover-analysis':
        return { ...baseFilters, include_reasons: true, include_demographics: true };
      default:
        return baseFilters;
    }
  };

  const getStartDate = (period) => {
    switch (period) {
      case 'week': return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      case 'month': return new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      case 'quarter': return new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1).toISOString().split('T')[0];
      case 'year': return new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
      default: return new Date().toISOString().split('T')[0];
    }
  };

  const getEndDate = (period) => {
    switch (period) {
      case 'week': return new Date().toISOString().split('T')[0];
      case 'month': return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
      case 'quarter': return new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 + 3, 0).toISOString().split('T')[0];
      case 'year': return new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];
      default: return new Date().toISOString().split('T')[0];
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Centre de Rapports</h1>
            <p className="text-gray-600">Analysez vos données RH avec des rapports détaillés</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            
            <Button variant="outline" icon={Calendar}>
              Période personnalisée
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs période précédente</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-${stat.changeType === 'positive' ? 'green' : 'blue'}-50 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.changeType === 'positive' ? 'green' : 'blue'}-600`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Catégories de rapports */}
        <div className="space-y-8">
          {reportCategories.map((category) => (
            <PermissionGuard key={category.id} permission="reports.view">
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${category.color}-50 rounded-lg flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.reports.length} rapports disponibles</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.reports.map((report) => (
                      <PermissionGuard key={report.id} permission={report.permission}>
                        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                              <p className="text-sm text-gray-600">{report.description}</p>
                            </div>
                            <FileText className="w-5 h-5 text-gray-400 ml-2" />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateReport(report.id)}
                              disabled={loading}
                            >
                              {loading ? 'Génération...' : 'Générer'}
                            </Button>
                            
                            <div className="relative group">
                              <Button 
                                size="sm" 
                                variant="outline"
                                icon={Download}
                                disabled={loading}
                              >
                                Export
                              </Button>
                              
                              {/* Menu déroulant formats */}
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => exportReport(report.id, 'PDF')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    disabled={loading}
                                  >
                                    PDF
                                  </button>
                                  <button
                                    onClick={() => exportReport(report.id, 'EXCEL')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    disabled={loading}
                                  >
                                    Excel
                                  </button>
                                  <button
                                    onClick={() => exportReport(report.id, 'CSV')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    disabled={loading}
                                  >
                                    CSV
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PermissionGuard>
                    ))}
                  </div>
                </div>
              </Card>
            </PermissionGuard>
          ))}
        </div>

        {/* Rapports récents */}
        <Card title="Rapports récents">
          <div className="space-y-3">
            {[
              {
                name: "Rapport mensuel des présences",
                generatedBy: "Marie Lefebvre",
                date: "2025-01-20",
                format: "PDF",
                size: "2.4 MB"
              },
              {
                name: "Analyse des coûts RH Q4",
                generatedBy: "Sophie Martin",
                date: "2025-01-18",
                format: "Excel",
                size: "1.8 MB"
              },
              {
                name: "Rapport de diversité 2024",
                generatedBy: "Marie Lefebvre",
                date: "2025-01-15",
                format: "PDF",
                size: "3.1 MB"
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Par {report.generatedBy}</span>
                      <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                      <Badge variant="info" size="sm">{report.format}</Badge>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon={Eye}>
                    Voir
                  </Button>
                  <Button variant="outline" size="sm" icon={Download}>
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsCenter;