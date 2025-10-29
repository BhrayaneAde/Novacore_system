import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, FileText } from 'lucide-react';

const LeaveRequestForm = ({ isOpen, onClose, onSave, leaveRequest = null }) => {
  const [formData, setFormData] = useState({
    type: 'vacation',
    start_date: '',
    end_date: '',
    reason: '',
    days: 0
  });

  useEffect(() => {
    if (leaveRequest) {
      setFormData({
        type: leaveRequest.type || 'vacation',
        start_date: leaveRequest.start_date || '',
        end_date: leaveRequest.end_date || '',
        reason: leaveRequest.reason || '',
        days: leaveRequest.days || 0
      });
    } else {
      setFormData({
        type: 'vacation',
        start_date: '',
        end_date: '',
        reason: '',
        days: 0
      });
    }
  }, [leaveRequest, isOpen]);

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedDays = calculateDays(formData.start_date, formData.end_date);
    onSave({ ...formData, days: calculatedDays });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'start_date' || name === 'end_date') {
        updated.days = calculateDays(updated.start_date, updated.end_date);
      }
      return updated;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {leaveRequest ? 'Modifier la demande' : 'Demande de congé'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de congé
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vacation">Congés payés</option>
              <option value="sick">Congé maladie</option>
              <option value="personal">Congé personnel</option>
              <option value="maternity">Congé maternité</option>
              <option value="paternity">Congé paternité</option>
              <option value="rtt">RTT</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date de début
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date de fin
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Durée: {formData.days} jour{formData.days > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Motif
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Précisez le motif de votre demande..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {leaveRequest ? 'Modifier' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;