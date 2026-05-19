# The Women Who Made Science Bloom

Fullscreen right-sidebar version.

## What this fixes

The earlier layout made the title area too large, which compressed the tree into the bottom of the frame. This version removes the large header from document flow and places the title as a small overlay card inside the tree.

- Tree uses the full left frame.
- Filter stays fixed on the right.
- Title is compact and does not push the tree down.
- Details stay hidden until a scientist is clicked.
- No desktop scroll.
- Layout only stacks below 640px width.

## Run locally

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```
