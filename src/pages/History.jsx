import React, { useState, useEffect } from 'react';
import { Clock, Eye, Trash2, CheckCircle, AlertCircle, Search, RotateCcw } from 'lucide-react';
import { getHistory, deleteHistoryEntry, clearHistory } from '../services/analysisService';
import { useNavigate } from 'react-router-dom';
import './History.css';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffHrs = diffMs / 1000 / 60 / 60;
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    if (diffHrs < 48) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const reload = () => setHistory(getHistory());

  useEffect(() => { reload(); }, []);

  const handleDelete = (id) => {
    deleteHistoryEntry(id);
    reload();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory();
      reload();
    }
  };

  const handleView = (entry) => {
    navigate('/analyze');
  };

  const filtered = history.filter((e) =>
    e.query.toLowerCase().includes(search.toLowerCase()) ||
    e.analysisType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="history-page">
      <div className="history-page__inner">
        <div className="history-header">
          <div>
            <h1 className="history-header__title">
              <Clock size={20} aria-hidden="true" />
              Analysis History
            </h1>
            <p className="history-header__subtitle">
              Your previous satellite analyses — {history.length} total
            </p>
          </div>
          <div className="history-header__actions">
            <div className="history-search">
              <Search size={14} aria-hidden="true" />
              <input
                type="search"
                className="history-search__input"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search history"
                id="history-search"
              />
            </div>
            {history.length > 0 && (
              <button
                type="button"
                className="history-clear-btn"
                onClick={handleClearAll}
                aria-label="Clear all history"
                id="history-clear-btn"
              >
                <Trash2 size={13} /> Clear All
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="history-empty">
            <RotateCcw size={36} aria-hidden="true" />
            <p className="history-empty__title">
              {history.length === 0 ? 'No analyses yet' : 'No results match your search'}
            </p>
            <p className="history-empty__hint">
              {history.length === 0
                ? 'Run your first analysis on the Analyze page.'
                : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="history-table-wrap" role="region" aria-label="Analysis history table">
            <table className="history-table">
              <thead>
                <tr>
                  <th scope="col">Query</th>
                  <th scope="col">Analysis Type</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="history-row">
                    <td className="history-row__query" title={entry.query}>
                      {entry.query.length > 60 ? entry.query.slice(0, 60) + '…' : entry.query}
                    </td>
                    <td>
                      <span className="history-badge history-badge--type">{entry.analysisType}</span>
                    </td>
                    <td>
                      <span className="history-confidence">
                        {entry.confidence ? `${Number(entry.confidence).toFixed(1)}%` : '—'}
                      </span>
                    </td>
                    <td className="history-row__date">{formatDate(entry.timestamp)}</td>
                    <td>
                      <span className={`history-badge history-badge--status history-badge--${entry.status}`}>
                        {entry.status === 'completed'
                          ? <><CheckCircle size={11} /> Completed</>
                          : <><AlertCircle size={11} /> {entry.status}</>
                        }
                      </span>
                    </td>
                    <td>
                      <div className="history-row__actions">
                        <button
                          type="button"
                          className="history-action-btn history-action-btn--view"
                          onClick={() => handleView(entry)}
                          aria-label={`View analysis: ${entry.query}`}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          type="button"
                          className="history-action-btn history-action-btn--delete"
                          onClick={() => handleDelete(entry.id)}
                          aria-label={`Delete analysis: ${entry.query}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
