# AI & IT satellite network

Owner: [saipradikmallakuntla-tech](https://github.com/saipradikmallakuntla-tech).

## Current restoration batch — 2026-11-14 UTC
Batch: `zion-restoration-2026-11-14-en-es-pt`. This satellite remains an independent, English-language utility; the hub offers complete static language views:

[English hub](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/) · [Español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/) · [Português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/).

| Entry | Live HTTPS app | Source |
| --- | --- | --- |
| Central hub | https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/ | https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub |
| Stream Inspector | https://saipradikmallakuntla-tech.github.io/llm-stream-inspector/ | https://github.com/saipradikmallakuntla-tech/llm-stream-inspector |
| Retry Safety Lab | https://saipradikmallakuntla-tech.github.io/agent-retry-safety-lab/ | https://github.com/saipradikmallakuntla-tech/agent-retry-safety-lab |
| CORS & Cookie Doctor | https://saipradikmallakuntla-tech.github.io/cors-cookie-doctor/ | https://github.com/saipradikmallakuntla-tech/cors-cookie-doctor |

## Complementary responsibilities
- Stream Inspector: offline SSE/NDJSON framing, text reconstruction, and final tool-call JSON inspection.
- Retry Safety Lab: offline layered retries, duplicate side effects, and idempotency-TTL simulations.
- CORS & Cookie Doctor: browser CORS, preflight, credentials, and cookie-policy diagnostics.

Every interface links directly to the other three nodes: 12 directed edges across four apps, not 12 different products. Ordinary canonical HTTPS links never transfer captures, prompts, headers, cookies, secrets, or scenario inputs. Each app deploys independently; no common backend or shared hosted script is required.

## Verification and continuation
Fresh live verification completed at **2026-11-14 20:28:16 UTC**: all four sites and the hub's three language views returned HTTPS HTTP 200, all 12 navigation edges were present, and runtime files matched anchored GitHub sources. This satellite passed **9/9** built-in checks in Node and through its live Chromium test button; the three satellites passed **33/33** in each environment. Evidence is point-in-time, not monitoring or a semantic-correctness guarantee.

[Local restoration checkpoint](NETWORK_RESTORATION_BATCH.md) · [Hub batch summary](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/NETWORK_RESTORATION_BATCH.md) · [Dated verification receipt](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/DEPLOYMENT_VERIFICATION.json).

## Historical scope and boundaries
The hub was unavailable during the original three-app provisioning run; that historical note is not a current outage. The hub is now deployed at the addresses above. This update changes documentation only, not satellite HTML, CSS, or analysis engines. Broader references such as [Zion Tech Group](https://ziontechgroup.com/) and the [original catalog](https://github.com/Zion-support/zion-app-network/blob/main/CATALOG.md) remain separate. No third-party repository, catalog, upstream registration, or DNS setting is modified; outbound references do not imply endorsement.

## Enterprise case studies and reliability benchmarks — 2026-11-15

Illustrative deployment scenarios and reproducible synthetic diagnostics for the existing three utilities, not customer endorsements or production performance claims.

- [English case study](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/case-studies.html#sse)
- [Caso de estudio en español](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/es/case-studies.html#sse)
- [Estudo de caso em português](https://saipradikmallakuntla-tech.github.io/zion-ai-apps-hub/pt/case-studies.html#sse)
- [Dated release evidence](https://github.com/saipradikmallakuntla-tech/zion-ai-apps-hub/blob/main/CASE_STUDIES_CYCLE_RELEASE.md)

The hub documentation is fully available in EN/ES/PT; this utility interface remains English-only. Links carry no diagnostic input. This cycle changes only `index.html`, `README.md`, and `NETWORK.md` in this repository; `app.js` and `styles.css` are unchanged. Reference outcomes are synthetic and point-in-time, not an SLA, security certification, browser-conformance proof, or exactly-once guarantee.
