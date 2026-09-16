import React, { useState, useEffect } from 'react';
import { Settings, Moon, Bell, User, Sliders, ChevronRight } from 'lucide-react';
import './Settings.css';

const SETTINGS_KEY = 'satquery_settings';

const DEFAULT_SETTINGS = {
  darkMode: true,
  defaultModel: 'SatQuery Vision',
  defaultAnalysisType: 'Object Detection',
  confidenceThreshold: 75,
  notifAnalysis: true,
  notifSystem: true,
  username: 'Midnight Syntax',
  email: 'user@satquery.ai',
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function Toggle({ checked, onChange, id, label }) {
  return (
    <label className="st-toggle" htmlFor={id} aria-label={label}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="st-toggle__input sr-only"
      />
      <span className="st-toggle__track" aria-hidden="true">
        <span className="st-toggle__thumb" />
      </span>
    </label>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const update = (key, val) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      saveSettings(next);
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="st-page">
      {/* Header */}
      <div className="st-page__header">
        <h1 className="st-page__title">
          <Settings size={20} aria-hidden="true" />
          Settings
        </h1>
        {saved && (
          <span className="st-saved-badge" role="status" aria-live="polite">
            ✓ Saved
          </span>
        )}
      </div>

      <div className="st-sections">
        {/* Appearance */}
        <section className="st-section" aria-labelledby="st-appearance-heading">
          <div className="st-section__header">
            <Moon size={16} aria-hidden="true" />
            <h2 id="st-appearance-heading" className="st-section__title">Appearance</h2>
          </div>
          <div className="st-rows">
            <div className="st-row">
              <div className="st-row__info">
                <span className="st-row__label">Dark Mode</span>
                <span className="st-row__desc">Use dark theme across the application</span>
              </div>
              <Toggle
                id="st-dark-mode"
                checked={settings.darkMode}
                onChange={(v) => update('darkMode', v)}
                label="Toggle dark mode"
              />
            </div>
          </div>
        </section>

        {/* Analysis Preferences */}
        <section className="st-section" aria-labelledby="st-analysis-heading">
          <div className="st-section__header">
            <Sliders size={16} aria-hidden="true" />
            <h2 id="st-analysis-heading" className="st-section__title">Analysis Preferences</h2>
          </div>
          <div className="st-rows">
            <div className="st-row">
              <div className="st-row__info">
                <label className="st-row__label" htmlFor="st-model">Default Model</label>
                <span className="st-row__desc">AI model used for new analyses</span>
              </div>
              <select
                id="st-model"
                className="st-select"
                value={settings.defaultModel}
                onChange={(e) => update('defaultModel', e.target.value)}
              >
                <option value="SatQuery Vision">SatQuery Vision</option>
                <option value="SatQuery Vision Pro">SatQuery Vision Pro</option>
                <option value="SatQuery Vision Lite">SatQuery Vision Lite</option>
              </select>
            </div>

            <div className="st-row">
              <div className="st-row__info">
                <label className="st-row__label" htmlFor="st-analysis-type">Default Analysis Type</label>
                <span className="st-row__desc">Pre-selected analysis type for new queries</span>
              </div>
              <select
                id="st-analysis-type"
                className="st-select"
                value={settings.defaultAnalysisType}
                onChange={(e) => update('defaultAnalysisType', e.target.value)}
              >
                <option>Object Detection</option>
                <option>Change Detection</option>
                <option>Vegetation Analysis</option>
                <option>Water Body Detection</option>
                <option>Damage Assessment</option>
              </select>
            </div>

            <div className="st-row">
              <div className="st-row__info">
                <label className="st-row__label" htmlFor="st-confidence">
                  Confidence Threshold: <strong>{settings.confidenceThreshold}%</strong>
                </label>
                <span className="st-row__desc">Minimum confidence required to surface results</span>
              </div>
              <input
                type="range"
                id="st-confidence"
                className="st-slider"
                min={50}
                max={99}
                value={settings.confidenceThreshold}
                onChange={(e) => update('confidenceThreshold', Number(e.target.value))}
                aria-valuemin={50}
                aria-valuemax={99}
                aria-valuenow={settings.confidenceThreshold}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="st-section" aria-labelledby="st-notif-heading">
          <div className="st-section__header">
            <Bell size={16} aria-hidden="true" />
            <h2 id="st-notif-heading" className="st-section__title">Notifications</h2>
          </div>
          <div className="st-rows">
            <div className="st-row">
              <div className="st-row__info">
                <span className="st-row__label">Analysis Completed</span>
                <span className="st-row__desc">Notify when an analysis finishes</span>
              </div>
              <Toggle
                id="st-notif-analysis"
                checked={settings.notifAnalysis}
                onChange={(v) => update('notifAnalysis', v)}
                label="Toggle analysis notifications"
              />
            </div>
            <div className="st-row">
              <div className="st-row__info">
                <span className="st-row__label">System Notifications</span>
                <span className="st-row__desc">Platform updates and announcements</span>
              </div>
              <Toggle
                id="st-notif-system"
                checked={settings.notifSystem}
                onChange={(v) => update('notifSystem', v)}
                label="Toggle system notifications"
              />
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="st-section" aria-labelledby="st-account-heading">
          <div className="st-section__header">
            <User size={16} aria-hidden="true" />
            <h2 id="st-account-heading" className="st-section__title">Account</h2>
          </div>
          <div className="st-rows">
            <div className="st-row">
              <div className="st-row__info">
                <label className="st-row__label" htmlFor="st-username">Username</label>
                <span className="st-row__desc">Your display name across the platform</span>
              </div>
              <input
                type="text"
                id="st-username"
                className="st-input"
                value={settings.username}
                onChange={(e) => update('username', e.target.value)}
                aria-label="Username"
              />
            </div>
            <div className="st-row">
              <div className="st-row__info">
                <label className="st-row__label" htmlFor="st-email">Email</label>
                <span className="st-row__desc">Account email address</span>
              </div>
              <input
                type="email"
                id="st-email"
                className="st-input"
                value={settings.email}
                onChange={(e) => update('email', e.target.value)}
                aria-label="Email address"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
