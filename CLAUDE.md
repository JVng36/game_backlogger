# Backlog — game backlog tracker

A single-file web app for tracking a video-game backlog. Built to be trivially
shareable and to keep all data local to the user's browser (no server, no accounts).

## Current state

The entire app is **one file**: `backlog.html`. No build step, no dependencies,
no runtime network calls. Open it in a browser and it works.

- **HTML/CSS/JS all inline** in that single file (CSS in a `<style>` block,
  behavior in a `<script>` block at the end of `<body>`).
- **No framework** — plain vanilla JS. A `render()` function rebuilds the
  dynamic sections (`#formMount`, `#list`, bucket counts) from state and
  re-attaches event handlers. Deliberately chosen over React/etc. because at
  this scale a framework would add complexity without earning its keep.
- **Icons** are inline SVG, so there's nothing to fetch.
- **Theme** auto-adapts to system light/dark via `prefers-color-scheme`; all
  colors are CSS custom properties under `:root`.

## Data model

A game is:

```js
{ id, title, platform, genre, hours, notes, bucket }
```

- `id` — `Date.now()` timestamp (also used for dedupe on import)
- `bucket` — one of: `Now`, `Soon`, `Someday`, `Done`, `Drop`
- `hours` — estimated playtime (number) or `null`
- `platform` — one of a fixed list (PC, PS5, PS4, Xbox, Switch, Mobile, Other)

All games live in a single `games` array in memory.

## Persistence

- Saved to `localStorage` under the key `game-backlog-v1`.
- **Data is local to each browser on each device** — it never touches a server.
- **Export/Import** (header buttons) move a backlog between devices as a JSON
  file. Import dedupes by `id` and validates/sanitizes fields before merging.
  This is also the backup mechanism and the way to share an actual *list*
  (vs. just the app) with someone else.

## How to run / share

- **Run:** open `backlog.html` in any browser (double-click, or `open`/`xdg-open`).
- **Share:** send the file, or host it anywhere static. GitHub Pages is the
  intended path — commit the one file to a repo, enable Pages, get a public URL.
  (Owner's GitHub: https://github.com/JVng36)

## Conventions

- Keep it dependency-free and single-file unless there's a strong reason not to.
- User input is HTML-escaped (`esc()`) before being inserted into the DOM.
- All state mutations go through the `games` array, then call `save()` then
  `render()`. Don't mutate the DOM directly for data changes.

## Roadmap / next steps

The single-file + localStorage design has a deliberate ceiling: no cross-device
sync, no shared/multi-user data. The planned "next chapter" (and a good backend
portfolio piece) is to add a real backend:

- **Stack under consideration:** Node.js + Express, Prisma ORM, PostgreSQL,
  deployed on Railway. (Mirrors the "EcomSync" project scoping.)
- **Shape:** REST API for games CRUD + auth for real user accounts; the existing
  UI swaps `localStorage` reads/writes for `fetch()` calls to the API. The
  front end can stay almost entirely as-is.
- **Migration aid:** the existing JSON export format can seed the database, so
  early local data isn't lost.

If/when starting the backend, keep the current single-file app working as a
"local mode" — it's the simplest possible offline fallback.

## Notes

- File was originally authored in a chat session and moved here to continue in
  Claude Code. If anything in the code and this file disagree, the code wins —
  update this file to match.
