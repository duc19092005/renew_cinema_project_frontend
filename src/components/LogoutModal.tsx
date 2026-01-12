// src/components/LogoutModal.tsx
import React from 'react';
import { X, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  error?: string | null;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-xl border shadow-2xl transition-all ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : theme === 'web3'
              ? 'bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-cyan-900/95 border-purple-500/30 backdrop-blur-xl'
              : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              theme === 'web3'
                ? 'bg-gradient-to-br from-red-600 to-red-800'
                : 'bg-red-600'
            }`}>
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-2xl font-black ${
              theme === 'dark' || theme === 'web3' ? 'text-white' : 'text-gray-900'
            }`}>
              Xác nhận đăng xuất
            </h2>
          </div>
          {!loading && (
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
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className={`mb-4 p-4 rounded-lg border flex items-center ${
              theme === 'dark'
                ? 'bg-red-900/40 border-red-500/50 text-red-100'
                : theme === 'web3'
                  ? 'bg-red-900/40 border-red-500/50 text-red-100'
                  : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-300' : theme === 'web3' ? 'text-purple-200' : 'text-gray-700'
            }`}>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : theme === 'web3' ? 'text-purple-300/70' : 'text-gray-500'
            }`}>
              Sau khi đăng xuất, bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-6 border-t ${
          theme === 'dark' ? 'border-gray-800' : theme === 'web3' ? 'border-purple-500/30' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              loading
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
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              loading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${
              theme === 'web3'
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng xuất...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
