# Backlog — a game backlog tracker

No build step, no dependencies, no server. Open `backlog.html` in any browser and it runs. Share it by sending the files or hosting them anywhere static (e.g. GitHub Pages).

## Files

| File | Purpose |
|---|---|
| `backlog.html` | The app shell — markup only. Loads all scripts and the stylesheet. |
| `style.css` | All CSS. Theme colors are CSS custom properties under `:root`, with a light/dark mode override via `prefers-color-scheme`. |
| `constants.js` | Shared read-only data used across the app (buckets, platforms, genres, colors, icons). |
| `state.js` | Holds the app's current state and handles reading/writing to localStorage. |
| `render.js` | Rebuilds the UI from state whenever something changes. |
| `export-import.js` | Handles downloading your backlog as a JSON file and importing one back in. |
| `main.js` | Wires everything together and starts the app. |

Scripts must load in the order listed above — each one depends on globals defined by the previous ones.

## Data model

A game is: `{ id, title, platform, genre, hours, notes, bucket }`

All games live in the `games` array. Each game sits in one of five buckets: **Now / Soon / Someday / Done / Drop**.

## Persistence

Saved to the browser's `localStorage` under the key `"game-backlog-v1"`. Data is local to each browser on each device — it never touches a server. Export/Import (header buttons) move a backlog between devices as a JSON file, which is also how you'd back it up or hand a list to a friend.

## Rendering

No virtual DOM — `render()` rebuilds the dynamic sections from state and re-attaches event handlers. Fine at this scale; a framework would only earn its keep on a much larger app.
# game_backlogger
# game_backlogger
# game_backlogger
