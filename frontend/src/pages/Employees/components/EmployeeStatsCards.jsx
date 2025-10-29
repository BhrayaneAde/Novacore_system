import React from 'react';
import { useHRStore } from '../../../store/useHRStore';
import Card from '../../../components/ui/Card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const EmployeeStatsCards = () => {
  const { getEmployeeStats } = useHRStore();
  const stats = getEmployeeStats();

  const statsCards = [
    {
      title: 'Total Employés',
      value: stats.total,
      icon: Users,
      color: 'text-secondary-600',
      bgColor: 'bg-blue-50',
      change: '+2 ce mois'
    },
    {
      title: 'Employés Actifs',
      value: stats.active,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `${Math.round((stats.active / stats.total) * 100)}% du total`
    },
    {
      title: 'En Congé',
      value: stats.onLeave,
      icon: UserX,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: `${Math.round((stats.onLeave / stats.total) * 100)}% du total`
    },
    {
      title: 'Croissance',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'vs année dernière'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeStatsCards;