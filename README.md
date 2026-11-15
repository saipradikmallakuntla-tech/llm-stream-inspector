# LLM Stream Inspector

A working, zero-dependency browser utility for saved LLM streams. It reconstructs OpenAI Chat Completions and Anthropic Messages text/tool-call deltas, checks final tool arguments as JSON, reports missing termination and malformed frames, and exports normalized diagnostics.

**Live:** https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/

## Run
Open `index.html` directly, or serve this directory with any static server (for example `python3 -m http.server 8000`). No npm, bundler, API key, backend, or inference bill. GitHub Pages serves `main` at `/`; `.nojekyll` disables Jekyll processing.

## Use
1. Load one of five synthetic captures, paste SSE/NDJSON, or open a local file.
2. Inspect reconstructed text, tool JSON, findings, reported usage, and event timeline.
3. Export a content-omitting report by default. Including reconstructed content is an explicit checkbox; review before sharing.
4. Use **Run built-in tests** for the synthetic regression suite.

Timestamped NDJSON accepts one `{ "timestamp_ms": 1000, "data": { "choices": [...] } }` wrapper per line. Plain SSE does not contain reliable arrival times, so latency is unavailable rather than invented.

## Files and tests
- `index.html`: semantic interface, metadata, WebApplication JSON-LD, and satellite navigation.
- `styles.css`: responsive, keyboard-visible, system-font styling.
- `app.js`: dependency-free parser, provider adapters, fixtures, tests, safe DOM rendering and local exports.
- `NETWORK.md`: network entry points and non-overlap boundaries.
- `.nojekyll`: static publishing marker.

The engine also runs in Node without a DOM:
```sh
node -e "const a=require('./app.js'); const t=a.selfTest(); console.table(t); if(t.some(x=>!x.pass))process.exit(1)"
```

## Privacy and limits
No fetch/XHR, analytics, persistence, external assets, or model calls. Inputs remain in tab memory; downloads are user-initiated. Default exports omit raw content, tool names and IDs. This is not a comprehensive secret scanner. One MiB character / 10,000-event processing limits; imported file byte limit is one MiB. Timeline renders the first 200 events.

Supported adapters are specifically Chat Completions and Anthropic Messages, not every provider API (for example OpenAI Responses is not yet supported). A protocol terminal signal is not proof of semantic correctness or lossless capture. Tool JSON is never executed. No routing, model evaluation, or continuous telemetry platform is included.

## Network
[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/) · [CORS & Cookie Doctor](https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/) · [Network documentation](NETWORK.md)

The hub URL is owner-supplied; hub availability is independent of this app. No upstream Zion repository or DNS settings are modified by this project.

## Enterprise case studies and reliability benchmarks — 2026-11-15

Illustrative deployment scenarios and reproducible synthetic diagnostics for the existing three utilities, not customer endorsements or production performance claims.

- [English case study](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/case-studies.html#sse)
- [Caso de estudio en español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/case-studies.html#sse)
- [Estudo de caso em português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/case-studies.html#sse)
- [Dated release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/CASE_STUDIES_CYCLE_RELEASE.md)

The hub documentation is fully available in EN/ES/PT; this utility interface remains English-only. Links carry no diagnostic input. This cycle changes only `index.html`, `README.md`, and `NETWORK.md` in this repository; `app.js` and `styles.css` are unchanged. Reference outcomes are synthetic and point-in-time, not an SLA, security certification, browser-conformance proof, or exactly-once guarantee.
