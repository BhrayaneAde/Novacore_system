import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import BarChart from '../../../components/charts/BarChart';
import LineChart from '../../../components/charts/LineChart';
import PieChart from '../../../components/charts/PieChart';

const AdvancedReportsPage = () => {
  const { currentUser, isEmployer, isHRAdmin, isManager } = useAuthStore();
  const [selectedReport, setSelectedReport] = useState('performance');
  const [dateRange, setDateRange] = useState('last_month');

  const reports = {
    performance: {
      title: 'Rapport de Performance',
      description: 'Analyse des performances par équipe et individu',
      data: {
        teamPerformance: [
          { label: 'Design', value: 92 },
          { label: 'Développement', value: 88 },
          { label: 'Marketing', value: 85 },
          { label: 'Ventes', value: 94 }
        ],
        individualTop: [
          { name: 'Emma Rousseau', score: 96, department: 'Marketing' },
          { name: 'Pierre Moreau', score: 94, department: 'Ventes' },
          { name: 'Thomas Dubois', score: 92, department: 'Design' }
        ],
        trends: [
          { label: 'Jan', value: 85 },
          { label: 'Fév', value: 87 },
          { label: 'Mar', value: 89 },
          { label: 'Avr', value: 91 },
          { label: 'Mai', value: 90 }
        ]
      }
    },
    attendance: {
      title: 'Rapport de Présence',
      description: 'Suivi des présences et absences',
      data: {
        attendanceRate: [
          { label: 'Design', value: 96 },
          { label: 'Développement', value: 94 },
          { label: 'Marketing', value: 98 },
          { label: 'Ventes', value: 92 }
        ],
        absenceTypes: [
          { label: 'Congés payés', value: 45 },
          { label: 'Maladie', value: 20 },
          { label: 'RTT', value: 25 },
          { label: 'Formation', value: 10 }
        ],
        monthlyTrend: [
          { label: 'Jan', value: 95 },
          { label: 'Fév', value: 94 },
          { label: 'Mar', value: 96 },
          { label: 'Avr', value: 95 },
          { label: 'Mai', value: 97 }
        ]
      }
    },
    payroll: {
      title: 'Rapport Masse Salariale',
      description: 'Analyse des coûts salariaux',
      data: {
        departmentCosts: [
          { label: 'Développement', value: 45000 },
          { label: 'Marketing', value: 38000 },
          { label: 'Ventes', value: 42000 },
          { label: 'Design', value: 35000 }
        ],
        costEvolution: [
          { label: 'Jan', value: 155000 },
          { label: 'Fév', value: 158000 },
          { label: 'Mar', value: 160000 },
          { label: 'Avr', value: 162000 },
          { label: 'Mai', value: 160000 }
        ],
        breakdown: [
          { label: 'Salaires base', value: 75 },
          { label: 'Primes', value: 15 },
          { label: 'Charges', value: 10 }
        ]
      }
    },
    recruitment: {
      title: 'Rapport Recrutement',
      description: 'Efficacité du processus de recrutement',
      data: {
        sourceEffectiveness: [
          { label: 'LinkedIn', value: 35 },
          { label: 'Site web', value: 25 },
          { label: 'Cooptation', value: 30 },
          { label: 'Autres', value: 10 }
        ],
        hiringTrend: [
          { label: 'Jan', value: 2 },
          { label: 'Fév', value: 1 },
          { label: 'Mar', value: 3 },
          { label: 'Avr', value: 2 },
          { label: 'Mai', value: 4 }
        ],
        timeToHire: [
          { label: 'Développeur', value: 28 },
          { label: 'Designer', value: 21 },
          { label: 'Marketing', value: 35 },
          { label: 'Commercial', value: 25 }
        ]
      }
    }
  };

  const getAvailableReports = () => {
    if (isEmployer()) return Object.keys(reports);
    if (isHRAdmin()) return ['performance', 'attendance', 'recruitment'];
    if (isManager()) return ['performance', 'attendance'];
    return ['performance'];
  };

  const availableReports = getAvailableReports();
  const currentReport = reports[selectedReport];

  const exportReport = () => {
    // Simulation d'export
    const data = JSON.stringify(currentReport.data, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports Avancés</h1>
        <p className="text-gray-600">Analyses détaillées et insights business</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de rapport</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {availableReports.map(key => (
                  <option key={key} value={key}>{reports[key].title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="last_week">7 derniers jours</option>
                <option value="last_month">30 derniers jours</option>
                <option value="last_quarter">Dernier trimestre</option>
                <option value="last_year">Dernière année</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            <button
              onClick={exportReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{currentReport.title}</h2>
            <p className="text-gray-600">{currentReport.description}</p>
          </div>

          {/* Performance Report */}
          {selectedReport === 'performance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart
                  title="Performance par équipe"
                  color="blue"
                  data={currentReport.data.teamPerformance}
                />
                <LineChart
                  title="Évolution performance"
                  color="green"
                  data={currentReport.data.trends}
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {currentReport.data.individualTop.map((person, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-sm text-gray-600">{person.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{person.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Report */}
          {selectedReport === 'attendance' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart
                  title="Taux de présence par équipe"
                  color="green"
                  data={currentReport.data.attendanceRate}
                />
                <PieChart
                  title="Types d'absences"
                  data={currentReport.data.absenceTypes}
                />
              </div>
              
              <LineChart
                title="Évolution mensuelle"
                color="blue"
                data={currentReport.data.monthlyTrend}
              />
            </div>
          )}

          {/* Payroll Report */}
          {selectedReport === 'payroll' && isEmployer() && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart
                  title="Coûts par département (€)"
                  color="purple"
                  data={currentReport.data.departmentCosts}
                />
                <PieChart
                  title="Répartition des coûts"
                  data={currentReport.data.breakdown}
                />
              </div>
              
              <LineChart
                title="Évolution masse salariale (€)"
                color="red"
                data={currentReport.data.costEvolution}
              />
            </div>
          )}

          {/* Recruitment Report */}
          {selectedReport === 'recruitment' && (isEmployer() || isHRAdmin()) && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PieChart
                  title="Sources de recrutement"
                  data={currentReport.data.sourceEffectiveness}
                />
                <BarChart
                  title="Temps de recrutement (jours)"
                  color="orange"
                  data={currentReport.data.timeToHire}
                />
              </div>
              
              <LineChart
                title="Embauches par mois"
                color="green"
                data={currentReport.data.hiringTrend}
              />
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Tendance</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">+5.2%</p>
            <p className="text-sm text-gray-600">vs mois précédent</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Équipes</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-600">départements analysés</p>
          </div>
          
          {isEmployer() && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">ROI</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">127%</p>
              <p className="text-sm text-gray-600">retour investissement</p>
            </div>
          )}
          
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Dernière MAJ</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">2h</p>
            <p className="text-sm text-gray-600">données temps réel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportsPage;