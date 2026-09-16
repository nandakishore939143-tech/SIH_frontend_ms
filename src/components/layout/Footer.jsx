import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="sq-footer" role="contentinfo">
      <div className="sq-footer__inner">
        <span className="sq-footer__brand">
          SatQuery AI | <span className="sq-footer__tagline">Space Technology for a Better Tomorrow</span>
        </span>
        <nav className="sq-footer__links" aria-label="Footer navigation">
          <NavLink to="/about" className="sq-footer__link">Help</NavLink>
          <span className="sq-footer__sep" aria-hidden="true" />
          <NavLink to="/about" className="sq-footer__link">Privacy</NavLink>
          <span className="sq-footer__sep" aria-hidden="true" />
          <NavLink to="/about" className="sq-footer__link">Contact</NavLink>
        </nav>
      </div>
    </footer>
  );
}
