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

## Architecture and diagnostic continuation — 2026-11-15

Three practical checks for the existing engine, not new functionality or production guarantees:

### Capture boundary
- **Setup:** Load the same synthetic SSE capture once intact and once with the final event removed.
- **Expected finding:** Compare the protocol-terminal flag and framing findings, not just reconstructed text.
- **Interpretation and limits:** A missing terminal suggests an incomplete or unsupported capture; a terminal does not prove that no event was lost or that the answer is correct.

### Fragmented tool arguments
- **Setup:** Inspect a synthetic supported Chat Completions or Anthropic tool-use capture; compare valid final JSON with a truncated argument fragment.
- **Expected finding:** Read final JSON parsing findings alongside event ordering and the adapter label.
- **Interpretation and limits:** JSON validity is structural, not tool authorization; arguments are never executed. Unsupported APIs must not be treated as successful.

### Timing evidence
- **Setup:** Compare a timestamped NDJSON wrapper with the same provider events supplied as plain SSE.
- **Expected finding:** Latency is available only when supplied timing supports it; absent timestamps are not zero latency.
- **Interpretation and limits:** Fixture timestamps are synthetic inputs, not measured production performance. Review any content-enabled export for secrets.

### Continue through the owned network
- [Inspect retry amplification](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#diagnostic-notes)
- [Inspect browser access and cookies](https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/#diagnostic-notes)
- [Architecture and roadmap — English](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/changelog.html#architecture)
- [Arquitectura y hoja de ruta — Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/changelog.html#architecture)
- [Arquitetura e roteiro — Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/changelog.html#architecture)

[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Existing case studies](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/case-studies.html) · [Batch release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/NETWORK_INTERLINK_BATCH_RELEASE.md)

All six roadmap candidates remain proposals, not launched apps. Links carry no diagnostic inputs. EN/ES/PT parity applies to hub documentation; this utility interface remains English-only. This content-only batch preserves `app.js` and `styles.css`, existing showcases, and historical dated evidence. No third-party repository or Pages/DNS setting is changed.

## Failure-mode diagnostics and cross-app triage — 2026-11-15

Batch: `zion-diagnostics-matrix-2026-11-15-en-es-pt`.

Use synthetic or approved sanitized evidence. Review summaries manually: sanitization is not automatic. Links carry no diagnostic inputs, uploads, or shared state. Hub guides have full EN/ES/PT coverage; this utility interface remains English-only.

### Incomplete capture or repeated tool intent

- **Trigger:** A terminal is missing or a tool intent appears repeated.
- **Carry manually:** Adapter, event count, terminal state, finding codes, and timestamp availability only.
- **Next action and limits:** Model response loss and stable intent keys before any replay. Reconcile actual server state; do not execute tool arguments or infer that a timeout means failure.
- **Continue:** [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#diagnostic-notes)

### Browser cannot expose the stream

- **Trigger:** The browser cannot read the response or cookie eligibility is uncertain.
- **Carry manually:** Synthetic origin/site relationship, method, credential mode, and policy finding codes; no capture body, tokens, or cookie values.
- **Next action and limits:** Separate preflight/access from cookie eligibility. A request may have executed even when its response is hidden; the offline model is not a live browser test.
- **Continue:** [CORS & Cookie Doctor](https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/#diagnostic-notes)

### Matrix languages and reciprocal network

- [Diagnostics matrix — English](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/diagnostics-matrix.html#triage-stream)
- [Matriz de diagnóstico — Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/diagnostics-matrix.html#triage-stream)
- [Matriz de diagnóstico — Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/diagnostics-matrix.html#triage-stream)

[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#diagnostic-notes) · [CORS & Cookie Doctor](https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/#diagnostic-notes)

[Diagnostics cycle release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/DIAGNOSTICS_MATRIX_RELEASE.md). Existing scenarios, case studies, architecture links, engines and styles are preserved. No third-party repository or Pages/DNS setting is changed.

## Batch 22 — Production architecture integration

Use an approved saved capture as the diagnostic boundary, not a live proxy. Compare complete and truncated synthetic fixtures; record adapter, terminal state, structural findings and timing availability only. Never execute captured tool arguments.

If completion or repeated intent is uncertain, reconcile server state before modeling retry budgets. If the browser hides a response, analyze access and cookie policy separately; a hidden response does not prove failure.

Carry only manually reviewed, synthetic summaries. Omit payloads, personal data, credentials, cookie values and real keys; never encode inputs in navigation URLs. Links transfer no data and provide no automatic sanitizer or shared backend. This utility interface remains English-only.

- [Architecture recipes — English](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/architecture-patterns.html#recipe-stream)
- [Recetas de arquitectura — Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/architecture-patterns.html#recipe-stream)
- [Receitas de arquitetura — Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/architecture-patterns.html#recipe-stream)

[Central hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/#batch-22-integration) · [CORS & Cookie Doctor](https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/#batch-22-integration)

[Batch-22 release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/BATCH_22_CONTENT_RELEASE.md). Prior scenarios and links, analysis engines, styles, and Pages/DNS settings are preserved. No third-party repository is changed.


## Batch 99 — expanded seven-node network

This current expansion adds three independent browser-local utilities; all earlier dated notes above remain historical. The original analysis engine and stylesheet are unchanged. No third-party repositories, shared runtime, custom domains or diagnostic URL parameters are introduced.

- [Zion AI Apps Hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [source](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub)
- [Agent Retry Safety Lab](https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/) · [source](https://github.com/saipradikmallakuntla-tech/agent-retry-safety-lab)
- [CORS & Cookie Doctor](https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/) · [source](https://github.com/saipradikmallakuntla-tech/cors-cookie-doctor)
- [Prompt Token Budget Lab](https://saipradikmallakuntla-tech.github.io/prompt-token-budget-lab/) · [source](https://github.com/saipradikmallakuntla-tech/prompt-token-budget-lab)
- [Tool Schema Drift Auditor](https://saipradikmallakuntla-tech.github.io/tool-schema-drift-auditor/) · [source](https://github.com/saipradikmallakuntla-tech/tool-schema-drift-auditor)
- [Webhook Replay Guard](https://saipradikmallakuntla-tech.github.io/webhook-replay-guard/) · [source](https://github.com/saipradikmallakuntla-tech/webhook-replay-guard)

[Discovery EN](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/batch-99-discovery.html) · [ES](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/batch-99-discovery.html) · [PT](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/batch-99-discovery.html). Use only sanitized, manually reviewed evidence. Copy/export/mailto drafts omit raw diagnostic inputs; no email is sent automatically. The full graph has seven repository nodes and 42 non-self directed links, not 42 apps. New estimates and simulations are not tokenization, compatibility, security or exactly-once guarantees. See the hub's `BATCH_99_NETWORK_EXPANSION_RELEASE.md` for dated evidence.
