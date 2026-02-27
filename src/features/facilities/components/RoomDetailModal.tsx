import React, { useEffect, useState } from 'react';
import { X, Film, Users, Loader2, AlertCircle, Activity, Plus, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { facilitiesApi, type Room, type MovieFormat } from '../../../api/facilitiesApi';
import axios from 'axios';
import type { ApiErrorResponse } from '../../../types/auth.types';

interface RoomDetailModalProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ roomId, isOpen, onClose }) => {
  const { theme } = useTheme();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Movie format selection modal state
  const [isMovieFormatModalOpen, setIsMovieFormatModalOpen] = useState(false);
  const [movieFormats, setMovieFormats] = useState<MovieFormat[]>([]);
  const [formatsLoading, setFormatsLoading] = useState(false);
  const [formatsError, setFormatsError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<MovieFormat | null>(null);

  useEffect(() => {
    if (isOpen && roomId) {
      fetchRoomDetail();
    } else {
      setRoom(null);
      setError(null);
    }
  }, [isOpen, roomId]);

  // Seed data cho chi tiết phòng (mock data để test)
  const getSeedRoomDetail = (id: string): Room | null => {
    const seedRooms: Record<string, Room> = {
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890': {
        roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        roomName: 'Phòng 1',
        roomCapacity: 120,
        roomStatus: 'active',
      },
      'b2c3d4e5-f6a7-8901-bcde-f12345678901': {
        roomId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        roomName: 'Phòng 2',
        roomCapacity: 150,
        roomStatus: 'active',
      },
      'c3d4e5f6-a7b8-9012-cdef-123456789012': {
        roomId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        roomName: 'Phòng 3',
        roomCapacity: 100,
        roomStatus: 'active',
      },
      'd4e5f6a7-b8c9-0123-defa-234567890123': {
        roomId: 'd4e5f6a7-b8c9-0123-defa-234567890123',
        roomName: 'Phòng VIP 1',
        roomCapacity: 80,
        roomStatus: 'active',
      },
      'e5f6a7b8-c9d0-1234-efab-345678901234': {
        roomId: 'e5f6a7b8-c9d0-1234-efab-345678901234',
        roomName: 'Phòng 4',
        roomCapacity: 200,
        roomStatus: 'maintenance',
      },
      'f6a7b8c9-d0e1-2345-fabc-456789012345': {
        roomId: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
        roomName: 'Phòng 5',
        roomCapacity: 130,
        roomStatus: 'active',
      },
      'a7b8c9d0-e1f2-3456-abcd-567890123456': {
        roomId: 'a7b8c9d0-e1f2-3456-abcd-567890123456',
        roomName: 'Phòng IMAX',
        roomCapacity: 300,
        roomStatus: 'active',
      },
      'b8c9d0e1-f2a3-4567-bcde-678901234567': {
        roomId: 'b8c9d0e1-f2a3-4567-bcde-678901234567',
        roomName: 'Phòng 6',
        roomCapacity: 110,
        roomStatus: 'active',
      },
    };
    return seedRooms[id] || null;
  };

