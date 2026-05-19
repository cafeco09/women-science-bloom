# The Women Who Made Science Bloom

A one-page GitHub Pages interactive project showing women scientists as faces and organised names on a structured tree.

## What this version fixes

The previous layout pushed the tree below the fold because the hero and filters were too tall.

This version:

- keeps the moving quote ribbon compact
- reduces the title area height
- turns the legend into small inline chips
- makes the filters shorter
- gives the tree most of the viewport
- opens details as a floating layer over the tree
- keeps faces and names directly on the tree
- avoids name overlap with structured label positions

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
