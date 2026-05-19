const DATA_URL = "./data/scientists.json";

const treeSvg = document.getElementById("treeSvg");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const regionFilter = document.getElementById("regionFilter");
const centuryFilter = document.getElementById("centuryFilter");
const resetFilters = document.getElementById("resetFilters");
const emptyState = document.getElementById("emptyState");
const visibleCount = document.getElementById("visibleCount");
const pollenLayer = document.getElementById("pollenLayer");
const petalLayer = document.getElementById("petalLayer");

const details = {
  name: document.getElementById("detailName"),
  meta: document.getElementById("detailMeta"),
  field: document.getElementById("detailField"),
  origin: document.getElementById("detailOrigin"),
  year: document.getElementById("detailYear"),
  breakthrough: document.getElementById("detailBreakthrough"),
  discovery: document.getElementById("detailDiscovery"),
  struggle: document.getElementById("detailStruggle"),
  impact: document.getElementById("detailImpact"),
  source: document.getElementById("detailSource")
};

const metrics = {
  breakthroughYear: document.getElementById("metricBreakthroughYear"),
  fieldPeers: document.getElementById("metricFieldPeers"),
  regionPeers: document.getElementById("metricRegionPeers"),
  eraRank: document.getElementById("metricEraRank")
};

const timelineChart = document.getElementById("timelineChart");
const fieldChart = document.getElementById("fieldChart");
const regionChart = document.getElementById("regionChart");

let scientists = [];
let selectedId = null;

function unique(values) {
  return [...new Set(values)].sort();
}

function populateFilters() {
  unique(scientists.map((s) => s.field)).forEach((field) => {
    const option = document.createElement("option");
    option.value = field;
    option.textContent = field;
    fieldFilter.appendChild(option);
  });
  unique(scientists.map((s) => s.region)).forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionFilter.appendChild(option);
  });
  unique(scientists.map((s) => s.century)).forEach((century) => {
    const option = document.createElement("option");
    option.value = century;
    option.textContent = century;
    centuryFilter.appendChild(option);
  });
}

function matchesFilters(scientist) {
  const search = searchInput.value.trim().toLowerCase();
  const field = fieldFilter.value;
  const region = regionFilter.value;
  const century = centuryFilter.value;

  const text = [
    scientist.name, scientist.field, scientist.region, scientist.origin, scientist.century,
    scientist.branch, scientist.discovery, scientist.struggle, scientist.impact, scientist.keywords, scientist.leafLabel
  ].join(" ").toLowerCase();

  return (
    (!search || text.includes(search)) &&
    (field === "all" || scientist.field === field) &&
    (region === "all" || scientist.region === region) &&
    (century === "all" || scientist.century === century)
  );
}

function setDetails(scientist) {
  selectedId = scientist.id;
  details.name.textContent = scientist.name;
  details.meta.textContent = `${scientist.years} · ${scientist.century}`;
  details.field.textContent = scientist.field;
  details.origin.textContent = scientist.origin;
  details.year.textContent = `Breakthrough ${scientist.breakthroughYear}`;
  details.breakthrough.textContent = scientist.branch;
  details.discovery.textContent = scientist.discovery;
  details.struggle.textContent = scientist.struggle;
  details.impact.textContent = scientist.impact;
  details.source.textContent = `Open source · ${scientist.source}`;
  details.source.href = scientist.sourceUrl;
  updateAnalysis(scientist);
}

function updateAnalysis(scientist) {
  const sorted = [...scientists].sort((a, b) => a.breakthroughYear - b.breakthroughYear);
  const rank = sorted.findIndex((s) => s.id === scientist.id) + 1;
  const fieldPeers = scientists.filter((s) => s.field === scientist.field).length;
  const regionPeers = scientists.filter((s) => s.region === scientist.region).length;

  metrics.breakthroughYear.textContent = scientist.breakthroughYear;
  metrics.fieldPeers.textContent = fieldPeers;
  metrics.regionPeers.textContent = regionPeers;
  metrics.eraRank.textContent = `${rank}/${scientists.length}`;

  renderTimeline(sorted, scientist);
  renderDistribution(fieldChart, countBy(scientists, "field"), scientist.field);
  renderDistribution(regionChart, countBy(scientists, "region"), scientist.region);
}

