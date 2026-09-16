import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Zap, Shield, Layers, BarChart2, Clock, TrendingUp } from 'lucide-react';
import './Home.css';

const SpaceScene = lazy(() => import('../components/3d/SpaceScene'));

const STATS = [
  { icon: BarChart2,  value: '94.2%', label: 'Detection Accuracy' },
  { icon: Globe,      value: '180+',  label: 'Countries Covered' },
  { icon: Clock,      value: '~3s',   label: 'Analysis Time' },
  { icon: TrendingUp, value: '50K+',  label: 'Analyses Completed' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Natural Language Queries',
    desc: 'Ask questions about satellite imagery in plain English. No technical expertise required.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    desc: 'Any region. Any terrain. Consistent intelligence across 180+ countries worldwide.',
  },
  {
    icon: Shield,
    title: 'Confidence Scoring',
    desc: 'Every detection includes a transparent confidence score. Know what you can trust.',
  },
  {
    icon: Layers,
    title: 'Multi-layer Detection',
    desc: 'Simultaneous detection of buildings, water, vegetation, roads, and change events.',
  },
];

const USE_CASES = [
  { emoji: '🏗️', title: 'Urban Planning',    desc: 'Monitor construction and city expansion' },
  { emoji: '🌊', title: 'Disaster Response', desc: 'Rapid assessment of flood and storm damage' },
  { emoji: '🌿', title: 'Agriculture',        desc: 'Crop health, NDVI trends, land use analysis' },
  { emoji: '🔍', title: 'Change Detection',   desc: 'Before/after comparison and quantification' },
  { emoji: '🏭', title: 'Infrastructure',     desc: 'Roads, pipelines, and industrial monitoring' },
  { emoji: '🌱', title: 'Reforestation',      desc: 'Track deforestation and recovery programs' },
];

/**
 * useReveal — attaches an IntersectionObserver to add .is-visible when element enters viewport
 */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

export default function Home() {
  const navigate = useNavigate();

  const statsRef    = useReveal(0.1);
  const featuresRef = useReveal(0.08);
  const usecasesRef = useReveal(0.08);
  const ctaRef      = useReveal(0.1);

  return (
    <div className="home-page">

      {/* ══ HERO ══ */}
      <section className="home-hero" aria-labelledby="hero-heading">

        {/* Left — typography */}
        <div className="home-hero__content">
          <div className="home-hero__eyebrow">
            <span className="home-hero__eyebrow-dot" aria-hidden="true" />
            Earth Intelligence Platform
          </div>

          <h1 className="home-hero__title" id="hero-heading">
            SATELLITE<br />
            <span className="home-hero__title-accent">INTELLIGENCE.</span><br />
            ON DEMAND.
          </h1>

          <p className="home-hero__subtitle">
            Ask any question about any place on Earth.
            Upload satellite imagery — receive structured,
            high-confidence AI analysis in seconds.
          </p>

          {/* ASK → ACT flow */}
          <div className="home-hero__flow" aria-label="How it works">
            {['ASK', 'ANALYZE', 'UNDERSTAND', 'ACT'].map((w, i) => (
              <React.Fragment key={w}>
                <span className="home-hero__flow-word">{w}</span>
                {i < 3 && <span className="home-hero__flow-sep" aria-hidden="true">→</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="home-hero__actions">
            <button
              id="hero-analyze-btn"
              type="button"
              className="home-btn-primary"
              onClick={() => navigate('/analyze')}
            >
              Start Analyzing
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button
              id="hero-history-btn"
              type="button"
              className="home-btn-ghost"
              onClick={() => navigate('/history')}
            >
              View history
            </button>
          </div>
        </div>

        {/* Right — 3D planet */}
        <div className="home-hero__planet" aria-hidden="true">
          <Suspense fallback={<CssPlanetFallback />}>
            <SpaceScene />
          </Suspense>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section
        ref={statsRef}
        className="home-stats reveal"
        aria-label="Platform statistics"
      >
        {STATS.map(({ icon: Icon, value, label }, i) => (
          <React.Fragment key={label}>
            <div className="home-stat">
              <Icon size={14} className="home-stat__icon" aria-hidden="true" />
              <span className="home-stat__value">{value}</span>
              <span className="home-stat__label">{label}</span>
            </div>
            {i < STATS.length - 1 && (
              <div className="home-stats__sep" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </section>

      {/* ══ FEATURES ══ */}
      <section
        ref={featuresRef}
        className="home-features reveal"
        aria-labelledby="features-heading"
      >
        <div className="home-section-header">
          <p className="home-section-eyebrow">CAPABILITIES</p>
          <h2 id="features-heading" className="home-section-title">
            Built for Earth Intelligence
          </h2>
          <p className="home-section-sub">
            Precision tools for analysts, planners, and decision-makers.
          </p>
        </div>

        <div className="home-features__grid">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`home-feature-card reveal reveal-delay-${i + 1}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="home-feature-card__icon">
                <Icon size={17} aria-hidden="true" />
              </div>
              <h3 className="home-feature-card__title">{title}</h3>
              <p className="home-feature-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section
        ref={usecasesRef}
        className="home-usecases reveal"
        aria-labelledby="usecases-heading"
      >
        <div className="home-section-header">
          <p className="home-section-eyebrow">APPLICATIONS</p>
          <h2 id="usecases-heading" className="home-section-title">
            What Can You Analyze?
          </h2>
          <p className="home-section-sub">
            From disaster response to urban monitoring — SatQuery adapts to your domain.
          </p>
        </div>

        <div className="home-usecases__grid">
          {USE_CASES.map(({ emoji, title, desc }) => (
            <button
              key={title}
              type="button"
              className="home-usecase-row"
              onClick={() => navigate('/analyze')}
              aria-label={`Explore: ${title}`}
            >
              <span className="home-usecase-row__emoji" aria-hidden="true">{emoji}</span>
              <div className="home-usecase-row__body">
                <span className="home-usecase-row__title">{title}</span>
                <span className="home-usecase-row__desc">{desc}</span>
              </div>
              <ArrowRight size={13} className="home-usecase-row__arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section
        ref={ctaRef}
        className="home-cta reveal"
        aria-labelledby="cta-heading"
      >
        <p className="home-section-eyebrow">READY TO BEGIN</p>
        <h2 id="cta-heading" className="home-cta__title">
          Your first satellite insight is<br />
          <span className="home-hero__title-accent">one question away.</span>
        </h2>
        <p className="home-cta__sub">
          Upload an image. Ask in plain language. Receive structured AI analysis.
        </p>
        <button
          id="cta-analyze-btn"
          type="button"
          className="home-btn-primary"
          onClick={() => navigate('/analyze')}
        >
          Open Intelligence Workspace
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

function CssPlanetFallback() {
  return (
    <div className="home-hero__planet-fallback" aria-hidden="true">
      <div className="home-hero__planet-ring home-hero__planet-ring--1" />
      <div className="home-hero__planet-ring home-hero__planet-ring--2" />
      <div className="home-hero__planet-core" />
    </div>
  );
}
