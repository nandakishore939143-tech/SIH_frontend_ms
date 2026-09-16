import React from 'react';
import { Cpu } from 'lucide-react';
import './ModelInformation.css';

/**
 * ModelInformation — Compact 2×2 grid showing model, confidence, resolution, processing
 */
export default function ModelInformation({ result, isAnalyzing }) {
  return (
    <div className="sq-model-info">
      <div className="sq-model-info__header">
        <h2 className="sq-model-info__title">
          <span className="sq-model-info__icon" aria-hidden="true">
            <Cpu size={12} />
          </span>
          Model Intelligence
        </h2>
      </div>
      <div className="sq-model-info__body">
        {isAnalyzing ? (
          <div className="sq-model-info__loading" aria-busy="true">
            <div className="sq-model-info__skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="sq-model-info__skeleton-tile">
                  <div className="sq-model-info__skeleton sq-model-info__skeleton--value" />
                  <div className="sq-model-info__skeleton sq-model-info__skeleton--label" />
                </div>
              ))}
            </div>
          </div>
        ) : !result ? (
          <p className="sq-model-info__empty">
            Model performance, confidence, resolution, and processing details.
          </p>
        ) : (
          <div className="sq-model-info__stat-grid">
            <StatTile label="Model" value={result.model} accent />
            <StatTile label="Confidence" value={`${result.confidence.toFixed(1)}%`} highlight />
            <StatTile label="Resolution" value={result.resolution} />
            <StatTile label="Processing" value={result.processingTime} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value, accent, highlight }) {
  return (
    <div className={`sq-stat-tile ${accent ? 'sq-stat-tile--accent' : ''} ${highlight ? 'sq-stat-tile--highlight' : ''}`}>
      <span className="sq-stat-tile__value">{value}</span>
      <span className="sq-stat-tile__label">{label}</span>
    </div>
  );
}
