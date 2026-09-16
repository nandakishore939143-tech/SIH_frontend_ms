import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Analyze from './pages/Analyze';
import History from './pages/History';
import Home from './pages/Home';
import UseCases from './pages/UseCases';
import About from './pages/About';
import Profile from './pages/Profile';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

import { AuthProvider, useAuth } from './auth/AuthContext';

import './App.css';

function AppShell() {

  return (
    <div className="app-shell">
      <div className="stars-bg" aria-hidden="true" />

      <Header />

      <div className="app-body">
        <div className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/history" element={<History />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/datasets"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/settings"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>

          <Footer />
        </div>
      </div>
    </div>
  );
}

function ProtectedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading SatQuery AI...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}

function AppWithAuth() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<ProtectedApp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reset-password" element={<ResetPassword />}/>      
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </BrowserRouter>
  );
}