function countBy(items, key) {
  const map = new Map();
  items.forEach((item) => map.set(item[key], (map.get(item[key]) || 0) + 1));
  return [...map.entries()].map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function renderTimeline(sorted, selected) {
  timelineChart.innerHTML = "";
  const minYear = sorted[0].breakthroughYear;
  const maxYear = sorted[sorted.length - 1].breakthroughYear;
  const span = Math.max(1, maxYear - minYear);

  sorted.forEach((scientist) => {
    const bar = document.createElement("div");
    const relative = scientist.breakthroughYear - minYear;
    const height = 24 + (relative / span) * 76;
    bar.className = "timeline-bar" + (scientist.id === selected.id ? " selected" : "");
    bar.style.height = `${height}px`;
    bar.dataset.year = scientist.breakthroughYear;
    bar.dataset.name = scientist.name;
    timelineChart.appendChild(bar);
  });
}

function renderDistribution(container, data, highlightLabel) {
  container.innerHTML = "";
  const max = Math.max(...data.map((d) => d.value), 1);
  data.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row" + (item.label === highlightLabel ? " highlight" : "");

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = item.label;

    const track = document.createElement("div");
    track.className = "bar-track";

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${(item.value / max) * 100}%`;
    track.appendChild(fill);

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = item.value;

    row.append(label, track, value);
    container.appendChild(row);
  });
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function buildAmbientParticles() {
  pollenLayer.innerHTML = "";
  petalLayer.innerHTML = "";

  for (let i = 0; i < 22; i += 1) {
    const pollen = document.createElement("span");
    pollen.className = "pollen";
    pollen.style.left = `${Math.random() * 100}%`;
    pollen.style.bottom = `${Math.random() * 26}%`;
    pollen.style.animationDuration = `${8 + Math.random() * 9}s`;
    pollen.style.animationDelay = `${Math.random() * 8}s`;
    pollen.style.transform = `scale(${0.7 + Math.random() * 1.1})`;
    pollenLayer.appendChild(pollen);
  }

  for (let i = 0; i < 14; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 92 + 2}%`;
    petal.style.top = `${Math.random() * 30}%`;
    petal.style.animationDuration = `${10 + Math.random() * 10}s`;
    petal.style.animationDelay = `${Math.random() * 10}s`;
    petal.style.transform = `rotate(${Math.random() * 180}deg) scale(${0.7 + Math.random() * 0.8})`;
    petalLayer.appendChild(petal);
  }
}

function getSlots(count) {
  const tiers = [
    { y: 0.15, xs: [0.46, 0.54] },
    { y: 0.24, xs: [0.34, 0.46, 0.54, 0.66] },
    { y: 0.34, xs: [0.22, 0.34, 0.46, 0.54, 0.66, 0.78] },
    { y: 0.47, xs: [0.16, 0.28, 0.40, 0.60, 0.72, 0.84] },
    { y: 0.60, xs: [0.24, 0.38, 0.62, 0.76] }
  ];
  const slots = [];
  for (const tier of tiers) {
    for (const x of tier.xs) {
      if (slots.length < count) slots.push({ x, y: tier.y });
    }
  }
  return slots;
}

function cubicPath(startX, startY, endX, endY, bend = 0.2) {
  const dx = endX - startX;
  const dy = endY - startY;
  const ctrl1X = startX + dx * 0.3;
  const ctrl1Y = startY - Math.abs(dy) * bend;
  const ctrl2X = endX - dx * 0.22;
  const ctrl2Y = endY + Math.abs(dy) * bend * 0.25;
  return `M ${startX} ${startY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${endX} ${endY}`;
}

