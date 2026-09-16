import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, X, Satellite, User, LogOut } from 'lucide-react';
import './Header.css';

/* ── Nav items (Datasets removed) ── */
const NAV_ITEMS = [
  { label: 'Home',      to: '/' },
  { label: 'Analyze',   to: '/analyze' },
  { label: 'History',   to: '/history' },
  { label: 'Use Cases', to: '/use-cases' },
  { label: 'About',     to: '/about' },
];

/* ── Mock search data ── */
const SEARCH_DATA = [
  { type: 'History', label: 'Building detection — Lagos Nigeria',   to: '/history' },
  { type: 'History', label: 'Flood extent mapping — Bangladesh',    to: '/history' },
  { type: 'History', label: 'Agricultural land — Punjab India',     to: '/history' },
  { type: 'History', label: 'Urban expansion — Cairo Egypt',        to: '/history' },
  { type: 'History', label: 'Deforestation — Amazon Basin',         to: '/history' },
  { type: 'Use Case', label: 'Agriculture — Crop monitoring',       to: '/use-cases' },
  { type: 'Use Case', label: 'Urban Planning — Building detection', to: '/use-cases' },
  { type: 'Use Case', label: 'Disaster Management — Flood detection', to: '/use-cases' },
  { type: 'Use Case', label: 'Environmental Monitoring',            to: '/use-cases' },
];

/* ── Mock notifications ── */
const NOTIFICATIONS = [
  {
    id: 1,
    icon: '✅',
    title: 'Analysis completed',
    body: 'Your building detection analysis is ready.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    icon: '🛰️',
    title: 'New analysis available',
    body: 'Your latest satellite analysis has finished.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 3,
    icon: '🔔',
    title: 'System update',
    body: 'SatQuery Vision has been updated to v3.2.',
    time: '3 hr ago',
    unread: false,
  },
];

