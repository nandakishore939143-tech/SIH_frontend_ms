import React from 'react';
import './Card.css';

/**
 * Card — Base card component for SatQuery AI panels
 */
export default function Card({
  children,
  className = '',
  style,
  glow = false,
  onClick,
  role,
  tabIndex,
  'aria-label': ariaLabel,
}) {
  return (
    <div
      className={`sq-card ${glow ? 'sq-card--glow' : ''} ${className}`}
      style={style}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
