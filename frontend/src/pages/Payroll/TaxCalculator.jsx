import React, { useState, useEffect } from "react";
import { systemService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Calculator, Download, History, Info, TrendingUp, AlertCircle } from "lucide-react";
import Loader from '../../components/ui/Loader';

const TaxCalculator = () => {
  const [formData, setFormData] = useState({
    gross_salary: 50000,
    employment_type: 'cdi',
    family_situation: 'single',
    dependents: 0,
    benefits: [],
    deductions: [],
    region: 'ile_de_france'
  });
  
  const [calculation, setCalculation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [benefits, setBenefits] = useState([
    { type: 'meal_vouchers', amount: 0, description: 'Tickets restaurant' },
    { type: 'transport', amount: 0, description: 'Remboursement transport' },
    { type: 'health_insurance', amount: 0, description: 'Mutuelle entreprise' },
    { type: 'company_car', amount: 0, description: 'Véhicule de fonction' },
    { type: 'housing', amount: 0, description: 'Logement de fonction' }
  ]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (formData.gross_salary > 0) {
      calculateTaxes();
    }
  }, [formData]);

  const loadHistory = async () => {
    try {
      // Utiliser les vrais endpoints de paie
      const response = await fetch('/api/v1/payroll/payslips/null/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const payrollData = await response.json();
        const historyData = payrollData?.map(payslip => ({
          gross_salary: payslip.gross_salary,
          family_situation: 'single',
          created_at: payslip.created_at || payslip.processed_date,
          result: {
            net_salary: payslip.net_salary,
            effective_tax_rate: ((payslip.gross_salary - payslip.net_salary) / payslip.gross_salary * 100)
          }
        })) || [];
        setHistory(historyData);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setHistory([]);
    }
  };

  const calculateTaxes = async () => {
    setLoading(true);
    try {
      // Calcul local basé sur les données réelles
      const localResult = calculateTaxesLocal(formData);
      setCalculation(localResult);
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxesLocal = (data) => {
    const grossSalary = data.gross_salary;
    const monthlyGross = grossSalary / 12;
    
    // Cotisations sociales employé (taux 2024)
    const socialContributions = {
      csg_crds: grossSalary * 0.092, // CSG/CRDS 9.2%
      unemployment: grossSalary * 0.024, // Assurance chômage 2.4%
      retirement_base: Math.min(grossSalary, 41136) * 0.0690, // Retraite de base 6.90% (plafond SS)
      retirement_complementary: grossSalary * 0.0387, // Retraite complémentaire 3.87%
      disability: grossSalary * 0.013, // Invalidité-décès 1.3%
      health_insurance: 50 * 12 // Mutuelle forfaitaire
    };
    
    const totalSocialContributions = Object.values(socialContributions).reduce((sum, val) => sum + val, 0);
    
    // Avantages en nature
    const totalBenefits = benefits.reduce((sum, benefit) => sum + benefit.amount, 0);
    
    // Salaire imposable
    const taxableIncome = grossSalary + totalBenefits - (socialContributions.csg_crds * 0.025); // Abattement CSG déductible
    
    // Calcul impôt sur le revenu (barème 2024)
    const incomeTax = calculateIncomeTax(taxableIncome, data.family_situation, data.dependents);
    
    // Salaire net
    const netSalary = grossSalary - totalSocialContributions - incomeTax;
    
    // Coût employeur
    const employerContributions = {
      urssaf: grossSalary * 0.4545, // URSSAF 45.45%
      unemployment_employer: grossSalary * 0.0405, // Chômage employeur 4.05%
      retirement_employer: grossSalary * 0.1545, // Retraite employeur 15.45%
      training: grossSalary * 0.0068, // Formation 0.68%
      transport: data.region === 'ile_de_france' ? grossSalary * 0.0275 : grossSalary * 0.0175, // Transport
      housing: grossSalary * 0.0045, // Effort construction 0.45%
      accidents: grossSalary * 0.0025 // Accidents du travail 0.25% (moyenne)
    };
    
    const totalEmployerContributions = Object.values(employerContributions).reduce((sum, val) => sum + val, 0);
    const totalCost = grossSalary + totalEmployerContributions;
    
    return {
      gross_salary: grossSalary,
      social_contributions: socialContributions,
      total_social_contributions: totalSocialContributions,
      taxable_income: taxableIncome,
      income_tax: incomeTax,
      net_salary: netSalary,
      employer_contributions: employerContributions,
      total_employer_contributions: totalEmployerContributions,
      total_cost: totalCost,
      monthly_net: netSalary / 12,
      effective_tax_rate: (totalSocialContributions + incomeTax) / grossSalary * 100,
      benefits: totalBenefits
    };
  };

  const calculateIncomeTax = (taxableIncome, familySituation, dependents) => {
    // Quotient familial
    let familyQuotient = 1;
    if (familySituation === 'married') familyQuotient = 2;
    if (familySituation === 'pacs') familyQuotient = 2;
    familyQuotient += dependents * 0.5;
    
    const quotientIncome = taxableIncome / familyQuotient;
    
    // Barème progressif 2024
    let tax = 0;
    if (quotientIncome > 10777) {
      tax += Math.min(quotientIncome - 10777, 27478 - 10777) * 0.11;
    }
    if (quotientIncome > 27478) {
      tax += Math.min(quotientIncome - 27478, 78570 - 27478) * 0.30;
    }
    if (quotientIncome > 78570) {
      tax += Math.min(quotientIncome - 78570, 168994 - 78570) * 0.41;
    }
    if (quotientIncome > 168994) {
      tax += (quotientIncome - 168994) * 0.45;
    }
    
    return tax * familyQuotient;
  };

  const exportCalculation = (format) => {
    if (!calculation) return;
    
    // Générer un CSV simple avec les données de calcul
    const csvData = [
      ['Paramètre', 'Valeur'],
      ['Salaire brut annuel', `${calculation.gross_salary.toLocaleString('fr-FR')} €`],
      ['Cotisations sociales', `${calculation.total_social_contributions.toLocaleString('fr-FR')} €`],
      ['Impôt sur le revenu', `${calculation.income_tax.toLocaleString('fr-FR')} €`],
      ['Salaire net annuel', `${calculation.net_salary.toLocaleString('fr-FR')} €`],
      ['Salaire net mensuel', `${calculation.monthly_net.toLocaleString('fr-FR')} €`],
      ['Taux de prélèvement', `${calculation.effective_tax_rate.toFixed(1)}%`],
      ['Coût employeur', `${calculation.total_cost.toLocaleString('fr-FR')} €`]
    ];
    
    const csvContent = csvData.map(row => row.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calcul_fiscal_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleBenefitChange = (index, field, value) => {
    const newBenefits = [...benefits];
    newBenefits[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    setBenefits(newBenefits);
  };

  const getSalaryBracket = (netSalary) => {
    if (netSalary < 1500) return { label: 'SMIC', color: 'text-red-600' };
    if (netSalary < 2500) return { label: 'Salaire moyen', color: 'text-orange-600' };
    if (netSalary < 4000) return { label: 'Salaire élevé', color: 'text-secondary-600' };
    return { label: 'Salaire très élevé', color: 'text-green-600' };
  };

  const bracket = calculation ? getSalaryBracket(calculation.monthly_net) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Calculateur fiscal</h1>
            <p className="text-gray-600">Simulation précise selon la législation française 2024</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" icon={History} onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? 'Simple' : 'Avancé'}
            </Button>
            
            {calculation && (
              <Button variant="outline" icon={Download} onClick={() => exportCalculation('CSV')}>
                Exporter CSV
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de saisie */}
          <div className="lg:col-span-1">
            <Card title="Paramètres de calcul">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire brut annuel (€)
                  </label>
                  <input
                    type="number"
                    value={formData.gross_salary}
                    onChange={(e) => setFormData({...formData, gross_salary: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de contrat
                  </label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({...formData, employment_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="interim">Intérim</option>
                    <option value="stage">Stage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Situation familiale
                  </label>
                  <select
                    value={formData.family_situation}
                    onChange={(e) => setFormData({...formData, family_situation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="single">Célibataire</option>
                    <option value="married">Marié(e)</option>
                    <option value="pacs">Pacsé(e)</option>
                    <option value="divorced">Divorcé(e)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d'enfants à charge
                  </label>
                  <input
                    type="number"
                    value={formData.dependents}
                    onChange={(e) => setFormData({...formData, dependents: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Région
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <option value="ile_de_france">Île-de-France</option>
                    <option value="province">Province</option>
                  </select>
                </div>
              </div>
            </Card>
            
            {/* Avantages en nature */}
            {showAdvanced && (
              <Card title="Avantages en nature" className="mt-6">
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={benefit.type} className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">{benefit.description}</label>
                      </div>
                      <input
                        type="number"
                        value={benefit.amount}
                        onChange={(e) => handleBenefitChange(index, 'amount', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary-500"
                        min="0"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500">€/an</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {/* Résultats */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <div className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <Loader size={32} />
                  </div>
                  <p>Calcul en cours...</p>
                </div>
              </Card>
            ) : calculation ? (
              <div className="space-y-6">
                {/* Résumé */}
                <Card>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Salaire brut</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {calculation.gross_salary.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-sm text-gray-500">
                        {(calculation.gross_salary / 12).toLocaleString('fr-FR')} €/mois
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Salaire net</p>
                      <p className={`text-2xl font-bold ${bracket?.color}`}>
                        {calculation.net_salary.toLocaleString('fr-FR')} €
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-sm text-gray-500">
                          {calculation.monthly_net.toLocaleString('fr-FR')} €/mois
                        </p>
                        {bracket && (
                          <Badge variant="info" size="sm">{bracket.label}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Coût employeur</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {calculation.total_cost.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-sm text-gray-500">
                        {(calculation.total_cost / 12).toLocaleString('fr-FR')} €/mois
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Taux de prélèvement effectif:</span>
                      <span className="font-medium">{calculation.effective_tax_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
                
                {/* Détail cotisations employé */}
                <Card title="Cotisations employé">
                  <div className="space-y-3">
                    {Object.entries(calculation.social_contributions).map(([key, value]) => {
                      const labels = {
                        csg_crds: 'CSG/CRDS (9.2%)',
                        unemployment: 'Assurance chômage (2.4%)',
                        retirement_base: 'Retraite de base (6.9%)',
                        retirement_complementary: 'Retraite complémentaire (3.87%)',
                        disability: 'Invalidité-décès (1.3%)',
                        health_insurance: 'Mutuelle'
                      };
                      
                      return (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{labels[key] || key}</span>
                          <span className="font-medium text-gray-900">
                            -{value.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                      );
                    })}
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Impôt sur le revenu</span>
                        <span className="font-semibold text-red-600">
                          -{calculation.income_tax.toLocaleString('fr-FR')} €
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Total prélèvements</span>
                        <span className="font-bold text-red-600">
                          -{(calculation.total_social_contributions + calculation.income_tax).toLocaleString('fr-FR')} €
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Détail cotisations employeur */}
                {showAdvanced && (
                  <Card title="Cotisations employeur">
                    <div className="space-y-3">
                      {Object.entries(calculation.employer_contributions).map(([key, value]) => {
                        const labels = {
                          urssaf: 'URSSAF (45.45%)',
                          unemployment_employer: 'Chômage employeur (4.05%)',
                          retirement_employer: 'Retraite employeur (15.45%)',
                          training: 'Formation professionnelle (0.68%)',
                          transport: 'Versement transport',
                          housing: 'Effort construction (0.45%)',
                          accidents: 'Accidents du travail (0.25%)'
                        };
                        
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600">{labels[key] || key}</span>
                            <span className="font-medium text-gray-900">
                              +{value.toLocaleString('fr-FR')} €
                            </span>
                          </div>
                        );
                      })}
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Total charges patronales</span>
                          <span className="font-bold text-purple-600">
                            +{calculation.total_employer_contributions.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* Informations légales */}
                <Card>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-secondary-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Informations importantes</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Calculs basés sur la législation française 2024</li>
                        <li>• Taux de prélèvement à la source estimé</li>
                        <li>• Ne tient pas compte des crédits d'impôt spécifiques</li>
                        <li>• Simulation à titre indicatif uniquement</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Saisissez un salaire pour commencer le calcul</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        {/* Historique */}
        {history.length > 0 && (
          <Card title="Historique des calculs">
            <div className="space-y-3">
              {history.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.gross_salary.toLocaleString('fr-FR')} € brut
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.created_at).toLocaleDateString('fr-FR')} - {item.family_situation}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {item.result.net_salary.toLocaleString('fr-FR')} € net
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.result.effective_tax_rate.toFixed(1)}% de prélèvements
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaxCalculator;
