import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner — Animated futuristic radar-style spinner
 */
export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  return (
    <div className={`sq-spinner sq-spinner--${size}`} role="status" aria-label={label}>
      <div className="sq-spinner__ring sq-spinner__ring--outer" />
      <div className="sq-spinner__ring sq-spinner__ring--inner" />
      <div className="sq-spinner__dot" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
