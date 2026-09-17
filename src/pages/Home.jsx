import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoOrthographic, geoPath } from 'd3-geo';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  Zap,
  Shield,
  Layers,
  BarChart2,
  Clock,
  TrendingUp,
  Satellite,
  Radar,
  ScanLine,
  Map,
  Activity,
} from 'lucide-react';
import './Home.css';

const STATS = [
  { icon: BarChart2, value: '94.2%', label: 'Detection Accuracy' },
  { icon: Globe, value: '180+', label: 'Countries Covered' },
  { icon: Clock, value: '~3s', label: 'Analysis Time' },
  { icon: TrendingUp, value: '50K+', label: 'Analyses Completed' },
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
  { emoji: '🏗️', title: 'Urban Planning', desc: 'Monitor construction and city expansion' },
  { emoji: '🌊', title: 'Disaster Response', desc: 'Rapid assessment of flood and storm damage' },
  { emoji: '🌿', title: 'Agriculture', desc: 'Crop health, NDVI trends, land use analysis' },
  { emoji: '🔍', title: 'Change Detection', desc: 'Before/after comparison and quantification' },
  { emoji: '🏭', title: 'Infrastructure', desc: 'Roads, pipelines, and industrial monitoring' },
  { emoji: '🌱', title: 'Reforestation', desc: 'Track deforestation and recovery programs' },
];

function useReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/* -------------------------------------------------------------------------- */
/* Persistent Earth-intelligence background                                    */
/* -------------------------------------------------------------------------- */

function SolarSystemScene() {
  const sceneRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || reducedMotion) return;

    let frame;
    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        scene.style.setProperty('--mouse-x', `${x}`);
        scene.style.setProperty('--mouse-y', `${y}`);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={sceneRef}
      className={`sq-space-scene ${reducedMotion ? 'sq-space-scene--reduced' : ''}`}
    >
      <div className="sq-space-scene__stars sq-space-scene__stars--far" />
      <div className="sq-space-scene__stars sq-space-scene__stars--near" />

      <div className="sq-space-hud sq-space-hud--top">
        <span className="sq-hud-dot" />
        <span>EARTH OBSERVATION NETWORK</span>
        <span className="sq-hud-line" />
        <span>LIVE</span>
      </div>

      <div className="sq-orbit sq-orbit--outer">
        <div className="sq-planet sq-planet--saturn">
          <div className="sq-planet__body" />
          <div className="sq-planet__ring" />
        </div>
      </div>

      <div className="sq-orbit sq-orbit--jupiter">
        <div className="sq-planet sq-planet--jupiter">
          <div className="sq-planet__body" />
        </div>
      </div>

      <div className="sq-orbit sq-orbit--mars">
        <div className="sq-planet sq-planet--mars">
          <div className="sq-planet__body" />
        </div>
      </div>

      <div className="sq-orbit sq-orbit--earth">
        <div className="sq-planet sq-planet--earth">
          <div className="sq-planet__glow" />
          <div className="sq-planet__body">
            <span className="sq-continent sq-continent--one" />
            <span className="sq-continent sq-continent--two" />
            <span className="sq-continent sq-continent--three" />
          </div>
          <div className="sq-planet__clouds" />
          <div className="sq-planet__atmosphere" />
        </div>
      </div>

      <div className="sq-orbit sq-orbit--venus">
        <div className="sq-planet sq-planet--venus">
          <div className="sq-planet__body" />
        </div>
      </div>

      <div className="sq-orbit sq-orbit--mercury">
        <div className="sq-planet sq-planet--mercury">
          <div className="sq-planet__body" />
        </div>
      </div>

      <div className="sq-sun">
        <div className="sq-sun__core" />
        <div className="sq-sun__glow sq-sun__glow--one" />
        <div className="sq-sun__glow sq-sun__glow--two" />
      </div>

      <div className="sq-satellite sq-satellite--one">
        <div className="sq-satellite__body" />
        <div className="sq-satellite__panel sq-satellite__panel--left" />
        <div className="sq-satellite__panel sq-satellite__panel--right" />
        <span className="sq-satellite__signal" />
      </div>

      <div className="sq-satellite sq-satellite--two">
        <div className="sq-satellite__body" />
        <div className="sq-satellite__panel sq-satellite__panel--left" />
        <div className="sq-satellite__panel sq-satellite__panel--right" />
      </div>

      <div className="sq-scan-ring sq-scan-ring--one" />
      <div className="sq-scan-ring sq-scan-ring--two" />

      <div className="sq-space-hud sq-space-hud--bottom">
        <span>LAT 12.9716° N</span>
        <span>LONG 77.5946° E</span>
        <span className="sq-hud-separator" />
        <span>EO-INT / VLM</span>
      </div>
    </div>
  );
}

function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [locationState, setLocationState] = useState('idle');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState('unsupported');
      return;
    }

    setLocationState('requesting');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          lat: coords.latitude,
          lon: coords.longitude,
          accuracy: coords.accuracy,
        });
        setLocationState('ready');
      },
      () => setLocationState('denied'),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 600000,
      }
    );
  }, []);

  return { location, locationState };
}

