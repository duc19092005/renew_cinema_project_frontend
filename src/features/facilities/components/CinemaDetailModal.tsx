import React, { useEffect, useState } from 'react';
import { X, Building2, MapPin, Phone, Film, Loader2, AlertCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { facilitiesApi, type Cinema, type Room } from '../../../api/facilitiesApi';
import axios from 'axios';
import type { ApiErrorResponse } from '../../../types/auth.types';
import RoomDetailModal from './RoomDetailModal';
import CreateAuditoriumModal from './CreateAuditoriumModal';

interface CinemaDetailModalProps {
  cinemaId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CinemaDetailModal: React.FC<CinemaDetailModalProps> = ({ cinemaId, isOpen, onClose }) => {
  const { theme } = useTheme();
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  
  // Room detail modal state
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isRoomDetailModalOpen, setIsRoomDetailModalOpen] = useState(false);
  
  // Create auditorium modal state
  const [isCreateAuditoriumModalOpen, setIsCreateAuditoriumModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && cinemaId) {
      fetchCinemaDetail();
      fetchCinemaRooms();
    } else {
      // Reset state when modal closes
      setCinema(null);
      setRooms([]);
      setError(null);
      setRoomsError(null);
    }
  }, [isOpen, cinemaId]);

  const fetchCinemaDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await facilitiesApi.getCinemaDetail(cinemaId);
      setCinema(res.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        setError(data.message || 'Failed to load cinema information.');
      } else {
        setError('Unable to connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Seed data cho phòng chiếu (mock data để test)
  const getSeedRooms = (): Room[] => {
    return [
      {
        roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        roomName: 'Phòng 1',
        roomCapacity: 120,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
      {
        roomId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        roomName: 'Phòng 2',
        roomCapacity: 150,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
      {
        roomId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        roomName: 'Phòng 3',
        roomCapacity: 100,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
      {
        roomId: 'd4e5f6a7-b8c9-0123-defa-234567890123',
        roomName: 'Phòng VIP 1',
        roomCapacity: 80,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
      {
        roomId: 'e5f6a7b8-c9d0-1234-efab-345678901234',
        roomName: 'Phòng 4',
        roomCapacity: 200,
        roomStatus: 'maintenance',
        cinemaId: cinemaId,
      },
      {
        roomId: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
        roomName: 'Phòng 5',
        roomCapacity: 130,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
      {
        roomId: 'a7b8c9d0-e1f2-3456-abcd-567890123456',
        roomName: 'Phòng IMAX',
        roomCapacity: 300,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
      {
        roomId: 'b8c9d0e1-f2a3-4567-bcde-678901234567',
        roomName: 'Phòng 6',
        roomCapacity: 110,
        roomStatus: 'active',
        cinemaId: cinemaId,
      },
    ];
  };

  const fetchCinemaRooms = async () => {
    setRoomsLoading(true);
    setRoomsError(null);
    try {
      const res = await facilitiesApi.getCinemaRooms(cinemaId);
      // Nếu API trả về dữ liệu rỗng hoặc lỗi, sử dụng seed data
      if (res.data && res.data.length > 0) {
        setRooms(res.data);
      } else {
        // Sử dụng seed data để test
        setRooms(getSeedRooms());
      }
    } catch (err) {
      // Nếu API lỗi, vẫn hiển thị seed data để test
      console.warn('API error, using seed data:', err);
      setRooms(getSeedRooms());
      // Không set error để vẫn hiển thị seed data
      // setRoomsError('Không thể kết nối đến server.');
    } finally {
      setRoomsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`relative w-full max-w-4xl max-h-[90vh] rounded-xl border shadow-2xl transition-all flex flex-col ${
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
              Cinema Details
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

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Loading information...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className={`p-4 rounded-lg border flex items-center mb-6 ${
                theme === 'dark'
                  ? 'bg-red-900/40 border-red-500/50 text-red-100'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {!loading && !error && cinema && (
              <div className="space-y-6">
                {/* Cinema Info Card */}
                <div className={`p-6 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {cinema.cinemaName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        theme === 'dark'
                          ? 'bg-green-900/40 text-green-400 border-green-700'
                          : 'bg-green-50 text-green-700 border-green-300'
                      }`}>
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    {cinema.cinemaDescription && (
                      <div>
                        <p className={`text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Description
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {cinema.cinemaDescription}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-5 h-5 mt-0.5 ${
                          theme === 'dark' ? 'text-red-500' : 'text-red-600'
                        }`} />
                        <div>
                          <p className={`text-xs mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Location
                          </p>
                          <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {cinema.cinemaLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className={`w-5 h-5 mt-0.5 ${
                          theme === 'dark' ? 'text-red-500' : 'text-red-600'
                        }`} />
                        <div>
                          <p className={`text-xs mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Hotline
                          </p>
                          <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {cinema.cinemaHotlineNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Film className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-red-500' : 'text-red-600'
                        }`} />
                        <div>
                          <p className={`text-xs mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Total Auditoriums
                          </p>
                          <p className={`text-2xl font-black ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {cinema.totalRooms} rooms
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms List Section */}
                <div className={`rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`flex items-center justify-between p-6 border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h3 className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Auditorium List ({rooms.length})
                    </h3>
                    <button 
                      onClick={() => setIsCreateAuditoriumModalOpen(true)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        theme === 'dark'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Auditorium
                    </button>
                  </div>

                  <div className="p-6">
                    {roomsLoading && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                      </div>
                    )}

                    {roomsError && (
                      <div className={`p-4 rounded-lg border flex items-center mb-4 ${
                        theme === 'dark'
                          ? 'bg-red-900/40 border-red-500/50 text-red-100'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}>
                        <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
                        <span className="text-sm font-medium">{roomsError}</span>
                      </div>
                    )}

                    {!roomsLoading && !roomsError && (
                      <>
                        {rooms.length === 0 ? (
                          <div className="text-center py-12">
                            <Film className={`w-12 h-12 mx-auto mb-4 ${
                              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                              No auditoriums available
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rooms.map((room) => (
                              <div
                                key={room.roomId || Math.random()}
                                className={`p-4 rounded-lg border transition-all ${
                                  theme === 'dark'
                                    ? 'bg-gray-900 border-gray-700 hover:border-red-600'
                                    : 'bg-white border-gray-200 hover:border-red-600'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                                      <Film className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <h4 className={`font-bold ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {room.roomName}
                                      </h4>
                                      <p className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {room.roomCapacity} ghế
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                                    room.roomStatus === 'active' || !room.roomStatus
                                      ? theme === 'dark'
                                        ? 'bg-green-900/40 text-green-400 border-green-700'
                                        : 'bg-green-50 text-green-700 border-green-300'
                                      : theme === 'dark'
                                        ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700'
                                        : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                                  }`}>
                                    {room.roomStatus === 'active' || !room.roomStatus ? 'Hoạt động' : 'Bảo trì'}
                                  </span>
                                </div>

                                {/* Actions */}
                                <div className={`flex gap-2 pt-3 border-t ${
                                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                  <button
                                    onClick={() => {
                                      if (room.roomId) {
                                        setSelectedRoomId(room.roomId);
                                        setIsRoomDetailModalOpen(true);
                                      }
                                    }}
                                    disabled={!room.roomId}
                                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${
                                      !room.roomId
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    } ${
                                      theme === 'dark'
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    <Eye className="w-3 h-3" />
                                    View
                                  </button>
                                  <button className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${
                                    theme === 'dark'
                                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                  }`}>
                                    <Edit className="w-3 h-3" />
                                    Edit
                                  </button>
                                  <button className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors border ${
                                    theme === 'dark'
                                      ? 'bg-red-900/40 hover:bg-red-900/60 text-red-400 border-red-800'
                                      : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-300'
                                  }`}>
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Cinema ID (for reference) */}
                {cinema.cinemaId && (
                  <div className={`p-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className={`text-xs mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Cinema ID
                    </p>
                    <p className={`text-xs font-mono ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {cinema.cinemaId}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex justify-end gap-3 p-6 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Room Detail Modal */}
      {selectedRoomId && (
        <RoomDetailModal
          roomId={selectedRoomId}
          isOpen={isRoomDetailModalOpen}
          onClose={() => {
            setIsRoomDetailModalOpen(false);
            setSelectedRoomId(null);
          }}
        />
      )}

      {/* Create Auditorium Modal */}
      {cinema?.cinemaId && (
        <CreateAuditoriumModal
          cinemaId={cinema.cinemaId}
          isOpen={isCreateAuditoriumModalOpen}
          onClose={() => setIsCreateAuditoriumModalOpen(false)}
          onSuccess={async () => {
            // Refresh danh sách phòng sau khi tạo thành công
            await fetchCinemaRooms();
            await fetchCinemaDetail();
          }}
        />
      )}
    </>
  );
};

export default CinemaDetailModal;
