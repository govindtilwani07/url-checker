import React from 'react';
import './ScoreGauge.css';

export default function ScoreGauge({ score, label, color }) {
  const colorMap = { green: '#22d3a0', yellow: '#f7c948', red: '#f75f5f' };
  const hex = colorMap[color] || colorMap.green;

  // SVG arc
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;

  return (
    <div className="gauge-wrap">
      <div className="gauge-svg-wrap">
        <svg viewBox="0 0 140 80" className="gauge-svg" aria-label={`Safety score: ${score}/100`}>
          {/* Background arc */}
          <path
            d="M 10 75 A 60 60 0 0 1 130 75"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 75 A 60 60 0 0 1 130 75"
            fill="none"
            stroke={hex}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 6px ${hex}88)`, transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
          {/* Score text */}
          <text x="70" y="68" textAnchor="middle" fill={hex}
                fontFamily="JetBrains Mono, monospace" fontSize="28" fontWeight="700">
            {score}
          </text>
        </svg>
        <div className="gauge-label" style={{ color: hex }}>
          <span className={`gauge-dot ${color}`} />
          {label}
        </div>
      </div>
    </div>
  );
}
