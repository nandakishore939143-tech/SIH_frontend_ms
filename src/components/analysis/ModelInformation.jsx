import React from 'react';
import { Cpu } from 'lucide-react';
import './ModelInformation.css';

/**
 * ModelInformation — Shows model name, confidence, resolution, and processing details
 */
export default function ModelInformation({ result, isAnalyzing }) {
  return (
    <div className="sq-model-info">
      <div className="sq-model-info__header">
        <h2 className="sq-model-info__title">
          <span className="sq-model-info__icon" aria-hidden="true">
            <Cpu size={14} />
          </span>
          Model Information
        </h2>
      </div>
      <div className="sq-model-info__body">
        {isAnalyzing ? (
          <div className="sq-model-info__loading" aria-busy="true">
            <div className="sq-model-info__skeleton-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="sq-model-info__skeleton-item">
                  <div className="sq-model-info__skeleton sq-model-info__skeleton--label" />
                  <div className="sq-model-info__skeleton sq-model-info__skeleton--value" />
                </div>
              ))}
            </div>
          </div>
        ) : !result ? (
          <p className="sq-model-info__empty">
            Selected model, confidence score and<br />processing details will appear here.
          </p>
        ) : (
          <div className="sq-model-info__grid">
            <InfoRow label="Model" value={result.model} accent />
            <InfoRow label="Confidence" value={`${result.confidence.toFixed(1)}%`} highlight />
            <InfoRow label="Resolution" value={result.resolution} />
            <InfoRow label="Processing" value={result.processingTime} />
            <InfoRow label="Analysis Type" value={result.analysisType} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, accent, highlight }) {
  return (
    <div className={`sq-info-row ${accent ? 'sq-info-row--accent' : ''} ${highlight ? 'sq-info-row--highlight' : ''}`}>
      <span className="sq-info-row__label">{label}</span>
      <span className="sq-info-row__value">{value}</span>
    </div>
  );
}
