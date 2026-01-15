import React from 'react';
import { Building2, Film, Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { Cinema } from '../../../api/facilitiesApi';

interface DashboardProps {
  cinemas: Cinema[];
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ cinemas, loading }) => {
  const { theme } = useTheme();
  
  // Tính toán thống kê
  const totalCinemas = cinemas.length;
  const totalRooms = cinemas.reduce((sum, cinema) => sum + cinema.totalRooms, 0);
  const activeCinemas = cinemas.length; // Tất cả đều active
  const totalCapacity = totalRooms * 100; // Giả sử mỗi phòng 100 ghế

  const stats = [
    {
      label: 'Total Cinemas',
      value: totalCinemas,
      icon: Building2,
      color: 'from-red-600 to-red-800',
      change: '+2',
    },
    {
      label: 'Total Rooms',
      value: totalRooms,
      icon: Film,
      color: 'from-blue-600 to-blue-800',
      change: '+5',
    },
    {
      label: 'Active Cinemas',
      value: activeCinemas,
      icon: Activity,
      color: 'from-green-600 to-green-800',
      change: '100%',
    },
    {
      label: 'Total Capacity',
      value: totalCapacity.toLocaleString(),
      icon: Users,
      color: 'from-purple-600 to-purple-800',
      change: '+500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl p-6 border transition-all hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800 hover:border-red-600'
                  : theme === 'web3'
                    ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 hover:border-purple-400 backdrop-blur-xl'
                    : 'bg-white border-gray-200 hover:border-red-600 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <h3 className={`text-3xl font-black mb-1 ${
                theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
              }`}>{stat.value}</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
              }`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Cinemas */}
      <div className={`rounded-xl p-6 border ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : theme === 'web3'
            ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 backdrop-blur-xl'
            : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-black border-l-4 pl-4 ${
            theme === 'web3' ? 'border-purple-400' : 'border-red-600'
          } ${
            theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
          }`}>
            Cinema List
          </h2>
        </div>

        {cinemas.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : theme === 'web3' ? 'text-purple-600' : 'text-gray-400'
            }`} />
            <p className={theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-300' : 'text-gray-400'}>No cinemas available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cinemas.map((cinema, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 hover:border-red-600'
                    : theme === 'web3'
                      ? 'bg-purple-900/60 border-purple-500/30 hover:border-purple-400 backdrop-blur-xl'
                      : 'bg-gray-50 border-gray-200 hover:border-red-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === 'web3' 
                      ? 'bg-gradient-to-br from-purple-600 to-cyan-600' 
                      : 'bg-gradient-to-br from-red-600 to-red-800'
                  }`}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                    }`}>{cinema.cinemaName}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                    }`}>{cinema.cinemaLocation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>{cinema.totalRooms} rooms</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                  }`}>Active</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : theme === 'web3'
              ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 backdrop-blur-xl'
              : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
          }`}>Quick Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}>Room Utilization Rate</span>
              <span className={`font-bold ${
                theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
              }`}>85%</span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              theme === 'dark' ? 'bg-gray-800' : theme === 'web3' ? 'bg-purple-900/50' : 'bg-gray-200'
            }`}>
              <div className={`h-2 rounded-full ${
                theme === 'web3' 
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-red-600 to-red-800'
              }`} style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : theme === 'web3'
              ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 backdrop-blur-xl'
              : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
          }`}>Recent Activity</h3>
          <div className={`space-y-2 text-sm ${
            theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
          }`}>
            <p>• Added 2 new auditoriums</p>
            <p>• Updated VietNam cinema information</p>
            <p>• December seat report created</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
