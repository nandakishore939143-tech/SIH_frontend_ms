/**
 * SatQuery AI — Analysis Service
 * 
 * This is the service layer for analysis operations.
 * Currently returns mock data. Replace with real API calls later.
 */

/** @typedef {Object} AnalysisOptions
 * @property {string} model
 * @property {string} analysisType
 * @property {number} confidenceThreshold
 * @property {string} outputFormat
 */

/** @typedef {Object} AnalysisResult
 * @property {string} status
 * @property {number} confidence
 * @property {string} processingTime
 * @property {string} model
 * @property {string} resolution
 * @property {string} analysisType
 * @property {{ buildings: number, waterBodies: number, vegetationCoverage: number }} detectedFeatures
 * @property {string[]} findings
 */

const MOCK_RESULTS = {
  'detect buildings': {
    status: 'completed',
    confidence: 94.2,
    processingTime: '3.1 seconds',
    model: 'SatQuery Vision',
    resolution: '10m',
    analysisType: 'Object Detection',
    detectedFeatures: { buildings: 47, waterBodies: 1, vegetationCoverage: 38 },
    findings: [
      'High-density building clusters detected in the central region.',
      'Residential and commercial zones identified with 94.2% confidence.',
      'Road network spans approximately 12.3 km in the analyzed area.',
    ],
  },
  'find water bodies': {
    status: 'completed',
    confidence: 97.8,
    processingTime: '2.2 seconds',
    model: 'SatQuery Vision',
    resolution: '10m',
    analysisType: 'Water Body Detection',
    detectedFeatures: { buildings: 4, waterBodies: 7, vegetationCoverage: 55 },
    findings: [
      'Seven distinct water bodies identified across the region.',
      'Main water body spans approximately 4.2 sq km.',
      'Seasonal water patterns suggest elevated levels for this period.',
    ],
  },
  'identify vegetation': {
    status: 'completed',
    confidence: 91.5,
    processingTime: '2.5 seconds',
    model: 'SatQuery Vision',
    resolution: '10m',
    analysisType: 'Vegetation Analysis',
    detectedFeatures: { buildings: 12, waterBodies: 2, vegetationCoverage: 73 },
    findings: [
      'Dense vegetation coverage detected across 73% of the analyzed area.',
      'NDVI index indicates healthy, active vegetation in the northern zone.',
      'Deforestation risk areas flagged near the southern boundary.',
    ],
  },
  'show changes': {
    status: 'completed',
    confidence: 89.3,
    processingTime: '4.1 seconds',
    model: 'SatQuery Vision Pro',
    resolution: '10m',
    analysisType: 'Change Detection',
    detectedFeatures: { buildings: 8, waterBodies: 1, vegetationCoverage: -15 },
    findings: [
      'Significant land-use changes detected between the two images.',
      'Urban expansion observed in the western corridor.',
      'Vegetation reduction of approximately 15% over the comparison period.',
    ],
  },
  'detect damaged': {
    status: 'completed',
    confidence: 88.1,
    processingTime: '3.7 seconds',
    model: 'SatQuery Vision Pro',
    resolution: '10m',
    analysisType: 'Damage Assessment',
    detectedFeatures: { buildings: 31, waterBodies: 5, vegetationCoverage: 22 },
    findings: [
      'Widespread flood damage detected across 3 district zones.',
      '31 structures identified as partially or fully compromised.',
      'Emergency access routes remain viable via the northern highway.',
    ],
  },
};

const DEFAULT_RESULT = {
  status: 'completed',
  confidence: 92.4,
  processingTime: '2.8 seconds',
  model: 'SatQuery Vision',
  resolution: '10m',
  analysisType: 'Object Detection',
  detectedFeatures: { buildings: 24, waterBodies: 3, vegetationCoverage: 61 },
  findings: [
    'High vegetation density detected in the northern region.',
    'Several building clusters detected.',
    'A possible water body is visible near the eastern boundary.',
  ],
};

