// src/components/AuthRedirect.tsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { verifyAuthAndGetUser } from '../utils/authHelpers';

const roleConfig: Record<string, string> = {
  Customer: '/home',
  Cashier: '/cashier',
  Admin: '/admin',
  MovieManager: '/movie-manager',
  TheaterManager: '/theater-manager',
  FacilitiesManager: '/facilities-manager',
};

const AuthRedirect: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Verify authentication bằng cách gọi API (cookie HttpOnly sẽ tự động được gửi)
      const userInfo = await verifyAuthAndGetUser();

      if (!userInfo) {
        setRedirectPath('/login');
        setIsChecking(false);
        return;
      }

      // Redirect dựa trên số lượng roles
      if (userInfo.roles.length === 1) {
        // Nếu chỉ có 1 role, redirect thẳng đến trang của role đó
        const singleRole = userInfo.roles[0];
        const route = roleConfig[singleRole] || '/role-selection';
        setRedirectPath(route);
      } else if (userInfo.roles.length > 1) {
        // Nếu có nhiều roles, redirect đến trang chọn role
        setRedirectPath('/role-selection');
      } else {
        // Không có role, về login
        setRedirectPath('/login');
      }

      setIsChecking(false);
    };

    checkAndRedirect();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return <Navigate to={redirectPath || '/login'} replace />;
};

export default AuthRedirect;
