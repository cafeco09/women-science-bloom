# The Women Who Made Science Bloom

Clean tree version.

## What this fixes

The previous version still had too much interface placed over the canopy. This build removes the large legend from the tree, keeps the title small, and moves the legend into the sidebar.

- Tree gets the full left frame.
- Filters stay on the right.
- Legend is in the right sidebar, not over the tree.
- Title is compact and no longer blocks the canopy.
- Detail layer is hidden until a scientist is clicked.
- Nodes use a calmer, more even layout.

## Run locally

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```