/**
 * Simulate a delay
 * @param {number} ms
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyze satellite image with a query.
 * 
 * @param {string} query - The user's question
 * @param {File|null} image - Primary uploaded image
 * @param {File|null} secondImage - Second image for change detection
 * @param {AnalysisOptions} options - Advanced options
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeImage(query, image, secondImage, options = {}) {
  // Simulate network latency + AI processing time
  const processingMs = 2500 + Math.random() * 1500;
  await delay(processingMs);

  const lowerQuery = query.toLowerCase();

  let result = DEFAULT_RESULT;

  if (lowerQuery.includes('building') || lowerQuery.includes('structure')) {
    result = MOCK_RESULTS['detect buildings'];
  } else if (lowerQuery.includes('water') || lowerQuery.includes('river') || lowerQuery.includes('lake')) {
    result = MOCK_RESULTS['find water bodies'];
  } else if (lowerQuery.includes('vegetation') || lowerQuery.includes('forest') || lowerQuery.includes('green')) {
    result = MOCK_RESULTS['identify vegetation'];
  } else if (lowerQuery.includes('change') || secondImage) {
    result = MOCK_RESULTS['show changes'];
  } else if (lowerQuery.includes('damage') || lowerQuery.includes('flood') || lowerQuery.includes('fire')) {
    result = MOCK_RESULTS['detect damaged'];
  }

  const analysisType = options.analysisType || result.analysisType;
  const finalResult = {
    ...result,
    analysisType,
    model: options.model || result.model,
    confidence: Math.min(99, result.confidence + (Math.random() * 2 - 1)),
    processingTime: `${(processingMs / 1000).toFixed(1)} seconds`,
    timestamp: new Date().toISOString(),
    query,
  };

  // Save to history in localStorage
  saveToHistory({ query, ...finalResult });

  return finalResult;
}

/**
 * Get mock follow-up response
 * @param {string} question
 * @param {AnalysisResult} context
 * @returns {Promise<string>}
 */
export async function getFollowUpResponse(question, context) {
  await delay(1200 + Math.random() * 800);

  const lower = question.toLowerCase();

  if (lower.includes('confidence') || lower.includes('accurate')) {
    return `The confidence score of ${context?.confidence?.toFixed(1) ?? '92.4'}% is based on the model's certainty across all detected features. Higher confidence is achieved when image resolution is high and lighting conditions are optimal.`;
  }
  if (lower.includes('resolution') || lower.includes('detail')) {
    return `The analysis was performed at ${context?.resolution ?? '10m'} ground resolution. For higher detail, consider uploading images captured by commercial satellites with sub-meter resolution.`;
  }
  if (lower.includes('building') || lower.includes('structure')) {
    return `Buildings were detected using a combination of edge detection and deep learning-based object recognition. The model was trained on global satellite imagery datasets spanning multiple continents and climate zones.`;
  }
  if (lower.includes('vegetation') || lower.includes('green') || lower.includes('forest')) {
    return `Vegetation analysis uses the Normalized Difference Vegetation Index (NDVI), which compares near-infrared and red light absorption. Values above 0.4 typically indicate healthy, dense vegetation.`;
  }
  if (lower.includes('water') || lower.includes('river') || lower.includes('lake')) {
    return `Water bodies are identified through spectral signatures in the near-infrared and shortwave infrared bands. Seasonal variations are accounted for using temporal comparison models.`;
  }
  if (lower.includes('change') || lower.includes('before') || lower.includes('after')) {
    return `Change detection uses bitemporal analysis — comparing pixel values between two images acquired at different times. Significant changes are flagged for further investigation.`;
  }

  return `Based on the analysis results, the ${context?.analysisType ?? 'satellite analysis'} model has identified the key features with high confidence. Would you like me to focus on any specific aspect of the results?`;
}

// ─── History Management ────────────────────────────────────────────

const HISTORY_KEY = 'satquery_history';

/**
 * Save an analysis result to localStorage history
 */
function saveToHistory(result) {
  try {
    const existing = getHistory();
    const entry = {
      id: `analysis_${Date.now()}`,
      query: result.query,
      analysisType: result.analysisType,
      confidence: result.confidence,
      status: result.status,
      timestamp: result.timestamp ?? new Date().toISOString(),
    };
    const updated = [entry, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable, silently fail
  }
}

/**
 * Get analysis history from localStorage
 * @returns {Array}
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Delete a history entry by ID
 * @param {string} id
 */
export function deleteHistoryEntry(id) {
  try {
    const existing = getHistory();
    const updated = existing.filter((e) => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}
