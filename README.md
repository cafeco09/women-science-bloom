# The Women Who Made Science Bloom

A forced right-sidebar, no-scroll one-page version.

## What this version fixes

The filter panel was appearing above the tree because a responsive breakpoint moved the sidebar into a stacked layout. This version keeps the layout side-by-side on laptop/desktop widths.

- Quote ribbon is only 30px high.
- Tree and filters sit in the same row.
- Filter panel is fixed on the right.
- Tree is visible immediately on page load.
- No desktop scroll.
- Layout only stacks on very narrow phone screens under 640px.

## Run locally

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```
