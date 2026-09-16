import React from 'react';
import { Satellite, Upload, MessageSquare, Cpu, BarChart2, Globe, Layers, Brain } from 'lucide-react';
import './About.css';

const HOW_IT_WORKS = [
  { step: 1, icon: Upload, title: 'Upload Satellite Imagery', desc: 'Upload any satellite image — Sentinel-2, Landsat, or your own data.' },
  { step: 2, icon: MessageSquare, title: 'Ask a Natural-Language Question', desc: 'Describe what you want to find in plain English. No special syntax required.' },
  { step: 3, icon: Cpu, title: 'AI Analyzes the Imagery', desc: 'SatQuery Vision processes your image using state-of-the-art computer vision models.' },
  { step: 4, icon: BarChart2, title: 'Receive Actionable Insights', desc: 'Get confidence-scored findings, feature counts, and follow-up query support.' },
];

const TECHNOLOGIES = [
  { icon: Globe, label: 'Satellite Imagery', desc: 'Multi-spectral & SAR data from Sentinel, Landsat and commercial providers.' },
  { icon: Layers, label: 'Computer Vision', desc: 'Deep learning object detection and semantic segmentation at scale.' },
  { icon: Brain, label: 'AI / Vision Models', desc: 'SatQuery Vision v3.1 — purpose-built for Earth observation analysis.' },
  { icon: MessageSquare, label: 'Natural Language Queries', desc: 'Query your imagery the way you think — no GIS expertise needed.' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero" aria-labelledby="about-hero-heading">
        <div className="about-hero__glow" aria-hidden="true" />
        <div className="about-hero__badge">
          <Satellite size={13} aria-hidden="true" />
          SatQuery AI Platform
        </div>
        <h1 className="about-hero__title" id="about-hero-heading">
          Earth Insights.<br />
          <span className="about-hero__accent">Beyond Boundaries.</span>
        </h1>
        <p className="about-hero__desc">
          SatQuery AI is an AI-powered satellite imagery analysis platform that allows users to interact
          with Earth observation data using natural language — making geospatial intelligence accessible
          to everyone.
        </p>
      </section>

      {/* What is SatQuery AI */}
      <section className="about-section" aria-labelledby="what-heading">
        <div className="about-section__header">
          <h2 id="what-heading" className="about-section__title">What is SatQuery AI?</h2>
        </div>
        <div className="about-what__grid">
          <div className="about-what__text">
            <p>
              SatQuery AI bridges the gap between raw satellite data and actionable intelligence. Traditional
              satellite analysis required specialized GIS software and domain expertise. SatQuery AI changes
              that — ask a question in plain English and receive instant, high-confidence answers backed by
              cutting-edge computer vision.
            </p>
            <p>
              Whether you're monitoring agricultural land, assessing disaster damage, tracking urban growth,
              or studying environmental change, SatQuery AI delivers insights that were previously only
              available to large organizations with dedicated remote-sensing teams.
            </p>
          </div>
          <div className="about-what__stats">
            <div className="about-stat"><span className="about-stat__val">94.2%</span><span className="about-stat__label">Avg. Accuracy</span></div>
            <div className="about-stat"><span className="about-stat__val">180+</span><span className="about-stat__label">Countries</span></div>
            <div className="about-stat"><span className="about-stat__val">~3s</span><span className="about-stat__label">Analysis Time</span></div>
            <div className="about-stat"><span className="about-stat__val">50k+</span><span className="about-stat__label">Analyses Run</span></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="about-section" aria-labelledby="how-heading">
        <div className="about-section__header">
          <h2 id="how-heading" className="about-section__title">How It Works</h2>
          <p className="about-section__sub">Four simple steps from image to insight.</p>
        </div>
        <div className="about-steps">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="about-step">
              <div className="about-step__num" aria-hidden="true">{step}</div>
              <div className="about-step__icon-wrap" aria-hidden="true">
                <Icon size={20} />
              </div>
              <div className="about-step__content">
                <h3 className="about-step__title">{title}</h3>
                <p className="about-step__desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="about-section" aria-labelledby="tech-heading">
        <div className="about-section__header">
          <h2 id="tech-heading" className="about-section__title">Technology</h2>
          <p className="about-section__sub">Built on a foundation of proven geospatial AI.</p>
        </div>
        <div className="about-tech__grid">
          {TECHNOLOGIES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="about-tech-card">
              <div className="about-tech-card__icon" aria-hidden="true">
                <Icon size={22} />
              </div>
              <h3 className="about-tech-card__label">{label}</h3>
              <p className="about-tech-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
