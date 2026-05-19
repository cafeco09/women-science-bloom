# The Women Who Made Science Bloom

A GitHub Pages interactive project built as a living tree of women scientists, now redesigned with **portrait nodes** and **thought-bubble names**.

## What changed in this version

The previous version improved readability by moving analysis into a bottom drawer, but the tree still used blossom-style nodes.

This version goes one step further:

- **portrait medallions** replace the flower icons
- **thought bubbles** show names on hover or selection
- the **bottom analysis drawer** remains for charts and story details

## Current portrait system

This build is **portrait-ready**:

- each scientist can have a `portrait` field in `docs/data/scientists.json`
- if no portrait image is supplied, the tree shows a clean illustrated face medallion instead
- if you later add real images such as `./assets/faces/marie-curie.jpg`, the node will display that image automatically

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
