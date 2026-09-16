import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, CheckCircle, AlertCircle, Plus, Minus } from 'lucide-react';
import './ImageUploader.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/tiff'];
const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `Invalid file type. Supported: JPG, PNG, TIFF.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

function SingleUploader({ label, image, onFile, onRemove, id }) {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = useCallback((file) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    onFile({ file, url });
  }, [onFile]);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const openPicker = () => fileInputRef.current?.click();

  return (
    <div className="sq-uploader">
      {label && <p className="sq-uploader__label">{label}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.tif,.tiff"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
        style={{ display: 'none' }}
        id={id}
      />

      {!image ? (
        <div
          className={`sq-uploader__zone ${dragging ? 'sq-uploader__zone--dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openPicker}
          role="button"
          tabIndex={0}
          aria-label="Upload image — click or drag and drop"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
        >
          <div className="sq-uploader__icon-wrap" aria-hidden="true">
            <Upload size={24} />
          </div>
          <p className="sq-uploader__main-text">
            Drag &amp; drop an image here<br />
            <span className="sq-uploader__or">or click to browse</span>
          </p>
          <p className="sq-uploader__hint">Supports JPG, PNG, TIFF (Max {MAX_SIZE_MB}MB)</p>
        </div>
      ) : (
        <div className="sq-uploader__preview">
          <img
            src={image.url}
            alt={`Uploaded: ${image.file.name}`}
            className="sq-uploader__img"
          />
          <div className="sq-uploader__preview-overlay">
            <span className="sq-uploader__preview-name">{image.file.name}</span>
            <div className="sq-uploader__preview-actions">
              <span className="sq-uploader__success">
                <CheckCircle size={12} /> Loaded
              </span>
              <button
                type="button"
                className="sq-uploader__remove-btn"
                onClick={onRemove}
                aria-label="Remove uploaded image"
              >
                <X size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="sq-uploader__error" role="alert">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

/**
 * ImageUploader — Handles single or dual image upload with drag-and-drop
 */
export default function ImageUploader({ twoImageMode, image, secondImage, onImage, onSecondImage }) {
  return (
    <div className="sq-image-uploader">
      <div className="sq-image-uploader__header">
        <Image size={14} aria-hidden="true" />
        <span>Upload Image {twoImageMode ? '(Image 1)' : '(Optional)'}</span>
      </div>

      <SingleUploader
        id="image-upload-1"
        image={image}
        onFile={onImage}
        onRemove={() => onImage(null)}
      />

      {twoImageMode && (
        <>
          <div className="sq-image-uploader__divider">
            <span>Image 2 — For Comparison</span>
          </div>
          <SingleUploader
            id="image-upload-2"
            image={secondImage}
            onFile={onSecondImage}
            onRemove={() => onSecondImage(null)}
          />
        </>
      )}
    </div>
  );
}
