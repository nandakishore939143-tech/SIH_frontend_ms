import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  X,
} from 'lucide-react';

import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';

import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const fullName =
    user?.user_metadata?.full_name || 'SatQuery User';

  const email = user?.email || '';

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  // =========================================================
  // CHANGE PASSWORD STATE
  // =========================================================

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [changingPassword, setChangingPassword] =
    useState(false);

  // =========================================================
  // OPEN CHANGE PASSWORD
  // =========================================================

  const handleOpenChangePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setShowChangePassword(true);
  };

  // =========================================================
  // CANCEL CHANGE PASSWORD
  // =========================================================

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setPasswordError('');
    setPasswordSuccess('');

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError('');
    setPasswordSuccess('');

    // ---------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------

    if (!currentPassword) {
      setPasswordError(
        'Please enter your current password.'
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        'Please enter a new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        'New password must contain at least 6 characters.'
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError(
        'Please confirm your new password.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'New passwords do not match.'
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        'New password must be different from your current password.'
      );
      return;
    }

    // ---------------------------------------------
    // START
    // ---------------------------------------------

    setChangingPassword(true);

    // ---------------------------------------------
    // VERIFY CURRENT PASSWORD
    // ---------------------------------------------

    const { error: verifyError } =
      await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (verifyError) {
      setPasswordError(
        'Current password is incorrect.'
      );

      setChangingPassword(false);
      return;
    }

    // ---------------------------------------------
    // UPDATE PASSWORD
    // ---------------------------------------------

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      setPasswordError(updateError.message);
      setChangingPassword(false);
      return;
    }

    // ---------------------------------------------
    // SUCCESS
    // ---------------------------------------------

    setPasswordSuccess(
      'Your password has been changed successfully.'
    );

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setChangingPassword(false);
  };

  // =========================================================
  // SIGN OUT
  // =========================================================

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      console.error(
        'Sign out failed:',
        error.message
      );
      return;
    }

    navigate('/login');
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* BACK BUTTON */}
        <button
          className="profile-back"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{fullName}</h1>
            <p>{email}</p>
          </div>
        </div>

        {/* =================================================
            ACCOUNT CARD
            ================================================= */}

        <div className="profile-card">

          {/* ACCOUNT HEADER */}
          <div className="profile-card-header">
            <div>
              <h2>Account</h2>

              <p>
                Your SatQuery AI account information
              </p>
            </div>

            <ShieldCheck size={20} />
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="profile-details">

            <div className="profile-detail">
              <div className="profile-detail-icon">
                <User size={16} />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{fullName}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <div className="profile-detail-icon">
                <Mail size={16} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{email}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <div className="profile-detail-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <span>Account Created</span>
                <strong>{createdAt}</strong>
              </div>
            </div>

          </div>

          {/* =================================================
              SECURITY SECTION
              ================================================= */}

          <div className="profile-divider" />

          <div className="profile-card-header">
            <div>
              <h2>Security</h2>

              <p>
                Manage your account password
              </p>
            </div>

            <KeyRound size={20} />
          </div>

          {/* =================================================
              PASSWORD SUMMARY
              ================================================= */}

          {!showChangePassword && (
            <div className="profile-security-summary">

              <div className="profile-security-info">
                <div className="profile-security-icon">
                  <Lock size={16} />
                </div>

                <div>
                  <span>Password</span>

                  <strong>
                    ••••••••••••••••
                  </strong>
                </div>
              </div>

              <button
                className="profile-change-password"
                type="button"
                onClick={handleOpenChangePassword}
              >
                <KeyRound size={15} />
                Change Password
              </button>

            </div>
          )}

          {/* =================================================
              CHANGE PASSWORD FORM
              ================================================= */}

          {showChangePassword && (
            <form
              className="profile-password-form"
              onSubmit={handleChangePassword}
            >

              {/* CURRENT PASSWORD */}
              <div className="profile-password-field">

                <label htmlFor="current-password">
                  Current Password
                </label>

                <div className="profile-password-input">

                  <Lock size={16} />

                  <input
                    id="current-password"
                    type={
                      showCurrentPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showCurrentPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* NEW PASSWORD */}
              <div className="profile-password-field">

                <label htmlFor="new-password">
                  New Password
                </label>

                <div className="profile-password-input">

                  <Lock size={16} />

                  <input
                    id="new-password"
                    type={
                      showNewPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showNewPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="profile-password-field">

                <label htmlFor="confirm-password">
                  Confirm New Password
                </label>

                <div className="profile-password-input">

                  <Lock size={16} />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Confirm your new password"
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
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
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

              {/* ERROR */}
              {passwordError && (
                <p className="profile-password-error">
                  {passwordError}
                </p>
              )}

              {/* SUCCESS */}
              {passwordSuccess && (
                <p className="profile-password-success">
                  {passwordSuccess}
                </p>
              )}

              {/* ACTION BUTTONS */}
              <div className="profile-password-actions">

                <button
                  className="profile-update-password"
                  type="submit"
                  disabled={changingPassword}
                >
                  <KeyRound size={15} />

                  {changingPassword
                    ? 'Updating Password...'
                    : 'Update Password'}
                </button>

                <button
                  className="profile-cancel-password"
                  type="button"
                  onClick={handleCancelChangePassword}
                  disabled={changingPassword}
                >
                  <X size={15} />
                  Cancel
                </button>

              </div>

            </form>
          )}

          {/* =================================================
              SIGN OUT
              ================================================= */}

          <div className="profile-divider" />

          <button
            className="profile-signout"
            type="button"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </button>

        </div>
      </div>
    </main>
  );
}