import React from 'react';
import './Toggle.css';

/**
 * Toggle — Accessible switch toggle component
 */
export default function Toggle({ checked = false, onChange, label, id, disabled = false }) {
  const toggleId = id || `toggle-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="sq-toggle-wrapper">
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={`sq-toggle ${checked ? 'sq-toggle--on' : ''}`}
        onClick={() => onChange && onChange(!checked)}
      >
        <span className="sq-toggle__thumb" />
      </button>
      {label && (
        <label htmlFor={toggleId} className="sq-toggle__label">
          {label}
        </label>
      )}
    </div>
  );
}
