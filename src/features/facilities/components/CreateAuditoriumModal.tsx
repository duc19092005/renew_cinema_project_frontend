import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Loader2, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Grid3x3, Move } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { facilitiesApi, type MovieFormat, type CreateAuditoriumRequest, type SeatPosition } from '../../../api/facilitiesApi';
import axios from 'axios';
import type { ApiErrorResponse } from '../../../types/auth.types';

interface CreateAuditoriumModalProps {
  cinemaId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'format' | 'info' | 'seats';

const CreateAuditoriumModal: React.FC<CreateAuditoriumModalProps> = ({ cinemaId, isOpen, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<Step>('format');
  const [movieFormats, setMovieFormats] = useState<MovieFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<MovieFormat | null>(null);
  const [formatsLoading, setFormatsLoading] = useState(false);
  const [formatsError, setFormatsError] = useState<string | null>(null);

  // Step 2: Room info
  const [auditoriumNumber, setAuditoriumNumber] = useState('');
  const [roomCols, setRoomCols] = useState(10);
  const [roomRows, setRoomRows] = useState(8);
  const [exitPosition, setExitPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

  // Step 3: Seats
  const [seats, setSeats] = useState<SeatPosition[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ cols: 10, rows: 8 });
  const [cellSize, setCellSize] = useState({ width: 40, height: 40 });
  const [isMobile, setIsMobile] = useState(false);

  // Create state
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCellSize({ width: 30, height: 30 });
      } else {
        setCellSize({ width: 40, height: 40 });
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update grid size when room size changes
  useEffect(() => {
    setGridSize({ cols: roomCols, rows: roomRows });
    // Clear seats when grid size changes
    setSeats([]);
  }, [roomCols, roomRows]);

  // Fetch movie formats
  useEffect(() => {
    if (isOpen && currentStep === 'format') {
      fetchMovieFormats();
    }
  }, [isOpen, currentStep]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('format');
      setSelectedFormat(null);
      setAuditoriumNumber('');
      setRoomCols(10);
      setRoomRows(8);
      setExitPosition('bottom');
      setSeats([]);
      setCreateError(null);
      setCreateSuccess(false);
    }
  }, [isOpen]);

  const fetchMovieFormats = async () => {
    setFormatsLoading(true);
    setFormatsError(null);
    try {
      const res = await facilitiesApi.getMovieFormats();
      setMovieFormats(res.data || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        setFormatsError(data.message || 'Failed to load movie formats.');
      } else {
        setFormatsError('Unable to connect to server.');
      }
    } finally {
      setFormatsLoading(false);
    }
  };

  const handleFormatSelect = (format: MovieFormat) => {
    setSelectedFormat(format);
  };

  const handleNextStep = () => {
    if (currentStep === 'format' && selectedFormat) {
      setCurrentStep('info');
    } else if (currentStep === 'info' && auditoriumNumber.trim()) {
      setCurrentStep('seats');
    }
  };

