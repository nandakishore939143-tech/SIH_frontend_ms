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
import { NotificationProvider } from './notifications/NotificationContext';

import './App.css';


/* =========================================================
   APP SHELL
   ========================================================= */

function AppShell() {

  return (
    <div className="app-shell">

      <div
        className="stars-bg"
        aria-hidden="true"
      />

      <Header />

      <div className="app-body">

        <div className="app-main">

          <Routes>

            {/* Home */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* Analyze */}
            <Route
              path="/analyze"
              element={<Analyze />}
            />

            {/* History */}
            <Route
              path="/history"
              element={<History />}
            />

            {/* Use Cases */}
            <Route
              path="/use-cases"
              element={<UseCases />}
            />

            {/* About */}
            <Route
              path="/about"
              element={<About />}
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Legacy / unused routes */}
            <Route
              path="/datasets"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

            <Route
              path="/settings"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

          <Footer />

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   PROTECTED APPLICATION
   ========================================================= */

function ProtectedApp() {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <div>
        Loading SatQuery AI...
      </div>
    );

  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return <AppShell />;
}


/* =========================================================
   AUTH ROUTES
   ========================================================= */

function AppWithAuth() {

  return (

    <Routes>

      {/* Authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* Protected application */}
      <Route
        path="/*"
        element={<ProtectedApp />}
      />

    </Routes>

  );
}


/* =========================================================
   ROOT APP
   ========================================================= */

export default function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <NotificationProvider>

          <AppWithAuth />

        </NotificationProvider>

      </AuthProvider>

    </BrowserRouter>

  );

}