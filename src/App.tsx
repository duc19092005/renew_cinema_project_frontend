import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import RegisterForm from './features/auth/RegisterForm';
import LoginForm from './features/auth/LoginForm';
import RoleSelectionPage from './features/auth/RoleSelectionPage';
import HomePage from '../src/features/public/HomePage';
import FacilitiesManagerPage from './features/facilities/FacilitiesManagerPage';
import NotFound from './features/misc/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Route root - check token và redirect */}
          <Route path="/" element={<AuthRedirect />} />

          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route path="/role-selection" element={<ProtectedRoute><RoleSelectionPage /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/cashier" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/movie-manager" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/theater-manager" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/facilities-manager" element={<ProtectedRoute requiredRole="FacilitiesManager"><FacilitiesManagerPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
