import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/adminApi';
import type { AdminTicketPricingDto } from '../../../types/admin.types';
import toast from 'react-hot-toast';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Loader2, Save, Percent } from 'lucide-react';
import axios from 'axios';

const TicketPricingConfig: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [pricingContext, setPricingContext] = useState<AdminTicketPricingDto>({
        weekendSurchargePercent: 0,
        imaxExtraSurchargePercent: 0,
        studentExtraDiscountPercent: 0
    });

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const res = await adminApi.getTicketPricing();
            if (res.data) {
                setPricingContext(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch pricing config', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminApi.updateTicketPricing(pricingContext);
            toast.success(t('Cập nhật giá vé thành công!'));
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                toast.error(t('Không có quyền thao tác (Forbidden)'));
            } else {
                toast.error(t('Cập nhật thất bại. Vui lòng thử lại.'));
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <div className={`p-6 max-w-2xl mx-auto rounded-3xl mt-6 border shadow-2xl transition-colors ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' :
            theme === 'modern' ? 'bg-[#0E0A20]/40 backdrop-blur-md border-indigo-500/20' :
            'bg-white border-gray-100'
        }`}>
            <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${
                    theme === 'modern' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-50 text-red-600'
                }`}>
                    <Percent className="w-6 h-6" />
                </div>
                <div>
                    <h2 className={`text-xl font-black tracking-tight ${theme === 'dark' || theme === 'modern' ? 'text-white' : 'text-gray-900'}`}>
                        {t('Cấu Hình Giá Vé')}
                    </h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : theme === 'modern' ? 'text-indigo-200/60' : 'text-gray-500'}`}>
                        {t('Điều chỉnh các thông số tỷ lệ phần trăm (Strategy Pattern)')}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' || theme === 'modern' ? 'text-gray-200' : 'text-gray-700'}`}>
                        {t('Phụ thu cuối tuần (%)')}
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 focus:ring-red-500/50' :
                            theme === 'modern' ? 'bg-[#151225] border-indigo-500/20 focus:ring-indigo-500/50 text-white' :
                            'bg-gray-50 border-gray-200 focus:ring-red-600/50'
                        }`}
                        value={pricingContext.weekendSurchargePercent}
                        onChange={(e) => setPricingContext({ ...pricingContext, weekendSurchargePercent: Number(e.target.value) })}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' || theme === 'modern' ? 'text-gray-200' : 'text-gray-700'}`}>
                        {t('Phụ thu định dạng IMAX (%)')}
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 focus:ring-red-500/50' :
                            theme === 'modern' ? 'bg-[#151225] border-indigo-500/20 focus:ring-indigo-500/50 text-white' :
                            'bg-gray-50 border-gray-200 focus:ring-red-600/50'
                        }`}
                        value={pricingContext.imaxExtraSurchargePercent}
                        onChange={(e) => setPricingContext({ ...pricingContext, imaxExtraSurchargePercent: Number(e.target.value) })}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' || theme === 'modern' ? 'text-gray-200' : 'text-gray-700'}`}>
                        {t('Giảm giá HSSV (%)')}
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700 focus:ring-red-500/50' :
                            theme === 'modern' ? 'bg-[#151225] border-indigo-500/20 focus:ring-indigo-500/50 text-white' :
                            'bg-gray-50 border-gray-200 focus:ring-red-600/50'
                        }`}
                        value={pricingContext.studentExtraDiscountPercent}
                        onChange={(e) => setPricingContext({ ...pricingContext, studentExtraDiscountPercent: Number(e.target.value) })}
                    />
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-xl transition-all active:scale-95 ${
                        theme === 'modern' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/30 font-bold hover:shadow-indigo-500/50' :
                        'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
                    }`}
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {t('Lưu Cấu Hình')}
                </button>
            </div>
        </div>
    );
};

export default TicketPricingConfig;
