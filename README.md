# The Women Who Made Science Bloom

A no-scroll one-page GitHub Pages interactive tree of women scientists.

## What this fixes

The previous version used a responsive breakpoint that moved the filter panel above the tree too early. On laptop/browser widths below that breakpoint, the dashboard opened on the filter panel and the tree was pushed below the fold.

This build fixes that:

- The tree and filters stay side by side on normal desktop/laptop widths.
- The page uses `100svh` and fixed grid rows so the tree is visible immediately.
- The quote ribbon is compact.
- The right-hand filter panel is compact.
- The tree uses HTML portrait nodes over a visible SVG tree.
- Details open as a floating layer over the tree.

## Run locally

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## GitHub Pages

Use:

```text
Settings → Pages → Deploy from a branch → main → /docs
```
