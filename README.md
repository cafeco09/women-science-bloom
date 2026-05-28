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


## Detail header fix

This version fixes the small overlap in the floating detail layer by stacking the field, origin and breakthrough pills beneath the scientist name instead of forcing them into the same row.


## Link and timeline-year fix

This version updates every detail-layer button to open a stable scientist profile page and rotates the timeline years by 90 degrees for a cleaner analysis chart.
