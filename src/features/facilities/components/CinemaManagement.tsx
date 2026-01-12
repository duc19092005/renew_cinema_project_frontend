import React, { useState } from 'react';
import { Building2, Plus, Search, Edit, Trash2, MapPin, Phone, Film, Eye } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { Cinema } from '../../../api/facilitiesApi';
import CinemaDetailModal from './CinemaDetailModal';

interface CinemaManagementProps {
  cinemas: Cinema[];
  onRefresh?: () => void;
}

const CinemaManagement: React.FC<CinemaManagementProps> = ({ cinemas, onRefresh }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredCinemas = cinemas.filter(
    (cinema) =>
      cinema.cinemaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.cinemaLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-2 border-l-4 pl-4 ${
            theme === 'web3' ? 'border-purple-400' : 'border-red-600'
          } ${
            theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
          }`}>
            Quản lý rạp
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}>
            Quản lý và theo dõi tất cả các rạp chiếu trong hệ thống
          </p>
        </div>
        <button className={`inline-flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
          theme === 'web3'
            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
            : 'bg-red-600 hover:bg-red-700'
        }`}>
          <Plus className="w-5 h-5" />
          Thêm rạp mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Tìm kiếm rạp chiếu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
            theme === 'web3' 
              ? 'focus:border-purple-400' 
              : 'focus:border-red-600'
          } ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500'
              : theme === 'web3'
                ? 'bg-purple-900/60 border-purple-500/30 text-white placeholder-purple-300/70 backdrop-blur-xl'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      {/* Cinemas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCinemas.map((cinema, index) => (
          <div
            key={cinema.cinemaId || index}
            className={`rounded-xl p-6 border transition-all hover:-translate-y-1 ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800 hover:border-red-600'
                : theme === 'web3'
                  ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 hover:border-purple-400 backdrop-blur-xl'
                  : 'bg-white border-gray-200 hover:border-red-600 shadow-sm'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  theme === 'web3'
                    ? 'bg-gradient-to-br from-purple-600 to-cyan-600'
                    : 'bg-gradient-to-br from-red-600 to-red-800'
                }`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>{cinema.cinemaName}</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                  }`}>Rạp chiếu</p>
                </div>
              </div>
               <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                 theme === 'dark'
                   ? 'bg-green-900/40 text-green-400 border-green-700'
                   : theme === 'web3'
                     ? 'bg-green-900/40 text-green-400 border-green-700'
                     : 'bg-green-50 text-green-700 border-green-300'
               }`}>
                 Hoạt động
               </span>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-4">
              {cinema.cinemaDescription && (
                <p className={`text-sm line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-300' : theme === 'web3' ? 'text-purple-100' : 'text-gray-700'
                }`}>
                  {cinema.cinemaDescription}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm">
                <MapPin className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-red-500' : theme === 'web3' ? 'text-purple-400' : 'text-red-600'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}>
                  {cinema.cinemaLocation}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-red-500' : theme === 'web3' ? 'text-purple-400' : 'text-red-600'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}>
                  {cinema.cinemaHotlineNumber}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Film className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-red-500' : theme === 'web3' ? 'text-purple-400' : 'text-red-600'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}>
                  {cinema.totalRooms} phòng chiếu
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex gap-2 pt-4 border-t ${
              theme === 'dark' ? 'border-gray-800' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-200'
            }`}>
              <button
                onClick={() => {
                  if (cinema.cinemaId) {
                    setSelectedCinemaId(cinema.cinemaId);
                    setIsDetailModalOpen(true);
                  }
                }}
                disabled={!cinema.cinemaId}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  !cinema.cinemaId
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : theme === 'web3'
                      ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                Xem chi tiết
              </button>
              <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : theme === 'web3'
                    ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                <Edit className="w-4 h-4" />
                Sửa
              </button>
               <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm border ${
                 theme === 'dark'
                   ? 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border-red-800'
                   : theme === 'web3'
                     ? 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border-red-800'
                     : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-300'
               }`}>
                 <Trash2 className="w-4 h-4" />
                 Xóa
               </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCinemas.length === 0 && (
        <div className={`text-center py-12 rounded-xl border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : theme === 'web3'
              ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 backdrop-blur-xl'
              : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <Building2 className={`w-12 h-12 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : theme === 'web3' ? 'text-purple-600' : 'text-gray-400'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-300' : 'text-gray-400'}>
            {searchTerm ? 'Không tìm thấy rạp nào' : 'Chưa có rạp chiếu nào'}
          </p>
        </div>
      )}

      {/* Cinema Detail Modal */}
      {selectedCinemaId && (
        <CinemaDetailModal
          cinemaId={selectedCinemaId}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCinemaId(null);
          }}
        />
      )}
    </div>
  );
};

export default CinemaManagement;
