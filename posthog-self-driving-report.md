# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for Subpilot with Session Replay, Error Tracking, and Support available; health, error, and support responders are enabled. The focused scout troop and two Replay Vision monitors are active, and findings will begin appearing in the [Self-driving inbox](https://eu.posthog.com/project/275471/inbox) within about 30 minutes once data is available.

No application source code or environment files were changed during this setup. The only repository file created was this report.

## AI data processing

Approved. The organization-level approval required by Self-driving was in place before this setup ran.

## GitHub

The PostHog GitHub App was already connected before this setup. GitHub Issues was not selected as an external Self-driving source, so no warehouse import or GitHub issue responder was enabled.

## Products enabled

| Product | Result | Notes |
| --- | --- | --- |
| Session Replay | Already enabled | This is a mobile Expo app. The PostHog React Native client exists, but server-side replay enablement is inert until mobile session replay capture is configured and verified in the SDK. |
| Error Tracking | Already enabled | The app already calls `captureException` for authentication and sign-out failures; verify its mobile SDK configuration in a real build. |
| Support (Conversations) | Enabled | Tickets will begin arriving only after an inbound email, inbox, or Slack channel is connected in PostHog. |

The repository does not use `posthog-js`, so there was no web initialization override that could disable recording or exception capture.

## Signal sources

| Signal source | Action | Notes |
| --- | --- | --- |
| `analytics` / `anomaly_investigation` | Already enabled; unchanged | Existing configuration was preserved. |
| `health_checks` / `health_issue` | Enabled | Surfaces actionable PostHog setup health findings. |
| `error_tracking` / `issue_created` | Enabled | Reports newly created error issues. |
| `error_tracking` / `issue_reopened` | Enabled | Reports reopened error issues. |
| `error_tracking` / `issue_spiking` | Enabled | Reports materially spiking error issues. |
| `conversations` / `ticket` | Enabled | Dormant until a Support inbound channel is connected. |
| `signals_scout` / `cross_source_issue` | On by default; no row created | Scout findings are allowed into the inbox. |
| Session replay responder | Deliberately not created | Replay reaches the inbox through the two Replay Vision scanners below. |

## Connected tools

| Tool | Result |
| --- | --- |
| GitHub Issues | Not used — not selected in the connected-tools choice. |
| Linear | Not used — not selected. |
| Jira | Not used — not selected. |
| Sentry | Not used — not selected. |
| Zendesk | Not used — not selected. |
| Other catalog tools | Not used — the expanded catalog was not requested. |

No external data warehouse sources were present when checked.

## Scout troop

The project is enrolled with a verified limit of **100 scout runs per day**; **0** runs had been used at setup time. The active early-access banner says: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

### Enabled scouts

| Scout | Coverage |
| --- | --- |
| `signals-scout-general` | Cross-product correlations and product surfaces not owned by a specialist. |
| `signals-scout-product-analytics` | Core product-flow regressions in funnels, retention, lifecycle, stickiness, and paths. |
| `signals-scout-health-checks` | PostHog configuration health issues, prioritized by impact. |
| `signals-scout-account-access` | Custom account-access monitor described below. |

### Disabled built-in scouts

| Scouts | Reason |
| --- | --- |
| `signals-scout-error-tracking` | Covered by the enabled native Error Tracking responders; a scout would duplicate that route. |
| `signals-scout-session-replay` | Covered by the Replay Vision scanners; a scout would duplicate that route. |
| `signals-scout-replay-vision` | No prior Replay Vision observations exist yet; enable later if aggregate scanner trends become useful. |
| `signals-scout-anomaly-detection` | No mature saved dashboard or insight portfolio was confirmed. |
| `signals-scout-inbox-validation` | No shipped Self-driving fixes exist yet to re-measure. |
| `signals-scout-observability-gaps` | Kept off while the project profile is unavailable and event coverage is still being established. |
| `signals-scout-ai-observability`, `signals-scout-apm`, `signals-scout-logs` | No confirmed LLM tracing, APM, or PostHog logs usage. |
| `signals-scout-conversations` | Support is newly enabled, but no inbound channel or ticket stream is connected yet. |
| `signals-scout-csp-violations`, `signals-scout-web-analytics`, `signals-scout-web-vitals` | This is a native mobile app; no web/CSP surface was confirmed. |
| `signals-scout-customer-analytics`, `signals-scout-data-pipelines`, `signals-scout-data-warehouse` | No customer-account analytics, pipeline, or warehouse data surface was confirmed. |
| `signals-scout-experiments`, `signals-scout-feature-flags`, `signals-scout-insight-alerts` | No active experiments, feature-flag usage, or insight alerts were confirmed. |
| `signals-scout-revenue-analytics` | Subscription tracking is core product functionality, but no payment integration or revenue telemetry was detected. |
| `signals-scout-surveys` | No active surveys were found. |
| `signals-scout-mcp-tool-calls`, `signals-scout-skills-store`, `signals-scout-tasks` | No evidence that these operational surfaces are used for this product. |

