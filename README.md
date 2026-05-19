# The Women Who Made Science Bloom

A reliable, one-page GitHub Pages interactive tree of women scientists.

## What is fixed in this build

This version is designed to show reliably on GitHub Pages:

- The tree is visible in the main frame.
- Faces and names are regular HTML elements over the tree, not images embedded inside SVG.
- Filters are in a right-hand sidebar.
- Names are fixed to structured positions to avoid overlap.
- Details open as a floating layer over the tree.
- Quotes move horizontally across the top.

## Files

```text
women-science-bloom/
  README.md
  docs/
    .nojekyll
    index.html
    styles.css
    app.js
    data/
      scientists.json
```

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
