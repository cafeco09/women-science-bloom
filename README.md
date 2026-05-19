# The Women Who Made Science Bloom

A calmer, more intuitive GitHub Pages prototype for an interactive science garden of women scientists.

## What changed in this version

The first version tried to show every branch, leaf, thorn and seed at once. That made the page visually busy.

This version uses a clearer interaction model:

1. Pick a scientist flower from the garden map.
2. Read her breakthrough branch.
3. See her discovery leaf.
4. Understand the thorn she pushed through.
5. End with the seed of long-term impact.

## Project structure

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

## Add more scientists

Edit:

```text
docs/data/scientists.json
```

Keep each entry short. The interface is designed for clarity, not long biographies.
