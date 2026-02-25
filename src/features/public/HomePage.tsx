import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, LogOut, AlertCircle, ArrowLeftRight, Loader2, Sun, Moon, Sparkles } from 'lucide-react';
import axios from 'axios';
import { authApi } from '../../api/authApi';
import { movieApi } from '../../api/movieApi';
import type { ApiErrorResponse } from '../../types/auth.types';
import type { Movie } from '../../types/movie.types';
import LogoutModal from '../../components/LogoutModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [user, setUser] = useState<{ username: string; roles?: string[]; selectedRole?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Movies state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchMovies();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await movieApi.getMovieList();
      setMovies(res.data || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as ApiErrorResponse;
        if (data.statusCode === 401) {
          localStorage.removeItem('user_info');
          navigate('/login');
          return;
        }
        setError(data.message || 'Cannot load movies list.');
      } else {
        setError('Cannot connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : theme === 'web3' ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
      {/* --- HEADER --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b h-16 flex items-center justify-between px-6 shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-black/80 border-gray-800' : theme === 'web3' ? 'bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-cyan-900/90 border-purple-500/30' : 'bg-white/80 border-gray-200'
        }`}>
        <div className={`text-2xl font-black tracking-widest uppercase cursor-pointer ${theme === 'web3' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400' : 'text-red-600'
          }`}
          onClick={() => navigate('/home')}
        >
          CINEMA<span className={theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'}>PRO</span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {/* Theme Dropdown */}
          <div className="relative" ref={themeDropdownRef}>
            <button onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : theme === 'web3' ? 'hover:bg-purple-900/30 text-purple-300' : 'hover:bg-gray-100 text-gray-700'
              }`}>
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : theme === 'web3' ? <Sparkles className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="hidden sm:inline-block text-sm font-medium">{theme === 'dark' ? 'Dark' : theme === 'web3' ? 'Web3' : 'Light'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isThemeDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : theme === 'web3' ? 'bg-purple-900/95 border border-purple-500/30 backdrop-blur-xl' : 'bg-white border border-gray-200'
                }`}>
                {(['light', 'dark', 'web3'] as const).map((t) => (
                  <button key={t} onClick={() => { setTheme(t); setIsThemeDropdownOpen(false); }} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === t ? (theme === 'dark' ? 'bg-gray-800 text-white' : theme === 'web3' ? 'bg-purple-800/50 text-white' : 'bg-gray-100 text-gray-900')
                    : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : theme === 'web3' ? 'text-purple-200 hover:bg-purple-800/30' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    {t === 'light' ? <Sun className="w-4 h-4" /> : t === 'dark' ? <Moon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {t === 'light' ? 'Light Mode' : t === 'dark' ? 'Dark Mode' : 'Web3 View'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-red-600/50 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className={`hidden sm:block font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {user?.username || 'Guest'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>

            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <div className="py-2">
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                    <p className={`text-xs uppercase font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t('header.signedInAs')}</p>
                    <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.username}</p>
                  </div>

                  {user?.roles && user.roles.length > 1 && (
                    <button
                      onClick={() => navigate('/role-selection')}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-500' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        }`}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      {t('header.switchRole')}
                    </button>
                  )}

                  <div className={`border-t mt-1 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}></div>

                  <button
                    onClick={handleLogoutClick}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors font-bold ${theme === 'dark' ? 'text-red-500 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                      }`}
                  >
                    <LogOut className="w-4 h-4" />
                    {t('header.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {logoutError && (
        <div className="pt-24 px-6 container mx-auto">
          <div className="mb-4 p-4 rounded-lg bg-red-900/40 border border-red-500/50 flex items-center text-red-100">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
            <span className="text-sm font-medium">{logoutError}</span>
          </div>
        </div>
      )}

      {/* --- BODY CONTENT --- */}
      <main className="pt-24 px-6 container mx-auto mb-16">
        <h2 className={`text-3xl font-black mb-6 border-l-4 pl-4 ${theme === 'web3' ? 'border-purple-400 text-white' : 'border-red-600'
          }`}>Now Showing</h2>

        {error && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center ${theme === 'dark' || theme === 'web3' ? 'bg-red-900/40 border-red-500/50 text-red-100' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-sm font-medium flex-1">{error}</span>
            <button onClick={fetchMovies} className="ml-3 px-3 py-1 rounded text-sm font-semibold bg-red-600 hover:bg-red-700 text-white">Retry</button>
          </div>
        )}

        {loading ? (
          <div className={`text-center py-20 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : theme === 'web3' ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30' : 'bg-white border-gray-200'
            }`}>
            <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${theme === 'web3' ? 'text-purple-400' : 'text-red-600'}`} />
            <p className={theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300' : 'text-gray-600'}>Loading movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className={`text-center py-20 rounded-xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
            <p className="text-xl">No movies currently showing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div key={movie.movieId} className={`group rounded-xl overflow-hidden shadow-lg border transition-all hover:-translate-y-1 cursor-pointer ${theme === 'dark'
                ? 'bg-gray-900 border-gray-800 hover:border-red-600'
                : theme === 'web3'
                  ? 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 border-purple-500/30 hover:border-purple-400 backdrop-blur-xl'
                  : 'bg-white border-gray-200 hover:border-red-600 shadow-sm'
                }`}>
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.movieImageUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500'}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    alt={movie.movieName}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <button className={`w-full py-2 rounded font-bold text-sm ${theme === 'web3' ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'}`}>Book Ticket</button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`font-bold text-sm sm:text-base truncate mb-1 ${theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
                    }`}>{movie.movieName}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.movieGenresInfos.slice(0, 2).map((genre, i) => (
                      <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : theme === 'web3' ? 'bg-purple-800/40 text-purple-300' : 'bg-gray-100 text-gray-600'
                        }`}>{genre}</span>
                    ))}
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : theme === 'web3' ? 'text-purple-400' : 'text-gray-500'}`}>
                    {movie.duration} min • {formatDate(movie.startedDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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

export default HomePage;