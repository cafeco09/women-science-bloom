const DATA_URL = "./data/scientists.json";

const svg = document.getElementById("treeSvg");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const centuryFilter = document.getElementById("centuryFilter");
const resetFilters = document.getElementById("resetFilters");
const emptyState = document.getElementById("emptyState");

const details = {
  name: document.getElementById("detailName"),
  field: document.getElementById("detailField"),
  years: document.getElementById("detailYears"),
  breakthrough: document.getElementById("detailBreakthrough"),
  discovery: document.getElementById("detailDiscovery"),
  struggle: document.getElementById("detailStruggle"),
  impact: document.getElementById("detailImpact"),
  source: document.getElementById("detailSource")
};

let scientists = [];
let selectedId = null;

function unique(list) {
  return [...new Set(list)].sort();
}

function populateFilters() {
  fieldFilter.innerHTML = '<option value="all">All fields</option>';
  centuryFilter.innerHTML = '<option value="all">All centuries</option>';

  unique(scientists.map((s) => s.field)).forEach((field) => {
    const option = document.createElement("option");
    option.value = field;
    option.textContent = field;
    fieldFilter.appendChild(option);
  });

  unique(scientists.map((s) => s.century)).forEach((century) => {
    const option = document.createElement("option");
    option.value = century;
    option.textContent = century;
    centuryFilter.appendChild(option);
  });
}

function updateStats(visibleCount) {
  document.getElementById("statScientists").textContent = scientists.length;
  document.getElementById("statFields").textContent = unique(scientists.map((s) => s.field)).length;
  document.getElementById("statCenturies").textContent = unique(scientists.map((s) => s.century)).length;
  document.getElementById("statVisible").textContent = visibleCount;
}

function isVisible(scientist) {
  const term = searchInput.value.trim().toLowerCase();
  const field = fieldFilter.value;
  const century = centuryFilter.value;

  const haystack = [
    scientist.name,
    scientist.field,
    scientist.century,
    scientist.branch,
    scientist.discovery,
    scientist.struggle,
    scientist.impact,
    scientist.keywords
  ].join(" ").toLowerCase();

  const matchesTerm = !term || haystack.includes(term);
  const matchesField = field === "all" || scientist.field === field;
  const matchesCentury = century === "all" || scientist.century === century;

  return matchesTerm && matchesField && matchesCentury;
}

function setDetails(scientist) {
  selectedId = scientist.id;

  details.name.textContent = scientist.name;
  details.field.textContent = scientist.field;
  details.years.textContent = `${scientist.years} · Breakthrough: ${scientist.breakthroughYear}`;
  details.breakthrough.textContent = scientist.branch;
  details.discovery.textContent = scientist.discovery;
  details.struggle.textContent = scientist.struggle;
  details.impact.textContent = scientist.impact;
  details.source.textContent = `Open source · ${scientist.source}`;
  details.source.href = scientist.sourceUrl;

  document.querySelectorAll(".flower").forEach((flower) => {
    flower.classList.toggle("active", flower.dataset.id === scientist.id);
  });
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);

  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  return el;
}

function makeFlower(x, y, radius, scientist, visible) {
  const group = svgEl("g", {
    class: `flower ${visible ? "" : "dimmed"} ${scientist.id === selectedId ? "active" : ""}`,
    transform: `translate(${x}, ${y})`,
    tabindex: "0",
    role: "button",
    "aria-label": `${scientist.name}, ${scientist.field}`
  });

  group.dataset.id = scientist.id;
  group.style.animationDelay = `${Math.random() * 0.35}s`;

  const petalCount = 7;

  for (let i = 0; i < petalCount; i += 1) {
    const angle = (Math.PI * 2 * i) / petalCount;
    const px = Math.cos(angle) * radius * 0.58;
    const py = Math.sin(angle) * radius * 0.58;

    group.appendChild(svgEl("ellipse", {
      class: "petal",
      cx: px.toFixed(1),
      cy: py.toFixed(1),
      rx: (radius * 0.42).toFixed(1),
      ry: (radius * 0.68).toFixed(1),
      transform: `rotate(${(angle * 180 / Math.PI).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})`
    }));
  }

  group.appendChild(svgEl("circle", {
    class: "centre",
    cx: 0,
    cy: 0,
    r: (radius * 0.38).toFixed(1)
  }));

  const label = svgEl("text", {
    class: "flower-name",
    x: 0,
    y: radius + 20,
    "text-anchor": "middle"
  });

  label.textContent = scientist.name;
  group.appendChild(label);

  group.addEventListener("click", () => setDetails(scientist));

  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDetails(scientist);
    }
  });

  return group;
}

function makeLeaf(x, y, angle, text, visible) {
  const group = svgEl("g", {
    class: `leaf ${visible ? "" : "dimmed"}`,
    transform: `translate(${x}, ${y}) rotate(${angle})`
  });

  group.appendChild(svgEl("path", {
    d: "M 0 0 C 22 -28 58 -24 74 0 C 55 24 22 28 0 0 Z"
  }));

  const label = svgEl("text", {
    x: 36,
    y: 4,
    "text-anchor": "middle",
    transform: `rotate(${-angle} 36 4)`
  });

  label.textContent = text;
  group.appendChild(label);

  return group;
}

function makeThorn(x, y, angle, visible) {
  const group = svgEl("g", {
    class: `thorn ${visible ? "" : "dimmed"}`,
    transform: `translate(${x}, ${y}) rotate(${angle})`
  });

  group.appendChild(svgEl("path", {
    d: "M 0 0 L 42 -13 L 30 17 Z"
  }));

  const label = svgEl("text", {
    x: 54,
    y: 4,
    transform: `rotate(${-angle} 54 4)`
  });

  label.textContent = "struggle";
  group.appendChild(label);

  return group;
}