function renderCanopyLeaves(width, height) {
  const clusterPositions = [
    [0.18, 0.36, 22], [0.28, 0.22, -16], [0.37, 0.18, 18], [0.63, 0.18, -18], [0.72, 0.22, 14],
    [0.82, 0.36, -20], [0.25, 0.50, 12], [0.75, 0.50, -14], [0.50, 0.12, 0], [0.50, 0.29, 16]
  ];

  clusterPositions.forEach(([xf, yf, angle], idx) => {
    const leaf = svgEl("ellipse", {
      class: "canopy-leaf",
      cx: width * xf,
      cy: height * yf,
      rx: 34 + (idx % 3) * 7,
      ry: 18 + (idx % 2) * 5,
      transform: `rotate(${angle} ${width * xf} ${height * yf})`
    });
    leaf.style.animationDelay = `${idx * 0.3}s`;
    treeSvg.appendChild(leaf);
  });
}

function renderStaticTree(width, height) {
  const cx = width * 0.5;
  const rootY = height * 0.92;
  const trunkTopY = height * 0.53;

  const trunk = svgEl("path", {
    class: "trunk-path",
    d: `M ${cx} ${rootY} C ${cx - 18} ${height * 0.84}, ${cx + 24} ${height * 0.68}, ${cx} ${trunkTopY}`,
    "stroke-width": 22
  });
  treeSvg.appendChild(trunk);

  const boughs = [
    { start: [cx, height * 0.64], end: [cx - width * 0.19, height * 0.53] },
    { start: [cx, height * 0.64], end: [cx + width * 0.19, height * 0.53] },
    { start: [cx, height * 0.55], end: [cx - width * 0.11, height * 0.36] },
    { start: [cx, height * 0.55], end: [cx + width * 0.11, height * 0.36] },
    { start: [cx, trunkTopY], end: [cx, height * 0.27] },
    { start: [cx - width * 0.19, height * 0.53], end: [cx - width * 0.28, height * 0.42] },
    { start: [cx + width * 0.19, height * 0.53], end: [cx + width * 0.28, height * 0.42] }
  ];

  boughs.forEach((b) => {
    const path = svgEl("path", {
      class: "bough-path",
      d: cubicPath(b.start[0], b.start[1], b.end[0], b.end[1], 0.35)
    });
    treeSvg.appendChild(path);
  });

  renderCanopyLeaves(width, height);

  return {
    top: [cx, height * 0.27],
    leftUpper: [cx - width * 0.11, height * 0.36],
    rightUpper: [cx + width * 0.11, height * 0.36],
    leftMid: [cx - width * 0.19, height * 0.53],
    rightMid: [cx + width * 0.19, height * 0.53],
    leftOuter: [cx - width * 0.28, height * 0.42],
    rightOuter: [cx + width * 0.28, height * 0.42]
  };
}

function chooseAnchor(slot, anchors) {
  if (slot.y <= 0.17) return anchors.top;
  if (slot.x < 0.23) return anchors.leftOuter;
  if (slot.x > 0.77) return anchors.rightOuter;
  if (slot.x < 0.5 && slot.y < 0.40) return anchors.leftUpper;
  if (slot.x > 0.5 && slot.y < 0.40) return anchors.rightUpper;
  if (slot.x < 0.5) return anchors.leftMid;
  return anchors.rightMid;
}

function paletteFromName(name) {
  const palettes = [
    { skin: "#f2c8b5", hair: "#5e3524", coat: "#8d4f63" },
    { skin: "#d8a189", hair: "#2f1a13", coat: "#4c7b43" },
    { skin: "#b87d65", hair: "#3b231d", coat: "#426d92" },
    { skin: "#f1d0b8", hair: "#6e5b54", coat: "#7a5a96" },
    { skin: "#c98e76", hair: "#2f2521", coat: "#aa6b3e" }
  ];
  let total = 0;
  for (const ch of name) total += ch.charCodeAt(0);
  return palettes[total % palettes.length];
}

