import React, { useState } from 'react';
import { isValidUrl } from '../utils/urlAnalyzer';
import './SearchBar.css';

export default function SearchBar({ onSubmit, loading }) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = !touched || !value || isValidUrl(value);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (value && isValidUrl(value)) {
      onSubmit(value);
    }
  }

  const examples = [
    'https://github.com',
    'https://google.com',
    'http://example.tk',
  ];

  return (
    <div className="search-wrap">
      <form className="search-form" onSubmit={handleSubmit} noValidate>
        <div className={`search-box ${!isValid ? 'invalid' : ''} ${loading ? 'loading' : ''}`}>
          {/* URL Icon */}
          <span className="search-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>

          <input
            type="text"
            className="search-input"
            value={value}
            onChange={e => { setValue(e.target.value); setTouched(false); }}
            placeholder="Enter any URL — e.g. https://github.com"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={loading}
            aria-label="URL to check"
          />

          {value && !loading && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => { setValue(''); setTouched(false); }}
              aria-label="Clear"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}

          <button
            type="submit"
            className={`check-btn ${loading ? 'checking' : ''}`}
            disabled={loading || !value}
          >
            {loading ? (
              <>
                <span className="btn-spinner" aria-hidden />
                <span>Checking…</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>

        {!isValid && (
          <p className="search-error" role="alert">
            ⚠ Please enter a valid URL (e.g. https://example.com)
          </p>
        )}
      </form>

      {/* Quick examples */}
      <div className="examples">
        <span className="examples-label">Try:</span>
        {examples.map(ex => (
          <button
            key={ex}
            className="example-btn"
            onClick={() => { setValue(ex); setTouched(false); }}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
