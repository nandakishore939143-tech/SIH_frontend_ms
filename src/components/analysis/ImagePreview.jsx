import React, {
  useState,
  lazy,
  Suspense,
  useEffect,
} from 'react';

import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Columns,
} from 'lucide-react';

import './ImagePreview.css';


const AnalysisScanner = lazy(
  () => import('../3d/AnalysisScanner')
);


const DETECTION_OVERLAYS = [
  {
    label: 'BUILDINGS',
    conf: '94%',
    top: '22%',
    left: '18%',
  },
  {
    label: 'WATER',
    conf: '91%',
    top: '58%',
    left: '62%',
  },
  {
    label: 'VEGETATION',
    conf: '87%',
    top: '38%',
    left: '72%',
  },
];


export default function ImagePreview({
  images,
  activeImageIndex,
  onActiveImageChange,
  twoImageMode,
  isAnalyzing,
  analysisResult,
}) {

  const [zoom, setZoom] =
    useState(1);

  const [fullscreen, setFullscreen] =
    useState(false);

  const [compareMode, setCompareMode] =
    useState('sideBySide');

  const [overlayOpacity, setOverlayOpacity] =
    useState(0.5);


  /* =====================================================
     CURRENT IMAGE
     ===================================================== */

  const currentImage =
    images[activeImageIndex];


  const hasImages =
    images.length > 0;


  const hasMultipleImages =
    images.length > 1;


  const showDetections =
    hasImages &&
    !!analysisResult &&
    !isAnalyzing;


  /* =====================================================
     LOOPING NAVIGATION
     ===================================================== */

  const goNext = () => {

    if (!images.length) return;

    const nextIndex =
      (activeImageIndex + 1) %
      images.length;

    onActiveImageChange(nextIndex);

    /*
      Reset zoom when switching images.
    */

    setZoom(1);
  };


  const goPrevious = () => {

    if (!images.length) return;

    const previousIndex =
      (activeImageIndex - 1 + images.length) %
      images.length;

    onActiveImageChange(previousIndex);

    setZoom(1);
  };


  const selectImage = (index) => {

    onActiveImageChange(index);

    setZoom(1);
  };


  /* =====================================================
     KEYBOARD NAVIGATION
     ===================================================== */

  useEffect(() => {

    if (!hasMultipleImages) return;

    const handleKeyDown = (e) => {

      /*
        Don't hijack keyboard input
        while typing into inputs.
      */

      const tag =
        document.activeElement?.tagName;

      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA'
      ) {
        return;
      }


      if (e.key === 'ArrowRight') {

        e.preventDefault();

        goNext();
      }


      if (e.key === 'ArrowLeft') {

        e.preventDefault();

        goPrevious();
      }

    };


    document.addEventListener(
      'keydown',
      handleKeyDown
    );


    return () => {

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

    };

  }, [
    hasMultipleImages,
    activeImageIndex,
    images.length,
  ]);


  /* =====================================================
     ZOOM
     ===================================================== */

  const handleZoomIn = () => {

    setZoom((value) =>
      Math.min(
        value + 0.25,
        4
      )
    );
  };


  const handleZoomOut = () => {

    setZoom((value) =>
      Math.max(
        value - 0.25,
        0.25
      )
    );
  };


  const handleReset = () => {

    setZoom(1);
  };


  /* =====================================================
     FULLSCREEN
     ===================================================== */

  const openFullscreen = () => {

    if (!currentImage) return;

    setFullscreen(true);
  };


  const closeFullscreen = () => {

    setFullscreen(false);
  };


  useEffect(() => {

    if (!fullscreen) return;


    const handleEscape = (e) => {

      if (e.key === 'Escape') {

        setFullscreen(false);
      }

    };


    document.addEventListener(
      'keydown',
      handleEscape
    );


    document.body.style.overflow =
      'hidden';


    return () => {

      document.removeEventListener(
        'keydown',
        handleEscape
      );

      document.body.style.overflow =
        '';

    };

  }, [fullscreen]);


  /* =====================================================
     STATUS
     ===================================================== */

  const statusLabel =
    isAnalyzing
      ? 'ANALYZING'
      : analysisResult
        ? 'COMPLETE'
        : hasImages
          ? 'READY'
          : 'AWAITING IMAGE';


  /* =====================================================
     NO IMAGE
     ===================================================== */

  if (!hasImages) {

    return (
      <div className="sq-preview">

        <div className="sq-preview__header">

          <div className="sq-preview__title-row">

            <h2 className="sq-preview__title">
              Satellite View
            </h2>

            <span className="sq-preview__status sq-preview__status--ready">

              <span className="sq-preview__status-dot" />

              AWAITING IMAGE

            </span>

          </div>

        </div>


        <div className="sq-preview__canvas">

          <Suspense
            fallback={
              <div className="sq-preview__placeholder">

                <div className="sq-preview__placeholder-icon">

                  <div className="sq-preview__radar" />

                  <div className="sq-preview__radar sq-preview__radar--2" />

                  <div className="sq-preview__radar sq-preview__radar--3" />

                </div>

                <p className="sq-preview__placeholder-title">
                  Upload Satellite Imagery
                </p>

                <p className="sq-preview__placeholder-hint">
                  Upload one or more images to begin.
                </p>

              </div>
            }
          >

            <AnalysisScanner />

          </Suspense>

        </div>

      </div>
    );
  }


  /* =====================================================
     SECOND IMAGE FOR COMPARISON
     ===================================================== */

  const comparisonImage =
    twoImageMode && images.length > 1
      ? images[
          (activeImageIndex + 1) %
          images.length
        ]
      : null;


  return (
    <>

      {/* =================================================
          NORMAL VIEW
          ================================================= */}

      <div className="sq-preview">


        {/* =================================================
            HEADER
            ================================================= */}

        <div className="sq-preview__header">

          <div className="sq-preview__title-row">

            <h2 className="sq-preview__title">
              Satellite View
            </h2>


            <span
              className={`sq-preview__status ${
                isAnalyzing
                  ? 'sq-preview__status--analyzing'
                  : analysisResult
                    ? 'sq-preview__status--complete'
                    : 'sq-preview__status--ready'
              }`}
            >

              <span className="sq-preview__status-dot" />

              {statusLabel}

            </span>

          </div>


          {/* CONTROLS */}

          <div className="sq-preview__controls">

            <button
              type="button"
              className="sq-preview__ctrl-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>


            <button
              type="button"
              className="sq-preview__ctrl-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 0.25}
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>


            <button
              type="button"
              className="sq-preview__ctrl-btn"
              onClick={handleReset}
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw size={14} />
            </button>


            <button
              type="button"
              className="sq-preview__ctrl-btn"
              onClick={openFullscreen}
              title="Open fullscreen"
              aria-label="Open image fullscreen"
            >
              <Maximize2 size={14} />
            </button>

          </div>

        </div>


        {/* =================================================
            IMAGE SWITCHER
            ================================================= */}

        {hasMultipleImages && (

          <div className="sq-preview__image-switcher">

            {/* PREVIOUS */}

            <button
              type="button"
              className="sq-preview__nav-btn"
              onClick={goPrevious}
              aria-label="Previous image"
              title="Previous image"
            >

              <ChevronLeft size={15} />

            </button>


            {/* NUMBER BUTTONS */}

            <div className="sq-preview__image-buttons">

              {images.map((_, index) => (

                <button
                  key={index}
                  type="button"

                  className={`sq-preview__image-number ${
                    index === activeImageIndex
                      ? 'sq-preview__image-number--active'
                      : ''
                  }`}

                  onClick={() =>
                    selectImage(index)
                  }

                  aria-label={`Show image ${index + 1}`}

                  aria-current={
                    index === activeImageIndex
                      ? 'true'
                      : undefined
                  }

                  title={`Image ${index + 1}`}
                >

                  {index + 1}

                </button>

              ))}

            </div>


            {/* NEXT */}

            <button
              type="button"
              className="sq-preview__nav-btn"
              onClick={goNext}
              aria-label="Next image"
              title="Next image"
            >

              <ChevronRight size={15} />

            </button>

          </div>

        )}


        {/* =================================================
            IMAGE INFO BAR
            ================================================= */}

        <div className="sq-preview__image-info">

          <span>
            Image {activeImageIndex + 1}
            {' / '}
            {images.length}
          </span>

          <span className="sq-preview__image-info-name">
            {currentImage.file.name}
          </span>

        </div>


        {/* =================================================
            COMPARISON
            ================================================= */}

        {twoImageMode &&
          comparisonImage && (

          <div className="sq-preview__compare-bar">

            <button
              type="button"
              className={`sq-preview__compare-btn ${
                compareMode === 'sideBySide'
                  ? 'sq-preview__compare-btn--active'
                  : ''
              }`}
              onClick={() =>
                setCompareMode(
                  'sideBySide'
                )
              }
            >

              <Columns size={13} />

              Compare

            </button>


            <button
              type="button"
              className={`sq-preview__compare-btn ${
                compareMode === 'overlay'
                  ? 'sq-preview__compare-btn--active'
                  : ''
              }`}
              onClick={() =>
                setCompareMode(
                  'overlay'
                )
              }
            >

              <Layers size={13} />

              Overlay

            </button>

          </div>

        )}


        {/* =================================================
            CANVAS
            ================================================= */}

        <div className="sq-preview__canvas">

          {twoImageMode &&
          comparisonImage &&
          compareMode === 'sideBySide' ? (

            <div className="sq-preview__side-by-side">

              <div className="sq-preview__side">

                <span className="sq-preview__side-label">
                  Image {activeImageIndex + 1}
                </span>

                <div
                  className="sq-preview__img-wrap"
                  style={{
                    '--zoom': zoom,
                  }}
                >

                  <img
                    src={currentImage.url}
                    alt={`Satellite image ${
                      activeImageIndex + 1
                    }`}
                    className="sq-preview__img"
                  />

                </div>

              </div>


              <div className="sq-preview__divider-line" />


              <div className="sq-preview__side">

                <span className="sq-preview__side-label">
                  Image {
                    (
                      activeImageIndex + 1
                    ) %
                    images.length + 1
                  }
                </span>

                <div
                  className="sq-preview__img-wrap"
                  style={{
                    '--zoom': zoom,
                  }}
                >

                  <img
                    src={comparisonImage.url}
                    alt="Comparison satellite image"
                    className="sq-preview__img"
                  />

                </div>

              </div>

            </div>

          ) : twoImageMode &&
            comparisonImage &&
            compareMode === 'overlay' ? (

            <div
              className="sq-preview__overlay-wrap"
              style={{
                '--zoom': zoom,
              }}
            >

              <img
                src={currentImage.url}
                alt="Base satellite image"
                className="sq-preview__img sq-preview__img--base"
              />

              <img
                src={comparisonImage.url}
                alt="Comparison satellite image"
                className="sq-preview__img sq-preview__img--overlay"
                style={{
                  opacity: overlayOpacity,
                }}
              />


              <div className="sq-preview__opacity-ctrl">

                <span className="sq-preview__opacity-label">
                  Opacity
                </span>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) =>
                    setOverlayOpacity(
                      Number(e.target.value)
                    )
                  }
                  className="sq-preview__slider"
                />

                <span className="sq-preview__opacity-value">
                  {Math.round(
                    overlayOpacity * 100
                  )}%
                </span>

              </div>

            </div>

          ) : (

            <div
              className="sq-preview__img-wrap"
              style={{
                '--zoom': zoom,
              }}
            >

              <img
                src={currentImage.url}
                alt={`Uploaded satellite image ${
                  activeImageIndex + 1
                }`}
                className="sq-preview__img"
              />


              {isAnalyzing && (

                <div
                  className="sq-preview__analyzing-overlay"
                  aria-live="polite"
                >

                  <div className="sq-preview__scan-line" />

                  <div className="sq-preview__analyzing-content">

                    <div className="sq-preview__analyzing-spinner" />

                    <span className="sq-preview__analyzing-text">
                      Analyzing Satellite Imagery
                    </span>

                  </div>

                </div>

              )}


              {showDetections && (

                <div
                  className="sq-preview__detection-overlay"
                  aria-hidden="true"
                >

                  {DETECTION_OVERLAYS.map((d) => (

                    <div
                      key={d.label}
                      className="sq-preview__detection-label"
                      style={{
                        top: d.top,
                        left: d.left,
                      }}
                    >

                      <span className="sq-preview__detection-name">
                        {d.label}
                      </span>

                      <span className="sq-preview__detection-conf">
                        {d.conf}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )}

        </div>


        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="sq-preview__footer">

          <span className="sq-preview__zoom-label">
            Zoom: {Math.round(zoom * 100)}%
          </span>


          <span className="sq-preview__file-info">

            {currentImage.file.name}

            {' · '}

            {(
              currentImage.file.size /
              1024 /
              1024
            ).toFixed(2)} MB

          </span>

        </div>

      </div>


      {/* =================================================
          FULLSCREEN
          ================================================= */}

      {fullscreen && (

        <div
          className="sq-fullscreen-viewer"
          role="dialog"
          aria-modal="true"
        >

          <div className="sq-fullscreen-viewer__header">

            <div className="sq-fullscreen-viewer__title">

              <span className="sq-fullscreen-viewer__dot" />

              Satellite Image

              <span className="sq-fullscreen-viewer__zoom">

                Image {activeImageIndex + 1}
                {' / '}
                {images.length}

                {' · '}

                {Math.round(zoom * 100)}%

              </span>

            </div>


            <button
              type="button"
              className="sq-fullscreen-viewer__close"
              onClick={closeFullscreen}
              title="Close fullscreen"
              aria-label="Close fullscreen"
            >

              <X size={20} />

            </button>

          </div>


          {/* FULLSCREEN IMAGE SWITCHER */}

          {hasMultipleImages && (

            <div className="sq-fullscreen-viewer__switcher">

              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous image"
              >

                <ChevronLeft size={17} />

              </button>


              {images.map((_, index) => (

                <button
                  key={index}
                  type="button"

                  className={
                    index === activeImageIndex
                      ? 'active'
                      : ''
                  }

                  onClick={() =>
                    selectImage(index)
                  }
                >

                  {index + 1}

                </button>

              ))}


              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
              >

                <ChevronRight size={17} />

              </button>

            </div>

          )}


          {/* FULLSCREEN CONTROLS */}

          <div className="sq-fullscreen-viewer__controls">

            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.25}
              title="Zoom out"
            >
              <ZoomOut size={17} />
            </button>


            <button
              type="button"
              onClick={handleReset}
              title="Reset zoom"
            >
              <RotateCcw size={16} />
            </button>


            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              title="Zoom in"
            >
              <ZoomIn size={17} />
            </button>

          </div>


          {/* FULLSCREEN CANVAS */}

          <div className="sq-fullscreen-viewer__canvas">

            <div
              className="sq-fullscreen-viewer__image-wrap"
              style={{
                '--zoom': zoom,
              }}
            >

              <img
                src={currentImage.url}
                alt={`Fullscreen satellite image ${
                  activeImageIndex + 1
                }`}
                className="sq-fullscreen-viewer__image"
              />

            </div>

          </div>


          <div className="sq-fullscreen-viewer__footer">

            <span>
              Scroll to explore enlarged imagery
            </span>

            <span>
              Press <strong>ESC</strong> to close
            </span>

          </div>

        </div>

      )}

    </>
  );
}