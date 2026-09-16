import React from 'react';
import { Building2, Droplets, Leaf, GitCompare, AlertTriangle, ArrowRight } from 'lucide-react';
import './ExampleQueries.css';

const EXAMPLES = [
  {
    id: 'buildings',
    icon: Building2,
    label: 'Detect buildings\nin this area',
    query: 'Detect buildings in this area',
    twoImage: false,
  },
  {
    id: 'water',
    icon: Droplets,
    label: 'Find water\nbodies',
    query: 'Find water bodies in this satellite image',
    twoImage: false,
  },
  {
    id: 'vegetation',
    icon: Leaf,
    label: 'Identify vegetation\ncover',
    query: 'Identify vegetation cover and NDVI index',
    twoImage: false,
  },
  {
    id: 'change',
    icon: GitCompare,
    label: 'Show changes\nbetween two images',
    query: 'Show changes between two images',
    twoImage: true,
  },
  {
    id: 'damage',
    icon: AlertTriangle,
    label: 'Detect damaged\nareas (flood/fire)',
    query: 'Detect damaged areas from flood or fire',
    twoImage: false,
  },
];

/**
 * ExampleQueries — Clickable example query cards below the workspace
 */
export default function ExampleQueries({ onSelect }) {
  return (
    <section className="sq-examples" aria-label="Example queries">
      <div className="sq-examples__header">
        <h2 className="sq-examples__title">Try These Example Queries</h2>
        <button type="button" className="sq-examples__view-all" aria-label="View all example queries">
          View All <ArrowRight size={13} />
        </button>
      </div>

      <div className="sq-examples__grid">
        {EXAMPLES.map(({ id, icon: Icon, label, query, twoImage }) => (
          <button
            key={id}
            type="button"
            className="sq-example-card"
            onClick={() => onSelect(query, twoImage)}
            id={`example-${id}`}
            aria-label={`Use example: ${query}`}
          >
            <div className="sq-example-card__icon" aria-hidden="true">
              <Icon size={18} />
            </div>
            <p className="sq-example-card__label">{label}</p>
            {twoImage && (
              <span className="sq-example-card__badge">2 Images</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
