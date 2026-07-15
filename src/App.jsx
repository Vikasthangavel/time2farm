import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PWAInstallBanner from './components/PWAInstallBanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sections from './pages/Sections';
import SectionDetail from './pages/SectionDetail';
import AddAction from './pages/AddAction';
import TransactionForm from './pages/TransactionForm';
import TransactionsHistory from './pages/TransactionsHistory';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';
import ReportDownload from './pages/ReportDownload';
import MandiPrices from './pages/MandiPrices';
import TaskReminders from './pages/TaskReminders';
import Calendar from './pages/Calendar';
import DeleteAccountPublic from './pages/DeleteAccountPublic';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {children}
      {/* PWA banner is only shown when the user is logged in */}
      <PWAInstallBanner />
    </>
  );
};



function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/delete-account" element={<DeleteAccountPublic />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/sections/:id" element={<SectionDetail />} />
        <Route path="/add-action" element={<AddAction />} />
        <Route path="/record-sale" element={<TransactionForm defaultType="sale" />} />
        <Route path="/add-expense" element={<TransactionForm defaultType="expense" />} />
        <Route path="/transactions" element={<TransactionsHistory />} />
        <Route path="/settings" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/download" element={<ReportDownload />} />
        <Route path="/mandi-prices" element={<MandiPrices />} />
        <Route path="/task-reminders" element={<TaskReminders />} />
        <Route path="/calendar" element={<Calendar />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
