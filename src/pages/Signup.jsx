import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Satellite,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../auth/AuthContext';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    const { data, error } = await signUp(
      email,
      password,
      fullName.trim()
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate('/');
    } else {
      setMessage(
        'Account created. Please check your email to verify your account.'
      );

      setLoading(false);
    }
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
              See Beyond
              <span>the Visible.</span>
            </h2>

            <p className="auth-brand-description">
              Build your satellite intelligence workspace and
              turn Earth observation data into meaningful insights.
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
              <span className="auth-stat-value">∞</span>
              <span className="auth-stat-label">Possibilities</span>
            </div>
          </div>
        </section>

        {/* Signup */}
        <section className="auth-form-panel">
          <div className="auth-form-wrapper">

            <div className="auth-form-header">
              <h1>Create your account</h1>

              <p>
                Set up your secure SatQuery AI workspace.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="auth-field">
                <label htmlFor="signup-name">
                  Full name
                </label>

                <div className="auth-input-wrap">
                  <User
                    size={16}
                    className="auth-input-icon"
                  />

                  <input
                    id="signup-name"
                    className="auth-input"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email">
                  Email address
                </label>

                <div className="auth-input-wrap">
                  <Mail
                    size={16}
                    className="auth-input-icon"
                  />

                  <input
                    id="signup-email"
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
                <label htmlFor="signup-password">
                  Password
                </label>

                <div className="auth-input-wrap">
                  <Lock
                    size={16}
                    className="auth-input-icon"
                  />

                  <input
                    id="signup-password"
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword((v) => !v)
                    }
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
              </div>

              <div className="auth-field">
                <label htmlFor="signup-confirm">
                  Confirm password
                </label>

                <div className="auth-input-wrap">
                  <Lock
                    size={16}
                    className="auth-input-icon"
                  />

                  <input
                    id="signup-confirm"
                    className="auth-input"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((v) => !v)
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              {message && (
                <p className="auth-success">
                  {message}
                </p>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Creating account...'
                  : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">
                Sign in
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