// src/utils/themeUtils.ts
import type { Theme } from '../contexts/ThemeContext';

export const getThemeClasses = {
  // Background colors
  bg: (theme: Theme) => {
    if (theme === 'dark') return 'bg-black';
    if (theme === 'web3') return 'bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950';
    return 'bg-gray-50';
  },
  
  bgCard: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-900';
    if (theme === 'web3') return 'bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 backdrop-blur-xl';
    return 'bg-white';
  },
  
  bgSecondary: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'web3') return 'bg-purple-900/60 backdrop-blur-xl';
    return 'bg-gray-50';
  },
  
  // Text colors
  text: (theme: Theme) => {
    if (theme === 'dark') return 'text-white';
    if (theme === 'web3') return 'text-white';
    return 'text-gray-900';
  },
  
  textSecondary: (theme: Theme) => {
    if (theme === 'dark') return 'text-gray-400';
    if (theme === 'web3') return 'text-purple-200';
    return 'text-gray-600';
  },
  
  textMuted: (theme: Theme) => {
    if (theme === 'dark') return 'text-gray-500';
    if (theme === 'web3') return 'text-purple-300/70';
    return 'text-gray-500';
  },
  
  // Border colors
  border: (theme: Theme) => {
    if (theme === 'dark') return 'border-gray-800';
    if (theme === 'web3') return 'border-purple-500/30';
    return 'border-gray-200';
  },
  
  borderHover: (theme: Theme) => {
    if (theme === 'dark') return 'hover:border-red-600';
    if (theme === 'web3') return 'hover:border-purple-400';
    return 'hover:border-red-600';
  },
  
  // Header/Background overlay
  headerBg: (theme: Theme) => {
    if (theme === 'dark') return 'bg-black/80 border-gray-800';
    if (theme === 'web3') return 'bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-cyan-900/90 border-purple-500/30';
    return 'bg-white/80 border-gray-200';
  },
  
  // Sidebar
  sidebarBg: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-900 border-gray-800';
    if (theme === 'web3') return 'bg-gradient-to-b from-purple-900/95 via-indigo-900/95 to-cyan-900/95 border-purple-500/30 backdrop-blur-xl';
    return 'bg-white border-gray-200';
  },
  
  // Button styles
  buttonPrimary: (theme: Theme) => {
    if (theme === 'dark') return 'bg-red-600 hover:bg-red-700 text-white';
    if (theme === 'web3') return 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white';
    return 'bg-red-600 hover:bg-red-700 text-white';
  },
  
  buttonSecondary: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-800 hover:bg-gray-700 text-gray-300';
    if (theme === 'web3') return 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200';
    return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  },
  
  // Logo gradient
  logoGradient: (theme: Theme) => {
    if (theme === 'web3') return 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400';
    return 'text-red-600';
  },
};
