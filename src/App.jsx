import React, { useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Home from './pages/Home';
import UseCases from './pages/UseCases';
import About from './pages/About';
import './App.css';

/**
 * AppShell — wraps pages with persistent Header + Sidebar layout.
 * Uses react-router-dom hooks so it must be rendered inside <BrowserRouter>.
 */
function AppShell() {
  const navigate = useNavigate();

  const handleNewAnalysis = useCallback(() => {
    navigate('/analyze');
  }, [navigate]);

  return (
    <div className="app-shell">
      {/* Stars background */}
      <div className="stars-bg" aria-hidden="true" />

      {/* Sticky top header */}
      <Header />

      <div className="app-body">
        {/* Collapsible left sidebar */}
        <Sidebar onNewAnalysis={handleNewAnalysis} />

        {/* Page content */}
        <div className="app-main">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/analyze"   element={<Analyze />} />
            <Route path="/history"   element={<History />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/about"     element={<About />} />
            {/* Preserved but not in nav */}
            <Route path="/datasets"  element={<Navigate to="/" replace />} />
            <Route path="/settings"  element={<Navigate to="/" replace />} />
            {/* Catch-all */}
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
