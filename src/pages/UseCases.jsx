import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sprout, Building2, AlertTriangle, Leaf } from 'lucide-react';
import './UseCases.css';

const USE_CASES = [
  {
    id: 'agriculture',
    icon: Sprout,
    color: 'green',
    title: 'Agriculture',
    tagline: 'Smarter farming through satellite insight.',
    items: ['Crop monitoring', 'Vegetation analysis', 'Land assessment'],
    desc: 'Track crop health and yield predictions using NDVI analysis, vegetation indices, and multi-temporal imagery. Detect early signs of stress, drought, or disease across thousands of hectares.',
  },
  {
    id: 'urban-planning',
    icon: Building2,
    color: 'blue',
    title: 'Urban Planning',
    tagline: 'Monitor cities as they evolve.',
    items: ['Building detection', 'Urban expansion', 'Infrastructure monitoring'],
    desc: 'Map urban growth, detect new construction, and monitor infrastructure changes in near real-time. Supports city planning, zoning analysis, and population density modeling.',
  },
  {
    id: 'disaster',
    icon: AlertTriangle,
    color: 'orange',
    title: 'Disaster Management',
    tagline: 'Rapid response when it matters most.',
    items: ['Flood detection', 'Fire damage assessment', 'Disaster response'],
    desc: 'Rapidly assess flood extents, fire perimeters, and storm damage using before-and-after change detection. Identify priority response zones and route emergency access.',
  },
  {
    id: 'environment',
    icon: Leaf,
    color: 'teal',
    title: 'Environmental Monitoring',
    tagline: 'Protecting the planet with data.',
    items: ['Deforestation tracking', 'Water body monitoring', 'Vegetation change'],
    desc: 'Monitor deforestation events, track water body levels, and detect land degradation over time. Support conservation programs and environmental compliance reporting.',
  },
];

export default function UseCases() {
  const navigate = useNavigate();

  return (
    <div className="uc-page">
      {/* Header */}
      <section className="uc-hero" aria-labelledby="uc-heading">
        <div className="uc-hero__glow" aria-hidden="true" />
        <h1 className="uc-hero__title" id="uc-heading">Use Cases</h1>
        <p className="uc-hero__sub">
          SatQuery AI adapts to your domain. Explore how teams around the world are using
          satellite intelligence to make faster, better decisions.
        </p>
      </section>

      {/* Cards */}
      <section className="uc-cards" aria-label="Use case categories">
        <div className="uc-cards__grid">
          {USE_CASES.map(({ id, icon: Icon, color, title, tagline, items, desc }) => (
            <article key={id} className={`uc-card uc-card--${color}`}>
              <div className="uc-card__header">
                <div className="uc-card__icon-wrap" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="uc-card__title">{title}</h2>
                  <p className="uc-card__tagline">{tagline}</p>
                </div>
              </div>

              <p className="uc-card__desc">{desc}</p>

              <ul className="uc-card__items" aria-label={`${title} capabilities`}>
                {items.map((item) => (
                  <li key={item} className="uc-card__item">
                    <span className="uc-card__item-dot" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="uc-card__btn"
                onClick={() => navigate('/analyze')}
                aria-label={`Try ${title} analysis`}
                id={`uc-btn-${id}`}
              >
                Try It Now
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
