/**
 * URL Analyzer Utility
 * Uses free public APIs to analyze a URL:
 *  - urlhaus.abuse.ch  → malware / phishing check
 *  - ipapi.co          → IP geolocation (for the domain)
 *  - DNS over HTTPS    → DNS resolution
 * Plus: local analysis (protocol, structure, TLD, etc.)
 */

// ── HELPERS ──────────────────────────────────────────────────────────────────

export function normalizeUrl(input) {
  let url = input.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

export function isValidUrl(input) {
  try {
    const url = normalizeUrl(input);
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function extractParts(urlString) {
  try {
    const url = new URL(normalizeUrl(urlString));
    return {
      protocol:  url.protocol.replace(':', ''),
      hostname:  url.hostname,
      port:      url.port || (url.protocol === 'https:' ? '443' : '80'),
      pathname:  url.pathname,
      search:    url.search,
      hash:      url.hash,
      tld:       url.hostname.split('.').slice(-1)[0],
      subdomain: url.hostname.split('.').length > 2
                   ? url.hostname.split('.').slice(0, -2).join('.')
                   : null,
      domain:    url.hostname.split('.').slice(-2).join('.'),
    };
  } catch {
    return null;
  }
}

function scoreUrl(parts, safetyResult) {
  let score = 100;
  const flags = [];

  // Protocol
  if (parts.protocol === 'http') {
    score -= 20;
    flags.push({ type: 'warn', msg: 'Uses HTTP — not encrypted (no SSL/TLS)' });
  } else {
    flags.push({ type: 'good', msg: 'HTTPS — encrypted connection' });
  }

  // Suspicious TLDs
  const suspiciousTlds = ['xyz', 'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'click', 'loan', 'work', 'date'];
  if (suspiciousTlds.includes(parts.tld)) {
    score -= 20;
    flags.push({ type: 'warn', msg: `TLD ".${parts.tld}" is commonly used in spam/phishing` });
  }

  // URL length (long URLs can be obfuscated)
  const fullUrl = `${parts.protocol}://${parts.hostname}${parts.pathname}${parts.search}`;
  if (fullUrl.length > 100) {
    score -= 10;
    flags.push({ type: 'warn', msg: 'URL is unusually long — possible obfuscation' });
  }

  // IP address as hostname
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(parts.hostname)) {
    score -= 25;
    flags.push({ type: 'danger', msg: 'Hostname is a raw IP address — highly suspicious' });
  }

  // Multiple subdomains
  const subdomainDepth = parts.hostname.split('.').length - 2;
  if (subdomainDepth > 2) {
    score -= 15;
    flags.push({ type: 'warn', msg: `${subdomainDepth} subdomain levels — could be phishing` });
  }

  // Query params
  if (parts.search) {
    flags.push({ type: 'info', msg: `Has query parameters: ${parts.search}` });
  }

  // Safety API result
  if (safetyResult?.malicious) {
    score -= 40;
    flags.push({ type: 'danger', msg: 'Flagged as MALICIOUS by URLhaus threat database' });
  } else if (safetyResult?.checked) {
    flags.push({ type: 'good', msg: 'Not found in URLhaus malware database' });
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let label, color;
  if (score >= 80)      { label = 'Safe';         color = 'green'; }
  else if (score >= 55) { label = 'Suspicious';   color = 'yellow'; }
  else                  { label = 'Dangerous';    color = 'red'; }

  return { score, label, color, flags };
}

// ── API CALLS ─────────────────────────────────────────────────────────────────

async function checkUrlHaus(hostname) {
  try {
    // URLhaus lookup via their public API (no key needed)
    const res = await fetch('https://urlhaus-api.abuse.ch/v1/host/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `host=${encodeURIComponent(hostname)}`,
    });
    if (!res.ok) return { checked: false };
    const data = await res.json();
    return {
      checked: true,
      malicious: data.query_status === 'is_host',
      urls_count: data.urls ? data.urls.length : 0,
      blacklists: data.blacklists || null,
    };
  } catch {
    return { checked: false };
  }
}

async function getDnsInfo(hostname) {
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      status: data.Status === 0 ? 'Resolved' : 'NXDOMAIN',
      answers: data.Answer
        ? data.Answer.filter(a => a.type === 1).map(a => a.data)
        : [],
      ttl: data.Answer?.[0]?.TTL || null,
    };
  } catch {
    return null;
  }
}

async function getIpGeo(ip) {
  if (!ip) return null;
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return {
      ip,
      city:    data.city,
      region:  data.region,
      country: data.country_name,
      org:     data.org,
      asn:     data.asn,
    };
  } catch {
    return null;
  }
}

// ── MAIN ANALYZER ─────────────────────────────────────────────────────────────

export async function analyzeUrl(rawInput) {
  if (!isValidUrl(rawInput)) {
    throw new Error('Invalid URL — please enter a valid web address (e.g. https://example.com)');
  }

  const normalized = normalizeUrl(rawInput);
  const parts = extractParts(rawInput);

  if (!parts) throw new Error('Could not parse URL structure.');

  // Run API calls in parallel
  const [safetyResult, dnsInfo] = await Promise.all([
    checkUrlHaus(parts.hostname),
    getDnsInfo(parts.hostname),
  ]);

  // Get geo for first resolved IP
  const geoInfo = dnsInfo?.answers?.[0]
    ? await getIpGeo(dnsInfo.answers[0])
    : null;

  const { score, label, color, flags } = scoreUrl(parts, safetyResult);

  return {
    original:   rawInput,
    normalized,
    parts,
    score,
    safetyLabel: label,
    safetyColor: color,
    flags,
    dns:        dnsInfo,
    geo:        geoInfo,
    safety:     safetyResult,
    checkedAt:  new Date().toISOString(),
  };
}
