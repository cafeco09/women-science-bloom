# The Women Who Made Science Bloom

A one-page GitHub Pages interactive project showing women scientists as faces on a structured tree.

## What changed in this version

- the filter controls move to a right-hand sidebar
- the tree receives the main frame so it stays visible on load
- name badges are split and positioned by row to avoid overlap
- details open as a floating layer inside the tree
- the experience stays on one page
- scientist quotes move horizontally across the top

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
