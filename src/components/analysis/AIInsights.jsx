import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import './AIInsights.css';

/**
 * AIInsights — Key AI findings from the analysis
 */
export default function AIInsights({ result, isAnalyzing }) {
  return (
    <div className="sq-insights">
      <div className="sq-insights__header">
        <h2 className="sq-insights__title">
          <span className="sq-insights__icon" aria-hidden="true">
            <Sparkles size={14} />
          </span>
          AI Insights
        </h2>
      </div>
      <div className="sq-insights__body">
        {isAnalyzing ? (
          <div className="sq-insights__loading" aria-busy="true">
            <div className="sq-insights__skeleton" />
            <div className="sq-insights__skeleton sq-insights__skeleton--short" />
            <div className="sq-insights__skeleton" />
            <div className="sq-insights__skeleton sq-insights__skeleton--short" />
          </div>
        ) : !result ? (
          <p className="sq-insights__empty">
            Key findings and AI interpretations<br />will appear here after analysis.
          </p>
        ) : (
          <div className="sq-insights__findings">
            <p className="sq-insights__findings-label">Key Findings</p>
            <ul className="sq-insights__list">
              {result.findings.map((finding, idx) => (
                <li key={idx} className="sq-insights__item">
                  <span className="sq-insights__item-bullet" aria-hidden="true">
                    <ArrowRight size={11} />
                  </span>
                  <span className="sq-insights__item-text">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
