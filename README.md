# The Women Who Made Science Bloom

A GitHub Pages interactive project built as a living tree of women scientists, now redesigned with **real portrait nodes** and **always-on thought bubbles**.

## What changed in this version

This version makes three important changes:

- **real faces** are used instead of illustration placeholders
- **thought-bubble names are always visible** and no longer depend on hover
- the tree interaction no longer relies on hover states, so it is more stable on touch devices and should not flicker when tapped

## Portrait sourcing

This build uses public image URLs for the featured scientists, referenced in `docs/data/scientists.json` under the `portrait` field.

## Included analysis

When a scientist is selected, the drawer shows:

- breakthrough year
- field peer count
- region peer count
- era rank in the full timeline
- timeline chart
- field distribution chart
- region distribution chart

## Run locally

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Deploy on GitHub Pages

Use:

```text
Settings → Pages → Deploy from a branch → main → /docs
```
