# 🔗 URL Checker

> Validate and analyze any URL instantly — safety score, DNS records, geolocation, SSL status, and threat intelligence.

**Live Demo:** [url-checker.netlify.app](https://url-checker.netlify.app) <!-- update after deploy -->

![URL Checker Screenshot](./screenshot.png)

---

## ✨ Features

- **Safety Score (0–100)** — Instant risk assessment with color-coded rating
- **Threat Intelligence** — Real-time check against URLhaus malware database
- **DNS Resolution** — A records, TTL via Google DNS over HTTPS
- **Server Geolocation** — Country, city, ISP, ASN via ipapi.co
- **URL Structure Breakdown** — Protocol, subdomain, domain, TLD, path, query params
- **SSL/HTTPS Detection** — Flags unencrypted HTTP connections
- **No login required** — Free, instant, open source

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React.js 18 |
| Styling | Custom CSS (CSS Variables, dark theme) |
| API: Threat Intel | [URLhaus API](https://urlhaus-api.abuse.ch/) |
| API: DNS Lookup | [Google DNS over HTTPS](https://dns.google/) |
| API: Geolocation | [ipapi.co](https://ipapi.co/) |
| Deployment | Netlify |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/govindtilwani07/url-checker.git
cd url-checker

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# Opens at http://localhost:3000
```

## 📦 Build for Production

```bash
npm run build
# Output in /build folder — ready to deploy on Netlify
```

---

## 📁 Project Structure

```
url-checker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SearchBar.js / .css    ← URL input with validation
│   │   ├── ResultCard.js / .css   ← Full analysis results (4 tabs)
│   │   └── ScoreGauge.js / .css   ← SVG safety score gauge
│   ├── hooks/
│   │   └── useUrlChecker.js       ← Custom hook (fetch logic + state)
│   ├── utils/
│   │   └── urlAnalyzer.js         ← Core analysis engine + API calls
│   ├── App.js / App.css
│   └── index.js / index.css
└── package.json
```

---

## 🌐 APIs Used

All APIs are **free and require no API key**:

| API | Purpose | Docs |
|---|---|---|
| URLhaus (abuse.ch) | Malware / phishing check | [Link](https://urlhaus-api.abuse.ch/) |
| Google DNS over HTTPS | DNS resolution (A records, TTL) | [Link](https://developers.google.com/speed/public-dns/docs/doh) |
| ipapi.co | IP geolocation | [Link](https://ipapi.co/api/) |

---

## 👨‍💻 Author

**Govind Tilwani**
- GitHub: [@govindtilwani07](https://github.com/govindtilwani07)
- LinkedIn: [govindtilwani0](https://linkedin.com/in/govindtilwani0)

---

## 📄 License

MIT License — feel free to use and modify.
