import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Satellite,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../auth/AuthContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate('/');
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* Brand */}
        <section className="auth-brand">
          <div className="auth-brand-top">

            <div className="auth-brand-logo">
              <div className="auth-brand-logo-icon">
                <Satellite size={21} />
              </div>

              <div>
                <div className="auth-brand-logo-name">
                  SatQuery AI
                </div>

                <span className="auth-brand-logo-tagline">
                  Satellite Intelligence Platform
                </span>
              </div>
            </div>

            <h2>
              From Space
              <span>to Smarter Decisions.</span>
            </h2>

            <p className="auth-brand-description">
              Transform satellite imagery into actionable intelligence
              with AI-powered visual analysis and natural-language
              queries.
            </p>
          </div>

          <div className="auth-brand-bottom">
            <div className="auth-stat">
              <span className="auth-stat-value">AI</span>
              <span className="auth-stat-label">Vision Analysis</span>
            </div>

            <div className="auth-stat">
              <span className="auth-stat-value">EO</span>
              <span className="auth-stat-label">Earth Observation</span>
            </div>

            <div className="auth-stat">
              <span className="auth-stat-value">24/7</span>
              <span className="auth-stat-label">Intelligence</span>
            </div>
          </div>
        </section>

        {/* Login */}
        <section className="auth-form-panel">
          <div className="auth-form-wrapper">

            <div className="auth-form-header">
              <h1>Welcome back</h1>
              <p>
                Sign in to continue to your SatQuery workspace.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="auth-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <div className="auth-input-wrap">
                  <Mail
                    size={16}
                    className="auth-input-icon"
                  />

                  <input
                    id="login-email"
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="auth-input-wrap">
                  <Lock
                    size={16}
                    className="auth-input-icon"
                  />

                  <input
                    id="login-password"
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className="auth-forgot">
                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/signup">
                Create an account
              </Link>
            </p>

            <div className="auth-security">
              <ShieldCheck size={13} />
              Secure authentication powered by Supabase
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}