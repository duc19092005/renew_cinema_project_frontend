import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  Palette,
  Sparkles,
} from 'lucide-react';
import { facilitiesApi, type Cinema } from '../../api/facilitiesApi';
import axios from 'axios';
import { authApi } from '../../api/authApi';
import type { ApiErrorResponse } from '../../types/auth.types';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CinemaManagement from './components/CinemaManagement';
import SeatReport from './components/SeatReport';
import LogoutModal from '../../components/LogoutModal';

const FacilitiesManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ username: string; roles?: string[]; selectedRole?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Sidebar state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load user info và check quyền FacilitiesManager
  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsed = JSON.parse(storedUser) as { username: string; roles?: string[]; selectedRole?: string };
      const roles = parsed.roles || [];

      // Nếu không có quyền FacilitiesManager thì đá về chọn role
      if (!roles.includes('FacilitiesManager')) {
        navigate('/role-selection');
        return;
      }

      setUser(parsed);
      fetchCinemas();
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCinemas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await facilitiesApi.getCinemaList();
      setCinemas(res.data || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        if (data.statusCode === 401) {
          // Token / cookie hết hạn → logout
          localStorage.removeItem('user_info');
          navigate('/login');
          return;
        }
        setError(data.message || 'Failed to load cinemas.');
      } else {
        setError('Unable to connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setLogoutError(null);
  };

  const handleLogoutConfirm = async () => {
    setLogoutError(null);
    setLogoutLoading(true);
    try {
      await authApi.logout();
      localStorage.removeItem('user_info');
      setIsLogoutModalOpen(false);
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiErrorResponse;
        setLogoutError(data.message || 'Logout failed.');
      } else {
        setLogoutError('Unable to connect to server.');
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard cinemas={cinemas} loading={loading} />;
      case 'cinemas':
        return <CinemaManagement cinemas={cinemas} onRefresh={fetchCinemas} />;
      case 'seat-reports':
        return <SeatReport />;
      default:
        return <Dashboard cinemas={cinemas} loading={loading} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-black text-white' 
        : theme === 'web3'
          ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950 text-white'
          : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 lg:left-64 z-50 backdrop-blur-md border-b h-16 flex items-center justify-between px-6 shadow-lg transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-black/80 border-gray-800'
          : theme === 'web3'
            ? 'bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-cyan-900/90 border-purple-500/30'
            : 'bg-white/80 border-gray-200'
      }`}>
        {/* Logo bên trái - ẩn trên mobile vì có sidebar button */}
        <div
          className="hidden lg:flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/home')}
        >
          <div className={`text-2xl font-black tracking-widest uppercase ${
            theme === 'web3' 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400'
              : 'text-red-600'
          }`}>
            CINEMA<span className={theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'}>PRO</span>
          </div>
          <span className={`text-xs border-l pl-3 ${
            theme === 'dark' 
              ? 'text-gray-400 border-gray-700' 
              : theme === 'web3'
                ? 'text-purple-200 border-purple-500/30'
                : 'text-gray-600 border-gray-300'
          }`}>
            Facilities Manager Dashboard
          </span>
        </div>

        {/* Spacer cho mobile */}
        <div className="lg:hidden flex-1" />

        {/* Theme Selector & User Menu */}
        <div className="flex items-center gap-3">
          {/* Theme Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-300'
                  : theme === 'web3'
                    ? 'hover:bg-purple-900/30 text-purple-300'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label="Select theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" />
              ) : theme === 'web3' ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span className="hidden sm:inline-block text-sm font-medium">
                {theme === 'dark' ? 'Dark' : theme === 'web3' ? 'Web3' : 'Light'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isThemeDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-700'
                  : theme === 'web3'
                    ? 'bg-gradient-to-br from-purple-900/95 to-cyan-900/95 border border-purple-500/30 backdrop-blur-xl'
                    : 'bg-white border border-gray-200'
              }`}>
                <div className="py-2">
                  <div className={`px-4 py-2 border-b ${
                    theme === 'dark' ? 'border-gray-800' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-200'
                  }`}>
                    <p className={`text-xs uppercase font-bold ${
                      theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-300' : 'text-gray-400'
                    }`}>
                      Chọn giao diện
                    </p>
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-200/70' : 'text-gray-500'
                    }`}>
                      Demo - Chọn tone màu yêu thích
                    </p>
                  </div>

                  {/* Light Mode */}
                  <button
                    onClick={() => {
                      setTheme('light');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-900'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : theme === 'web3'
                            ? 'text-purple-200 hover:bg-purple-800/30 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-semibold">Light Mode</div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
                      }`}>
                        Giao diện sáng
                      </div>
                    </div>
                    {theme === 'light' && (
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </button>

                  {/* Dark Mode */}
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : theme === 'web3'
                          ? 'text-purple-200 hover:bg-purple-800/30 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-semibold">Dark Mode</div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
                      }`}>
                        Giao diện tối
                      </div>
                    </div>
                    {theme === 'dark' && (
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </button>

                  {/* Web3 Mode */}
                  <button
                    onClick={() => {
                      setTheme('web3');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                      theme === 'web3'
                        ? 'bg-purple-800/50 text-white'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-semibold">Web3 View</div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
                      }`}>
                        Tông màu Web3
                      </div>
                    </div>
                    {theme === 'web3' && (
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-red-600/50 ${
                theme === 'dark'
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-red-glow">
                <User className="w-5 h-5 text-white" />
              </div>

              <span className={`hidden sm:block font-bold text-sm ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {user?.username || 'Guest'}
              </span>

              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="py-2">
                  <div className={`px-4 py-3 border-b ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <p className={`text-xs uppercase font-bold ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>Signed in as</p>
                    <p className={`text-sm font-bold truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{user?.username}</p>
                    {user?.selectedRole && (
                      <p className="mt-1 text-[11px] text-red-400 uppercase tracking-wide">
                        Role: {user.selectedRole}
                      </p>
                    )}
                  </div>

                  <button className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-red-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
                  }`}>
                    <UserCircle className="w-4 h-4" />
                    Account Information
                  </button>

                  <button className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-red-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
                  }`}>
                    <Settings className="w-4 h-4" />
                    Change Password
                  </button>

                  <div className={`border-t mt-1 ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`} />

                  <button
                    onClick={handleLogoutClick}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors font-bold ${
                      theme === 'dark'
                        ? 'text-red-500 hover:bg-red-900/20 hover:text-red-400'
                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-6 container mx-auto max-w-7xl">
          {/* Thông báo lỗi Logout */}
          {logoutError && (
            <div className={`mb-4 p-4 rounded-lg border flex items-center ${
              theme === 'dark'
                ? 'bg-red-900/40 border-red-500/50 text-red-100'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
              <span className="text-sm font-medium">{logoutError}</span>
            </div>
          )}

          {/* Error state */}
          {error && activeTab === 'dashboard' && (
            <div className={`mb-6 p-4 rounded-lg border flex items-center ${
              theme === 'dark'
                ? 'bg-red-900/40 border-red-500/50 text-red-100'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Render content based on active tab */}
          {renderContent()}
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
        error={logoutError}
      />
    </div>
  );
};

export default FacilitiesManagerPage;
