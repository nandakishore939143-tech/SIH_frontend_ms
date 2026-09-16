import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { useAuth } from '../../auth/AuthContext';
import { useNotifications } from '../../notifications/NotificationContext';

import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  Bell,
  ChevronDown,
  Menu,
  X,
  Satellite,
  User,
  LogOut,
} from 'lucide-react';

import './Header.css';


/* =========================================================
   NAV ITEMS
   ========================================================= */

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Analyze', to: '/analyze' },
  { label: 'History', to: '/history' },
  { label: 'Use Cases', to: '/use-cases' },
  { label: 'About', to: '/about' },
];


/* =========================================================
   OUTSIDE CLICK
   ========================================================= */

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function listener(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        handler();
      }
    }

    document.addEventListener(
      'mousedown',
      listener
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        listener
      );
    };
  }, [ref, handler]);
}


/* =========================================================
   NOTIFICATION TIME
   ========================================================= */

function formatNotificationTime(createdAt) {
  if (!createdAt) {
    return '';
  }

  const created = new Date(createdAt);
  const now = new Date();

  const difference = Math.max(
    0,
    now.getTime() - created.getTime()
  );

  const seconds = Math.floor(
    difference / 1000
  );

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? 'min' : 'mins'
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? 'hr' : 'hrs'
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} ${
      days === 1 ? 'day' : 'days'
    } ago`;
  }

  return created.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year:
        created.getFullYear() !==
        now.getFullYear()
          ? 'numeric'
          : undefined,
    }
  );
}


/* =========================================================
   NOTIFICATION ICON
   ========================================================= */

function getNotificationIcon(notification) {
  if (notification.icon) {
    return notification.icon;
  }

  switch (
    notification.type?.toUpperCase()
  ) {
    case 'ANALYSIS':
      return '🛰️';

    case 'SUCCESS':
      return '✅';

    case 'WARNING':
      return '⚠️';

    case 'ERROR':
      return '❌';

    case 'SYSTEM':
      return '🔔';

    default:
      return '🔔';
  }
}


/* =========================================================
   HEADER
   ========================================================= */

export default function Header() {
  const navigate = useNavigate();

  const {
    user,
    signOut,
  } = useAuth();

  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllRead,
    removeNotification,
  } = useNotifications();


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  const [
    notifOpen,
    setNotifOpen,
  ] = useState(false);

  const notifRef = useRef(null);

  const closeNotif = useCallback(() => {
    setNotifOpen(false);
  }, []);

  useOutsideClick(
    notifRef,
    closeNotif
  );


  /* =======================================================
     PROFILE
     ======================================================= */

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const profileRef = useRef(null);

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
  }, []);

  useOutsideClick(
    profileRef,
    closeProfile
  );


  /* =======================================================
     SIGN OUT
     ======================================================= */

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      console.error(
        'Sign out failed:',
        error.message
      );
      return;
    }

    setProfileOpen(false);
    navigate('/login');
  };


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') {
        closeNotif();
        closeProfile();
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener(
      'keydown',
      onKey
    );

    return () => {
      document.removeEventListener(
        'keydown',
        onKey
      );
    };
  }, [
    closeNotif,
    closeProfile,
  ]);


  /* =======================================================
     NOTIFICATION CLICK
     ======================================================= */

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.is_read) {
        await markAsRead(
          notification.id
        );
      }
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }

    if (notification.link) {
      setNotifOpen(false);
      navigate(notification.link);
      return;
    }

    const route =
      notification.metadata?.route;

    if (route) {
      setNotifOpen(false);
      navigate(route);
    }
  };


  /* =======================================================
     DELETE NOTIFICATION
     ======================================================= */

  const handleDeleteNotification = async (
    event,
    notificationId
  ) => {
    event.stopPropagation();

    try {
      await removeNotification(
        notificationId
      );
    } catch (error) {
      console.error(
        'Failed to delete notification:',
        error
      );
    }
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <header
      className="sq-header"
      role="banner"
    >

      <div className="sq-header__inner">


        {/* =================================================
            LOGO
            ================================================= */}

        <div className="sq-header__brand">

          <NavLink
            to="/"
            className="sq-header__logo-link"
            aria-label="SatQuery AI Home"
          >

            <div
              className="sq-header__logo-icon"
              aria-hidden="true"
            >
              <Satellite size={20} />
            </div>

            <div className="sq-header__logo-text">

              <span className="sq-header__logo-name">
                SatQuery AI
              </span>

              <span className="sq-header__tagline">
                Satellite Intelligence Platform
              </span>

            </div>

          </NavLink>

        </div>


        {/* =================================================
            DESKTOP NAVIGATION
            ================================================= */}

        <nav
          className="sq-header__nav"
          role="navigation"
          aria-label="Main navigation"
        >

          <ul className="sq-header__nav-list">

            {NAV_ITEMS.map(
              ({ label, to }) => (

                <li key={to}>

                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `sq-header__nav-link ${
                        isActive
                          ? 'sq-header__nav-link--active'
                          : ''
                      }`
                    }
                  >
                    {label}
                  </NavLink>

                </li>

              )
            )}

          </ul>

        </nav>


        {/* =================================================
            RIGHT ACTIONS
            ================================================= */}

        <div className="sq-header__actions">


          {/* Hero text */}

          <div
            className="sq-header__hero-text"
            aria-hidden="true"
          >

            <span className="sq-header__hero-line">
              From
            </span>

            <span className="sq-header__hero-line">
              Space to
            </span>

            <span className="sq-header__hero-line sq-header__hero-line--accent">
              Smarter Decisions.
            </span>

          </div>


          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          <div
            className="sq-header__dropdown-wrap"
            ref={notifRef}
          >

            <button
              className={`sq-header__icon-btn sq-header__icon-btn--notif ${
                notifOpen
                  ? 'sq-header__icon-btn--active'
                  : ''
              }`}
              type="button"
              aria-label={`Notifications: ${unreadCount} unread`}
              aria-expanded={notifOpen}
              id="header-notif-btn"
              onClick={() => {

                setProfileOpen(false);

                setNotifOpen(
                  (value) => !value
                );

              }}
            >

              <Bell size={16} />

              {unreadCount > 0 && (

                <span
                  className="sq-header__notif-badge"
                  aria-hidden="true"
                >
                  {unreadCount > 99
                    ? '99+'
                    : unreadCount}
                </span>

              )}

            </button>


            {/* Notification dropdown */}

            {notifOpen && (

              <div
                className="sq-header__notif-panel"
                role="dialog"
                aria-label="Notifications"
              >

                {/* Header */}

                <div className="sq-header__notif-header">

                  <span className="sq-header__notif-title">
                    Notifications
                  </span>

                  {unreadCount > 0 && (

                    <button
                      className="sq-header__notif-mark-read"
                      onClick={markAllRead}
                      type="button"
                    >
                      Mark all read
                    </button>

                  )}

                </div>


                {/* List */}

                <div className="sq-header__notif-list">

                  {notificationsLoading ? (

                    <div className="sq-header__notif-empty">
                      Loading notifications...
                    </div>

                  ) : notifications.length === 0 ? (

                    <div className="sq-header__notif-empty">

                      <Bell
                        size={20}
                        aria-hidden="true"
                      />

                      <span>
                        No notifications yet.
                      </span>

                    </div>

                  ) : (

                    notifications.map(
                      (notification) => (

                        <div
                          key={notification.id}
                          className={`sq-header__notif-item ${
                            !notification.is_read
                              ? 'sq-header__notif-item--unread'
                              : ''
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          onKeyDown={(event) => {

                            if (
                              event.key ===
                                'Enter' ||
                              event.key === ' '
                            ) {

                              event.preventDefault();

                              handleNotificationClick(
                                notification
                              );

                            }

                          }}
                        >

                          {/* Icon */}

                          <span
                            className="sq-header__notif-icon"
                            aria-hidden="true"
                          >
                            {getNotificationIcon(
                              notification
                            )}
                          </span>


                          {/* Content */}

                          <div className="sq-header__notif-body">

                            <p className="sq-header__notif-item-title">
                              {notification.title}
                            </p>

                            <p className="sq-header__notif-item-body">
                              {notification.message}
                            </p>

                            <p className="sq-header__notif-time">
                              {formatNotificationTime(
                                notification.created_at
                              )}
                            </p>

                          </div>


                          {/* Unread dot */}

                          {!notification.is_read && (

                            <span
                              className="sq-header__notif-dot"
                              aria-hidden="true"
                            />

                          )}


                          {/* Delete */}

                          <button
                            type="button"
                            className="sq-header__notif-delete"
                            aria-label={`Delete notification: ${notification.title}`}
                            title="Delete notification"
                            onClick={(event) =>
                              handleDeleteNotification(
                                event,
                                notification.id
                              )
                            }
                          >

                            <X size={12} />

                          </button>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              PROFILE
              ================================================= */}

          <div
            className="sq-header__dropdown-wrap"
            ref={profileRef}
          >

            <button
              className={`sq-header__user sq-header__user--icon-only ${
                profileOpen
                  ? 'sq-header__user--open'
                  : ''
              }`}
              type="button"
              aria-label="User menu"
              aria-expanded={profileOpen}
              id="header-user-btn"
              onClick={() => {

                setNotifOpen(false);

                setProfileOpen(
                  (value) => !value
                );

              }}
            >

              <div
                className="sq-header__avatar"
                aria-hidden="true"
              >
                {(user?.email?.[0] || 'U')
                  .toUpperCase()}
              </div>

              <ChevronDown
                size={12}
                className="sq-header__chevron"
                aria-hidden="true"
              />

            </button>


            {profileOpen && (

              <div
                className="sq-header__profile-panel"
                role="dialog"
                aria-label="User menu"
              >

                <div className="sq-header__profile-info">

                  <div
                    className="sq-header__profile-avatar"
                    aria-hidden="true"
                  >
                    {(user?.email?.[0] || 'U')
                      .toUpperCase()}
                  </div>

                  <div>

                    <p className="sq-header__profile-name">
                      {user?.user_metadata?.full_name ||
                        'SatQuery User'}
                    </p>

                    <p className="sq-header__profile-email">
                      {user?.email}
                    </p>

                  </div>

                </div>


                <div className="sq-header__profile-divider" />


                <button
                  className="sq-header__profile-item"
                  type="button"
                  id="profile-menu-profile"
                  onClick={() => {

                    setProfileOpen(false);

                    navigate('/profile');

                  }}
                >

                  <User
                    size={14}
                    aria-hidden="true"
                  />

                  Profile

                </button>


                <button
                  className="sq-header__profile-item sq-header__profile-item--danger"
                  type="button"
                  id="profile-menu-signout"
                  onClick={handleSignOut}
                >

                  <LogOut
                    size={14}
                    aria-hidden="true"
                  />

                  Sign Out

                </button>

              </div>

            )}

          </div>


          {/* =================================================
              MOBILE HAMBURGER
              ================================================= */}

          <button
            className="sq-header__hamburger"
            type="button"
            aria-label={
              mobileMenuOpen
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen(
                (value) => !value
              )
            }
            id="header-hamburger-btn"
          >

            {mobileMenuOpen
              ? <X size={20} />
              : <Menu size={20} />}

          </button>

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
          ===================================================== */}

      {mobileMenuOpen && (

        <nav
          className="sq-header__mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >

          <ul className="sq-header__mobile-list">

            {NAV_ITEMS.map(
              ({ label, to }) => (

                <li key={to}>

                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `sq-header__mobile-link ${
                        isActive
                          ? 'sq-header__mobile-link--active'
                          : ''
                      }`
                    }
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    {label}
                  </NavLink>

                </li>

              )
            )}

          </ul>

        </nav>

      )}

    </header>
  );
}