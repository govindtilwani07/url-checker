import React, { useState } from 'react';
import ScoreGauge from './ScoreGauge';
import './ResultCard.css';

function InfoRow({ label, value, mono, tag }) {
  if (!value) return null;
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className={`info-value ${mono ? 'mono' : ''}`}>
        {tag ? <span className={`tag tag-${tag}`}>{value}</span> : value}
      </span>
    </div>
  );
}

function FlagItem({ flag }) {
  const icons = { good: '✓', warn: '⚠', danger: '✕', info: 'ℹ' };
  return (
    <div className={`flag flag-${flag.type}`}>
      <span className="flag-icon" aria-hidden>{icons[flag.type]}</span>
      <span>{flag.msg}</span>
    </div>
  );
}

export default function ResultCard({ result }) {
  const [section, setSection] = useState('overview');
  const { parts, dns, geo, safety, flags, score, safetyLabel, safetyColor, checkedAt } = result;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'structure', label: 'Structure' },
    { id: 'dns', label: 'DNS / IP' },
    { id: 'safety', label: 'Safety Flags' },
  ];

  return (
    <div className="result-card">

      {/* ── TOP: URL + score ── */}
      <div className="result-header">
        <div className="result-url-wrap">
          <div className="result-url-label">Analyzing</div>
          <div className="result-url">{result.normalized}</div>
          <div className="result-time">
            Checked at {new Date(checkedAt).toLocaleTimeString()}
          </div>
        </div>
        <ScoreGauge score={score} label={safetyLabel} color={safetyColor} />
      </div>

      {/* ── TABS ── */}
      <div className="result-tabs" role="tablist">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={section === t.id}
            className={`result-tab ${section === t.id ? 'active' : ''}`}
            onClick={() => setSection(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="result-body">

        {section === 'overview' && (
          <div className="section-grid">
            <div className="info-block">
              <div className="info-block-title">URL Details</div>
              <InfoRow label="Protocol"  value={parts.protocol.toUpperCase()} tag={parts.protocol === 'https' ? 'green' : 'red'} />
              <InfoRow label="Domain"    value={parts.domain} mono />
              <InfoRow label="TLD"       value={`.${parts.tld}`} mono />
              {parts.subdomain && <InfoRow label="Subdomain" value={parts.subdomain} mono />}
              <InfoRow label="Port"      value={parts.port} mono />
              {parts.pathname !== '/' && <InfoRow label="Path" value={parts.pathname} mono />}
              {parts.search && <InfoRow label="Query" value={parts.search} mono />}
            </div>
            <div className="info-block">
              <div className="info-block-title">Server Location</div>
              {geo ? (
                <>
                  <InfoRow label="IP"      value={geo.ip} mono />
                  <InfoRow label="City"    value={geo.city} />
                  <InfoRow label="Region"  value={geo.region} />
                  <InfoRow label="Country" value={geo.country} />
                  <InfoRow label="ISP"     value={geo.org} />
                  <InfoRow label="ASN"     value={geo.asn} mono />
                </>
              ) : (
                <p className="no-data">Could not resolve geolocation</p>
              )}
            </div>
          </div>
        )}

        {section === 'structure' && (
          <div className="info-block full">
            <div className="info-block-title">URL Structure Breakdown</div>
            <div className="url-breakdown">
              <span className={`url-part protocol ${parts.protocol === 'https' ? 'good' : 'bad'}`}>
                <span className="url-part-label">protocol</span>
                {parts.protocol}://
              </span>
              {parts.subdomain && (
                <span className="url-part subdomain">
                  <span className="url-part-label">subdomain</span>
                  {parts.subdomain}.
                </span>
              )}
              <span className="url-part domain">
                <span className="url-part-label">domain</span>
                {parts.domain.split('.')[0]}
              </span>
              <span className="url-part tld">
                <span className="url-part-label">tld</span>
                .{parts.tld}
              </span>
              {parts.port !== '443' && parts.port !== '80' && (
                <span className="url-part port">
                  <span className="url-part-label">port</span>
                  :{parts.port}
                </span>
              )}
              {parts.pathname !== '/' && (
                <span className="url-part path">
                  <span className="url-part-label">path</span>
                  {parts.pathname}
                </span>
              )}
              {parts.search && (
                <span className="url-part query">
                  <span className="url-part-label">query</span>
                  {parts.search}
                </span>
              )}
            </div>

            <div className="info-block-title" style={{ marginTop: 28 }}>Raw URL</div>
            <div className="raw-url">{result.normalized}</div>
            <InfoRow label="Total Length" value={`${result.normalized.length} characters`} />
            <InfoRow label="Encoded"      value={result.normalized !== decodeURIComponent(result.normalized) ? 'Yes — contains encoded characters' : 'No'} />
          </div>
        )}

        {section === 'dns' && (
          <div className="section-grid">
            <div className="info-block">
              <div className="info-block-title">DNS Resolution</div>
              {dns ? (
                <>
                  <InfoRow label="Status"  value={dns.status} tag={dns.status === 'Resolved' ? 'green' : 'red'} />
                  <InfoRow label="TTL"     value={dns.ttl ? `${dns.ttl}s` : null} mono />
                  {dns.answers.length > 0 && (
                    <div className="info-row" style={{ flexDirection: 'column', gap: 6 }}>
                      <span className="info-label">A Records (IPs)</span>
                      {dns.answers.map(ip => (
                        <span key={ip} className="info-value mono tag tag-blue">{ip}</span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="no-data">DNS lookup failed or timed out</p>
              )}
            </div>
            <div className="info-block">
              <div className="info-block-title">Threat Intelligence</div>
              <InfoRow label="URLhaus Check" value={safety.checked ? 'Completed' : 'Unavailable'} tag={safety.checked ? 'green' : 'yellow'} />
              {safety.checked && (
                <>
                  <InfoRow
                    label="Status"
                    value={safety.malicious ? 'MALICIOUS' : 'Clean'}
                    tag={safety.malicious ? 'red' : 'green'}
                  />
                  {safety.urls_count > 0 && (
                    <InfoRow label="Flagged URLs" value={`${safety.urls_count} found`} tag="red" />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {section === 'safety' && (
          <div className="info-block full">
            <div className="info-block-title">Security Analysis — {flags.length} checks</div>
            <div className="flags-list">
              {flags.map((f, i) => <FlagItem key={i} flag={f} />)}
            </div>
            <div className="score-summary">
              <div className="score-bar-wrap">
                <div className="score-bar-label">
                  <span>Safety Score</span>
                  <span className={`score-num score-${safetyColor}`}>{score}/100</span>
                </div>
                <div className="score-bar-track">
                  <div
                    className={`score-bar-fill score-fill-${safetyColor}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