function CinematicEarth({ location, locationState, onComplete }) {
  const [phase, setPhase] = useState('locked');

  useEffect(() => {
    // The story deliberately starts close to the target and zooms OUT.
    const timers = [
      window.setTimeout(() => setPhase('location'), 900),
      window.setTimeout(() => setPhase('region'), 1900),
      window.setTimeout(() => setPhase('earth'), 3000),
      window.setTimeout(() => setPhase('space'), 4050),
      window.setTimeout(() => setPhase('settle'), 4850),
      window.setTimeout(onComplete, 5900),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [onComplete]);

  const lat = location?.lat ?? 12.9716;
  const lon = location?.lon ?? 77.5946;

  return (
    <div className={`sq-cinematic sq-cinematic--${phase}`}>
      <div className="sq-cinematic__stars" />

      <div className="sq-cinematic__header">
        <span className="sq-hud-dot" />
        SATQUERY // EARTH OBSERVATION
        <span className="sq-cinematic__live">
          {locationState === 'ready' ? 'POSITION ACQUIRED' : 'POSITION SCANNING'}
        </span>
      </div>

      <div className="sq-cinematic__earth">
        <div className="sq-cinematic__earth-glow" />
        <div className="sq-cinematic__earth-body">
          <span className="sq-cinematic__land land-a" />
          <span className="sq-cinematic__land land-b" />
          <span className="sq-cinematic__land land-c" />
          <span className="sq-cinematic__land land-d" />
          <div className="sq-cinematic__country-grid" />
          <div className="sq-cinematic__state-grid" />
        </div>
        <div className="sq-cinematic__clouds" />
        <div className="sq-cinematic__target">
          <i /><i /><i /><i /><b />
        </div>
      </div>

      {/* The solar system is hidden behind the close Earth, then revealed by the zoom-out. */}
      <div className="sq-cinematic__solar-system">
        <div className="sq-mini-sun" />
        <div className="sq-mini-orbit sq-mini-orbit--1"><span className="sq-mini-planet sq-mini-planet--1" /></div>
        <div className="sq-mini-orbit sq-mini-orbit--2"><span className="sq-mini-planet sq-mini-planet--2" /></div>
        <div className="sq-mini-orbit sq-mini-orbit--3"><span className="sq-mini-planet sq-mini-planet--3" /></div>
        <div className="sq-mini-orbit sq-mini-orbit--4"><span className="sq-mini-planet sq-mini-planet--4" /></div>
        <div className="sq-mini-orbit sq-mini-orbit--5"><span className="sq-mini-planet sq-mini-planet--5" /></div>
        <div className="sq-mini-orbit sq-mini-orbit--6"><span className="sq-mini-planet sq-mini-planet--6" /></div>
        <div className="sq-mini-earth-marker" />
      </div>

      <div className="sq-cinematic__readout sq-cinematic__readout--left">
        <span>MISSION</span>
        <strong>EARTH / 001</strong>
        <span>OBJECTIVE</span>
        <strong>{phase === 'space' || phase === 'settle' ? 'ORBITAL VIEW' : 'GEO-LOCATE'}</strong>
      </div>

      <div className="sq-cinematic__readout sq-cinematic__readout--right">
        <span>SENSOR</span>
        <strong>EO + VLM</strong>
        <span>STATUS</span>
        <strong>{phase === 'locked' ? 'LOCKED' : phase === 'settle' ? 'READY' : 'ZOOM OUT'}</strong>
      </div>

      <div className="sq-cinematic__lock">
        <div className="sq-cinematic__reticle">
          <i /><i /><i /><i /><b />
        </div>
        <div>
          <span>
            {phase === 'locked'
              ? 'LOCATION LOCKED'
              : phase === 'settle'
                ? 'ORBITAL VIEW READY'
                : 'RELEASING TARGET'}
          </span>
          <strong>
            {phase === 'locked'
              ? `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}  /  ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`
              : phase === 'space' || phase === 'settle'
                ? 'EARTH OBSERVATION NETWORK'
                : 'EXPANDING FIELD OF VIEW'}
          </strong>
        </div>
      </div>

      <div className="sq-cinematic__footer">
        <span>LOCATION</span><b>→</b>
        <span>EARTH</span><b>→</b>
        <span>ORBIT</span><b>→</b>
        <strong>SATQUERY</strong>
      </div>
    </div>
  );
}

function SpaceBackground() {
  const [introVisible, setIntroVisible] = useState(true);
  const { location, locationState } = useUserLocation();

  const completeIntro = React.useCallback(() => setIntroVisible(false), []);

  return (
    <>
      <div
        className={`home-space-background ${introVisible ? 'home-space-background--intro' : ''}`}
        aria-hidden="true"
      >
        <div className="home-space-background__vignette" />
        <div className="home-space-background__nebula home-space-background__nebula--one" />
        <div className="home-space-background__nebula home-space-background__nebula--two" />
        <SolarSystemScene />

        <div className="home-location-persistent">
          <span className="home-location-persistent__pulse" />
          <span className="home-location-persistent__label">
            {locationState === 'ready' ? 'LOCATION LOCKED' : 'EARTH OBSERVATION'}
          </span>
          <span className="home-location-persistent__coords">
            {location
              ? `${Math.abs(location.lat).toFixed(3)}° ${location.lat >= 0 ? 'N' : 'S'} · ${Math.abs(location.lon).toFixed(3)}° ${location.lon >= 0 ? 'E' : 'W'}`
              : '12.972° N · 77.595° E'}
          </span>
        </div>
      </div>

      {introVisible && (
        <CinematicEarth
          location={location}
          locationState={locationState}
          onComplete={completeIntro}
        />
      )}
    </>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const statsRef = useReveal(0.1);
  const featuresRef = useReveal(0.08);
  const usecasesRef = useReveal(0.08);
  const ctaRef = useReveal(0.1);

  return (
    <div className="home-page">
      {/* This is intentionally outside the hero so it remains visible while scrolling. */}
      <SpaceBackground />

      <section className="home-hero" aria-labelledby="hero-heading">
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

          <div className="home-hero__flow" aria-label="How it works">
            {['ASK', 'ANALYZE', 'UNDERSTAND', 'ACT'].map((word, index) => (
              <React.Fragment key={word}>
                <span className="home-hero__flow-word">{word}</span>
                {index < 3 && (
                  <span className="home-hero__flow-sep" aria-hidden="true">→</span>
                )}
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

          <div className="home-hero__location-note">
          <span className="home-hero__location-dot" />
          LOCATION-AWARE EARTH INTELLIGENCE
        </div>

        <div className="home-hero__micro-status">
            <span><Radar size={13} /> MULTISPECTRAL READY</span>
            <span><ScanLine size={13} /> AI VISION ACTIVE</span>
            <span><Satellite size={13} /> ORBITAL DATA</span>
          </div>
        </div>

        <div className="home-hero__side-readout" aria-hidden="true">
          <div className="home-readout__label">CURRENT MISSION</div>
          <div className="home-readout__title">EARTH / 001</div>
          <div className="home-readout__row">
            <span>MODE</span>
            <strong>OBSERVE</strong>
          </div>
          <div className="home-readout__row">
            <span>SENSOR</span>
            <strong>VLM</strong>
          </div>
          <div className="home-readout__row">
            <span>STATUS</span>
            <strong>READY</strong>
          </div>
          <div className="home-readout__bar">
            <span />
          </div>
        </div>
      </section>

      <section className="home-stats home-reveal" ref={statsRef}>
        <div className="home-section-label">
          <span>01</span>
          SYSTEM CAPABILITY
        </div>

        <div className="home-stats__grid">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div className="home-stat" key={label}>
              <Icon size={17} aria-hidden="true" />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-features home-reveal" ref={featuresRef}>
        <div className="home-section-heading">
          <div>
            <div className="home-section-label">
              <span>02</span>
              CORE INTELLIGENCE
            </div>
            <h2>From pixels to decisions.</h2>
          </div>

          <p>
            SatQuery combines satellite imagery, computer vision and
            natural-language interaction into one intelligence workflow.
          </p>
        </div>

        <div className="home-features__grid">
          {FEATURES.map(({ icon: Icon, title, desc }, index) => (
            <article className="home-feature-card" key={title}>
              <div className="home-feature-card__number">0{index + 1}</div>
              <div className="home-feature-card__icon">
                <Icon size={19} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className="home-feature-card__line" />
            </article>
          ))}
        </div>
      </section>

      <section className="home-usecases home-reveal" ref={usecasesRef}>
        <div className="home-section-heading home-section-heading--center">
          <div>
            <div className="home-section-label">
              <span>03</span>
              EARTH APPLICATIONS
            </div>
            <h2>One interface. Many missions.</h2>
          </div>
          <p>
            Translate real-world questions into actionable geospatial insight.
          </p>
        </div>

        <div className="home-usecases__grid">
          {USE_CASES.map(({ emoji, title, desc }) => (
            <article className="home-usecase-card" key={title}>
              <span className="home-usecase-card__emoji" aria-hidden="true">{emoji}</span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <ArrowRight size={16} aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta home-reveal" ref={ctaRef}>
        <div className="home-cta__grid">
          <div>
            <div className="home-section-label">
              <span>04</span>
              MISSION CONTROL
            </div>
            <h2>Ask the Earth.<br /><span>We’ll find the signal.</span></h2>
            <p>
              Upload imagery, describe what you need, and let SatQuery turn
              remote-sensing data into understandable intelligence.
            </p>
          </div>

          <div className="home-cta__action">
            <div className="home-cta__telemetry">
              <span><Map size={13} /> GLOBAL</span>
              <span><Activity size={13} /> AI ONLINE</span>
            </div>
            <button
              type="button"
              className="home-btn-primary home-btn-primary--large"
              onClick={() => navigate('/analyze')}
            >
              Launch SatQuery
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