  // Auto fill all empty cells with seats
  const handleAutoFillSeats = () => {
    const newSeats: SeatPosition[] = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        // Check if seat already exists at this position
        const existingSeat = seats.find(
          s => s.colIndex === col && s.rowIndex === row
        );
        if (!existingSeat) {
          const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
          newSeats.push({
            seatNumber,
            coordX: col * cellSize.width,
            coordY: row * cellSize.height,
            colIndex: col,
            rowIndex: row,
          });
        }
      }
    }
    setSeats([...seats, ...newSeats]);
  };

  // Clear all seats
  const handleClearAllSeats = () => {
    setSeats([]);
  };

  const handlePrevStep = () => {
    if (currentStep === 'info') {
      setCurrentStep('format');
    } else if (currentStep === 'seats') {
      setCurrentStep('info');
    }
  };

  // Seat drag and drop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate grid position
    const colIndex = Math.floor(x / cellSize.width);
    const rowIndex = Math.floor(y / cellSize.height);

    // Check if clicking on existing seat
    const existingSeat = seats.find(
      s => s.colIndex === colIndex && s.rowIndex === rowIndex
    );

    if (existingSeat) {
      // Remove seat if clicking on existing one
      handleRemoveSeat(colIndex, rowIndex);
      return;
    }

    // Start dragging to add seats
    setIsDragging(true);
    setDragStart({ x, y });
    
    // Add first seat immediately
    if (colIndex >= 0 && colIndex < gridSize.cols && rowIndex >= 0 && rowIndex < gridSize.rows) {
      const seatNumber = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
      const newSeat: SeatPosition = {
        seatNumber,
        coordX: colIndex * cellSize.width,
        coordY: rowIndex * cellSize.height,
        colIndex,
        rowIndex,
      };
      setSeats([...seats, newSeat]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate grid position
    const colIndex = Math.floor(x / cellSize.width);
    const rowIndex = Math.floor(y / cellSize.height);

    // Check if within bounds
    if (colIndex >= 0 && colIndex < gridSize.cols && rowIndex >= 0 && rowIndex < gridSize.rows) {
      // Check if seat already exists at this position
      const existingSeat = seats.find(
        s => s.colIndex === colIndex && s.rowIndex === rowIndex
      );

      if (!existingSeat) {
        // Create new seat
        const seatNumber = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
        const newSeat: SeatPosition = {
          seatNumber,
          coordX: colIndex * cellSize.width,
          coordY: rowIndex * cellSize.height,
          colIndex,
          rowIndex,
        };
        setSeats([...seats, newSeat]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleRemoveSeat = (colIndex: number, rowIndex: number) => {
    setSeats(seats.filter(s => !(s.colIndex === colIndex && s.rowIndex === rowIndex)));
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const colIndex = Math.floor(x / cellSize.width);
    const rowIndex = Math.floor(y / cellSize.height);

    const existingSeat = seats.find(
      s => s.colIndex === colIndex && s.rowIndex === rowIndex
    );

    if (existingSeat) {
      handleRemoveSeat(colIndex, rowIndex);
      return;
    }

    setIsDragging(true);
    if (colIndex >= 0 && colIndex < gridSize.cols && rowIndex >= 0 && rowIndex < gridSize.rows) {
      const seatNumber = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
      const newSeat: SeatPosition = {
        seatNumber,
        coordX: colIndex * cellSize.width,
        coordY: rowIndex * cellSize.height,
        colIndex,
        rowIndex,
      };
      setSeats([...seats, newSeat]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !canvasRef.current) return;
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const colIndex = Math.floor(x / cellSize.width);
    const rowIndex = Math.floor(y / cellSize.height);

    if (colIndex >= 0 && colIndex < gridSize.cols && rowIndex >= 0 && rowIndex < gridSize.rows) {
      const existingSeat = seats.find(
        s => s.colIndex === colIndex && s.rowIndex === rowIndex
      );

      if (!existingSeat) {
        const seatNumber = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
        const newSeat: SeatPosition = {
          seatNumber,
          coordX: colIndex * cellSize.width,
          coordY: rowIndex * cellSize.height,
          colIndex,
          rowIndex,
        };
        setSeats([...seats, newSeat]);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!selectedFormat || !auditoriumNumber.trim() || seats.length === 0) {
      setCreateError('Please fill in all information and add at least one seat.');
      return;
    }

    setCreateError(null);
    setCreateLoading(true);

    try {
      const requestData: CreateAuditoriumRequest = {
        auditoriumNumber: auditoriumNumber.trim(),
        movieFormatId: selectedFormat.formatId,
        cinemaId,
        add_req_seats_auditorium_dto: seats,
      };

      console.log('Creating auditorium:', requestData);
      const response = await facilitiesApi.createAuditorium(requestData);
      console.log('Create auditorium response:', response);

      if (response.isSuccess) {
        setCreateSuccess(true);
        if (onSuccess) {
          await onSuccess();
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setCreateError(response.message || 'Failed to create auditorium. Please try again.');
      }
    } catch (err) {
      console.error('Error creating auditorium:', err);
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        setCreateError(data.message || 'Failed to create auditorium. Please try again.');
      } else {
        setCreateError('Unable to connect to server. Please check your network connection.');
      }
    } finally {
      setCreateLoading(false);
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-xl border shadow-2xl transition-all flex flex-col ${
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
          <div>
            <h2 className={`text-2xl font-black ${
              theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
            }`}>
              Add Auditorium
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'format'
                  ? theme === 'web3' ? 'bg-purple-500 text-white' : 'bg-red-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`h-1 w-8 ${
                currentStep !== 'format' 
                  ? theme === 'web3' ? 'bg-purple-500' : 'bg-red-600'
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'info'
                  ? theme === 'web3' ? 'bg-purple-500 text-white' : 'bg-red-600 text-white'
                  : currentStep === 'seats'
                    ? theme === 'web3' ? 'bg-purple-500 text-white' : 'bg-red-600 text-white'
                    : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <div className={`h-1 w-8 ${
                currentStep === 'seats'
                  ? theme === 'web3' ? 'bg-purple-500' : 'bg-red-600'
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'seats'
                  ? theme === 'web3' ? 'bg-purple-500 text-white' : 'bg-red-600 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
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
              <span className="text-sm font-medium">Auditorium added successfully! Updating...</span>
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

          {/* Step 1: Select Movie Format */}
          {currentStep === 'format' && (
            <div className="space-y-4">
              <h3 className={`text-xl font-bold mb-4 ${
                theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
              }`}>
                Select Movie Format
              </h3>

              {formatsLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className={`w-12 h-12 animate-spin ${
                    theme === 'web3' ? 'text-purple-400' : 'text-red-600'
                  }`} />
                </div>
              )}

              {formatsError && (
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-red-900/40 border-red-500/50 text-red-100'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {formatsError}
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
                          ? theme === 'web3'
                            ? 'border-purple-400 bg-purple-800/30 shadow-lg'
                            : 'border-red-600 bg-red-50 shadow-lg'
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                            : theme === 'web3'
                              ? 'bg-purple-800/20 border-purple-500/30 hover:border-purple-400/50'
                              : 'bg-white border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`font-bold text-lg ${
                              theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {format.formatName}
                            </h4>
                            {selectedFormat?.formatId === format.formatId && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                theme === 'web3' ? 'bg-purple-500' : 'bg-red-600'
                              }`}>
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${
                            theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                          }`}>
                            {format.formatDescription}
                          </p>
                          <p className={`text-lg font-black ${
                            theme === 'web3' ? 'text-purple-300' : 'text-red-600'
                          }`}>
                            {formatPrice(format.movieFormatPrice)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Room Info */}
          {currentStep === 'info' && (
            <div className="space-y-4">
              <h3 className={`text-xl font-bold mb-4 ${
                theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
              }`}>
                Auditorium Information
              </h3>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                }`}>
                  Auditorium Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={auditoriumNumber}
                  onChange={(e) => setAuditoriumNumber(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                    theme === 'web3' ? 'focus:border-purple-400' : 'focus:border-red-600'
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : theme === 'web3'
                        ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="e.g., Room 1, Room A, VIP Room 1..."
                />
              </div>

              {/* Exit Position */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                }`}>
                  Exit Position <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
                    <button
                      key={position}
                      type="button"
                      onClick={() => setExitPosition(position)}
                      className={`p-4 rounded-lg border transition-all ${
                        exitPosition === position
                          ? theme === 'web3'
                            ? 'border-purple-400 bg-purple-800/30 shadow-lg'
                            : 'border-red-600 bg-red-50 shadow-lg'
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                            : theme === 'web3'
                              ? 'bg-purple-800/20 border-purple-500/30 hover:border-purple-400/50'
                              : 'bg-white border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className={`text-center ${
                        theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div className={`text-2xl mb-2 ${
                          exitPosition === position
                            ? theme === 'web3' ? 'text-purple-300' : 'text-red-600'
                            : theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                        }`}>
                          {position === 'top' && '⬆️'}
                          {position === 'bottom' && '⬇️'}
                          {position === 'left' && '⬅️'}
                          {position === 'right' && '➡️'}
                        </div>
                        <p className={`text-sm font-semibold capitalize ${
                          exitPosition === position
                            ? theme === 'web3' ? 'text-purple-300' : 'text-red-600'
                            : theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                        }`}>
                          {position === 'top' && 'Top'}
                          {position === 'bottom' && 'Bottom'}
                          {position === 'left' && 'Left'}
                          {position === 'right' && 'Right'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedFormat && (
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'web3' ? 'bg-purple-800/20 border-purple-500/30' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                  }`}>
                    Selected Format:
                  </p>
                  <p className={`font-bold ${
                    theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedFormat.formatName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Seats Layout */}
          {currentStep === 'seats' && (
            <div className="space-y-4">
              <h3 className={`text-xl font-bold mb-4 ${
                theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
              }`}>
                Seat Layout ({seats.length} seats)
              </h3>

              {/* Room Size Configuration */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'web3' ? 'bg-purple-800/20 border-purple-500/30' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                }`}>
                  Room Size
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${
                      theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Columns <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={roomCols}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 5;
                        setRoomCols(Math.max(5, Math.min(20, value)));
                      }}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors text-sm ${
                        theme === 'web3' ? 'focus:border-purple-400' : 'focus:border-red-600'
                      } ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                          : theme === 'web3'
                            ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="5-20"
                    />
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
                    }`}>
                      Min: 5, Max: 20
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${
                      theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Rows <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="15"
                      value={roomRows}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 5;
                        setRoomRows(Math.max(5, Math.min(15, value)));
                      }}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-colors text-sm ${
                        theme === 'web3' ? 'focus:border-purple-400' : 'focus:border-red-600'
                      } ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                          : theme === 'web3'
                            ? 'bg-purple-800/30 border-purple-500/30 text-white placeholder-purple-300/70'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="5-15"
                    />
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
                    }`}>
                      Min: 5, Max: 15
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto Actions */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'web3' ? 'bg-purple-800/20 border-purple-500/30' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                }`}>
                  Auto Options
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAutoFillSeats}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                      theme === 'web3'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Auto Fill Seats
                  </button>
                  <button
                    onClick={handleClearAllSeats}
                    disabled={seats.length === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                      seats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : theme === 'web3'
                          ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Clear All Seats
                  </button>
                </div>
                <p className={`text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                }`}>
                  "Auto Fill Seats" will create seats for all empty cells in the grid
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'web3' ? 'bg-purple-800/20 border-purple-500/30' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm mb-2 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                }`}>
                  <Move className="w-4 h-4" />
                  {isMobile ? 'Touch and drag to add seats' : 'Click and drag to add seats, click on seat to remove'}
                </p>
              </div>

              {/* Screen */}
              <div className={`text-center py-2 mb-4 rounded ${
                theme === 'dark' ? 'bg-gray-800' : theme === 'web3' ? 'bg-purple-800/30' : 'bg-gray-200'
              }`}>
                <p className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                }`}>
                  SCREEN
                </p>
              </div>

              {/* Exit Position Indicator */}
              <div className={`mb-4 p-3 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : theme === 'web3' ? 'bg-purple-800/20 border-purple-500/30' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200' : 'text-gray-600'
                }`}>
                  <span className="text-lg">
                    {exitPosition === 'top' && '⬆️'}
                    {exitPosition === 'bottom' && '⬇️'}
                    {exitPosition === 'left' && '⬅️'}
                    {exitPosition === 'right' && '➡️'}
                  </span>
                  Exit: <span className="font-semibold capitalize">
                    {exitPosition === 'top' && 'Top'}
                    {exitPosition === 'bottom' && 'Bottom'}
                    {exitPosition === 'left' && 'Left'}
                    {exitPosition === 'right' && 'Right'}
                  </span>
                </p>
              </div>

              {/* Grid Canvas */}
              <div className="overflow-auto max-h-96">
                <div className="relative inline-block">
                  {/* Exit Position Visual */}
                  {exitPosition === 'top' && (
                    <div className={`text-center py-2 mb-2 rounded ${
                      theme === 'dark' ? 'bg-green-800/40 border border-green-600' : theme === 'web3' ? 'bg-green-800/40 border border-green-500' : 'bg-green-100 border border-green-300'
                    }`} style={{ width: gridSize.cols * cellSize.width }}>
                      <p className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-green-300' : theme === 'web3' ? 'text-green-200' : 'text-green-700'
                      }`}>
                        🚪 EXIT
                      </p>
                    </div>
                  )}
                  
                  <div className="flex">
                    {exitPosition === 'left' && (
                      <div className={`flex items-center justify-center px-2 rounded-l ${
                        theme === 'dark' ? 'bg-green-800/40 border border-green-600' : theme === 'web3' ? 'bg-green-800/40 border border-green-500' : 'bg-green-100 border border-green-300'
                      }`} style={{ height: gridSize.rows * cellSize.height }}>
                        <p className={`text-xs font-semibold writing-vertical ${
                          theme === 'dark' ? 'text-green-300' : theme === 'web3' ? 'text-green-200' : 'text-green-700'
                        }`} style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                          🚪 EXIT
                        </p>
                      </div>
                    )}

                    <div
                      ref={canvasRef}
                      className={`relative border-2 ${
                        theme === 'dark' ? 'border-gray-700' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-300'
                      }`}
                      style={{
                        width: gridSize.cols * cellSize.width,
                        height: gridSize.rows * cellSize.height,
                        backgroundImage: `
                          linear-gradient(to right, ${theme === 'dark' ? 'rgba(75, 85, 99, 0.3)' : theme === 'web3' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(209, 213, 219, 0.3)'} 1px, transparent 1px),
                          linear-gradient(to bottom, ${theme === 'dark' ? 'rgba(75, 85, 99, 0.3)' : theme === 'web3' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(209, 213, 219, 0.3)'} 1px, transparent 1px)
                        `,
                        backgroundSize: `${cellSize.width}px ${cellSize.height}px`,
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Seats */}
                      {seats.map((seat, index) => (
                        <div
                          key={index}
                          onClick={() => handleRemoveSeat(seat.colIndex, seat.rowIndex)}
                          className={`absolute cursor-pointer rounded transition-all hover:scale-110 flex items-center justify-center text-xs font-bold ${
                            theme === 'web3'
                              ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white'
                              : 'bg-gradient-to-br from-red-600 to-red-800 text-white'
                          }`}
                          style={{
                            left: seat.coordX,
                            top: seat.coordY,
                            width: cellSize.width - 4,
                            height: cellSize.height - 4,
                            margin: '2px',
                          }}
                          title={seat.seatNumber}
                        >
                          {!isMobile && seat.seatNumber}
                        </div>
                      ))}
                    </div>

                    {exitPosition === 'right' && (
                      <div className={`flex items-center justify-center px-2 rounded-r ${
                        theme === 'dark' ? 'bg-green-800/40 border border-green-600' : theme === 'web3' ? 'bg-green-800/40 border border-green-500' : 'bg-green-100 border border-green-300'
                      }`} style={{ height: gridSize.rows * cellSize.height }}>
                        <p className={`text-xs font-semibold writing-vertical ${
                          theme === 'dark' ? 'text-green-300' : theme === 'web3' ? 'text-green-200' : 'text-green-700'
                        }`} style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                          🚪 EXIT
                        </p>
                      </div>
                    )}
                  </div>

                  {exitPosition === 'bottom' && (
                    <div className={`text-center py-2 mt-2 rounded ${
                      theme === 'dark' ? 'bg-green-800/40 border border-green-600' : theme === 'web3' ? 'bg-green-800/40 border border-green-500' : 'bg-green-100 border border-green-300'
                    }`} style={{ width: gridSize.cols * cellSize.width }}>
                      <p className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-green-300' : theme === 'web3' ? 'text-green-200' : 'text-green-700'
                      }`}>
                        🚪 EXIT
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Info */}
              <div className={`p-3 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : theme === 'web3' ? 'bg-purple-800/20 text-purple-200' : 'bg-gray-50 text-gray-600'
              }`}>
                <p>Size: {gridSize.cols} columns × {gridSize.rows} rows</p>
                <p>Cell size: {cellSize.width}px × {cellSize.height}px</p>
                <p className="mt-1">
                  <span className="font-semibold">Exit:</span>{' '}
                  {exitPosition === 'top' && 'Top'}
                  {exitPosition === 'bottom' && 'Bottom'}
                  {exitPosition === 'left' && 'Left'}
                  {exitPosition === 'right' && 'Right'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-between gap-3 p-6 border-t ${
          theme === 'dark' ? 'border-gray-800' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-200'
        }`}>
          <button
            onClick={currentStep === 'format' ? onClose : handlePrevStep}
            disabled={createLoading}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : theme === 'web3'
                  ? 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            } ${createLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {currentStep !== 'format' && <ArrowLeft className="w-4 h-4" />}
            {currentStep === 'format' ? 'Cancel' : 'Back'}
          </button>

          {currentStep === 'seats' ? (
            <button
              onClick={handleSubmit}
              disabled={createLoading || seats.length === 0}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                createLoading || seats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
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
                  Create Auditorium
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNextStep}
              disabled={
                (currentStep === 'format' && !selectedFormat) ||
                (currentStep === 'info' && !auditoriumNumber.trim())
              }
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                (currentStep === 'format' && !selectedFormat) ||
                (currentStep === 'info' && !auditoriumNumber.trim())
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                theme === 'web3'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAuditoriumModal;
