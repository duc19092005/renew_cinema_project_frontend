import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const { theme } = useTheme();

    return (
        <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : theme === 'web3' ? 'bg-purple-900/50 border-purple-500/30' : 'bg-gray-100 border-gray-200'
            }`}>
            <button
                onClick={() => i18n.changeLanguage('vi')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'vi'
                    ? theme === 'web3'
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                    : theme === 'dark' ? 'text-gray-500 hover:text-white' : theme === 'web3' ? 'text-purple-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                VI
            </button>
            <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'en'
                    ? theme === 'web3'
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                    : theme === 'dark' ? 'text-gray-500 hover:text-white' : theme === 'web3' ? 'text-purple-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
