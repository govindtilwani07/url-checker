import React from 'react';
import { useUrlChecker } from './hooks/useUrlChecker';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import './App.css';

export default function App() {
  const { status, result, error, checkUrl, reset } = useUrlChecker();

  function handleNew() {
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">

      {/* ── BACKGROUND GRID ── */}
      <div className="bg-grid" aria-hidden />

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>
          <span className="logo-text">URL<span className="logo-accent">Checker</span></span>
        </div>
        <a
          href="https://github.com/govindtilwani07"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
      </header>

      <main className="app-main">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-dot" aria-hidden />
            Free · No Login · Instant Results
          </div>
          <h1 className="hero-title">
            Analyze Any URL<br />
            <span className="hero-accent">Instantly & Safely</span>
          </h1>
          <p className="hero-sub">
            Check safety score, DNS records, server location, SSL status,<br />
            URL structure and threat intelligence — in one click.
          </p>

          <SearchBar
            onSubmit={checkUrl}
            loading={status === 'loading'}
          />
        </section>

        {/* ── LOADING ── */}
        {status === 'loading' && (
          <div className="loading-state">
            <div className="loading-steps">
              {['Parsing URL structure…', 'Checking threat databases…', 'Resolving DNS…', 'Fetching geolocation…'].map((step, i) => (
                <div key={step} className="loading-step" style={{ animationDelay: `${i * 0.3}s` }}>
                  <span className="step-dot" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div className="error-state">
            <div className="error-icon" aria-hidden>⚠</div>
            <div className="error-msg">{error}</div>
            <button className="retry-btn" onClick={reset}>Try Again</button>
          </div>
        )}

        {/* ── RESULT ── */}
        {status === 'success' && result && (
          <div className="result-wrap">
            <ResultCard result={result} />
            <div className="result-actions">
              <button className="new-check-btn" onClick={handleNew}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Check Another URL
              </button>
            </div>
          </div>
        )}

        {/* ── FEATURES (idle) ── */}
        {status === 'idle' && (
          <section className="features">
            {[
              { icon: '🛡', title: 'Safety Score', desc: 'Real-time threat analysis using URLhaus malware database' },
              { icon: '🌐', title: 'DNS Lookup', desc: 'A records, TTL, resolution status via Google DNS' },
              { icon: '📍', title: 'Geolocation', desc: 'Server country, city, ISP and ASN details' },
              { icon: '🔍', title: 'URL Structure', desc: 'Protocol, subdomain, domain, TLD, path and query breakdown' },
              { icon: '🔒', title: 'SSL Check', desc: 'Detects HTTP vs HTTPS and encryption warnings' },
              { icon: '⚡', title: 'Instant', desc: 'No login needed — results in under 3 seconds' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon" aria-hidden>{f.icon}</span>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </section>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="app-footer">
        <span>Built by <a href="https://github.com/govindtilwani07" target="_blank" rel="noopener noreferrer">Govind Tilwani</a></span>
        <span>·</span>
        <span>React.js · Tailwind · REST APIs</span>
      </footer>

    </div>
  );
}
