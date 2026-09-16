import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import './AdvancedOptions.css';

const MODELS = ['SatQuery Vision', 'SatQuery Vision Pro', 'SatQuery Lite'];
const ANALYSIS_TYPES = ['Object Detection', 'Change Detection', 'Vegetation Analysis', 'Water Body Detection', 'Damage Assessment'];
const OUTPUT_FORMATS = ['JSON', 'GeoJSON', 'CSV', 'PDF Report'];

/**
 * AdvancedOptions — Collapsible panel for model/analysis configuration
 */
export default function AdvancedOptions({ options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sq-advanced">
      <button
        type="button"
        className={`sq-advanced__toggle ${open ? 'sq-advanced__toggle--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="advanced-options-panel"
        id="advanced-options-toggle"
      >
        <div className="sq-advanced__toggle-left">
          <SlidersHorizontal size={13} aria-hidden="true" />
          <span>Advanced Options</span>
        </div>
        {open ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
      </button>

      {open && (
        <div className="sq-advanced__panel" id="advanced-options-panel" role="region" aria-label="Advanced options">
          <div className="sq-advanced__grid">
            <SelectField
              id="adv-model"
              label="Model"
              value={options.model}
              options={MODELS}
              onChange={(v) => onChange({ ...options, model: v })}
            />
            <SelectField
              id="adv-analysis-type"
              label="Analysis Type"
              value={options.analysisType}
              options={ANALYSIS_TYPES}
              onChange={(v) => onChange({ ...options, analysisType: v })}
            />
            <div className="sq-advanced__field">
              <label htmlFor="adv-confidence" className="sq-advanced__label">
                Confidence Threshold
                <span className="sq-advanced__value-display">{options.confidenceThreshold}%</span>
              </label>
              <div className="sq-advanced__slider-wrap">
                <input
                  type="range"
                  id="adv-confidence"
                  min="50"
                  max="99"
                  step="1"
                  value={options.confidenceThreshold}
                  onChange={(e) => onChange({ ...options, confidenceThreshold: Number(e.target.value) })}
                  className="sq-advanced__slider"
                  aria-label={`Confidence threshold: ${options.confidenceThreshold}%`}
                />
                <div
                  className="sq-advanced__slider-fill"
                  style={{ width: `${((options.confidenceThreshold - 50) / 49) * 100}%` }}
                />
              </div>
            </div>
            <SelectField
              id="adv-output-format"
              label="Output Format"
              value={options.outputFormat}
              options={OUTPUT_FORMATS}
              onChange={(v) => onChange({ ...options, outputFormat: v })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SelectField({ id, label, value, options, onChange }) {
  return (
    <div className="sq-advanced__field">
      <label htmlFor={id} className="sq-advanced__label">{label}</label>
      <select
        id={id}
        className="sq-advanced__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
