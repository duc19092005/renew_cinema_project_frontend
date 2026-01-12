import React from 'react';
import { LayoutDashboard, Building2, BarChart3, Menu, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onToggle }) => {
  const { theme } = useTheme();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cinemas', label: 'Quản lý rạp', icon: Building2 },
    { id: 'seat-reports', label: 'Báo cáo ghế', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 border rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-700 text-white hover:bg-gray-800'
            : theme === 'web3'
              ? 'bg-purple-900/90 border-purple-500/30 text-white hover:bg-purple-800/90 backdrop-blur-xl'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay cho mobile */}
      {isOpen && (
        <div
          className={`lg:hidden fixed inset-0 z-40 ${
            theme === 'dark' 
              ? 'bg-black/50' 
              : theme === 'web3'
                ? 'bg-purple-950/60'
                : 'bg-black/30'
          }`}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full border-r z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : theme === 'web3'
              ? 'bg-gradient-to-b from-purple-900/95 via-indigo-900/95 to-cyan-900/95 border-purple-500/30 backdrop-blur-xl'
              : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-6 border-b ${
            theme === 'dark' 
              ? 'border-gray-800' 
              : theme === 'web3'
                ? 'border-purple-500/30'
                : 'border-gray-200'
          }`}>
            <div className={`text-xl font-black tracking-widest uppercase ${
              theme === 'web3'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400'
                : 'text-red-600'
            }`}>
              CINEMA<span className={theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'}>PRO</span>
            </div>
            <p className={`text-xs mt-1 ${
              theme === 'dark' 
                ? 'text-gray-400' 
                : theme === 'web3'
                  ? 'text-purple-200'
                  : 'text-gray-600'
            }`}>Facilities Manager</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    // Đóng sidebar trên mobile sau khi chọn
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? theme === 'web3'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : theme === 'web3'
                          ? 'text-purple-200 hover:bg-purple-800/30 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t ${
            theme === 'dark' 
              ? 'border-gray-800' 
              : theme === 'web3'
                ? 'border-purple-500/30'
                : 'border-gray-200'
          }`}>
            <p className={`text-xs text-center ${
              theme === 'dark' 
                ? 'text-gray-500' 
                : theme === 'web3'
                  ? 'text-purple-300/70'
                  : 'text-gray-400'
            }`}>
              © 2024 CinemaPro
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
