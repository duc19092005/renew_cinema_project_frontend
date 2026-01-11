import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './features/auth/RegisterForm';
import LoginForm from './features/auth/LoginForm'; // Import mới
import HomePage from '../src/features/public/HomePage';   // Import mới
import NotFound from './features/misc/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Điều hướng mặc định về login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        
        {/* Route trang chủ */}
        <Route path="/home" element={<HomePage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;