import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Maximize2,
  X,
  Building2,
  Droplets,
  Leaf,
  Clock3,
  Brain,
} from 'lucide-react';

import LoadingSpinner from '../ui/LoadingSpinner';
import './AnalysisResult.css';

export default function AnalysisResult({ result, isAnalyzing }) {
  const [isExpanded, setIsExpanded] = useState(false);
  /* =====================================================
   ESCAPE KEY — CLOSE EXPANDED ANALYSIS
   ===================================================== */

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  const confidence = Number(result?.confidence ?? 0);

  const buildings = result?.detectedFeatures?.buildings ?? 0;
  const waterBodies = result?.detectedFeatures?.waterBodies ?? 0;
  const vegetation = Number(
    result?.detectedFeatures?.vegetationCoverage ?? 0
  );

  const toggleExpanded = () => {
    setIsExpanded((current) => !current);
  };

  return (
    <div
      className={`sq-result ${
        isExpanded ? 'sq-result--expanded' : ''
      }`}
    >
      {/* HEADER */}
      <div className="sq-result__header">
        <h2 className="sq-result__title">
          <span className="sq-result__icon" aria-hidden="true">
            <Sparkles size={15} />
          </span>

          AI Intelligence
        </h2>

        <div className="sq-result__header-actions">
          {result && (
            <span className="sq-result__badge sq-result__badge--success">
              <CheckCircle size={11} />
              Analysis Complete
            </span>
          )}

          <button
            type="button"
            className="sq-result__expand-btn"
            onClick={toggleExpanded}
            aria-label={
              isExpanded
                ? 'Close expanded analysis'
                : 'Expand analysis'
            }
            title={
              isExpanded
                ? 'Close expanded analysis'
                : 'Expand analysis'
            }
          >
            {isExpanded ? (
              <X size={18} />
            ) : (
              <Maximize2 size={17} />
            )}

            <span className="sq-result__expand-text">
              {isExpanded ? 'Close' : 'Expand'}
            </span>
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="sq-result__body">
        {isAnalyzing ? (
          <div
            className="sq-result__loading"
            aria-live="polite"
            aria-busy="true"
          >
            <LoadingSpinner
              size="lg"
              label="Analyzing satellite imagery..."
            />

            <p className="sq-result__loading-text">
              Processing imagery…
            </p>

            <div className="sq-result__loading-steps">
              <LoadingStep
                label="Satellite positioning"
                done
              />

              <LoadingStep
                label="Scanning imagery"
                active
              />

              <LoadingStep
                label="Generating intelligence"
              />
            </div>
          </div>
        ) : !result ? (
          <div
            className="sq-result__empty"
            aria-label="No analysis result yet"
          >
            <div
              className="sq-result__target"
              aria-hidden="true"
            >
              <div className="sq-result__target-ring sq-result__target-ring--1" />
              <div className="sq-result__target-ring sq-result__target-ring--2" />
              <div className="sq-result__target-ring sq-result__target-ring--3" />

              <div className="sq-result__target-crosshair-h" />
              <div className="sq-result__target-crosshair-v" />
            </div>

            <p className="sq-result__empty-title">
              Your intelligence report will appear here.
            </p>

            <p className="sq-result__empty-hint">
              Upload imagery and run an analysis to generate
              evidence-backed insights.
            </p>
          </div>
        ) : (
          <div
            className="sq-result__data"
            aria-label="Analysis results"
          >
            {/* CONFIDENCE */}
            <div className="sq-result__confidence-hero">
              <span className="sq-result__confidence-number">
                {confidence.toFixed(1)}%
              </span>

              <div className="sq-result__confidence-meta">
                <span className="sq-result__confidence-label">
                  CONFIDENCE
                </span>

                <div className="sq-result__confidence-bar-wrap">
                  <div
                    className="sq-result__confidence-bar"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, confidence)
                      )}%`,
                    }}
                    role="progressbar"
                    aria-valuenow={confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            </div>

            {/* META */}
            <div className="sq-result__meta-row">
              <MetaChip
                label="Processing"
                value={result.processingTime || '—'}
                icon={<Clock3 size={13} />}
              />

              <MetaChip
                label="Analysis Type"
                value={result.analysisType || 'Satellite Analysis'}
                icon={<Brain size={13} />}
                highlight
              />
            </div>

            {/* FEATURES */}
            <div className="sq-result__features-section">
              <p className="sq-result__section-label">
                Detected Features
              </p>

              <div className="sq-result__features-grid">
                <FeatureTile
                  label="Buildings"
                  value={buildings}
                  icon={<Building2 size={19} />}
                  color="blue"
                />

                <FeatureTile
                  label="Water Bodies"
                  value={waterBodies}
                  icon={<Droplets size={19} />}
                  color="cyan"
                />

                <FeatureTile
                  label="Vegetation"
                  value={`${Math.abs(vegetation)}%`}
                  icon={<Leaf size={19} />}
                  color="green"
                  note={
                    vegetation < 0
                      ? 'Reduced'
                      : vegetation > 0
                        ? 'Detected'
                        : ''
                  }
                />
              </div>
            </div>

            {/* AI INSIGHT — INSIDE MAIN CARD */}
            {(result.summary ||
              result.description ||
              result.insight ||
              result.explanation) && (
              <div className="sq-result__insight">
                <div className="sq-result__insight-header">
                  <span className="sq-result__insight-icon">
                    <Sparkles size={14} />
                  </span>

                  <span>AI-Generated Insight</span>
                </div>

                <p className="sq-result__insight-text">
                  {result.summary ||
                    result.description ||
                    result.insight ||
                    result.explanation}
                </p>
              </div>
            )}

            {/* EXPANDED CONTENT */}
            {isExpanded && (
              <div className="sq-result__expanded-content">
                <div className="sq-result__expanded-divider" />

                <div className="sq-result__report-heading">
                  <Sparkles size={16} />
                  <span>Analysis Report</span>
                </div>

                <div className="sq-result__report-grid">
                  <ReportItem
                    label="Confidence"
                    value={`${confidence.toFixed(1)}%`}
                  />

                  <ReportItem
                    label="Buildings Detected"
                    value={buildings}
                  />

                  <ReportItem
                    label="Water Bodies"
                    value={waterBodies}
                  />

                  <ReportItem
                    label="Vegetation Coverage"
                    value={`${Math.abs(vegetation)}%`}
                  />
                </div>

                {result.details && (
                  <div className="sq-result__details">
                    <p className="sq-result__section-label">
                      Detailed Intelligence
                    </p>

                    <p className="sq-result__details-text">
                      {result.details}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


/* -------------------------------------------------------
   Loading Step
------------------------------------------------------- */

function LoadingStep({ label, done, active }) {
  return (
    <div
      className={`sq-loading-step ${
        active
          ? 'sq-loading-step--active'
          : ''
      } ${
        done
          ? 'sq-loading-step--done'
          : ''
      }`}
    >
      <span
        className="sq-loading-step__dot"
        aria-hidden="true"
      />

      <span className="sq-loading-step__label">
        {label}
      </span>
    </div>
  );
}


/* -------------------------------------------------------
   Meta Chip
------------------------------------------------------- */

function MetaChip({
  label,
  value,
  icon,
  highlight,
}) {
  return (
    <div
      className={`sq-meta-chip ${
        highlight
          ? 'sq-meta-chip--highlight'
          : ''
      }`}
    >
      {icon && (
        <span className="sq-meta-chip__icon">
          {icon}
        </span>
      )}

      <div>
        <span className="sq-meta-chip__label">
          {label}
        </span>

        <span className="sq-meta-chip__value">
          {value}
        </span>
      </div>
    </div>
  );
}


/* -------------------------------------------------------
   Feature Tile
------------------------------------------------------- */

function FeatureTile({
  label,
  value,
  icon,
  color,
  note,
}) {
  return (
    <div
      className={`sq-feature-tile sq-feature-tile--${color}`}
    >
      <span className="sq-feature-tile__icon">
        {icon}
      </span>

      <span className="sq-feature-tile__value">
        {value}
      </span>

      <span className="sq-feature-tile__label">
        {label}
      </span>

      {note && (
        <span className="sq-feature-tile__note">
          {note}
        </span>
      )}
    </div>
  );
}


/* -------------------------------------------------------
   Report Item
------------------------------------------------------- */

function ReportItem({ label, value }) {
  return (
    <div className="sq-report-item">
      <span className="sq-report-item__label">
        {label}
      </span>

      <span className="sq-report-item__value">
        {value}
      </span>
    </div>
  );
}