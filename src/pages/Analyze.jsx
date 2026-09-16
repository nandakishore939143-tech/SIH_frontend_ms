import React, { useState, useCallback } from 'react';
import QueryPanel from '../components/analysis/QueryPanel';
import ImagePreview from '../components/analysis/ImagePreview';
import AnalysisResult from '../components/analysis/AnalysisResult';
import AIInsights from '../components/analysis/AIInsights';
import ModelInformation from '../components/analysis/ModelInformation';
import FollowUp from '../components/analysis/FollowUp';
import ExampleQueries from '../components/analysis/ExampleQueries';
import './Analyze.css';

/**
 * Analyze — AI Intelligence Workspace (three-column layout)
 * Communicates ASK → ANALYZE → UNDERSTAND → ACT
 */
export default function Analyze() {
  const [query,       setQuery]       = useState('');
  const [twoImageMode,setTwoImageMode]= useState(false);
  const [image,       setImage]       = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing,    setIsAnalyzing]    = useState(false);

  const handleResult   = useCallback((r) => setAnalysisResult(r), []);
  const handleAnalyzing = useCallback((analyzing) => {
    setIsAnalyzing(analyzing);
    if (analyzing) setAnalysisResult(null);
  }, []);

  const handleExampleSelect = useCallback((exampleQuery, enableTwoImage) => {
    setQuery(exampleQuery);
    if (enableTwoImage) setTwoImageMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* Flow step states for UI indicator */
  const flowSteps = [
    { label: 'ASK',       active: true },
    { label: 'ANALYZE',   active: isAnalyzing || !!analysisResult },
    { label: 'UNDERSTAND',active: !!analysisResult },
    { label: 'ACT',       active: !!analysisResult },
  ];

  return (
    <div className="analyze-page">
      {/* Workspace header with ASK→ACT flow indicator */}
      <div className="analyze-page__header">
        <span className="analyze-page__title">Intelligence Workspace</span>
        <div className="analyze-page__flow" aria-label="Workflow progress">
          {flowSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <span
                className={`analyze-page__flow-step ${step.active ? 'analyze-page__flow-step--active' : ''}`}
              >
                {step.label}
              </span>
              {i < flowSteps.length - 1 && (
                <span className="analyze-page__flow-arrow" aria-hidden="true">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Three-column workspace */}
      <div className="analyze-workspace">
        {/* Column 1 — ASK */}
        <div className="analyze-col analyze-col--query">
          <QueryPanel
            onResult={handleResult}
            onAnalyzing={handleAnalyzing}
            query={query}
            setQuery={setQuery}
            twoImageMode={twoImageMode}
            setTwoImageMode={setTwoImageMode}
            image={image}
            setImage={setImage}
            secondImage={secondImage}
            setSecondImage={setSecondImage}
          />
        </div>

        {/* Column 2 — ANALYZE */}
        <div className="analyze-col analyze-col--preview">
          <ImagePreview
            image={image}
            secondImage={secondImage}
            twoImageMode={twoImageMode}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Column 3 — UNDERSTAND + ACT */}
        <div className="analyze-col analyze-col--results">
          <AnalysisResult result={analysisResult} isAnalyzing={isAnalyzing} />
          <AIInsights     result={analysisResult} isAnalyzing={isAnalyzing} />
          <ModelInformation result={analysisResult} isAnalyzing={isAnalyzing} />
          <FollowUp analysisResult={analysisResult} />
        </div>
      </div>

      {/* Example queries below workspace */}
      <div className="analyze-examples-section">
        <ExampleQueries onSelect={handleExampleSelect} />
      </div>
    </div>
  );
}
