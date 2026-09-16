import React, { useState, lazy, Suspense } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Layers, Columns } from 'lucide-react';
import './ImagePreview.css';

/* Lazy-load the 3D scanner so it only loads when the Analyze page is opened */
const AnalysisScanner = lazy(() => import('../3d/AnalysisScanner'));

/**
 * ImagePreview — Shows uploaded image with zoom controls, comparison mode for two images
 */
export default function ImagePreview({ image, secondImage, twoImageMode, isAnalyzing }) {
  const [zoom, setZoom] = useState(1);
  const [compareMode, setCompareMode] = useState('sideBySide'); // 'sideBySide' | 'overlay'
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [fullscreen, setFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const handleReset = () => setZoom(1);
  const handleFullscreen = () => setFullscreen((v) => !v);

  const hasImage = !!image;
  const hasBothImages = hasImage && !!secondImage && twoImageMode;

  return (
    <div className={`sq-preview ${fullscreen ? 'sq-preview--fullscreen' : ''}`}>
      <div className="sq-preview__header">
        <h2 className="sq-preview__title">
          <span className="sq-preview__title-icon" aria-hidden="true">◎</span>
          Image Preview
        </h2>

        <div className="sq-preview__controls">
          {hasImage && (
            <>
              <button
                type="button"
                className="sq-preview__ctrl-btn"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                title="Zoom in"
                disabled={zoom >= 4}
                id="preview-zoom-in"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                className="sq-preview__ctrl-btn"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                title="Zoom out"
                disabled={zoom <= 0.25}
                id="preview-zoom-out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                className="sq-preview__ctrl-btn"
                onClick={handleReset}
                aria-label="Reset zoom"
                title="Reset"
                id="preview-reset"
              >
                <RotateCcw size={14} />
              </button>
            </>
          )}
          <button
            type="button"
            className="sq-preview__ctrl-btn"
            onClick={handleFullscreen}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            id="preview-fullscreen"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Comparison mode selector */}
      {hasBothImages && (
        <div className="sq-preview__compare-bar">
          <button
            type="button"
            className={`sq-preview__compare-btn ${compareMode === 'sideBySide' ? 'sq-preview__compare-btn--active' : ''}`}
            onClick={() => setCompareMode('sideBySide')}
            id="compare-side-by-side"
          >
            <Columns size={13} /> Side by Side
          </button>
          <button
            type="button"
            className={`sq-preview__compare-btn ${compareMode === 'overlay' ? 'sq-preview__compare-btn--active' : ''}`}
            onClick={() => setCompareMode('overlay')}
            id="compare-overlay"
          >
            <Layers size={13} /> Overlay
          </button>
        </div>
      )}

      {/* Canvas */}
      <div className="sq-preview__canvas">
        {!hasImage ? (
          <Suspense fallback={
            <div className="sq-preview__placeholder" aria-label="No image uploaded">
              <div className="sq-preview__placeholder-icon" aria-hidden="true">
                <div className="sq-preview__radar" />
                <div className="sq-preview__radar sq-preview__radar--2" />
                <div className="sq-preview__radar sq-preview__radar--3" />
              </div>
              <p className="sq-preview__placeholder-title">Uploaded image will appear here</p>
              <p className="sq-preview__placeholder-hint">
                Start by uploading a satellite image<br />to begin analysis.
              </p>
            </div>
          }>
            <AnalysisScanner />
          </Suspense>
        ) : hasBothImages && compareMode === 'sideBySide' ? (
          <div className="sq-preview__side-by-side">
            <div className="sq-preview__side">
              <span className="sq-preview__side-label">Image 1 — Before</span>
              <div className="sq-preview__img-wrap" style={{ '--zoom': zoom }}>
                <img src={image.url} alt="First uploaded satellite image" className="sq-preview__img" />
              </div>
            </div>
            <div className="sq-preview__divider-line" aria-hidden="true" />
            <div className="sq-preview__side">
              <span className="sq-preview__side-label">Image 2 — After</span>
              <div className="sq-preview__img-wrap" style={{ '--zoom': zoom }}>
                <img src={secondImage.url} alt="Second uploaded satellite image" className="sq-preview__img" />
              </div>
            </div>
          </div>
        ) : hasBothImages && compareMode === 'overlay' ? (
          <div className="sq-preview__overlay-wrap" style={{ '--zoom': zoom }}>
            <img src={image.url} alt="First satellite image (overlay base)" className="sq-preview__img sq-preview__img--base" />
            <img
              src={secondImage.url}
              alt="Second satellite image (overlay)"
              className="sq-preview__img sq-preview__img--overlay"
              style={{ opacity: overlayOpacity }}
            />
            <div className="sq-preview__opacity-ctrl">
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Opacity</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                aria-label="Overlay opacity"
                className="sq-preview__slider"
              />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 30 }}>
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
          </div>
        ) : (
          <div
            className="sq-preview__img-wrap"
            style={{ '--zoom': zoom }}
            aria-label={`Satellite image: ${image.file?.name}`}
          >
            <img
              src={image.url}
              alt={`Uploaded satellite image: ${image.file?.name}`}
              className="sq-preview__img"
            />
            {isAnalyzing && (
              <div className="sq-preview__analyzing-overlay" aria-live="polite">
                <div className="sq-preview__scan-line" aria-hidden="true" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {hasImage && (
        <div className="sq-preview__footer">
          <span className="sq-preview__zoom-label">Zoom: {Math.round(zoom * 100)}%</span>
          {image.file && (
            <span className="sq-preview__file-info">
              {image.file.name} · {(image.file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          )}
        </div>
      )}
    </div>
  );
}