  const fetchRoomDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await facilitiesApi.getRoomDetail(roomId);
      setRoom(res.data);
    } catch (err) {
      // Nếu API lỗi, thử dùng seed data
      const seedRoom = getSeedRoomDetail(roomId);
      if (seedRoom) {
        setRoom(seedRoom);
        console.warn('API error, using seed data for room:', roomId);
      } else {
        if (axios.isAxiosError(err) && err.response) {
          const data = err.response.data as ApiErrorResponse;
          setError(data.message || 'Cannot load room information.');
        } else {
          setError('Cannot connect to server.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShowtime = () => {
    setIsMovieFormatModalOpen(true);
    fetchMovieFormats();
  };

  const fetchMovieFormats = async () => {
    setFormatsLoading(true);
    setFormatsError(null);
    setSelectedFormat(null);
    try {
      const res = await facilitiesApi.getMovieFormats();
      setMovieFormats(res.data || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        setFormatsError(data.message || 'Cannot load movie formats list.');
      } else {
        setFormatsError('Cannot connect to server.');
      }
    } finally {
      setFormatsLoading(false);
    }
  };

  const handleFormatSelect = (format: MovieFormat) => {
    setSelectedFormat(format);
  };

  const handleConfirmFormat = () => {
    if (selectedFormat) {
      // TODO: Xử lý logic tạo phòng chiếu với format đã chọn
      console.log('Selected format:', selectedFormat);
      // Có thể gọi API tạo showtime ở đây
      // Sau đó đóng modal
      setIsMovieFormatModalOpen(false);
      setSelectedFormat(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-xl border shadow-2xl transition-all ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-black ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Details phòng chiếu
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Loading thông tin...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className={`p-4 rounded-lg border flex items-center ${
              theme === 'dark'
                ? 'bg-red-900/40 border-red-500/50 text-red-100'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {!loading && !error && room && (
            <div className="space-y-6">
              {/* Room Info Card */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {room.auditoriumName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      room.auditoriumStatus === 'active' || !room.auditoriumStatus
                        ? theme === 'dark'
                          ? 'bg-green-900/40 text-green-400 border-green-700'
                          : 'bg-green-50 text-green-700 border-green-300'
                        : theme === 'dark'
                          ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                    }`}>
                      {room.auditoriumStatus === 'active' || !room.auditoriumStatus ? 'Hoạt động' : 'Maintenance'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Users className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-blue-500' : 'text-blue-600'
                      }`} />
                      <div>
                        <p className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Capacity
                        </p>
                        <p className={`text-2xl font-black ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {room.totalSeats} ghế
                        </p>
                      </div>
                    </div>
                  </div>

                  {room.auditoriumStatus && (
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Activity className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-pink-500' : 'text-pink-400'
                        }`} />
                        <div>
                          <p className={`text-xs mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Status
                          </p>
                          <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {room.auditoriumStatus === 'active' ? 'Hoạt động' : 
                             room.auditoriumStatus === 'maintenance' ? 'Maintenance' : 'Ngừng hoạt động'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Room ID (for reference) */}
              {room.auditoriumId && (
                <div className={`p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-xs mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Room ID
                  </p>
                  <p className={`text-xs font-mono ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {room.auditoriumId}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-between gap-3 p-6 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <button
            onClick={handleCreateShowtime}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              theme === 'modern'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 border border-pink-400/50 shadow-md shadow-pink-500/20 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Auditorium
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Movie Format Selection Modal */}
      {isMovieFormatModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsMovieFormatModalOpen(false);
              setSelectedFormat(null);
            }}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] rounded-xl border shadow-2xl transition-all flex flex-col ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : theme === 'modern'
                  ? 'bg-gradient-to-br from-[#15102B]/95 to-[#0b061c]/95 border-indigo-500/30 shadow-sm shadow-indigo-500/10 backdrop-blur-2xl'
                  : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/30 shadow-sm shadow-indigo-500/10' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-black ${
                theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'
              }`}>
                Select Movie Format
              </h2>
              <button
                onClick={() => {
                  setIsMovieFormatModalOpen(false);
                  setSelectedFormat(null);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400'
                    : theme === 'modern'
                      ? 'hover:bg-indigo-800/40 text-white font-medium'
                      : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {formatsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${
                      theme === 'modern' ? 'text-indigo-300' : 'text-red-600'
                    }`} />
                    <p className={theme === 'dark' || theme === 'modern' ? 'text-gray-400' : 'text-gray-600'}>
                      Loading list định dạng...
                    </p>
                  </div>
                </div>
              )}

              {formatsError && (
                <div className={`p-4 rounded-lg border flex items-center ${
                  theme === 'dark'
                    ? 'bg-red-900/40 border-red-500/50 text-red-100'
                    : theme === 'modern'
                      ? 'bg-red-900/40 border-red-500/50 text-red-100'
                      : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
                  <span className="text-sm font-medium">{formatsError}</span>
                </div>
              )}

              {!formatsLoading && !formatsError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movieFormats.map((format) => (
                    <button
                      key={format.formatId}
                      onClick={() => handleFormatSelect(format)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selectedFormat?.formatId === format.formatId
                          ? theme === 'modern'
                            ? 'border-pink-400 text-white shadow-md shadow-pink-500/20 bg-indigo-800/40 shadow-lg shadow-pink-500/20'
                            : 'border-red-600 bg-red-50 shadow-lg'
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                            : theme === 'modern'
                              ? 'bg-slate-800/20 border-indigo-500/30 shadow-sm shadow-indigo-500/10 hover:border-pink-400 text-white shadow-md shadow-pink-500/20/50'
                              : 'bg-white border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-bold text-lg ${
                              theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {format.formatName}
                            </h3>
                            {selectedFormat?.formatId === format.formatId && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                theme === 'modern'
                                  ? 'bg-pink-500 shadow-md shadow-pink-500/20 text-white'
                                  : 'bg-red-600'
                              }`}>
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${
                            theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-white font-medium' : 'text-gray-600'
                          }`}>
                            {format.formatDescription}
                          </p>
                          <p className={`text-lg font-black ${
                            theme === 'modern'
                              ? 'text-white font-medium'
                              : 'text-red-600'
                          }`}>
                            {formatPrice(format.movieFormatPrice)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!formatsLoading && !formatsError && movieFormats.length === 0 && (
                <div className="text-center py-12">
                  <Film className={`w-12 h-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : theme === 'modern' ? 'text-pink-400' : 'text-gray-400'
                  }`} />
                  <p className={theme === 'dark' || theme === 'modern' ? 'text-gray-400' : 'text-gray-500'}>
                    No movie formats
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex justify-end gap-3 p-6 border-t ${
              theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/30 shadow-sm shadow-indigo-500/10' : 'border-gray-200'
            }`}>
              <button
                onClick={() => {
                  setIsMovieFormatModalOpen(false);
                  setSelectedFormat(null);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : theme === 'modern'
                      ? 'bg-[#15102B] hover:bg-slate-600/50 text-white font-medium'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFormat}
                disabled={!selectedFormat}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  !selectedFormat
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  theme === 'modern'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 border border-pink-400/50 shadow-md shadow-pink-500/20 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailModal;
