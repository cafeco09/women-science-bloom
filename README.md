# The Women Who Made Science Bloom

An interactive science garden of women scientists, their breakthrough moments, discoveries, struggles and long-term impact.

## Visual metaphor

- **Flower** = scientist
- **Branch** = breakthrough moment
- **Leaf** = discovery
- **Thorn** = struggle or barrier
- **Seed** = long-term impact

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

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/docs`
4. Save.

Your site should appear at:

```text
https://YOUR_USERNAME.github.io/women-science-bloom/
```

For the existing `cafeco09` account, the likely URL is:

```text
https://cafeco09.github.io/women-science-bloom/
```

## Add more scientists

Edit:

```text
docs/data/scientists.json
```

Add a new object with this structure:

```json
{
  "id": "unique-id",
  "name": "Scientist Name",
  "field": "Field",
  "century": "20th",
  "years": "1900–1999",
  "breakthroughYear": 1950,
  "branch": "Breakthrough moment.",
  "discovery": "Discovery or contribution.",
  "struggle": "Barrier or struggle.",
  "impact": "Long-term impact.",
  "source": "Source name",
  "sourceUrl": "https://example.com",
  "keywords": "searchable keywords",
  "leafLabel": "short label"
}
```

## Framing note

The thorn is deliberately secondary. The project should not reduce women scientists to suffering. The centre of the story is the scientist, the breakthrough and the discovery.
