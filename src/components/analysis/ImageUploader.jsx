import React, {
  useState,
  useRef,
  useCallback,
} from 'react';

import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import './ImageUploader.css';


const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/tiff',
];

const MAX_SIZE_MB = 20;

const MAX_SIZE_BYTES =
  MAX_SIZE_MB * 1024 * 1024;


function validateFile(file) {

  if (!ACCEPTED_TYPES.includes(file.type)) {

    return 'Invalid file type. Supported: JPG, PNG, TIFF.';
  }


  if (file.size > MAX_SIZE_BYTES) {

    return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
  }


  return null;
}


export default function ImageUploader({
  images,
  onImagesChange,
}) {

  const fileInputRef = useRef(null);

  const [dragging, setDragging] =
    useState(false);

  const [error, setError] =
    useState('');


  /* =====================================================
     PROCESS MULTIPLE FILES
     ===================================================== */

  const processFiles = useCallback(
    (fileList) => {

      const files = Array.from(fileList || []);

      if (!files.length) return;


      const validImages = [];

      const errors = [];


      files.forEach((file) => {

        const validationError =
          validateFile(file);

        if (validationError) {

          errors.push(
            `${file.name}: ${validationError}`
          );

          return;
        }


        validImages.push({
          file,
          url: URL.createObjectURL(file),
        });

      });


      if (errors.length) {

        setError(
          errors.join(' ')
        );

      } else {

        setError('');
      }


      if (!validImages.length) return;


      /*
        ADD the newly selected images
        instead of replacing the old ones.
      */

      onImagesChange([
        ...images,
        ...validImages,
      ]);

    },
    [images, onImagesChange]
  );


  /* =====================================================
     FILE PICKER
     ===================================================== */

  const handleInputChange = (e) => {

    processFiles(e.target.files);

    /*
      Allows selecting the same files again.
    */

    e.target.value = '';
  };


  /* =====================================================
     DRAG & DROP
     ===================================================== */

  const handleDrop = useCallback(
    (e) => {

      e.preventDefault();

      setDragging(false);

      processFiles(
        e.dataTransfer.files
      );

    },
    [processFiles]
  );


  const handleDragOver = (e) => {

    e.preventDefault();

    setDragging(true);
  };


  const handleDragLeave = () => {

    setDragging(false);
  };


  /* =====================================================
     REMOVE IMAGE
     ===================================================== */

  const removeImage = (index) => {

    const imageToRemove =
      images[index];

    if (imageToRemove?.url) {

      URL.revokeObjectURL(
        imageToRemove.url
      );
    }


    onImagesChange(
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };


  /* =====================================================
     CLEAR ALL
     ===================================================== */

  const clearAll = () => {

    images.forEach((image) => {

      if (image.url) {
        URL.revokeObjectURL(
          image.url
        );
      }

    });

    onImagesChange([]);

    setError('');
  };


  return (
    <div className="sq-image-uploader">


      {/* =================================================
          HEADER
          ================================================= */}

      <div className="sq-image-uploader__header">

        <ImageIcon
          size={14}
          aria-hidden="true"
        />

        <span>
          Satellite Imagery
        </span>

        {images.length > 0 && (

          <span className="sq-image-uploader__count">
            {images.length}{' '}
            {images.length === 1
              ? 'Image'
              : 'Images'}
          </span>

        )}

      </div>


      {/* =================================================
          UPLOAD ZONE
          ================================================= */}

      <input
        ref={fileInputRef}
        type="file"

        accept=".jpg,.jpeg,.png,.tif,.tiff"

        multiple

        onChange={handleInputChange}

        aria-hidden="true"

        tabIndex={-1}

        style={{
          display: 'none',
        }}

        id="image-upload-multiple"
      />


      <div
        className={`sq-uploader__zone ${
          dragging
            ? 'sq-uploader__zone--dragging'
            : ''
        } ${
          images.length
            ? 'sq-uploader__zone--compact'
            : ''
        }`}

        onDrop={handleDrop}

        onDragOver={handleDragOver}

        onDragLeave={handleDragLeave}

        onClick={() =>
          fileInputRef.current?.click()
        }

        role="button"

        tabIndex={0}

        aria-label="Upload multiple satellite images"
        onKeyDown={(e) => {

          if (
            e.key === 'Enter' ||
            e.key === ' '
          ) {

            e.preventDefault();

            fileInputRef.current?.click();
          }

        }}
      >

        <div
          className="sq-uploader__icon-wrap"
          aria-hidden="true"
        >
          <Upload size={22} />
        </div>


        <p className="sq-uploader__main-text">

          {images.length
            ? 'Add more satellite images'
            : 'Drag & drop satellite images here'}

          <br />

          <span className="sq-uploader__or">
            or click to browse
          </span>

        </p>


        <p className="sq-uploader__hint">

          Multiple JPG, PNG, TIFF · Max{' '}
          {MAX_SIZE_MB}MB each

        </p>

      </div>


      {/* =================================================
          IMAGE LIST
          ================================================= */}

      {images.length > 0 && (

        <div className="sq-image-uploader__list">

          {images.map((image, index) => (

            <div
              key={`${image.file.name}-${index}`}
              className="sq-image-uploader__item"
            >

              <div className="sq-image-uploader__thumb">

                <img
                  src={image.url}
                  alt={`Satellite image ${index + 1}`}
                />

              </div>


              <div className="sq-image-uploader__item-info">

                <span className="sq-image-uploader__item-number">
                  {index + 1}
                </span>

                <div className="sq-image-uploader__item-text">

                  <span className="sq-image-uploader__item-name">
                    {image.file.name}
                  </span>

                  <span className="sq-image-uploader__item-size">
                    {(image.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>

                </div>

              </div>


              <span className="sq-image-uploader__loaded">

                <CheckCircle size={11} />

                Loaded

              </span>


              <button
                type="button"
                className="sq-image-uploader__remove-btn"
                onClick={() =>
                  removeImage(index)
                }
                aria-label={`Remove image ${index + 1}`}
                title="Remove image"
              >

                <X size={13} />

              </button>

            </div>

          ))}


          {/* CLEAR */}

          <button
            type="button"
            className="sq-image-uploader__clear"
            onClick={clearAll}
          >
            Remove all images
          </button>

        </div>

      )}


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <p
          className="sq-uploader__error"
          role="alert"
        >

          <AlertCircle size={13} />

          {error}

        </p>

      )}

    </div>
  );
}