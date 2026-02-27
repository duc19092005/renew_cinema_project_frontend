// src/utils/themeUtils.ts
import type { Theme } from '../contexts/ThemeContext';

export const getThemeClasses = {
  // Background colors
  bg: (theme: Theme) => {
    if (theme === 'dark') return 'bg-black';
    if (theme === 'modern') return 'bg-gradient-to-br from-[#0D081D] via-[#050A14] to-[#12081C]';
    return 'bg-gray-50';
  },

  bgCard: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-900';
    if (theme === 'modern') return 'bg-[#15102B]/80 backdrop-blur-2xl border border-indigo-500/40 shadow-sm shadow-indigo-500/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]';
    return 'bg-white';
  },

  bgSecondary: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'modern') return 'bg-slate-800/40 backdrop-blur-lg border border-indigo-500/40 shadow-sm shadow-indigo-500/10';
    return 'bg-gray-50';
  },

  // Text colors
  text: (theme: Theme) => {
    if (theme === 'dark') return 'text-white';
    if (theme === 'modern') return 'text-white';
    return 'text-gray-900';
  },

  textSecondary: (theme: Theme) => {
    if (theme === 'dark') return 'text-gray-400';
    if (theme === 'modern') return 'text-white font-medium';
    return 'text-gray-600';
  },

  textMuted: (theme: Theme) => {
    if (theme === 'dark') return 'text-gray-500';
    if (theme === 'modern') return 'text-indigo-300';
    return 'text-gray-500';
  },

  // Border colors
  border: (theme: Theme) => {
    if (theme === 'dark') return 'border-gray-800';
    if (theme === 'modern') return 'border-indigo-500/30 shadow-sm shadow-indigo-500/10';
    return 'border-gray-200';
  },

  borderHover: (theme: Theme) => {
    if (theme === 'dark') return 'hover:border-red-600';
    if (theme === 'modern') return 'hover:border-cyan-300 shadow-md shadow-cyan-500/20';
    return 'hover:border-red-600';
  },

  // Header/Background overlay
  headerBg: (theme: Theme) => {
    if (theme === 'dark') return 'bg-black/80 border-gray-800';
    if (theme === 'modern') return 'bg-[#0E0A20]/80 border-indigo-900/50/80 shadow-lg';
    return 'bg-white/80 border-gray-200';
  },

  // Sidebar
  sidebarBg: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-900 border-gray-800';
    if (theme === 'modern') return 'bg-[#0E0A20]/95 border-indigo-900/50 backdrop-blur-2xl shadow-2xl shadow-cyan-900/20';
    return 'bg-white border-gray-200';
  },

  // Button styles
  buttonPrimary: (theme: Theme) => {
    if (theme === 'dark') return 'bg-red-600 hover:bg-red-700 text-white';
    if (theme === 'modern') return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]';
    return 'bg-red-600 hover:bg-red-700 text-white';
  },

  buttonSecondary: (theme: Theme) => {
    if (theme === 'dark') return 'bg-gray-800 hover:bg-gray-700 text-gray-300';
    if (theme === 'modern') return 'bg-slate-800/60 hover:bg-slate-700/60 text-white font-medium border border-slate-700';
    return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  },

  // Logo gradient
  logoGradient: (theme: Theme) => {
    if (theme === 'modern') return 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-rose-300 drop-shadow-sm';
    return 'text-red-600';
  },
};
