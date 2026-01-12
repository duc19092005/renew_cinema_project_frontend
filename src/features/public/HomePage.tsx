import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, LogOut, Settings, UserCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { authApi } from '../../api/authApi';
import type { ApiErrorResponse } from '../../types/auth.types';
import LogoutModal from '../../components/LogoutModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Load thông tin user từ LocalStorage khi vào trang
  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Nếu không có user, đá về trang login
      navigate('/login');
    }
  }, [navigate]);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
      // Xóa user info local sau khi backend đã logout (xóa cookie)
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

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-between px-6 shadow-lg">
        {/* Logo bên trái */}
        <div className="text-2xl font-black text-red-600 tracking-widest uppercase cursor-pointer">
          CINEMA<span className="text-white">PRO</span>
        </div>

        {/* User Menu bên phải (Góc phải trên cùng) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors outline-none focus:ring-2 focus:ring-red-600/50"
          >
            {/* Avatar Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-red-glow">
              <User className="w-5 h-5 text-white" />
            </div>
            
            {/* Username */}
            <span className="hidden sm:block font-bold text-sm text-gray-200">
              {user?.username || 'Guest'}
            </span>
            
            {/* Chevron Icon */}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-xs text-gray-500 uppercase font-bold">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{user?.username}</p>
                </div>

                <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-500 flex items-center gap-3 transition-colors">
                  <UserCircle className="w-4 h-4" />
                  Account Information
                </button>
                
                <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-500 flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4" />
                  Change Password
                </button>
                
                <div className="border-t border-gray-800 mt-1"></div>
                
                <button 
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-900/20 hover:text-red-400 flex items-center gap-3 transition-colors font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Thông báo lỗi Logout (giống style LoginForm) */}
      {logoutError && (
        <div className="pt-24 px-6 container mx-auto">
          <div className="mb-4 p-4 rounded-lg bg-red-900/40 border border-red-500/50 flex items-center text-red-100">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
            <span className="text-sm font-medium">{logoutError}</span>
          </div>
        </div>
      )}

      {/* --- BODY CONTENT (Placeholder) --- */}
      <main className="pt-24 px-6 container mx-auto">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">Now Showing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Demo Cards */}
          {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-red-600 transition-all hover:-translate-y-1 cursor-pointer group">
               <div className="aspect-[2/3] bg-gray-800 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1536440136628-849c177e76a1' : '1489599849927-2ee91cede3ba'}?auto=format&fit=crop&w=500`} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                    alt="Movie Poster" 
                  />
               </div>
               <div className="p-4">
                 <h3 className="font-bold text-white truncate">Movie Title {i}</h3>
                 <p className="text-gray-500 text-xs mt-1">Action • 2h 15m</p>
               </div>
             </div>
          ))}
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

export default HomePage;