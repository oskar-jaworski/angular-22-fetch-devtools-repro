# Angular 22 Fetch DevTools reproduction

Standalone reproduction for missing response bodies in Chromium DevTools. All data is synthetic; no login, private services, or external API is needed.

## Run

Use Node.js **24.15+ (24.x)** and pnpm **11.8.0**. Angular is pinned to `22.0.2`, CLI/build to `22.0.3`, and TypeScript to `6.0.3`.

```sh
pnpm install --frozen-lockfile
pnpm repro
```

This starts both servers in one terminal. Once Angular is ready:

1. Open **http://127.0.0.1:4200** (Angular application).
2. Open DevTools > Network, then reload the page (F5).
3. Select `documents?page=0&size=5&sort=createdDate%2Cdesc` and inspect Response / Preview.
4. Compare the body in DevTools with the JSON rendered in the page.

**Port 4300 is the API server only. Opening it directly does not exercise Angular's HTTP backend or development proxy.** The page on port 4200 must display "Angular 22 Fetch DevTools reproduction".

## Fetch / XHR comparison

The affected case: the application renders the JSON, but DevTools reports `Failed to load response data` / `No data found for resource with given identifier`. Expected: Response and Preview display the received JSON.

Stop with Ctrl+C, then run:

```sh
pnpm repro:xhr
```

Reload the same page and inspect the same request. This switches `provideHttpClient()` (Angular 22 Fetch default) to `provideHttpClient(withXhr())`. XHR made the response visible in the reported Chrome and Edge tests on Windows 11 Pro; Firefox displayed the Fetch response. Reproduction may depend on browser version and timing.

Both variants keep the same component, endpoint, proxy, and synthetic JSON. The API uses HTTP/1.1, `Transfer-Encoding: chunked`, `Connection: close`, and two writes 75 ms apart. These are reproduction conditions, not a confirmed root cause.

The original two-terminal commands remain available: `pnpm api` and `pnpm start` (or `pnpm start:xhr`).

## Build

```sh
pnpm build
pnpm build:xhr
```
