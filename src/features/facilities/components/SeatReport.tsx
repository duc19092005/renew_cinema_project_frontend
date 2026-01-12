import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const SeatReport: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data - sẽ thay bằng API call sau
  const reports = [
    {
      id: 1,
      period: 'Tháng 12/2024',
      totalSeats: 5000,
      availableSeats: 3500,
      occupiedSeats: 1500,
      utilizationRate: 30,
      status: 'good',
    },
    {
      id: 2,
      period: 'Tháng 11/2024',
      totalSeats: 5000,
      availableSeats: 2800,
      occupiedSeats: 2200,
      utilizationRate: 44,
      status: 'good',
    },
    {
      id: 3,
      period: 'Tháng 10/2024',
      totalSeats: 5000,
      availableSeats: 3200,
      occupiedSeats: 1800,
      utilizationRate: 36,
      status: 'warning',
    },
  ];

  const currentReport = reports[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-2 border-l-4 border-red-600 pl-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Báo cáo ghế
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Theo dõi và phân tích tình trạng sử dụng ghế
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-600 ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Tổng số ghế</span>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className={`text-3xl font-black mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {currentReport.totalSeats.toLocaleString()}
          </h3>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>Tất cả các rạp</p>
        </div>

        <div className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Ghế trống</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className={`text-3xl font-black mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {currentReport.availableSeats.toLocaleString()}
          </h3>
          <p className="text-xs text-green-400">+5% so với tháng trước</p>
        </div>

        <div className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Ghế đã sử dụng</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <h3 className={`text-3xl font-black mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {currentReport.occupiedSeats.toLocaleString()}
          </h3>
          <p className="text-xs text-red-400">-2% so với tháng trước</p>
        </div>

        <div className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Tỷ lệ sử dụng</span>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className={`text-3xl font-black mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{currentReport.utilizationRate}%</h3>
          <div className={`w-full rounded-full h-2 mt-2 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <div
              className="bg-gradient-to-r from-red-600 to-red-800 h-2 rounded-full transition-all"
              style={{ width: `${currentReport.utilizationRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Historical Reports */}
      <div className={`rounded-xl p-6 border ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-6 border-l-4 border-red-600 pl-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Lịch sử báo cáo
        </h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:border-red-600'
                  : 'bg-gray-50 border-gray-200 hover:border-red-600'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{report.period}</h3>
                  {report.status === 'warning' && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-700">
                      Cần chú ý
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tổng ghế:</span>
                    <span className={`font-semibold ml-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{report.totalSeats.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Đã sử dụng:</span>
                    <span className={`font-semibold ml-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{report.occupiedSeats.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tỷ lệ:</span>
                    <span className={`font-semibold ml-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{report.utilizationRate}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}>
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className={`rounded-xl p-6 border ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-6 border-l-4 border-red-600 pl-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Biểu đồ sử dụng ghế
        </h2>
        <div className={`h-64 flex items-center justify-center rounded-lg border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-center">
            <BarChart3 className={`w-12 h-12 mx-auto mb-2 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
              Biểu đồ sẽ được hiển thị ở đây
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatReport;
