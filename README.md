# The Women Who Made Science Bloom

A GitHub Pages interactive project built as a living tree of women scientists, now with a **bottom analysis drawer**.

## What changed in this version

The previous tree tried to show too many full names directly on the canopy, which created overlap and reduced readability.

This version fixes that by:

- keeping the tree itself visually clean
- showing **names on hover**
- opening a **bottom analysis card / drawer** when a flower is clicked
- adding **comparative charts** and quick metrics inside that drawer

## Included analysis

When a scientist is selected, the drawer shows:

- breakthrough year
- field peer count
- region peer count
- era rank in the full timeline
- timeline chart
- field distribution chart
- region distribution chart

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