This leaves **4 active scouts** and **24 disabled built-in scouts**, comfortably below the ten-scout quality ceiling. Any disabled scout can be enabled later from the inbox when its surface becomes active.

## Custom scouts

### Created: `signals-scout-account-access`

This scout watches Subpilot’s password/Google registration, email verification, and sign-in experience. Its discriminator is a material drop in registration completion or a verification-retry increase relative to the flow’s own trailing baseline, with multiple people affected and sign-up volume still present; authentication exceptions corroborate a regression but do not trigger a duplicate error-only report.

It fills a specific gap: the enabled product-analytics scout partly overlaps broad flow monitoring, but this scout owns the known account-access sequence and its verification friction. It uses `app/(auth)/sign-up.tsx` and `app/(auth)/sign-in.tsx` as the factual source for the surface, without embedding source or user data.

Considered but not created: a subscription-lifecycle scout. The current app captures subscription-detail expansion and add-subscription starts, but does not yet expose a reliable subscription-creation or reminder-delivery success/failure pair, so it would not meet the actionable-signal quality bar.

If the custom scout becomes noisy, set `emit: false` on its configuration in PostHog to keep it running in dry-run mode without sending findings to the inbox.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying observations to the inbox. It is the only part of this setup that spends Replay Vision quota. Scanner findings arrive at half weight and need independent corroboration before they are promoted into a report.

No session recordings were present during setup. Both scanners are active and signal-enabled, with a projected monthly spend of **0 credits** until recordings arrive; the organization had **2,500 credits remaining** and was not exhausted.

| Brief | Scanner | Status | Query scope | Sampling | Estimate |
| --- | --- | --- | --- | --- | --- |
| Breakage monitor | Subscription management breakage | Created | The app’s root subscription-management route (`/`), the current primary dashboard/completion surface. | 50% | 0 observations / 0 credits per month |
| Frustration monitor | Subscription management frustration | Created | Recordings containing `$rageclick` only; intentionally has no URL scope. | 100% | 0 observations / 0 credits per month |

The breakage scanner focuses on dashboard/balance loading, upcoming renewal cards, opening subscription details, and the add-subscription action. The frustration scanner focuses on visibly repeated attempts to open details, add a subscription, find an upcoming renewal, or reach settings. Their targeting is intentionally disjoint except for unavoidable residual overlap.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled ticket responder can receive tickets.
- [ ] Configure and verify Session Replay in a real Expo/React Native build. The server-side product is enabled, but mobile recordings have not yet arrived.
- [ ] After the first recordings arrive, confirm that the breakage monitor’s `/` route scope matches the mobile screen telemetry; refine it only if the first observations show it is not selecting the dashboard flow.
- [ ] Verify mobile error capture in a real build, then review the resulting error issues in PostHog.
- [ ] Rate early Replay Vision observations in the scanner UI with thumbs up/down to generate configuration recommendations.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Runs draw from the verified daily budget, findings cluster into reports in the [Self-driving inbox](https://eu.posthog.com/project/275471/inbox), and immediately actionable reports can be turned into coding tasks.

## Files modified or created

| File | Change |
| --- | --- |
| `posthog-self-driving-report.md` | Created this setup report. |
