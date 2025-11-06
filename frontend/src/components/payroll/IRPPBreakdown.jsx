import React, { useState, useEffect } from 'react';
import { Calculator, X } from 'lucide-react';
import { payrollCalculationAPI } from '../../services/api';

const IRPPBreakdown = ({ taxableIncome, onClose }) => {
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBreakdown();
  }, [taxableIncome]);

  const loadBreakdown = async () => {
    try {
      const response = await payrollCalculationAPI.getIRPPBreakdown(taxableIncome);
      setBreakdown(response.data || []);
    } catch (error) {
      console.error('Erreur chargement détail IRPP:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalTax = breakdown.reduce((sum, item) => sum + item.tax_amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">
                Détail calcul IRPP
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="text-sm text-gray-600">Revenu imposable</div>
            <div className="text-2xl font-bold text-gray-900">
              {taxableIncome.toLocaleString()} FCFA
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Calcul par tranches</h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tranche</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Barème</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Taux</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Base</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Impôt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {breakdown.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          Tranche {item.tranche}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {item.min.toLocaleString()} - {item.max ? item.max.toLocaleString() : '∞'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {item.rate}%
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900">
                          {item.taxable_amount.toLocaleString()} FCFA
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-blue-600">
                          {item.tax_amount.toLocaleString()} FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                        Total IRPP:
                      </td>
                      <td className="px-4 py-2 text-sm font-bold text-blue-600 text-right">
                        {totalTax.toLocaleString()} FCFA
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Barème IRPP Sénégal 2024</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>• 0 à 630 000 FCFA: 0%</div>
                  <div>• 630 001 à 1 500 000 FCFA: 20%</div>
                  <div>• 1 500 001 à 4 000 000 FCFA: 30%</div>
                  <div>• 4 000 001 à 8 300 000 FCFA: 35%</div>
                  <div>• Plus de 8 300 000 FCFA: 40%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IRPPBreakdown;