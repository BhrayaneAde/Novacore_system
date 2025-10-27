import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeesService, systemService } from "../../services";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ArrowLeft, Play, CheckCircle, AlertTriangle, Download, Eye, Calculator, FileText, Users, Euro } from "lucide-react";

const PayrollProcess = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [calculations, setCalculations] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('draft');

  const steps = [
    { id: 1, title: "Sélection de la période", completed: step > 1 },
    { id: 2, title: "Vérification des données", completed: step > 2 },
    { id: 3, title: "Calcul des salaires", completed: step > 3 },
    { id: 4, title: "Validation et génération", completed: step > 4 },
    { id: 5, title: "Finalisation", completed: step > 5 }
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedPeriod && step >= 2) {
      loadPayrollData();
    }
  }, [selectedPeriod, step]);

  const loadEmployees = async () => {
    try {
      const data = await employeesService.getAll();
      setEmployees(data?.filter(emp => emp.status === 'active') || []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    }
  };

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedPeriod.split('-');
      
      // Charger les données de présence et heures
      const attendanceData = await systemService.payroll.getAttendanceData(year, month);
      const overtimeData = await systemService.payroll.getOvertimeData(year, month);
      const leaveData = await systemService.payroll.getLeaveData(year, month);
      
      // Combiner les données par employé
      const payrollEntries = employees.map(employee => {
        const attendance = attendanceData?.find(a => a.employee_id === employee.id) || {};
        const overtime = overtimeData?.find(o => o.employee_id === employee.id) || {};
        const leaves = leaveData?.filter(l => l.employee_id === employee.id) || [];
        
        return {
          employee_id: employee.id,
          employee_name: `${employee.first_name} ${employee.last_name}`,
          department: employee.department,
          position: employee.position,
          base_salary: employee.salary || 0,
          worked_hours: attendance.total_hours || 0,
          overtime_hours: overtime.total_hours || 0,
          leave_days: leaves.reduce((sum, leave) => sum + (leave.days || 0), 0),
          sick_days: leaves.filter(l => l.leave_type === 'sick').reduce((sum, leave) => sum + (leave.days || 0), 0),
          attendance_rate: attendance.attendance_rate || 100,
          bonuses: employee.bonuses || [],
          deductions: employee.deductions || []
        };
      });
      
      setPayrollData(payrollEntries);
    } catch (error) {
      console.error('Erreur lors du chargement des données de paie:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = async () => {
    try {
      setLoading(true);
      const calculatedData = {};
      
      for (const entry of payrollData) {
        const calc = calculateEmployeePayroll(entry);
        calculatedData[entry.employee_id] = calc;
      }
      
      setCalculations(calculatedData);
      
      // Vérifier les erreurs
      const errors = validateCalculations(calculatedData);
      setValidationErrors(errors);
      
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEmployeePayroll = (employee) => {
    const baseSalary = employee.base_salary;
    const hourlyRate = baseSalary / (35 * 4.33); // Taux horaire basé sur 35h/semaine
    
    // Calcul du salaire de base (prorata si nécessaire)
    const expectedHours = 35 * 4.33; // Heures attendues par mois
    const workedHours = employee.worked_hours;
    const salaryProrata = (workedHours / expectedHours) * baseSalary;
    
    // Heures supplémentaires (majoration 25% puis 50%)
    const overtime25 = Math.min(employee.overtime_hours, 8) * hourlyRate * 1.25;
    const overtime50 = Math.max(employee.overtime_hours - 8, 0) * hourlyRate * 1.50;
    const overtimePay = overtime25 + overtime50;
    
    // Primes et indemnités
    const bonuses = employee.bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    
    // Salaire brut
    const grossSalary = salaryProrata + overtimePay + bonuses;
    
    // Cotisations sociales (taux 2024 France)
    const socialContributions = {
      // Cotisations employé
      csg_crds: grossSalary * 0.092, // CSG/CRDS 9.2%
      assurance_chomage: grossSalary * 0.024, // Assurance chômage 2.4%
      retraite_base: Math.min(grossSalary, 3428) * 0.0690, // Retraite de base 6.90%
      retraite_complementaire: grossSalary * 0.0387, // Retraite complémentaire 3.87%
      prevoyance: grossSalary * 0.013, // Prévoyance 1.3%
      mutuelle: 50 // Mutuelle forfaitaire
    };
    
    const totalSocialContributions = Object.values(socialContributions).reduce((sum, val) => sum + val, 0);
    
    // Déductions diverses
    const deductions = employee.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    
    // Salaire imposable
    const taxableSalary = grossSalary - socialContributions.csg_crds * 0.025; // Abattement CSG déductible
    
    // Prélèvement à la source (estimation 10% par défaut)
    const incomeTax = taxableSalary * 0.10;
    
    // Salaire net
    const netSalary = grossSalary - totalSocialContributions - incomeTax - deductions;
    
    // Coût employeur
    const employerContributions = {
      urssaf: grossSalary * 0.4545, // URSSAF 45.45%
      assurance_chomage: grossSalary * 0.0405, // Assurance chômage employeur 4.05%
      retraite: grossSalary * 0.1545, // Retraite employeur 15.45%
      formation: grossSalary * 0.0068, // Formation professionnelle 0.68%
      transport: grossSalary * 0.0175, // Versement transport 1.75%
      cet: grossSalary * 0.0034 // Contribution économique territoriale 0.34%
    };
    
    const totalEmployerContributions = Object.values(employerContributions).reduce((sum, val) => sum + val, 0);
    const totalCost = grossSalary + totalEmployerContributions;
    
    return {
      employee_id: employee.employee_id,
      base_salary: baseSalary,
      worked_hours: workedHours,
      overtime_hours: employee.overtime_hours,
      overtime_pay: overtimePay,
      bonuses,
      gross_salary: grossSalary,
      social_contributions: socialContributions,
      total_social_contributions: totalSocialContributions,
      taxable_salary: taxableSalary,
      income_tax: incomeTax,
      deductions,
      net_salary: netSalary,
      employer_contributions: employerContributions,
      total_employer_contributions: totalEmployerContributions,
      total_cost: totalCost
    };
  };

  const validateCalculations = (calculations) => {
    const errors = [];
    
    Object.values(calculations).forEach(calc => {
      const employee = payrollData.find(e => e.employee_id === calc.employee_id);
      
      // Vérifications
      if (calc.net_salary < 0) {
        errors.push({
          type: 'error',
          employee: employee.employee_name,
          message: 'Salaire net négatif'
        });
      }
      
      if (calc.net_salary < 1398.69) { // SMIC 2024
        errors.push({
          type: 'warning',
          employee: employee.employee_name,
          message: 'Salaire net inférieur au SMIC'
        });
      }
      
      if (calc.overtime_hours > 48) {
        errors.push({
          type: 'warning',
          employee: employee.employee_name,
          message: 'Plus de 48h supplémentaires (limite légale)'
        });
      }
    });
    
    return errors;
  };

  const generatePayslips = async () => {
    try {
      setLoading(true);
      setProcessingStatus('generating');
      
      // Simulation de génération des bulletins
      for (const employeeId of Object.keys(calculations)) {
        await systemService.payroll.generatePayslip({
          employee_id: employeeId,
          period: selectedPeriod,
          calculation: calculations[employeeId]
        });
      }
      
      setProcessingStatus('completed');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setProcessingStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const finalizePayroll = async () => {
    try {
      setLoading(true);
      
      await systemService.payroll.finalize({
        period: selectedPeriod,
        calculations,
        total_employees: payrollData.length,
        total_gross: Object.values(calculations).reduce((sum, calc) => sum + calc.gross_salary, 0),
        total_net: Object.values(calculations).reduce((sum, calc) => sum + calc.net_salary, 0),
        total_cost: Object.values(calculations).reduce((sum, calc) => sum + calc.total_cost, 0)
      });
      
      navigate('/payroll');
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 2) {
      calculatePayroll();
    } else if (step === 4) {
      generatePayslips();
    }
    setStep(step + 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedPeriod !== '';
      case 2: return payrollData.length > 0;
      case 3: return Object.keys(calculations).length > 0 && validationErrors.filter(e => e.type === 'error').length === 0;
      case 4: return processingStatus === 'completed';
      default: return true;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/payroll")}>
            Retour
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Traitement de la paie</h1>
        </div>

        {/* Progress Steps */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      s.completed ? "bg-green-600 text-white" :
                      s.id === step ? "bg-blue-600 text-white" :
                      "bg-gray-200 text-gray-600"
                    }`}>
                      {s.completed ? <CheckCircle className="w-6 h-6" /> : s.id}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2 text-center">{s.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 ${
                      s.completed ? "bg-green-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Step Content */}
        <Card>
          <div className="p-6">
            {/* Étape 1: Sélection période */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Sélection de la période de paie</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Période de paie
                    </label>
                    <select 
                      value={selectedPeriod} 
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une période</option>
                      <option value="2024-12">Décembre 2024</option>
                      <option value="2024-11">Novembre 2024</option>
                      <option value="2024-10">Octobre 2024</option>
                      <option value="2024-09">Septembre 2024</option>
                    </select>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Informations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• {employees.length} employés actifs</li>
                      <li>• Calculs selon législation française 2024</li>
                      <li>• Prélèvement à la source inclus</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2: Vérification données */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Vérification des données employés</h3>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p>Chargement des données...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payrollData.map((employee) => (
                      <div key={employee.employee_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{employee.employee_name}</h4>
                            <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{employee.base_salary.toLocaleString('fr-FR')} €</p>
                            <p className="text-sm text-gray-600">{employee.worked_hours}h travaillées</p>
                          </div>
                        </div>
                        
                        {employee.overtime_hours > 0 && (
                          <div className="mt-2 text-sm text-orange-600">
                            +{employee.overtime_hours}h supplémentaires
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Étape 3: Calculs */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Résultats des calculs</h3>
                </div>
                
                {validationErrors.length > 0 && (
                  <div className="space-y-2">
                    {validationErrors.map((error, index) => (
                      <div key={index} className={`p-3 rounded-lg flex items-center gap-2 ${
                        error.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">
                          <strong>{error.employee}:</strong> {error.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900">Total Brut</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {Object.values(calculations).reduce((sum, calc) => sum + calc.gross_salary, 0).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">Total Net</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {Object.values(calculations).reduce((sum, calc) => sum + calc.net_salary, 0).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900">Coût Total</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.values(calculations).reduce((sum, calc) => sum + calc.total_cost, 0).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 4: Génération */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Génération des bulletins</h3>
                </div>
                
                <div className="text-center py-8">
                  {processingStatus === 'draft' && (
                    <div>
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Prêt à générer {Object.keys(calculations).length} bulletins de paie</p>
                    </div>
                  )}
                  
                  {processingStatus === 'generating' && (
                    <div>
                      <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-blue-600">Génération en cours...</p>
                    </div>
                  )}
                  
                  {processingStatus === 'completed' && (
                    <div>
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <p className="text-green-600 font-medium">Bulletins générés avec succès</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Étape 5: Finalisation */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Finalisation du traitement</h3>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-4">Traitement terminé</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Période:</span>
                      <span className="font-medium ml-2">{selectedPeriod}</span>
                    </div>
                    <div>
                      <span className="text-green-700">Employés:</span>
                      <span className="font-medium ml-2">{payrollData.length}</span>
                    </div>
                    <div>
                      <span className="text-green-700">Total net:</span>
                      <span className="font-medium ml-2">
                        {Object.values(calculations).reduce((sum, calc) => sum + calc.net_salary, 0).toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">Coût total:</span>
                      <span className="font-medium ml-2">
                        {Object.values(calculations).reduce((sum, calc) => sum + calc.total_cost, 0).toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" icon={Download}>
                    Télécharger le récapitulatif
                  </Button>
                  <Button variant="outline" icon={Eye}>
                    Voir les bulletins
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <div className="flex gap-3 p-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/payroll')}
            >
              {step > 1 ? 'Précédent' : 'Annuler'}
            </Button>
            
            {step < 5 ? (
              <Button 
                icon={Play} 
                className="flex-1" 
                onClick={nextStep}
                disabled={!canProceed() || loading}
              >
                {loading ? 'Traitement...' : 'Continuer'}
              </Button>
            ) : (
              <Button 
                icon={CheckCircle} 
                className="flex-1 bg-green-600 hover:bg-green-700" 
                onClick={finalizePayroll}
                disabled={loading}
              >
                {loading ? 'Finalisation...' : 'Finaliser'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PayrollProcess;
