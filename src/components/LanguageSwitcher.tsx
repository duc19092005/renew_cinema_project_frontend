import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const { theme } = useTheme();

    return (
        <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : theme === 'modern' ? 'bg-[#0E0A20]/50 border-indigo-500/30 shadow-sm shadow-indigo-500/10' : 'bg-gray-100 border-gray-200'
            }`}>
            <button
                onClick={() => i18n.changeLanguage('vi')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'vi'
                    ? theme === 'modern'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                    : theme === 'dark' ? 'text-gray-500 hover:text-white' : theme === 'modern' ? 'text-white font-medium hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                VI
            </button>
            <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'en'
                    ? theme === 'modern'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                    : theme === 'dark' ? 'text-gray-500 hover:text-white' : theme === 'modern' ? 'text-white font-medium hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
