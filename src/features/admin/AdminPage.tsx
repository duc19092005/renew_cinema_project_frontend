import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Settings,
    LayoutDashboard,
    LogOut,
    ChevronDown,
    UserCircle,
    Sun,
    Moon,
    Sparkles,
    Clapperboard,
    Loader2,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { adminApi } from '../../api/adminApi';
import { authApi } from '../../api/authApi';
import type { AdminUserDto, ScheduleJobDto } from '../../types/admin.types';
import toast from 'react-hot-toast';
import LogoutModal from '../../components/LogoutModal';
import LanguageSwitcher from '../../components/LanguageSwitcher';

// =============================================
// SIDEBAR COMPONENT
// =============================================
interface SidebarProps {
    activeTab: 'users' | 'jobs';
    onTabChange: (tab: 'users' | 'jobs') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'jobs', label: 'Background Jobs', icon: Clock },
    ] as const;

    return (
        <aside className={`fixed top-0 left-0 h-full w-64 z-50 border-r transition-transform duration-300 ${theme === 'dark'
            ? 'bg-gray-950 border-gray-800'
            : theme === 'modern'
                ? 'bg-[#0E0A20] border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                : 'bg-white border-gray-200'
            }`}>
            {/* Logo */}
            <div className={`h-16 flex items-center px-6 border-b ${theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/30 shadow-sm shadow-indigo-500/10' : 'border-gray-200'
                }`}>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/admin')}
                >
                    <Clapperboard className={`w-7 h-7 ${theme === 'modern' ? 'text-cyan-400' : 'text-red-600'}`} />
                    <span className={`text-xl font-black tracking-wider ${theme === 'modern'
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-rose-300 drop-shadow-sm'
                        : 'text-red-600'
                        }`}>
                        CINEMA<span className={theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'}>PRO</span>
                    </span>
                </div>
            </div>

            {/* Role badge */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/30 shadow-sm shadow-indigo-500/10' : 'border-gray-200'
                }`}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${theme === 'modern'
                    ? 'bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-cyan-400 border border-slate-700'
                    : 'bg-red-600/10 text-red-500'
                    }`}>
                    <LayoutDashboard className="w-4 h-4" />
                    System Admin
                </div>
            </div>

            {/* Menu */}
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === item.id
                            ? theme === 'modern'
                                ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 shadow-[inset_0_0_20px_rgba(6,182,212,0.1),0_0_15px_rgba(6,182,212,0.2)]'
                                : 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                            : theme === 'dark'
                                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                : theme === 'modern'
                                    ? 'text-white font-medium hover:bg-[#15102B]/60 hover:text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

// =============================================
// MAIN ADMIN PAGE
// =============================================

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [jobs, setJobs] = useState<ScheduleJobDto[]>([]);
    const [loading, setLoading] = useState(true);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const themeDropdownRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<{ username: string; roles?: string[] } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user_info');
        if (!storedUser) { navigate('/login'); return; }
        const parsed = JSON.parse(storedUser);
        if (!parsed.roles?.includes('Admin')) { navigate('/role-selection'); return; }
        setUser(parsed);
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) setIsThemeDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const res = await adminApi.getUsers();
                setUsers(res.data || []);
            } else {
                const res = await adminApi.getScheduleJobs();
                setJobs(res.data || []);
            }
        } catch (err) {
            toast.error('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserStatus = async (userId: string, newStatus: number) => {
        try {
            await adminApi.updateUserStatus(userId, newStatus);
            toast.success('User status updated successfully');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleUpdateUserRole = async (userId: string) => {
        const role = prompt("Enter new role: Admin, TheaterManager, SystemAdmin, User...", "User");
        if (!role) return;
        try {
            await adminApi.updateUserRole(userId, role);
            toast.success('User role updated successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleAssignTheaterManager = async (userId: string) => {
        const cinemaId = prompt("Enter the exact Cinema ID to assign this user to:");
        if (!cinemaId) return;
        try {
            await adminApi.assignTheaterManager(cinemaId, userId);
            toast.success('Theater manager assigned successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to assign theater manager');
        }
    };

    const handleLogoutConfirm = async () => {
        setLogoutLoading(true);
        try {
            await authApi.logout();
            localStorage.removeItem('user_info');
            navigate('/login');
        } catch (error) {
            setLogoutError('Logout failed.');
        } finally {
            setLogoutLoading(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : theme === 'modern' ? 'bg-gradient-to-br from-[#0D081D] via-[#050A14] to-[#12081C] text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* HEADER */}
            <header className={`fixed top-0 left-0 right-0 lg:left-64 z-50 backdrop-blur-md border-b h-16 flex items-center justify-between px-6 shadow-lg transition-colors duration-300 ${theme === 'dark'
                ? 'bg-black/80 border-gray-800'
                : theme === 'modern'
                    ? 'bg-gradient-to-r from-[#0E0A20]/90 shadow-2xl border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'bg-white/80 border-gray-200'
                }`}>
                <div
                    className="hidden lg:flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate('/home')}
                >
                    <div className={`text-2xl font-black tracking-widest uppercase ${theme === 'modern'
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-rose-300 drop-shadow-sm'
                        : 'text-red-600'
                        }`}>
                        CINEMA<span className={theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'}>PRO</span>
                    </div>
                    <span className={`text-xs border-l pl-3 ${theme === 'dark'
                        ? 'text-gray-400 border-gray-700'
                        : theme === 'modern'
                            ? 'text-white font-medium border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                            : 'text-gray-600 border-gray-300'
                        }`}>
                        System Admin Dashboard
                    </span>
                </div>

                <div className="lg:hidden flex-1" />

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <div className="relative" ref={themeDropdownRef}>
                        <button
                            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-300'
                                : theme === 'modern'
                                    ? 'hover:bg-indigo-800/40 text-white font-medium'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            aria-label="Select theme"
                        >
                            {theme === 'dark' ? (
                                <Moon className="w-5 h-5" />
                            ) : theme === 'modern' ? (
                                <Sparkles className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                            <span className="hidden sm:inline-block text-sm font-medium">
                                {theme === 'dark' ? 'Dark' : theme === 'modern' ? 'Modern' : 'Light'}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isThemeDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark'
                                ? 'bg-gray-900 border border-gray-700'
                                : theme === 'modern'
                                    ? 'bg-gradient-to-br from-[#15102B]/95 to-[#0b061c]/95 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 backdrop-blur-2xl'
                                    : 'bg-white border border-gray-200'} ${theme === 'modern' ? 'bg-[#0f172a]/40 backdrop-blur-2xl border-indigo-500/20' : ''}'
                                }`}>
                                <div className="py-2">
                                    <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/30 shadow-sm shadow-indigo-500/10' : 'border-gray-200'
                                        }`}>
                                        <p className={`text-xs uppercase font-bold ${theme === 'dark' ? 'text-gray-500' : theme === 'modern' ? 'text-white font-medium' : 'text-gray-400'
                                            }`}>
                                            Select Theme
                                        </p>
                                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-indigo-300' : 'text-gray-500'
                                            }`}>
                                            Demo - Choose your favorite color tone
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setTheme('light');
                                            setIsThemeDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'light'
                                            ? 'bg-gray-100 text-gray-900'
                                            : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                : theme === 'modern'
                                                    ? 'text-white font-medium hover:bg-indigo-800/40 hover:text-white'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Sun className="w-4 h-4" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Light Mode</div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-indigo-300/70' : 'text-gray-500'
                                                }`}>
                                                Light Interface
                                            </div>
                                        </div>
                                        {theme === 'light' && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setTheme('dark');
                                            setIsThemeDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'dark'
                                            ? 'bg-gray-800 text-white'
                                            : theme === 'modern'
                                                ? 'text-white font-medium hover:bg-indigo-800/40 hover:text-white'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Moon className="w-4 h-4" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Dark Mode</div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-indigo-300/70' : 'text-gray-500'
                                                }`}>
                                                Dark Interface
                                            </div>
                                        </div>
                                        {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setTheme('modern');
                                            setIsThemeDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'modern'
                                            ? 'bg-[#15102B] text-white'
                                            : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Modern View</div>
                                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-indigo-300/70' : 'text-gray-500'
                                                }`}>
                                                Modern Color Tone
                                            </div>
                                        </div>
                                        {theme === 'modern' && <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors outline-none focus:ring-2 ${theme === 'dark' ? 'hover:bg-gray-800 focus:ring-red-600/50' : theme === 'modern' ? 'hover:bg-indigo-500/10 hover:shadow-[0_0_8px_rgba(99,102,241,0.15)] focus:ring-indigo-500/50' : 'hover:bg-gray-100 focus:ring-red-600/50'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${theme === 'modern' ? 'bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90 shadow-indigo-500/20' : 'bg-gradient-to-br from-red-600 to-red-800'}`}>
                                <UserCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className={`hidden sm:block font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : theme === 'modern' ? 'text-white' : 'text-gray-700'}`}>
                                {user?.username || 'Guest'}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-white/60' : 'text-gray-600'}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : theme === 'modern' ? 'bg-[#0f172a]/40 backdrop-blur-2xl border border-indigo-500/20' : 'bg-white border border-gray-200'
                                }`}>
                                <div className="py-2">
                                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/20' : 'border-gray-200'}`}>
                                        <p className={`text-xs uppercase font-bold ${theme === 'dark' ? 'text-gray-500' : theme === 'modern' ? 'text-indigo-400' : 'text-gray-400'}`}>SIGNED IN AS</p>
                                        <p className={`text-sm font-bold truncate ${theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'}`}>{user?.username}</p>
                                    </div>

                                    <button className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-indigo-400' : theme === 'modern' ? 'text-white hover:bg-indigo-500/20 hover:text-indigo-300 hover:drop-shadow-[0_0_3px_rgba(129,140,248,0.4)]' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-400'}`}>
                                        <UserCircle className="w-4 h-4" />Account Information
                                    </button>

                                    <button className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-indigo-400' : theme === 'modern' ? 'text-white hover:bg-indigo-500/20 hover:text-indigo-300 hover:drop-shadow-[0_0_3px_rgba(129,140,248,0.4)]' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-400'}`}>
                                        <Settings className="w-4 h-4" />Change Password
                                    </button>

                                    <button
                                        onClick={() => navigate('/role-selection')}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-500' : theme === 'modern' ? 'text-white hover:bg-indigo-500/20 hover:text-indigo-300 hover:drop-shadow-[0_0_3px_rgba(129,140,248,0.4)]' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                            }`}
                                    >
                                        <Users className="w-4 h-4" />
                                        Switch Role
                                    </button>

                                    <div className={`border-t mt-1 ${theme === 'dark' ? 'border-gray-800' : theme === 'modern' ? 'border-indigo-500/20' : 'border-gray-200'}`}></div>

                                    <button
                                        onClick={() => setIsLogoutModalOpen(true)}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors font-bold ${theme === 'dark' ? 'text-red-500 hover:bg-red-900/20 hover:drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]' : theme === 'modern' ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:drop-shadow-[0_0_4px_rgba(248,113,113,0.4)]' : 'text-red-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-24 lg:pl-64 min-h-screen p-6">
                <div className={`rounded-xl border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : theme === 'modern' ? 'bg-[#15102B]/80 border-indigo-500/30 backdrop-blur-xl' : 'bg-white border-gray-200'}`}>
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto text-red-600 mb-4" />
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {activeTab === 'users' && (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className={`border-b ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : theme === 'modern' ? 'bg-[#0E0A20]' : 'bg-gray-50'}`}>
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Email</th>
                                            <th className="px-6 py-4 font-bold">Full Name</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                            <th className="px-6 py-4 font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 divide-opacity-20">
                                        {users.map(u => (
                                            <tr key={u.userId} className={`hover:bg-black/5 transaction-colors`}>
                                                <td className="px-6 py-4">{u.userEmail}</td>
                                                <td className="px-6 py-4">{u.fullName || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    {u.accountStatus === 1 && <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-500 font-bold border border-green-500/30"><CheckCircle className="inline w-3 h-3 mr-1" /> Active</span>}
                                                    {u.accountStatus !== 1 && <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-500 font-bold border border-red-500/30"><XCircle className="inline w-3 h-3 mr-1" /> Locked ({u.accountStatus})</span>}
                                                </td>
                                                <td className="px-6 py-4 space-x-2">
                                                    {u.accountStatus === 1 ? (
                                                        <button onClick={() => handleUpdateUserStatus(u.userId, 2)} className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded">Block</button>
                                                    ) : (
                                                        <button onClick={() => handleUpdateUserStatus(u.userId, 1)} className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded">Activate</button>
                                                    )}
                                                    <button onClick={() => handleUpdateUserRole(u.userId)} className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded">Role</button>
                                                    <button onClick={() => handleAssignTheaterManager(u.userId)} className="px-3 py-1 text-xs bg-pink-600 hover:bg-pink-700 text-white rounded">Assign Cinema</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'jobs' && (
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className={`border-b ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : theme === 'modern' ? 'bg-[#0E0A20]' : 'bg-gray-50'}`}>
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Job Type</th>
                                            <th className="px-6 py-4 font-bold">Cron Expression</th>
                                            <th className="px-6 py-4 font-bold">Last Execution</th>
                                            <th className="px-6 py-4 font-bold">Next Execution</th>
                                            <th className="px-6 py-4 font-bold">State</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 divide-opacity-20">
                                        {jobs.map((job, idx) => (
                                            <tr key={idx} className={`hover:bg-black/5 transaction-colors`}>
                                                <td className="px-6 py-4 font-bold">{job.jobType}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{job.cronExpression || 'N/A'}</td>
                                                <td className="px-6 py-4">{formatDate(job.lastExecutionTime)}</td>
                                                <td className="px-6 py-4">{formatDate(job.nextExecutionTime)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs border font-bold ${job.stateName === 'Enqueued' || job.stateName === 'Scheduled' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                                                        job.stateName === 'Processing' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                                                            job.stateName === 'Succeeded' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                                                                'bg-red-500/20 text-red-500 border-red-500/30'
                                                        }`}>
                                                        {job.stateName}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                    {!loading && ((activeTab === 'users' && users.length === 0) || (activeTab === 'jobs' && jobs.length === 0)) && (
                        <div className="p-12 text-center opacity-50">
                            No data available.
                        </div>
                    )}
                </div>
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

export default AdminPage;
