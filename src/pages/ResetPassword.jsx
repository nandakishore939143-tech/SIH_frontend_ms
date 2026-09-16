import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Satellite,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import { supabase } from '../lib/supabase';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

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
              New Password.
              <span>Fresh Start.</span>
            </h2>

            <p className="auth-brand-description">
              Create a new password for your SatQuery AI
              workspace and continue securely.
            </p>

          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-wrapper">

            {success ? (
              <>
                <div className="auth-form-header">
                  <h1>Password updated</h1>

                  <p>
                    Your SatQuery AI password has been
                    changed successfully.
                  </p>
                </div>

                <div className="auth-success-box">
                  <CheckCircle2 size={20} />

                  <div>
                    <strong>You're all set</strong>

                    <p>
                      You can now sign in using your new
                      password.
                    </p>
                  </div>
                </div>

                <button
                  className="auth-submit"
                  type="button"
                  onClick={() => navigate('/login')}
                >
                  Continue to Sign In
                </button>
              </>
            ) : (
              <>
                <div className="auth-form-header">
                  <h1>Set a new password</h1>

                  <p>
                    Choose a strong password for your
                    account.
                  </p>
                </div>

                <form
                  className="auth-form"
                  onSubmit={handleSubmit}
                >

                  <div className="auth-field">
                    <label htmlFor="reset-password">
                      New password
                    </label>

                    <div className="auth-input-wrap">
                      <Lock
                        size={16}
                        className="auth-input-icon"
                      />

                      <input
                        id="reset-password"
                        className="auth-input"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        placeholder="Create a new password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() =>
                          setShowPassword((v) => !v)
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
                    <label htmlFor="reset-confirm">
                      Confirm new password
                    </label>

                    <div className="auth-input-wrap">
                      <Lock
                        size={16}
                        className="auth-input-icon"
                      />

                      <input
                        id="reset-confirm"
                        className="auth-input"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (v) => !v
                          )
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

                  <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? 'Updating password...'
                      : 'Update Password'}
                  </button>

                </form>
              </>
            )}

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