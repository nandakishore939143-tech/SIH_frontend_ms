import React from 'react';
import './Button.css';

/**
 * Button — Reusable button with multiple variants
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  id,
  'aria-label': ariaLabel,
  title,
}) {
  return (
    <button
      id={id}
      type={type}
      className={`sq-btn sq-btn--${variant} sq-btn--${size} ${loading ? 'sq-btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
    >
      {loading && <span className="sq-btn__spinner" aria-hidden="true" />}
      {icon && !loading && <span className="sq-btn__icon" aria-hidden="true">{icon}</span>}
      <span className="sq-btn__label">{children}</span>
    </button>
  );
}
