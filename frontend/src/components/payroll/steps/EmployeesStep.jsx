import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Users, Search, UserCheck } from 'lucide-react';

const EmployeesStep = ({ data = {}, onChange, onValidate }) => {
  const [employees] = useState([
    { id: 1, name: 'Jean Dupont', position: 'Développeur', department: 'IT', baseSalary: 400000, status: 'active' },
    { id: 2, name: 'Marie Martin', position: 'Designer', department: 'Design', baseSalary: 350000, status: 'active' },
    { id: 3, name: 'Paul Durand', position: 'Manager', department: 'Management', baseSalary: 600000, status: 'active' },
    { id: 4, name: 'Sophie Bernard', position: 'Comptable', department: 'Finance', baseSalary: 450000, status: 'active' },
    { id: 5, name: 'Luc Moreau', position: 'Commercial', department: 'Ventes', baseSalary: 380000, status: 'active' }
  ]);

  const [selectedEmployees, setSelectedEmployees] = useState(data.selectedEmployees || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const stepData = { selectedEmployees };
    onChange && onChange(stepData);
    onValidate && onValidate(selectedEmployees.length > 0);
  }, [selectedEmployees]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeToggle = (employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.some(emp => emp.id === employee.id);
      if (isSelected) {
        return prev.filter(emp => emp.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees([...filteredEmployees]);
    }
    setSelectAll(!selectAll);
  };

  const isEmployeeSelected = (employeeId) => {
    return selectedEmployees.some(emp => emp.id === employeeId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sélection des Employés
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="default">
              {selectedEmployees.length} sélectionné{selectedEmployees.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline">
              {employees.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              size="sm"
            >
              {selectAll ? 'Désélectionner tout' : 'Sélectionner tout'}
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  isEmployeeSelected(employee.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleEmployeeToggle(employee)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isEmployeeSelected(employee.id)}
                      onChange={() => handleEmployeeToggle(employee)}
                    />
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">
                        {employee.position} • {employee.department}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {employee.baseSalary.toLocaleString()} XOF
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {employee.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucun employé trouvé</p>
            </div>
          )}

          {selectedEmployees.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Employés sélectionnés ({selectedEmployees.length})
                </h4>
                <div className="space-y-2">
                  {selectedEmployees.map((employee) => (
                    <div key={employee.id} className="flex justify-between items-center text-sm">
                      <span>{employee.name}</span>
                      <span className="text-gray-600">
                        {employee.baseSalary.toLocaleString()} XOF
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex justify-between font-medium">
                    <span>Total salaires de base:</span>
                    <span>
                      {selectedEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0).toLocaleString()} XOF
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedEmployees.length === 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Sélectionnez au moins un employé pour continuer la configuration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesStep;