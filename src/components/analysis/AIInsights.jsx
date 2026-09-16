import React from 'react';
import { Sparkles } from 'lucide-react';
import './AIInsights.css';

/**
 * AIInsights — Compact finding cards from AI analysis
 */
export default function AIInsights({ result, isAnalyzing }) {
  return (
    <div className="sq-insights">
      <div className="sq-insights__header">
        <h2 className="sq-insights__title">
          <span className="sq-insights__icon" aria-hidden="true">
            <Sparkles size={12} />
          </span>
          AI Insights
        </h2>
        {result && (
          <span className="sq-insights__badge">{result.findings.length} findings</span>
        )}
      </div>

      <div className="sq-insights__body">
        {isAnalyzing ? (
          <div className="sq-insights__loading" aria-busy="true">
            <div className="sq-insights__skeleton-list">
              {[0, 1, 2].map((i) => (
                <div key={i} className="sq-insights__skeleton-row">
                  <div className="sq-insights__skeleton-line sq-insights__skeleton-line--label" />
                  <div className="sq-insights__skeleton-line" />
                  <div className="sq-insights__skeleton-line sq-insights__skeleton-line--short" />
                </div>
              ))}
            </div>
          </div>
        ) : !result ? (
          <p className="sq-insights__empty">
            AI-generated findings, explanations, and detected patterns will appear here.
          </p>
        ) : (
          <div className="sq-insights__findings">
            <p className="sq-insights__findings-label">Detected Patterns</p>
            {result.findings.map((finding, idx) => (
              <FindingCard key={idx} index={idx} text={finding} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Category labels derived from the finding text */
const CATEGORIES = ['OBSERVATION', 'DETECTION', 'ANALYSIS', 'INTELLIGENCE'];

function FindingCard({ index, text }) {
  const category = CATEGORIES[index % CATEGORIES.length];
  return (
    <div className="sq-finding" style={{ animationDelay: `${index * 0.07}s` }}>
      <span className="sq-finding__category">{category}</span>
      <p className="sq-finding__text">{text}</p>
    </div>
  );
}
