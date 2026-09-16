import React, { useState, useMemo } from 'react';
import { Database, Search, SatelliteIcon, Globe, Radio } from 'lucide-react';
import './Datasets.css';

const DATASETS = [
  {
    id: 'sentinel-2',
    name: 'Sentinel-2',
    shortName: 'S2',
    desc: 'Multispectral satellite imagery with 13 spectral bands. Ideal for vegetation, urban, and land-use analysis.',
    resolution: '10m',
    type: 'Multispectral',
    coverage: 'Global',
    revisit: '5 days',
    icon: SatelliteIcon,
    color: 'blue',
    tags: ['Multispectral', 'ESA', 'Free'],
  },
  {
    id: 'landsat-89',
    name: 'Landsat 8/9',
    shortName: 'L9',
    desc: 'Earth observation imagery offering long-term continuity for change detection and environmental monitoring.',
    resolution: '30m',
    type: 'Multispectral',
    coverage: 'Global',
    revisit: '16 days',
    icon: Globe,
    color: 'teal',
    tags: ['Multispectral', 'USGS', 'Free'],
  },
  {
    id: 'sentinel-1',
    name: 'Sentinel-1',
    shortName: 'S1',
    desc: 'Synthetic Aperture Radar (SAR) imagery that works in all weather and lighting conditions, day and night.',
    resolution: '10m',
    type: 'SAR Radar',
    coverage: 'Global',
    revisit: '6 days',
    icon: Radio,
    color: 'purple',
    tags: ['SAR', 'ESA', 'Free', 'All-weather'],
  },
  {
    id: 'planet-scope',
    name: 'PlanetScope',
    shortName: 'PS',
    desc: 'High-resolution commercial imagery with daily revisit, ideal for precision agriculture and site monitoring.',
    resolution: '3m',
    type: 'Multispectral',
    coverage: 'Global',
    revisit: 'Daily',
    icon: SatelliteIcon,
    color: 'orange',
    tags: ['Commercial', 'High-res', 'Daily'],
  },
  {
    id: 'modis',
    name: 'MODIS',
    shortName: 'MOD',
    desc: 'Moderate-resolution spectroradiometer data from Terra and Aqua satellites for global monitoring.',
    resolution: '250m–1km',
    type: 'Multispectral',
    coverage: 'Global',
    revisit: '1–2 days',
    icon: Globe,
    color: 'green',
    tags: ['NASA', 'Free', 'Global'],
  },
  {
    id: 'dem',
    name: 'Copernicus DEM',
    shortName: 'DEM',
    desc: 'Digital Elevation Model providing high-accuracy terrain data for topographic and hydrological analysis.',
    resolution: '30m',
    type: 'Elevation',
    coverage: 'Global',
    revisit: 'Static',
    icon: Database,
    color: 'indigo',
    tags: ['Elevation', 'ESA', 'Free'],
  },
];

const ALL_TYPES = ['All', ...Array.from(new Set(DATASETS.map((d) => d.type)))];

export default function Datasets() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return DATASETS.filter((d) => {
      const matchesType = activeType === 'All' || d.type === activeType;
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [search, activeType]);

  return (
    <div className="ds-page">
      {/* Hero */}
      <section className="ds-hero" aria-labelledby="ds-heading">
        <div className="ds-hero__glow" aria-hidden="true" />
        <h1 className="ds-hero__title" id="ds-heading">
          <Database size={24} aria-hidden="true" />
          Datasets
        </h1>
        <p className="ds-hero__sub">
          Browse supported satellite imagery datasets. All datasets are available for analysis via
          SatQuery AI — upload imagery from these sources to get started.
        </p>
      </section>

      {/* Filters */}
      <div className="ds-filters" role="search">
        <div className="ds-search">
          <Search size={14} aria-hidden="true" className="ds-search__icon" />
          <input
            type="search"
            className="ds-search__input"
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search datasets"
            id="datasets-search"
          />
        </div>
        <div className="ds-type-filters" role="group" aria-label="Filter by type">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`ds-filter-btn ${activeType === type ? 'ds-filter-btn--active' : ''}`}
              onClick={() => setActiveType(type)}
              aria-pressed={activeType === type}
              id={`ds-filter-${type.toLowerCase().replace(/\s/g, '-')}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="ds-count" aria-live="polite">
        {filtered.length} dataset{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Cards */}
      <div className="ds-grid" role="list">
        {filtered.length === 0 ? (
          <div className="ds-empty">
            <Database size={36} aria-hidden="true" />
            <p>No datasets match your search.</p>
          </div>
        ) : (
          filtered.map(({ id, name, shortName, desc, resolution, type, coverage, revisit, icon: Icon, color, tags }) => (
            <article key={id} className={`ds-card ds-card--${color}`} role="listitem">
              <div className="ds-card__header">
                <div className="ds-card__icon-wrap" aria-hidden="true">
                  <Icon size={20} />
                </div>
                <div className="ds-card__title-wrap">
                  <h2 className="ds-card__name">{name}</h2>
                  <span className="ds-card__type">{type}</span>
                </div>
                <div className="ds-card__badge" aria-hidden="true">{shortName}</div>
              </div>

              <p className="ds-card__desc">{desc}</p>

              <div className="ds-card__meta">
                <div className="ds-card__meta-item">
                  <span className="ds-card__meta-label">Resolution</span>
                  <span className="ds-card__meta-val">{resolution}</span>
                </div>
                <div className="ds-card__meta-item">
                  <span className="ds-card__meta-label">Coverage</span>
                  <span className="ds-card__meta-val">{coverage}</span>
                </div>
                <div className="ds-card__meta-item">
                  <span className="ds-card__meta-label">Revisit</span>
                  <span className="ds-card__meta-val">{revisit}</span>
                </div>
              </div>

              <div className="ds-card__tags" aria-label="Tags">
                {tags.map((tag) => (
                  <span key={tag} className="ds-card__tag">{tag}</span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
