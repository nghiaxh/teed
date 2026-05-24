# AGENTS.md — daily-feed

## What it is

Vietnamese CLI news reader. Ink (React for terminals) app that aggregates RSS feeds and searches by keyword. Built with TypeScript, bundled via `tsc` to `dist/`.

## Commands

```sh
npm run build          # tsc
npm run dev            # tsc --watch
npm run typecheck      # tsc --noEmit
npm test               # prettier --check . && xo && ava
```

## Entrypoints & structure

| Path | Role |
|---|---|
| `source/cli.tsx` | CLI entrypoint (`bin` → `dist/cli.js`). Clears console, renders `<App>` via Ink. |
| `source/app.tsx` | Main app component: input handling, `/commands`, search orchestration. Exports `relativeTime`, `truncate` for testing. |
| `source/config.ts` | Reads/writes custom feeds to `~/.dfd_feeds.json`. Falls back to 80+ built-in defaults. |
| `source/feeds/rss.ts` | RSS fetching, HTML decoding, Vietnamese accent removal, stopword filtering, keyword matching. Concurrency-limited to 5 simultaneous requests. |
| `source/feeds/aggregator.ts` | Orchestrates fetch: exact match first, then falls back to OR token search. Dedupes & limits results. |
| `source/__tests__/ui.tsx` | Tests. Uses `ava` + `ink-testing-library`. |

## Testing

- **Framework**: `ava` with `--import=tsx/esm` for TypeScript (not `ts-node`).
- Run: `npm test` (runs prettier, xo, then ava).
- Single test: `npx ava source/__tests__/ui.tsx`.
- Tests are in `source/__tests__/` (not root); ava config restricts to this path.

## Style & linting

- `prettier` — config `@vdemedes/prettier-config` (semi: true, singleQuote: true, tabs)
- `xo` — prettier integration enabled, many noisy unicorn/TS rules disabled in config
- Indent: tabs (`.editorconfig`)

## RSS fetching

Fetches use a concurrent pool (5 simultaneous requests) with 1 retry on failure. Each request has an 8s timeout. With 80+ feeds, max completion is bounded by pool size × slowest request.

## Config persistence

Custom RSS feeds are stored at `~/.dfd_feeds.json`. Deleting this file resets to defaults.

## Debugging

Set `DEBUG` env var to see per-feed fetch results and rejected promises:

```sh
DEBUG=1 npm run dev
```

## Runtime

- Node >= 18.
- Published as `@nghiaxh/daily-feed`, CLI binary: `dfd`.
- Global install: `npm install -g @nghiaxh/daily-feed`.
