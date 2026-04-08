import React, { useState } from 'react';
import { bookingApi } from '../../../api/bookingApi';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ScanFace, Lock, Unlock, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketScanner: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLock = async () => {
        if (!orderId.trim()) return;
        setLoading(true);
        try {
            await bookingApi.lockSeat(orderId);
            toast.success(t('Đã khóa vé/ghế thành công (Command Pattern)'));
            setOrderId('');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Có lỗi xảy ra khi khóa vé.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async () => {
        if (!orderId.trim()) return;
        setLoading(true);
        try {
            await bookingApi.unlockSeat(orderId);
            toast.success(t('Đã mở khóa vé/ghế thành công (Command Pattern)'));
            setOrderId('');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Có lỗi xảy ra khi mở khóa vé.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8">
            <div className={`p-8 rounded-3xl shadow-2xl transition-all ${
                theme === 'dark' ? 'bg-gray-900 border border-gray-800' :
                theme === 'modern' ? 'bg-[#0E0A20]/60 backdrop-blur-xl border border-indigo-500/20 shadow-indigo-500/10' :
                'bg-white border border-gray-100 shadow-gray-200/50'
            }`}>
                <div className="flex flex-col items-center text-center mb-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                        theme === 'modern' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30' :
                        'bg-red-50 text-red-600'
                    }`}>
                        <ScanFace className={`w-10 h-10 ${theme === 'modern' ? 'text-white' : ''}`} />
                    </div>
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${
                        theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {t('Kiểm Soát Vé')}
                    </h2>
                    <p className={`mt-2 text-sm max-w-md ${
                        theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-indigo-200/60' : 'text-gray-500'
                    }`}>
                        {t('Quét mã vé thủ công hoặc nhập mã Order ID để khóa/mở khóa trạng thái ghế (Command Pattern).')}
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${
                            theme === 'dark' ? 'text-gray-500' : theme === 'modern' ? 'text-indigo-400' : 'text-gray-500'
                        }`}>
                            Mã Hóa Đơn (Order ID)
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập mã đơn hàng..."
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className={`w-full px-5 py-4 rounded-xl text-lg font-mono placeholder:font-sans transition-all focus:outline-none focus:ring-2 ${
                                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500/50' :
                                theme === 'modern' ? 'bg-[#151225] border-indigo-500/20 text-white focus:ring-indigo-500/50' :
                                'bg-gray-50 border-gray-200 text-gray-900 focus:ring-red-600/50'
                            }`}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handleLock}
                            disabled={loading || !orderId.trim()}
                            className={`flex-1 flex justify-center items-center gap-2 py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                theme === 'modern' ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' :
                                'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                            Khóa Ghế (Check-in)
                        </button>

                        <button
                            onClick={handleUnlock}
                            disabled={loading || !orderId.trim()}
                            className={`flex-1 flex justify-center items-center gap-2 py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                theme === 'modern' ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' :
                                'bg-gray-800 hover:bg-gray-900 text-white'
                            }`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                            Mở Khóa (Hoàn Tác)
                        </button>
                    </div>
                </div>

                <div className={`mt-8 p-4 rounded-xl flex items-start gap-3 ${
                    theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/50 text-blue-400' :
                    theme === 'modern' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' :
                    'bg-blue-50 border border-blue-100 text-blue-700'
                }`}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-bold mb-1">Lưu ý:</p>
                        <p className="opacity-80">
                            Thao tác này sử dụng Command Pattern. Sau khi hóa đơn được thanh toán xong, staff quầy có thể dùng tính năng này để Verify vé và chốt trạng thái Check-in.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketScanner;