function makeFaceIllustration(group, x, y, palette) {
  // shoulders
  group.appendChild(svgEl("path", {
    class: "face-coat",
    fill: palette.coat,
    d: `M ${x - 18} ${y + 19} Q ${x} ${y + 4} ${x + 18} ${y + 19} L ${x + 18} ${y + 26} L ${x - 18} ${y + 26} Z`
  }));
  // hair back
  group.appendChild(svgEl("ellipse", {
    class: "face-hair",
    cx: x,
    cy: y - 4,
    rx: 14.5,
    ry: 16.5,
    fill: palette.hair
  }));
  // face
  group.appendChild(svgEl("ellipse", {
    class: "face-skin",
    cx: x,
    cy: y - 1,
    rx: 10.8,
    ry: 12.8,
    fill: palette.skin
  }));
  // fringe / top hair
  group.appendChild(svgEl("path", {
    class: "face-hair",
    fill: palette.hair,
    d: `M ${x - 11} ${y - 5} Q ${x - 6} ${y - 18} ${x + 1} ${y - 15} Q ${x + 9} ${y - 13} ${x + 11} ${y - 4} Q ${x + 4} ${y - 10} ${x - 11} ${y - 5} Z`
  }));
  // eyes
  group.appendChild(svgEl("circle", { cx: x - 3.2, cy: y - 2, r: 0.9, fill: "#3b2d2c" }));
  group.appendChild(svgEl("circle", { cx: x + 3.2, cy: y - 2, r: 0.9, fill: "#3b2d2c" }));
  // mouth
  group.appendChild(svgEl("path", {
    d: `M ${x - 3} ${y + 4} Q ${x} ${y + 6} ${x + 3} ${y + 4}`,
    stroke: "#8f5c5c",
    "stroke-width": 1,
    fill: "none",
    "stroke-linecap": "round"
  }));
}

function makeDiscoveryLeaf(x, y, label) {
  const group = svgEl("g", { class: "discovery-leaf", transform: `translate(${x}, ${y}) rotate(-12)` });
  group.appendChild(svgEl("path", { d: "M 0 0 C 18 -22 52 -18 66 0 C 52 20 18 24 0 0 Z" }));
  const text = svgEl("text", { x: 33, y: 4 });
  text.textContent = label;
  group.appendChild(text);
  return group;
}

function makeSeedTag(x, y) {
  const group = svgEl("g", { class: "seed-tag", transform: `translate(${x}, ${y})` });
  group.appendChild(svgEl("circle", { cx: 0, cy: 0, r: 11 }));
  const text = svgEl("text", { x: 0, y: 4 });
  text.textContent = "impact";
  group.appendChild(text);
  return group;
}

function makeThornTag(x, y, rotation = 0) {
  const group = svgEl("g", { class: "thorn-tag", transform: `translate(${x}, ${y}) rotate(${rotation})` });
  group.appendChild(svgEl("path", { d: "M 0 0 L 18 -8 L 14 10 Z" }));
  const text = svgEl("text", { x: 26, y: 4 });
  text.textContent = "thorn";
  group.appendChild(text);
  return group;
}

function makeThoughtBubble(x, y, scientist) {
  const labelWidth = Math.max(92, Math.min(170, scientist.name.length * 7.5));
  const group = svgEl("g", { class: "thought-bubble", transform: `translate(${x}, ${y - 58})` });
  group.appendChild(svgEl("circle", { cx: -18, cy: 21, r: 4 }));
  group.appendChild(svgEl("circle", { cx: -10, cy: 14, r: 6 }));
  group.appendChild(svgEl("rect", { x: -labelWidth / 2, y: -18, width: labelWidth, height: 32, rx: 16, ry: 16 }));
  const text = svgEl("text", { x: 0, y: 2 });
  text.textContent = scientist.name;
  group.appendChild(text);
  return group;
}

