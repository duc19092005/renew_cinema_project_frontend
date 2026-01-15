import React, { useState } from 'react';
import { Building2, Plus, Search, Edit, Trash2, MapPin, Phone, Film, Eye, Loader2, AlertCircle, X, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { facilitiesApi, type Cinema, type CreateCinemaRequest } from '../../../api/facilitiesApi';
import CinemaDetailModal from './CinemaDetailModal';
import axios from 'axios';
import type { ApiErrorResponse } from '../../../types/auth.types';

interface CinemaManagementProps {
  cinemas: Cinema[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const CinemaManagement: React.FC<CinemaManagementProps> = ({ cinemas, loading = false, error = null, onRefresh }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Create cinema modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateCinemaRequest>({
    cinemaName: '',
    cinemaDescription: '',
    cinemaHotlineNumber: '',
    cinemaLocation: '',
    activeAt: null,
  });

  const filteredCinemas = cinemas.filter(
    (cinema) =>
      cinema.cinemaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.cinemaLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateError(null);
    setCreateSuccess(false);
    setFormData({
      cinemaName: '',
      cinemaDescription: '',
      cinemaHotlineNumber: '',
      cinemaLocation: '',
      activeAt: null,
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateError(null);
    setCreateSuccess(false);
    setFormData({
      cinemaName: '',
      cinemaDescription: '',
      cinemaHotlineNumber: '',
      cinemaLocation: '',
      activeAt: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      activeAt: value ? new Date(value).toISOString() : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);
    setCreateLoading(true);

    try {
      // Validate form
      if (!formData.cinemaName.trim()) {
        setCreateError('Please enter cinema name');
        setCreateLoading(false);
        return;
      }
      if (!formData.cinemaLocation.trim()) {
        setCreateError('Please enter cinema location');
        setCreateLoading(false);
        return;
      }
      if (!formData.cinemaHotlineNumber.trim()) {
        setCreateError('Please enter hotline number');
        setCreateLoading(false);
        return;
      }

      // Prepare request data - only include activeAt if it's not null
      const requestData: CreateCinemaRequest = {
        cinemaName: formData.cinemaName.trim(),
        cinemaDescription: formData.cinemaDescription.trim(),
        cinemaHotlineNumber: formData.cinemaHotlineNumber.trim(),
        cinemaLocation: formData.cinemaLocation.trim(),
        ...(formData.activeAt ? { activeAt: formData.activeAt } : {}),
      };

      console.log('Creating cinema with data:', requestData);
      const response = await facilitiesApi.createCinema(requestData);
      console.log('Create cinema response:', response);

      if (response.isSuccess) {
        setCreateSuccess(true);
        // Refresh danh sách ngay lập tức để cập nhật danh sách rạp
        if (onRefresh) {
          // Gọi refresh và đợi hoàn thành
          try {
            await onRefresh();
            console.log('Danh sách rạp đã được cập nhật');
          } catch (refreshError) {
            console.error('Error refreshing cinema list:', refreshError);
            // Vẫn đóng modal dù có lỗi refresh
          }
        }
        // Đóng modal sau khi refresh xong (hiển thị success message)
        setTimeout(() => {
          handleCloseCreateModal();
        }, 1000);
      } else {
        setCreateError(response.message || 'Failed to create cinema. Please try again.');
      }
    } catch (err) {
      console.error('Error creating cinema:', err);
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        setCreateError(data.message || 'Failed to create cinema. Please try again.');
      } else {
        setCreateError('Unable to connect to server. Please check your network connection.');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className={`text-2xl sm:text-3xl font-black mb-2 border-l-4 pl-4 ${
            theme === 'web3' ? 'border-purple-400' : 'border-red-600'
          } ${
            theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
          }`}>
            Cinema Management
          </h1>
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'}`}>
            Manage and monitor all cinemas in the system
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-colors whitespace-nowrap ${
            theme === 'web3'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add New Cinema</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`p-4 rounded-lg border flex items-center ${
          theme === 'dark'
            ? 'bg-red-900/40 border-red-500/50 text-red-100'
            : theme === 'web3'
              ? 'bg-red-900/40 border-red-500/50 text-red-100'
              : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
          <span className="text-sm font-medium flex-1">{error}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`ml-3 px-3 py-1 rounded text-sm font-semibold ${
                theme === 'dark' || theme === 'web3'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search cinemas..."
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

      {/* Loading State */}
      {loading && (
        <div className={`text-center py-12 rounded-xl border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : theme === 'web3'
              ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 backdrop-blur-xl'
              : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${
            theme === 'web3' ? 'text-purple-400' : 'text-red-600'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300' : 'text-gray-600'}>
            Loading cinemas...
          </p>
        </div>
      )}

      {/* Cinemas Grid */}
      {!loading && (
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
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  theme === 'web3'
                    ? 'bg-gradient-to-br from-purple-600 to-cyan-600'
                    : 'bg-gradient-to-br from-red-600 to-red-800'
                }`}>
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-bold truncate ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>{cinema.cinemaName}</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                  }`}>Cinema</p>
                </div>
              </div>
               <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${
                 theme === 'dark'
                   ? 'bg-green-900/40 text-green-400 border-green-700'
                   : theme === 'web3'
                     ? 'bg-green-900/40 text-green-400 border-green-700'
                     : 'bg-green-50 text-green-700 border-green-300'
               }`}>
                 Active
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
                  {cinema.totalRooms} rooms
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex flex-col sm:flex-row gap-2 pt-4 border-t ${
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
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </button>
              <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : theme === 'web3'
                    ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
               <button className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm border ${
                 theme === 'dark'
                   ? 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border-red-800'
                   : theme === 'web3'
                     ? 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border-red-800'
                     : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-300'
               }`}>
                 <Trash2 className="w-4 h-4" />
                 <span className="hidden sm:inline">Delete</span>
               </button>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCinemas.length === 0 && (
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
            {searchTerm ? 'No cinemas found' : 'No cinemas available'}
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

      {/* Create Cinema Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseCreateModal}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] rounded-xl border shadow-2xl transition-all flex flex-col ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : theme === 'web3'
                  ? 'bg-gradient-to-br from-purple-900/95 to-cyan-900/95 border-purple-500/30 backdrop-blur-xl'
                  : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-gray-800' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-black ${
                theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
              }`}>
                Add New Cinema
              </h2>
              <button
                onClick={handleCloseCreateModal}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400'
                    : theme === 'web3'
                      ? 'hover:bg-purple-800/30 text-purple-300'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Success Message */}
              {createSuccess && (
                <div className={`mb-4 p-4 rounded-lg border flex items-center ${
                  theme === 'dark'
                    ? 'bg-green-900/40 border-green-500/50 text-green-100'
                    : theme === 'web3'
                      ? 'bg-green-900/40 border-green-500/50 text-green-100'
                      : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <CheckCircle className="w-5 h-5 mr-3 shrink-0 text-green-500" />
                  <span className="text-sm font-medium">Cinema added successfully! Updating list...</span>
                </div>
              )}

              {/* Error Message */}
              {createError && (
                <div className={`mb-4 p-4 rounded-lg border flex items-center ${
                  theme === 'dark'
                    ? 'bg-red-900/40 border-red-500/50 text-red-100'
                    : theme === 'web3'
                      ? 'bg-red-900/40 border-red-500/50 text-red-100'
                      : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
                  <span className="text-sm font-medium">{createError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Cinema Name */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Cinema Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cinemaName"
                    value={formData.cinemaName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      theme === 'web3' 
                        ? 'focus:border-purple-400' 
                        : 'focus:border-red-600'
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : theme === 'web3'
                          ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Enter cinema name"
                  />
                </div>

                {/* Cinema Location */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cinemaLocation"
                    value={formData.cinemaLocation}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      theme === 'web3' 
                        ? 'focus:border-purple-400' 
                        : 'focus:border-red-600'
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : theme === 'web3'
                          ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Enter cinema location"
                  />
                </div>

                {/* Cinema Hotline */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Hotline Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="cinemaHotlineNumber"
                    value={formData.cinemaHotlineNumber}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      theme === 'web3' 
                        ? 'focus:border-purple-400' 
                        : 'focus:border-red-600'
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : theme === 'web3'
                          ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Enter hotline number"
                  />
                </div>

                {/* Cinema Description */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Description
                  </label>
                  <textarea
                    name="cinemaDescription"
                    value={formData.cinemaDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors resize-none ${
                      theme === 'web3' 
                        ? 'focus:border-purple-400' 
                        : 'focus:border-red-600'
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : theme === 'web3'
                          ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="Enter cinema description (optional)"
                  />
                </div>

                {/* Active At (Ngày khai trương) */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Opening Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.activeAt ? new Date(formData.activeAt).toISOString().slice(0, 16) : ''}
                    onChange={handleDateChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      theme === 'web3' 
                        ? 'focus:border-purple-400' 
                        : 'focus:border-red-600'
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : theme === 'web3'
                          ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
                  }`}>
                    Leave empty to use current date as opening date
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    disabled={createLoading}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : theme === 'web3'
                          ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } ${createLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      createLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      theme === 'web3'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Cinema
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaManagement;
