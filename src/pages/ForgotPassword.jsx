import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite,
  Mail,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import { useAuth } from '../auth/AuthContext';
import './Auth.css';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      'Password reset instructions have been sent to your email.'
    );

    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* LEFT BRAND PANEL */}
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
              Secure Access.
              <span>Stay in Control.</span>
            </h2>

            <p className="auth-brand-description">
              Recover your SatQuery AI account securely and
              get back to exploring satellite intelligence.
            </p>

          </div>

          <div className="auth-brand-bottom">
            <div className="auth-stat">
              <span className="auth-stat-value">AI</span>
              <span className="auth-stat-label">
                Vision Analysis
              </span>
            </div>

            <div className="auth-stat">
              <span className="auth-stat-value">EO</span>
              <span className="auth-stat-label">
                Earth Observation
              </span>
            </div>

            <div className="auth-stat">
              <span className="auth-stat-value">SEC</span>
              <span className="auth-stat-label">
                Secure Access
              </span>
            </div>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="auth-form-panel">
          <div className="auth-form-wrapper">

            <div className="auth-form-header">
              <h1>Forgot your password?</h1>

              <p>
                Enter your registered email and we'll send
                you a secure password reset link.
              </p>
            </div>

            {message ? (
              <div className="auth-success-box">
                <CheckCircle2 size={20} />

                <div>
                  <strong>Email sent</strong>

                  <p>{message}</p>
                </div>
              </div>
            ) : (
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                <div className="auth-field">
                  <label htmlFor="forgot-email">
                    Email address
                  </label>

                  <div className="auth-input-wrap">
                    <Mail
                      size={16}
                      className="auth-input-icon"
                    />

                    <input
                      id="forgot-email"
                      className="auth-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      autoComplete="email"
                      required
                    />
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
                  {loading
                    ? 'Sending reset link...'
                    : 'Send Reset Link'}
                </button>
              </form>
            )}

            <p className="auth-switch">
              <Link to="/login">
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </p>

            <div className="auth-security">
              <ShieldCheck size={13} />
              Secure password recovery powered by Supabase
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}