function makePortraitNode(x, y, scientist, selected = false) {
  const group = svgEl("g", {
    class: `portrait-group ${selected ? "active" : ""}`,
    tabindex: "0",
    role: "button",
    "aria-label": `${scientist.name}, ${scientist.field}`
  });
  group.dataset.id = scientist.id;

  group.appendChild(svgEl("circle", { class: "portrait-ring", cx: x, cy: y, r: 28 }));
  group.appendChild(svgEl("circle", { class: "portrait-inner", cx: x, cy: y, r: 23 }));

  if (scientist.portrait) {
    const clipId = `clip-${scientist.id}`;
    const clip = svgEl("clipPath", { id: clipId });
    clip.appendChild(svgEl("circle", { cx: x, cy: y, r: 23 }));
    treeSvg.appendChild(clip);
    const img = svgEl("image", {
      href: scientist.portrait,
      x: x - 23, y: y - 23, width: 46, height: 46,
      "clip-path": `url(#${clipId})`,
      preserveAspectRatio: "xMidYMid slice"
    });
    group.appendChild(img);
  } else {
    makeFaceIllustration(group, x, y, paletteFromName(scientist.name));
  }

  group.appendChild(makeThoughtBubble(x, y, scientist));

  if (selected) {
    group.appendChild(makeDiscoveryLeaf(x + 32, y - 18, scientist.leafLabel || "discovery"));
    group.appendChild(makeSeedTag(x + 18, y + 54));
    group.appendChild(makeThornTag(x - 34, y - 8, -20));
  }

  group.addEventListener("click", () => {
    selectedId = scientist.id;
    renderTree();
    document.getElementById("analysisDrawer").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectedId = scientist.id;
      renderTree();
      document.getElementById("analysisDrawer").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  return group;
}

function clearRenderedSvg() {
  [...treeSvg.querySelectorAll(":scope > g, :scope > path, :scope > ellipse, :scope > clipPath, :scope > circle")].forEach((node) => node.remove());
}

function renderTree() {
  const visibleScientists = scientists.filter(matchesFilters);
  visibleCount.textContent = `${visibleScientists.length} visible · ${scientists.length} total`;
  emptyState.style.display = visibleScientists.length ? "none" : "block";

  const width = treeSvg.clientWidth || treeSvg.parentElement.clientWidth || 1000;
  const height = treeSvg.clientHeight || treeSvg.parentElement.clientHeight || 800;

  clearRenderedSvg();
  const anchors = renderStaticTree(width, height);

  if (!visibleScientists.length) return;

  const slots = getSlots(visibleScientists.length);

  if (!visibleScientists.some((s) => s.id === selectedId)) {
    selectedId = visibleScientists[0].id;
  }

  visibleScientists.forEach((scientist, index) => {
    const slot = slots[index];
    const endX = width * slot.x;
    const endY = height * slot.y;
    const anchor = chooseAnchor(slot, anchors);

    const twig = svgEl("path", {
      class: `twig-path ${scientist.id === selectedId ? "active" : ""}`,
      d: cubicPath(anchor[0], anchor[1], endX, endY, 0.28)
    });
    treeSvg.appendChild(twig);

    const portraitNode = makePortraitNode(endX, endY, scientist, scientist.id === selectedId);
    treeSvg.appendChild(portraitNode);
  });

  const selected = visibleScientists.find((s) => s.id === selectedId) || visibleScientists[0];
  if (selected) setDetails(selected);
}

function resetAll() {
  searchInput.value = "";
  fieldFilter.value = "all";
  regionFilter.value = "all";
  centuryFilter.value = "all";
  selectedId = scientists[0]?.id || null;
  renderTree();
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
    scientists = await response.json();
    selectedId = scientists[0]?.id || null;
    populateFilters();
    buildAmbientParticles();
    renderTree();
  } catch (error) {
    console.error(error);
    emptyState.style.display = "block";
    emptyState.querySelector("h3").textContent = "Dataset could not load";
    emptyState.querySelector("p").textContent = "Check that docs/data/scientists.json exists.";
  }
}

searchInput.addEventListener("input", renderTree);
fieldFilter.addEventListener("change", renderTree);
regionFilter.addEventListener("change", renderTree);
centuryFilter.addEventListener("change", renderTree);
resetFilters.addEventListener("click", resetAll);

window.addEventListener("resize", () => {
  window.clearTimeout(window.__treeResize);
  window.__treeResize = window.setTimeout(renderTree, 160);
});

init();
