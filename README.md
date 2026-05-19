# The Women Who Made Science Bloom

A calm, interactive GitHub Pages science garden featuring 20 women scientists from across the world.

## Visual metaphor

- **Flower** = scientist
- **Branch** = breakthrough moment
- **Leaf** = discovery
- **Thorn** = struggle or barrier
- **Seed** = long-term impact

## What is included

The dataset includes scientists across physics, chemistry, medicine, mathematics, botany, genetics, environmental science, neuroscience, astrophysics, molecular biology and space mathematics.

Regions represented include:

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

Because the site loads `scientists.json`, open it through a local server rather than double-clicking the HTML file.

```bash
cd women-science-bloom/docs
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy on GitHub Pages

Use:

```text
Settings → Pages → Deploy from a branch → main → /docs
```

## Add or edit scientists

Edit:

```text
docs/data/scientists.json
```

Keep entries short so the garden stays readable.
