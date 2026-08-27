---
name: project-overview
description: Wedding card digital invitation project — structure, build system, and key features
metadata:
  type: project
---

Single-file wedding card invitation built from `src/` sources, compiled into `dist/wedding-card.html` via `build.py`.

**Why:** Standalone HTML — no hosting needed, just share the file.

**How to apply:** All changes go in `src/`, then rebuild with `python3 build.py .`

## Structure
- `src/index.html` — HTML template
- `src/styles.css` — all styles (CSS variables driven by theme config)
- `src/config.js` — WEDDING_CONFIG with all customization (names, dates, theme, etc.)
- `src/app.js` — all runtime logic (render, effects, intro, album, music player)
- `build.py` — reads source, embeds images/audio as base64 data URIs, outputs single HTML

## Image folders (auto-embedded by build.py)
- `src/images/intro-bg/` — intro screen background
- `src/images/cover-fullscreen/` — full-screen background behind everything
- `src/images/cover-box/` — background of the .page card
- `src/images/hero/` — hero section background
- `src/images/illustration/` — illustration in hero center
- `src/images/petals/` — PNG leaves/petals for falling animation
- `src/images/album/` — wedding album photos

## Music playlist (added 2026-08-27)
- `src/music/` — audio files (.mp3, .ogg, .wav, .m4a, .aac)
- Auto-embedded as base64 by build.py
- Player appears bottom-right corner, hidden when no tracks
- Autoplay triggers after user clicks intro card (to satisfy browser autoplay policy)
- Toggle button to play/pause, shows track name + progress bar
