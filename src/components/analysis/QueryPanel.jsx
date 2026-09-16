import React, { useState, useCallback } from 'react';
import { Sparkles, AlertCircle, Send } from 'lucide-react';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';
import AdvancedOptions from './AdvancedOptions';
import { analyzeImage } from '../../services/analysisService';
import './QueryPanel.css';

const MAX_QUERY_LENGTH = 500;

const DEFAULT_OPTIONS = {
  model: 'SatQuery Vision',
  analysisType: 'Object Detection',
  confidenceThreshold: 75,
  outputFormat: 'JSON',
};

const EXAMPLE_PROMPTS = [
  'How many buildings are visible in this image?',
  'Identify water bodies and estimate their area.',
  'Detect changes in vegetation cover between these two images.',
  'Map all road infrastructure visible in this satellite image.',
];

/**
 * QueryPanel — Left column: AI query input, upload, options, analyze button.
 * Image state is lifted to parent (Analyze page) so ImagePreview column can share it.
 */
export default function QueryPanel({
  onResult, onAnalyzing, query, setQuery,
  twoImageMode, setTwoImageMode,
  image, setImage, secondImage, setSecondImage,
}) {
  const [options, setOptions]     = useState(DEFAULT_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [queryError, setQueryError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!query.trim()) {
      setQueryError('Enter a question to begin analysis.');
      return;
    }
    setQueryError('');
    setIsLoading(true);
    onAnalyzing(true);

    try {
      const result = await analyzeImage(
        query, image, twoImageMode ? secondImage : null, options
      );
      onResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      onResult(null);
    } finally {
      setIsLoading(false);
      onAnalyzing(false);
    }
  }, [query, image, secondImage, twoImageMode, options, onResult, onAnalyzing]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_QUERY_LENGTH) {
      setQuery(val);
      if (val.trim()) setQueryError('');
    }
  };

  const handleExampleSelect = (prompt) => {
    setQuery(prompt);
    setShowExamples(false);
    setQueryError('');
  };

  const charCount = query.length;
  const charPct   = (charCount / MAX_QUERY_LENGTH) * 100;

  return (
    <div className="sq-query-panel">
      {/* Header */}
      <div className="sq-query-panel__header">
        <div className="sq-query-panel__header-badge">
          <Sparkles size={11} />
          AI Analysis
        </div>
        <h1 className="sq-query-panel__heading">
          Ask <span className="text-green">SatQuery</span>
        </h1>
        <p className="sq-query-panel__subtitle">
          Type a question in plain language. Upload a satellite image. Get structured intelligence.
        </p>
      </div>

      {/* Query textarea card */}
      <div className={`sq-query-panel__card ${queryError ? 'sq-query-panel__card--error' : ''}`}>
        <div className="sq-query-panel__card-header">
          <span className="sq-query-panel__card-label">Your Question</span>
          <button
            type="button"
            className="sq-query-panel__examples-btn"
            onClick={() => setShowExamples((v) => !v)}
            aria-expanded={showExamples}
          >
            <Sparkles size={11} />
            Examples
          </button>
        </div>

        {/* Example prompts dropdown */}
        {showExamples && (
          <div className="sq-query-panel__examples-list">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="sq-query-panel__example-item"
                onClick={() => handleExampleSelect(prompt)}
              >
                <Sparkles size={10} className="sq-query-panel__example-icon" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="sq-query-panel__textarea-wrap">
          <textarea
            id="query-textarea"
            className="sq-query-panel__textarea"
            placeholder="e.g. &quot;How many buildings are visible and what is the vegetation coverage?&quot;"
            value={query}
            onChange={handleQueryChange}
            rows={4}
            maxLength={MAX_QUERY_LENGTH}
            aria-label="Enter your satellite analysis query"
            aria-describedby={queryError ? 'query-error' : 'query-counter'}
          />
          <div className="sq-query-panel__textarea-footer">
            {queryError ? (
              <span id="query-error" className="sq-query-panel__error" role="alert">
                <AlertCircle size={12} /> {queryError}
              </span>
            ) : (
              <span />
            )}
            <div className="sq-query-panel__counter" id="query-counter">
              <div
                className={`sq-query-panel__counter-bar ${charPct > 85 ? 'sq-query-panel__counter-bar--warn' : ''}`}
                style={{ '--pct': `${charPct}%` }}
                aria-hidden="true"
              />
              <span className={charPct > 85 ? 'text-warning' : ''}>
                {charCount}/{MAX_QUERY_LENGTH}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload */}
      <ImageUploader
        twoImageMode={twoImageMode}
        image={image} secondImage={secondImage}
        onImage={setImage} onSecondImage={setSecondImage}
      />

      {/* Two-image toggle */}
      <div className="sq-query-panel__toggle-row">
        <Toggle
          id="two-image-toggle"
          checked={twoImageMode}
          onChange={setTwoImageMode}
          label="Compare two images (change detection)"
        />
      </div>

      {/* Advanced options */}
      <AdvancedOptions options={options} onChange={setOptions} />

      {/* Analyze button */}
      <Button
        variant="analyze"
        size="xl"
        id="analyze-btn"
        className="sq-query-panel__analyze-btn"
        loading={isLoading}
        disabled={isLoading}
        onClick={handleAnalyze}
        aria-label="Run satellite analysis"
      >
        {isLoading ? (
          'Analyzing…'
        ) : (
          <>
            <Sparkles size={14} />
            Analyze Satellite Image
            <Send size={13} />
          </>
        )}
      </Button>
    </div>
  );
}
