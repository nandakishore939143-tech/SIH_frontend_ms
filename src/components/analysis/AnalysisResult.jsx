import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import './AnalysisResult.css';

/**
 * AnalysisResult — Shows the primary analysis output in the right panel
 */
export default function AnalysisResult({ result, isAnalyzing }) {
  return (
    <div className="sq-result">
      <div className="sq-result__header">
        <h2 className="sq-result__title">
          <span className="sq-result__icon" aria-hidden="true">
            <Sparkles size={13} />
          </span>
          AI Intelligence
        </h2>
        {result && (
          <span className="sq-result__badge sq-result__badge--success">
            <CheckCircle size={10} /> Analysis Complete
          </span>
        )}
      </div>

      <div className="sq-result__body">
        {isAnalyzing ? (
          <div className="sq-result__loading" aria-live="polite" aria-busy="true">
            <LoadingSpinner size="lg" label="Analyzing satellite imagery..." />
            <p className="sq-result__loading-text">Processing imagery…</p>
            <div className="sq-result__loading-steps">
              <LoadingStep label="Satellite positioning" done={true} />
              <LoadingStep label="Scanning imagery" done={false} active={true} />
              <LoadingStep label="Generating intelligence" done={false} />
            </div>
          </div>
        ) : !result ? (
          <div className="sq-result__empty" aria-label="No analysis result yet">
            <div className="sq-result__target" aria-hidden="true">
              <div className="sq-result__target-ring sq-result__target-ring--1" />
              <div className="sq-result__target-ring sq-result__target-ring--2" />
              <div className="sq-result__target-ring sq-result__target-ring--3" />
              <div className="sq-result__target-crosshair-h" />
              <div className="sq-result__target-crosshair-v" />
            </div>
            <p className="sq-result__empty-title">Your intelligence report will appear here.</p>
            <p className="sq-result__empty-hint">
              Upload imagery and run an analysis to generate<br />evidence-backed insights.
            </p>
          </div>
        ) : (
          <div className="sq-result__data" aria-label="Analysis results">
            {/* Large confidence number */}
            <div className="sq-result__confidence-hero">
              <span className="sq-result__confidence-number">{result.confidence.toFixed(1)}%</span>
              <div className="sq-result__confidence-meta">
                <span className="sq-result__confidence-label">CONFIDENCE</span>
                <div className="sq-result__confidence-bar-wrap">
                  <div
                    className="sq-result__confidence-bar"
                    style={{ width: `${result.confidence}%` }}
                    role="progressbar"
                    aria-valuenow={result.confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Confidence: ${result.confidence.toFixed(1)}%`}
                  />
                </div>
              </div>
            </div>

            <div className="sq-result__meta-row">
              <MetaChip label="Processing" value={result.processingTime} />
              <MetaChip label="Analysis Type" value={result.analysisType} highlight />
            </div>

            <div className="sq-result__features-section">
              <p className="sq-result__section-label">Detected Features</p>
              <div className="sq-result__features-grid">
                <FeatureTile
                  label="Buildings"
                  value={result.detectedFeatures.buildings}
                  icon="🏢"
                  color="blue"
                />
                <FeatureTile
                  label="Water Bodies"
                  value={result.detectedFeatures.waterBodies}
                  icon="💧"
                  color="cyan"
                />
                <FeatureTile
                  label="Vegetation"
                  value={`${Math.abs(result.detectedFeatures.vegetationCoverage)}%`}
                  icon="🌿"
                  color="green"
                  note={result.detectedFeatures.vegetationCoverage < 0 ? '▼ Reduced' : ''}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingStep({ label, done, active }) {
  return (
    <div className={`sq-loading-step ${active ? 'sq-loading-step--active' : ''} ${done ? 'sq-loading-step--done' : ''}`}>
      <span className="sq-loading-step__dot" aria-hidden="true" />
      <span className="sq-loading-step__label">{label}</span>
    </div>
  );
}

function MetaChip({ label, value, highlight }) {
  return (
    <div className={`sq-meta-chip ${highlight ? 'sq-meta-chip--highlight' : ''}`}>
      <span className="sq-meta-chip__label">{label}</span>
      <span className="sq-meta-chip__value">{value}</span>
    </div>
  );
}

function FeatureTile({ label, value, icon, color, note }) {
  return (
    <div className={`sq-feature-tile sq-feature-tile--${color}`}>
      <span className="sq-feature-tile__icon" aria-hidden="true">{icon}</span>
      <span className="sq-feature-tile__value">{value}</span>
      <span className="sq-feature-tile__label">{label}</span>
      {note && <span className="sq-feature-tile__note">{note}</span>}
    </div>
  );
}
