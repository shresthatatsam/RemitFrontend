import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import KycPage from '../features/kyc/KycPage';
import BeneficiariesPage from '../features/beneficiaries/BeneficiariesPage';
import TransfersPage from '../features/transfers/TransfersPage';
import DepositsPage from '../features/deposits/DepositsPage';
import AppLayout from '../components/layout/AppLayout';
import LandingPage from './LandingPage';

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><span className="spinner" /> Loading your workspace…</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/app" element={<Protected><AppLayout /></Protected>}>
      <Route index element={<DashboardPage />} />
      <Route path="kyc" element={<KycPage />} />
      <Route path="beneficiaries" element={<BeneficiariesPage />} />
      <Route path="transfers" element={<TransfersPage />} />
      <Route path="deposits" element={<DepositsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
