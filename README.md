# The Women Who Made Science Bloom

Final clean-grid tree version.

## What this fixes

The earlier versions put too many interface elements over the tree and let portrait labels collide. This version uses a fixed 5×4 canopy grid so names do not overlap.

- No title card over the tree.
- No legend cards over the tree.
- Title, controls and legend sit in the right sidebar.
- Faces and names use fixed canopy positions.
- Detail layer opens only after clicking a scientist.
- No desktop scroll.
- Moving quotes remain at the top.

## Run locally

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```
