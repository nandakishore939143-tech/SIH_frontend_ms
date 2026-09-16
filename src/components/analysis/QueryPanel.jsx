import React, { useState, useCallback } from 'react';

import {
  Sparkles,
  AlertCircle,
  Send,
} from 'lucide-react';

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


export default function QueryPanel({

  onResult,
  onAnalyzing,

  query,
  setQuery,

  twoImageMode,
  setTwoImageMode,

  images,
  setImages,

  activeImageIndex,

}) {

  const [options, setOptions] =
    useState(DEFAULT_OPTIONS);

  const [isLoading, setIsLoading] =
    useState(false);

  const [queryError, setQueryError] =
    useState('');

  const [showExamples, setShowExamples] =
    useState(false);


  /* =====================================================
     ANALYZE
     ===================================================== */

  const handleAnalyze = useCallback(async () => {

    if (!query.trim()) {

      setQueryError(
        'Enter a question to begin analysis.'
      );

      return;
    }


    if (!images.length) {

      setQueryError(
        'Upload at least one satellite image.'
      );

      return;
    }


    setQueryError('');

    setIsLoading(true);

    onAnalyzing(true);


    try {

      const primaryImage =
        images[activeImageIndex] || images[0];


      /*
        For two-image mode:

        Current image = Image A

        Next image = Image B

        Example:

        1 → 2
        2 → 3
        3 → 4
        4 → 1
      */

      let comparisonImage = null;


      if (
        twoImageMode &&
        images.length >= 2
      ) {

        const nextIndex =
          (activeImageIndex + 1) %
          images.length;

        comparisonImage =
          images[nextIndex];

      }


      const result = await analyzeImage(
        query,
        primaryImage,
        comparisonImage,
        options
      );


      onResult(result);

    } catch (err) {

      console.error(
        'Analysis failed:',
        err
      );

      onResult(null);

    } finally {

      setIsLoading(false);

      onAnalyzing(false);
    }

  }, [
    query,
    images,
    activeImageIndex,
    twoImageMode,
    options,
    onResult,
    onAnalyzing,
  ]);


  /* =====================================================
     QUERY CHANGE
     ===================================================== */

  const handleQueryChange = (e) => {

    const value = e.target.value;

    if (value.length <= MAX_QUERY_LENGTH) {

      setQuery(value);

      if (value.trim()) {
        setQueryError('');
      }
    }
  };


  /* =====================================================
     EXAMPLE
     ===================================================== */

  const handleExampleSelect = (prompt) => {

    setQuery(prompt);

    setShowExamples(false);

    setQueryError('');
  };


  const charCount = query.length;

  const charPct =
    (charCount / MAX_QUERY_LENGTH) * 100;


  return (
    <div className="sq-query-panel">


      {/* =================================================
          HEADER
          ================================================= */}

      <div className="sq-query-panel__header">

        <div className="sq-query-panel__header-badge">

          <Sparkles size={10} />

          AI Analysis

        </div>


        <h1 className="sq-query-panel__heading">

          Ask{' '}

          <span className="text-blue">
            SatQuery
          </span>

        </h1>


        <p className="sq-query-panel__subtitle">

          Ask a question about your satellite imagery.
          SatQuery AI turns visual data into structured
          intelligence.

        </p>

      </div>


      {/* =================================================
          QUESTION
          ================================================= */}

      <div
        className={`sq-query-panel__card ${
          queryError
            ? 'sq-query-panel__card--error'
            : ''
        }`}
      >

        <div className="sq-query-panel__card-header">

          <span className="sq-query-panel__card-label">
            Your Question
          </span>


          <button
            type="button"
            className="sq-query-panel__examples-btn"
            onClick={() =>
              setShowExamples((value) => !value)
            }
            aria-expanded={showExamples}
          >

            <Sparkles size={10} />

            Examples

          </button>

        </div>


        {showExamples && (

          <div className="sq-query-panel__examples-list">

            {EXAMPLE_PROMPTS.map((prompt) => (

              <button
                key={prompt}
                type="button"
                className="sq-query-panel__example-item"
                onClick={() =>
                  handleExampleSelect(prompt)
                }
              >

                <Sparkles
                  size={10}
                  className="sq-query-panel__example-icon"
                />

                {prompt}

              </button>

            ))}

          </div>

        )}


        <div className="sq-query-panel__textarea-wrap">

          <textarea
            id="query-textarea"
            className="sq-query-panel__textarea"

            placeholder={`Ask a question about the satellite image...\ne.g. "How many buildings are visible in this area?"`}

            value={query}

            onChange={handleQueryChange}

            rows={4}

            maxLength={MAX_QUERY_LENGTH}

            aria-label="Enter your satellite analysis query"

            aria-describedby={
              queryError
                ? 'query-error'
                : 'query-counter'
            }
          />


          <div className="sq-query-panel__textarea-footer">

            {queryError ? (

              <span
                id="query-error"
                className="sq-query-panel__error"
                role="alert"
              >

                <AlertCircle size={12} />

                {queryError}

              </span>

            ) : (
              <span />
            )}


            <div
              className="sq-query-panel__counter"
              id="query-counter"
            >

              <div
                className={`sq-query-panel__counter-bar ${
                  charPct > 85
                    ? 'sq-query-panel__counter-bar--warn'
                    : ''
                }`}
                style={{
                  '--pct': `${charPct}%`,
                }}
                aria-hidden="true"
              />

              <span
                className={
                  charPct > 85
                    ? 'text-warning'
                    : ''
                }
              >
                {charCount}/{MAX_QUERY_LENGTH}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          MULTI IMAGE UPLOADER
          ================================================= */}

      <ImageUploader
        images={images}
        onImagesChange={setImages}
      />


      {/* =================================================
          TWO IMAGE MODE
          ================================================= */}

      <div className="sq-query-panel__toggle-row">

        <Toggle
          id="two-image-toggle"
          checked={twoImageMode}
          onChange={setTwoImageMode}
          label="Compare two images (change detection)"
        />

      </div>


      {/* =================================================
          ADVANCED OPTIONS
          ================================================= */}

      <AdvancedOptions
        options={options}
        onChange={setOptions}
      />


      {/* =================================================
          ANALYZE BUTTON
          ================================================= */}

      <Button
        variant="analyze"
        size="xl"
        id="analyze-btn"
        className="sq-query-panel__analyze-btn"

        loading={isLoading}

        disabled={
          isLoading ||
          images.length === 0
        }

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