function makeSeed(x, y, visible) {
  const group = svgEl("g", {
    class: `impact-seed ${visible ? "" : "dimmed"}`
  });

  group.appendChild(svgEl("circle", {
    cx: x,
    cy: y,
    r: 10
  }));

  const label = svgEl("text", {
    x: x + 15,
    y: y + 4
  });

  label.textContent = "impact";
  group.appendChild(label);

  return group;
}

function branchPath(startX, startY, endX, endY, curve = 0) {
  const midY = startY - Math.abs(endY - startY) * 0.55;
  const ctrl1X = startX + curve * 0.4;
  const ctrl2X = endX - curve * 0.18;

  return `M ${startX} ${startY} C ${ctrl1X} ${midY}, ${ctrl2X} ${midY}, ${endX} ${endY}`;
}

function clearSvgContent() {
  [...svg.querySelectorAll(":scope > g, :scope > path, :scope > text")].forEach((node) => node.remove());
}

function renderTree() {
  const width = svg.clientWidth || 900;
  const height = svg.clientHeight || 760;

  clearSvgContent();

  const visibleMap = new Map(scientists.map((s) => [s.id, isVisible(s)]));
  const visibleCount = [...visibleMap.values()].filter(Boolean).length;

  emptyState.style.display = visibleCount ? "none" : "block";
  updateStats(visibleCount);

  const rootX = width * 0.5;
  const rootY = height * 0.93;
  const trunkTopX = width * 0.5;
  const trunkTopY = height * 0.58;

  svg.appendChild(svgEl("path", {
    class: "trunk",
    d: `M ${rootX} ${rootY} C ${rootX - 34} ${height * 0.78}, ${rootX + 30} ${height * 0.68}, ${trunkTopX} ${trunkTopY}`
  }));

  const ordered = scientists.map((s, i) => ({ scientist: s, i }));
  const left = ordered.filter((_, i) => i % 2 === 0);
  const right = ordered.filter((_, i) => i % 2 === 1);

  const layout = [
    ...left.map((d, idx) => ({ ...d, side: -1, row: idx })),
    ...right.map((d, idx) => ({ ...d, side: 1, row: idx }))
  ];

  const maxRows = Math.max(left.length, right.length);
  const topY = height * 0.18;
  const rowGap = (height * 0.48) / Math.max(1, maxRows - 1);

  layout.forEach(({ scientist, side, row, i }) => {
    const visible = visibleMap.get(scientist.id);
    const endX = rootX + side * (width * (0.22 + (row % 2) * 0.08));
    const endY = topY + row * rowGap + (side === 1 ? 18 : 0);
    const curve = side * (width * 0.34);
    const startY = trunkTopY + row * 18;

    const path = svgEl("path", {
      class: `branch-line ${visible ? "" : "dimmed"}`,
      d: branchPath(trunkTopX, startY, endX, endY, curve)
    });

    path.style.animationDelay = `${i * 0.06}s`;
    svg.appendChild(path);

    const label = svgEl("text", {
      class: `branch-label ${visible ? "" : "dimmed"}`,
      x: endX - side * 50,
      y: endY - 44,
      "text-anchor": side === 1 ? "end" : "start"
    });

    label.textContent = `${scientist.breakthroughYear} · breakthrough`;
    svg.appendChild(label);

    const leafX = endX - side * 82;
    const leafY = endY + 18;
    svg.appendChild(makeLeaf(leafX, leafY, side === 1 ? 12 : -192, scientist.leafLabel || "discovery", visible));

    const thornX = endX - side * 46;
    const thornY = endY - 24;
    svg.appendChild(makeThorn(thornX, thornY, side === 1 ? -18 : 198, visible));

    const seedX = endX - side * 26;
    const seedY = endY + 72;
    svg.appendChild(makeSeed(seedX, seedY, visible));

    const flower = makeFlower(endX, endY, Math.max(22, Math.min(36, width * 0.035)), scientist, visible);
    svg.appendChild(flower);
  });

  const selected = scientists.find((s) => s.id === selectedId) || scientists[0];

  if (selected) {
    setDetails(selected);
  }
}

function handleFilterChange() {
  const currentSelected = scientists.find((s) => s.id === selectedId);

  if (currentSelected && !isVisible(currentSelected)) {
    const firstVisible = scientists.find(isVisible);
    if (firstVisible) {
      selectedId = firstVisible.id;
    }
  }

  renderTree();
}

async function init() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Could not load ${DATA_URL}`);
    }

    scientists = await response.json();
    selectedId = scientists[0]?.id || null;

    populateFilters();
    renderTree();
  } catch (error) {
    console.error(error);
    emptyState.style.display = "block";
    emptyState.querySelector("h3").textContent = "Data could not load";
    emptyState.querySelector("p").textContent = "Check that docs/data/scientists.json exists.";
  }
}

searchInput.addEventListener("input", handleFilterChange);
fieldFilter.addEventListener("change", handleFilterChange);
centuryFilter.addEventListener("change", handleFilterChange);

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  fieldFilter.value = "all";
  centuryFilter.value = "all";
  selectedId = scientists[0]?.id || null;
  renderTree();
});

window.addEventListener("resize", () => {
  window.clearTimeout(window.__treeResize);
  window.__treeResize = window.setTimeout(renderTree, 150);
});

init();