/* ── Utility: close on outside click ── */
function useOutsideClick(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Search */
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef  = useRef(null);
  const searchInput = useRef(null);
  const closeSearch = useCallback(() => { setSearchOpen(false); setSearchQuery(''); }, []);
  useOutsideClick(searchRef, closeSearch);

  /* Notifications */
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unreadCount = notifs.filter((n) => n.unread).length;
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  useOutsideClick(notifRef, closeNotif);

  /* Profile */
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useOutsideClick(profileRef, closeProfile);

  /* Open search → focus input */
  const handleSearchOpen = () => {
    setNotifOpen(false);
    setProfileOpen(false);
    setSearchOpen((v) => !v);
    setTimeout(() => searchInput.current?.focus(), 50);
  };

  /* Escape key */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        closeSearch();
        closeNotif();
        closeProfile();
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeSearch, closeNotif, closeProfile]);

  /* Filtered search results */
  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_DATA.filter((d) =>
        d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : SEARCH_DATA.slice(0, 5);

  /* Mark all notifs read */
  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, unread: false })));

  return (
    <header className="sq-header" role="banner">
      <div className="sq-header__inner">
        {/* Left — Logo */}
        <div className="sq-header__brand">
          <NavLink to="/" className="sq-header__logo-link" aria-label="SatQuery AI Home">
            <div className="sq-header__logo-icon" aria-hidden="true">
              <Satellite size={20} />
            </div>
            <div className="sq-header__logo-text">
              <span className="sq-header__logo-name">SatQuery AI</span>
              <span className="sq-header__tagline">Satellite Intelligence Platform</span>
            </div>
          </NavLink>
        </div>

        {/* Center — Desktop nav */}
        <nav className="sq-header__nav" role="navigation" aria-label="Main navigation">
          <ul className="sq-header__nav-list">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `sq-header__nav-link ${isActive ? 'sq-header__nav-link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right — Actions */}
        <div className="sq-header__actions">
          <div className="sq-header__hero-text" aria-hidden="true">
            <span className="sq-header__hero-line">From</span>
            <span className="sq-header__hero-line">Space to</span>
            <span className="sq-header__hero-line sq-header__hero-line--accent">Smarter Decisions.</span>
          </div>

          {/* ── Search ── */}
          <div className="sq-header__dropdown-wrap" ref={searchRef}>
            <button
              className={`sq-header__icon-btn ${searchOpen ? 'sq-header__icon-btn--active' : ''}`}
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              id="header-search-btn"
              onClick={handleSearchOpen}
            >
              <Search size={16} />
            </button>

            {searchOpen && (
              <div className="sq-header__search-panel" role="dialog" aria-label="Search">
                <div className="sq-header__search-bar">
                  <Search size={14} className="sq-header__search-icon" aria-hidden="true" />
                  <input
                    ref={searchInput}
                    type="search"
                    className="sq-header__search-input"
                    placeholder="Search analyses, use cases…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search analyses and use cases"
                    id="header-search-input"
                  />
                  {searchQuery && (
                    <button
                      className="sq-header__search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="sq-header__search-results">
                  {searchResults.length === 0 ? (
                    <p className="sq-header__search-empty">No results found.</p>
                  ) : (
                    <>
                      {!searchQuery && (
                        <p className="sq-header__search-label">Recent &amp; Suggested</p>
                      )}
                      {searchResults.map((r, i) => (
                        <NavLink
                          key={i}
                          to={r.to}
                          className="sq-header__search-item"
                          onClick={closeSearch}
                        >
                          <span className="sq-header__search-item-type">{r.type}</span>
                          <span className="sq-header__search-item-label">{r.label}</span>
                        </NavLink>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Notifications ── */}
          <div className="sq-header__dropdown-wrap" ref={notifRef}>
            <button
              className={`sq-header__icon-btn sq-header__icon-btn--notif ${notifOpen ? 'sq-header__icon-btn--active' : ''}`}
              type="button"
              aria-label={`Notifications: ${unreadCount} unread`}
              aria-expanded={notifOpen}
              id="header-notif-btn"
              onClick={() => { setSearchOpen(false); setProfileOpen(false); setNotifOpen((v) => !v); }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="sq-header__notif-badge" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="sq-header__notif-panel" role="dialog" aria-label="Notifications">
                <div className="sq-header__notif-header">
                  <span className="sq-header__notif-title">Notifications</span>
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
                <div className="sq-header__notif-list">
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`sq-header__notif-item ${n.unread ? 'sq-header__notif-item--unread' : ''}`}
                    >
                      <span className="sq-header__notif-icon" aria-hidden="true">{n.icon}</span>
                      <div className="sq-header__notif-body">
                        <p className="sq-header__notif-item-title">{n.title}</p>
                        <p className="sq-header__notif-item-body">{n.body}</p>
                        <p className="sq-header__notif-time">{n.time}</p>
                      </div>
                      {n.unread && <span className="sq-header__notif-dot" aria-hidden="true" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Profile ── */}
          <div className="sq-header__dropdown-wrap" ref={profileRef}>
            <button
              className={`sq-header__user sq-header__user--icon-only ${profileOpen ? 'sq-header__user--open' : ''}`}
              type="button"
              aria-label="User menu"
              aria-expanded={profileOpen}
              id="header-user-btn"
              onClick={() => { setSearchOpen(false); setNotifOpen(false); setProfileOpen((v) => !v); }}
            >
              <div className="sq-header__avatar" aria-hidden="true">M</div>
              <ChevronDown size={12} className="sq-header__chevron" aria-hidden="true" />
            </button>

            {profileOpen && (
              <div className="sq-header__profile-panel" role="dialog" aria-label="User menu">
                <div className="sq-header__profile-info">
                  <div className="sq-header__profile-avatar" aria-hidden="true">M</div>
                  <div>
                    <p className="sq-header__profile-name">Midnight Syntax</p>
                    <p className="sq-header__profile-email">user@satquery.ai</p>
                  </div>
                </div>
                <div className="sq-header__profile-divider" />
                <button
                  className="sq-header__profile-item"
                  type="button"
                  id="profile-menu-profile"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={14} aria-hidden="true" />
                  Profile
                </button>
                <button
                  className="sq-header__profile-item sq-header__profile-item--danger"
                  type="button"
                  id="profile-menu-signout"
                  onClick={() => setProfileOpen(false)}
                >
                  <LogOut size={14} aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sq-header__hamburger"
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            id="header-hamburger-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          className="sq-header__mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="sq-header__mobile-list">
            {NAV_ITEMS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `sq-header__mobile-link ${isActive ? 'sq-header__mobile-link--active' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
