# Verification

Packaging checks on 2026-09-09, using Node.js 24.19.0 and pnpm 11.8.0:

- Clean `pnpm install --frozen-lockfile`, `pnpm build`, and `pnpm build:xhr` passed.
- `pnpm repro` and `pnpm repro:xhr` started both servers; Chrome rendered the JSON in both modes.
- Direct API and development-proxy responses returned HTTP 200 with identical JSON, `Transfer-Encoding: chunked`, and `Connection: close`.
- The API root links to the Angular application on port 4200.
- Occupied ports stop startup with an error; Ctrl+C released both ports.
- The original Angular source, configurations, and lockfile are unchanged.

These checks validate the runnable package. The missing DevTools body in Fetch mode and working XHR comparison were reported previously; the DevTools-panel failure was not independently reverified during this packaging check. A successful application response alone does not establish that DevTools retained the body.
