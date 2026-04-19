import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { Users, UserCheck, Briefcase, TrendingUp } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (employeeType) => {
    if (employeeType === 'All') {
      navigate(`/employees?status=Active`);
    } else {
      navigate(`/employees?type=${encodeURIComponent(employeeType)}&status=Active`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Full Time Employees',
      value: stats?.full_time_count || 0,
      icon: Users,
      gradient: 'from-ironman-red to-ironman-darkRed',
      iconBg: 'bg-ironman-red/20',
      type: 'Full Time',
      clickable: true,
    },
    {
      title: 'Interns',
      value: stats?.intern_count || 0,
      icon: UserCheck,
      gradient: 'from-ironman-gold to-yellow-500',
      iconBg: 'bg-ironman-gold/20',
      type: 'Intern',
      clickable: true,
    },
    {
      title: 'Contract Employees',
      value: stats?.contract_count || 0,
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/20',
      type: 'Contract',
      clickable: true,
    },
    {
      title: 'Total Headcount',
      value: stats?.total_count || 0,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/20',
      clickable: true,
      type: 'All',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-ironman-red via-ironman-gold to-ironman-red bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">Welcome to the Employee Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className={`stat-card group ${card.clickable ? 'cursor-pointer hover:scale-105' : ''}`}
              onClick={() => card.clickable && handleCardClick(card.type)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-ironman-gold" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">{card.title}</h3>
              <p className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                {card.value}
              </p>
              <div className="mt-4 h-1 bg-gradient-to-r from-ironman-red/20 to-ironman-gold/20 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${card.gradient} animate-pulse`} style={{ width: '70%' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glossy-card p-6">
          <h2 className="text-2xl font-bold text-ironman-gold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-ironman-red/10 rounded-lg">
              <span className="text-gray-300">Full Time Percentage</span>
              <span className="text-ironman-gold font-bold">
                {stats?.total_count > 0 ? ((stats.full_time_count / stats.total_count) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-ironman-gold/10 rounded-lg">
              <span className="text-gray-300">Intern Percentage</span>
              <span className="text-ironman-gold font-bold">
                {stats?.total_count > 0 ? ((stats.intern_count / stats.total_count) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-lg">
              <span className="text-gray-300">Contract Percentage</span>
              <span className="text-ironman-gold font-bold">
                {stats?.total_count > 0 ? ((stats.contract_count / stats.total_count) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="glossy-card p-6">
          <h2 className="text-2xl font-bold text-ironman-gold mb-4">System Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-ironman-red/10 to-ironman-gold/10 rounded-lg border border-ironman-gold/20">
              <p className="text-sm text-gray-400 mb-1">Total Active Employees</p>
              <p className="text-3xl font-bold text-white">{stats?.total_count || 0}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-ironman-dark/50 rounded-lg">
                <p className="text-2xl font-bold text-ironman-red">{stats?.full_time_count || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Full Time</p>
              </div>
              <div className="text-center p-3 bg-ironman-dark/50 rounded-lg">
                <p className="text-2xl font-bold text-ironman-gold">{stats?.intern_count || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Interns</p>
              </div>
              <div className="text-center p-3 bg-ironman-dark/50 rounded-lg">
                <p className="text-2xl font-bold text-purple-400">{stats?.contract_count || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Contract</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
