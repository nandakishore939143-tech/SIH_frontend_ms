import React, { useState, useCallback } from 'react';

import QueryPanel from '../components/analysis/QueryPanel';
import ImagePreview from '../components/analysis/ImagePreview';
import AnalysisResult from '../components/analysis/AnalysisResult';
import AIInsights from '../components/analysis/AIInsights';
import ModelInformation from '../components/analysis/ModelInformation';
import FollowUp from '../components/analysis/FollowUp';
import ExampleQueries from '../components/analysis/ExampleQueries';

import './Analyze.css';


export default function Analyze() {

  const [query, setQuery] = useState('');

  const [twoImageMode, setTwoImageMode] = useState(false);

  /*
    ALL uploaded images live here.

    Example:

    [
      { file, url },
      { file, url },
      { file, url },
      { file, url }
    ]
  */
  const [images, setImages] = useState([]);

  /*
    Currently selected image in preview.
  */
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [analysisResult, setAnalysisResult] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);


  /* =====================================================
     IMAGE MANAGEMENT
     ===================================================== */

  const handleImagesChange = useCallback((newImages) => {
    setImages(newImages);

    /*
      Keep currently selected image valid.
    */
    setActiveImageIndex((currentIndex) => {
      if (newImages.length === 0) return 0;

      return Math.min(
        currentIndex,
        newImages.length - 1
      );
    });

    /*
      New upload means old analysis should not remain visible.
    */
    setAnalysisResult(null);
  }, []);


  const handleActiveImageChange = useCallback((index) => {
    setActiveImageIndex(index);
  }, []);


  /* =====================================================
     ANALYSIS CALLBACKS
     ===================================================== */

  const handleResult = useCallback((result) => {
    setAnalysisResult(result);
  }, []);


  const handleAnalyzing = useCallback((analyzing) => {
    setIsAnalyzing(analyzing);

    if (analyzing) {
      setAnalysisResult(null);
    }
  }, []);


  /* =====================================================
     EXAMPLE QUERY
     ===================================================== */

  const handleExampleSelect = useCallback(
    (exampleQuery, enableTwoImage) => {

      setQuery(exampleQuery);

      if (enableTwoImage) {
        setTwoImageMode(true);
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    []
  );


  /* =====================================================
     WORKFLOW
     ===================================================== */

  const flowSteps = [
    {
      label: 'ASK',
      active: true,
    },
    {
      label: 'ANALYZE',
      active:
        isAnalyzing ||
        !!analysisResult,
    },
    {
      label: 'UNDERSTAND',
      active: !!analysisResult,
    },
    {
      label: 'ACT',
      active: !!analysisResult,
    },
  ];


  return (
    <div className="analyze-page">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="analyze-page__header">

        <div className="analyze-page__header-left">

          <span className="analyze-page__title">
            Earth Intelligence Workspace
          </span>

          <span className="analyze-page__title-sub">
            Analyze satellite imagery with natural language.
          </span>

        </div>


        <div
          className="analyze-page__flow"
          aria-label="Workflow progress"
        >

          {flowSteps.map((step, i) => (

            <React.Fragment key={step.label}>

              <span
                className={`analyze-page__flow-step ${
                  step.active
                    ? 'analyze-page__flow-step--active'
                    : ''
                }`}
              >
                {step.label}
              </span>

              {i < flowSteps.length - 1 && (
                <span
                  className="analyze-page__flow-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              )}

            </React.Fragment>

          ))}

        </div>

      </div>


      {/* =================================================
          MAIN WORKSPACE
          ================================================= */}

      <div className="analyze-workspace">


        {/* =================================================
            QUERY
            ================================================= */}

        <div className="analyze-col analyze-col--query">

          <QueryPanel
            onResult={handleResult}
            onAnalyzing={handleAnalyzing}

            query={query}
            setQuery={setQuery}

            twoImageMode={twoImageMode}
            setTwoImageMode={setTwoImageMode}

            images={images}
            setImages={handleImagesChange}

            activeImageIndex={activeImageIndex}
          />

        </div>


        {/* =================================================
            IMAGE PREVIEW
            ================================================= */}

        <div className="analyze-col analyze-col--preview">

          <ImagePreview
            images={images}

            activeImageIndex={activeImageIndex}
            onActiveImageChange={handleActiveImageChange}

            twoImageMode={twoImageMode}

            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
          />

        </div>


        {/* =================================================
            RESULTS
            ================================================= */}

        <div className="analyze-col analyze-col--results">

          <AnalysisResult
            result={analysisResult}
            isAnalyzing={isAnalyzing}
          />

          <AIInsights
            result={analysisResult}
            isAnalyzing={isAnalyzing}
          />

          <ModelInformation
            result={analysisResult}
            isAnalyzing={isAnalyzing}
          />

          <FollowUp
            analysisResult={analysisResult}
          />

        </div>

      </div>


      {/* =================================================
          EXAMPLES
          ================================================= */}

      <div className="analyze-examples-section">

        <ExampleQueries
          onSelect={handleExampleSelect}
        />

      </div>

    </div>
  );
}