import { useState } from 'react';
import { Bell, X, CheckCircle, Clock, Users, AlertCircle } from 'lucide-react';
import { managerNominations } from '../data/managerNominations';
import { employees, users } from '../data/mockData';
import { useAuthStore } from '../store/useAuthStore';

const NotificationCenter = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const pendingNominations = managerNominations.filter(n => n.status === 'pending');
  
  const notifications = [
    ...pendingNominations.map(nomination => {
      const employee = employees.find(emp => emp.id === nomination.proposedManagerId);
      const proposer = users.find(u => u.id === nomination.proposedBy);
      
      return {
        id: `nomination-${nomination.id}`,
        type: 'manager_nomination',
        title: 'Nouvelle nomination de manager',
        message: `${proposer?.firstName} ${proposer?.lastName} propose ${employee?.firstName} ${employee?.lastName} comme manager`,
        time: nomination.proposedAt,
        icon: Users,
        color: 'blue',
        actionRequired: user?.role === 'employer'
      };
    })
  ];

  const unreadCount = notifications.filter(n => n.actionRequired).length;

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          notification.actionRequired ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              notification.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.time)}
                              </span>
                              {notification.actionRequired && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  Action requise
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;