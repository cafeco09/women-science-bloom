# The Women Who Made Science Bloom

A GitHub Pages interactive project built as a living tree of women scientists.

## What this version changes

This version returns to the original metaphor properly:

- A real tree with a **trunk**, **boughs** and **branch-end blossoms**
- A **dynamic environment** with floating pollen, drifting petals, moving sky glows and layered ground
- The selected blossom reveals a **leaf**, **thorn** and **seed** directly on the tree
- The side panel gives the fuller story

## Visual metaphor

- **Flower** = scientist
- **Branch** = breakthrough moment
- **Leaf** = discovery
- **Thorn** = barrier or struggle
- **Seed** = long-term impact

## Dataset

The dataset includes 20 women scientists from:
- Africa
- Asia
- Europe
- Latin America
- Middle East
- North America
- Oceania

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
