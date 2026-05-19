const DATA_URL = "./data/scientists.json";

const nodeLayer = document.getElementById("nodeLayer");
const pollenLayer = document.getElementById("pollenLayer");
const quoteTrack = document.getElementById("quoteTrack");
const emptyState = document.getElementById("emptyState");
const detailLayer = document.getElementById("detailLayer");
const closeLayer = document.getElementById("closeLayer");

const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const regionFilter = document.getElementById("regionFilter");
const centuryFilter = document.getElementById("centuryFilter");
const resetFilters = document.getElementById("resetFilters");
const visibleCount = document.getElementById("visibleCount");

const details = {
  name: document.getElementById("detailName"),
  meta: document.getElementById("detailMeta"),
  field: document.getElementById("detailField"),
  origin: document.getElementById("detailOrigin"),
  year: document.getElementById("detailYear"),
  portrait: document.getElementById("detailPortrait"),
  breakthrough: document.getElementById("detailBreakthrough"),
  discovery: document.getElementById("detailDiscovery"),
  struggle: document.getElementById("detailStruggle"),
  impact: document.getElementById("detailImpact"),
  quote: document.getElementById("detailQuote"),
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
let hasOpenedDetail = false;

// More even canopy placement, with top-left space reserved for the small title card.
const slots = [
  { x: 43, y: 10 }, { x: 57, y: 10 }, { x: 72, y: 12 }, { x: 86, y: 16 },
  { x: 31, y: 20 }, { x: 45, y: 22 }, { x: 59, y: 22 }, { x: 73, y: 23 }, { x: 89, y: 30 },
  { x: 13, y: 42 }, { x: 27, y: 39 }, { x: 41, y: 42 }, { x: 59, y: 42 }, { x: 73, y: 39 }, { x: 87, y: 42 },
  { x: 23, y: 61 }, { x: 38, y: 61 }, { x: 62, y: 61 }, { x: 77, y: 61 },
  { x: 50, y: 78 }
];

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

function buildQuotes() {
  const content = scientists.map((s) => (
    `<span class="quote-chip"><b>${s.name}</b><span>“${s.quote || s.discovery}”</span></span>`
  )).join("");

  quoteTrack.innerHTML = content + content;
}

function buildPollen() {
  pollenLayer.innerHTML = "";

  for (let i = 0; i < 20; i += 1) {
    const pollen = document.createElement("span");
    pollen.className = "pollen";
    pollen.style.left = `${Math.random() * 100}%`;
    pollen.style.bottom = `${Math.random() * 26}%`;
    pollen.style.animationDuration = `${8 + Math.random() * 9}s`;
    pollen.style.animationDelay = `${Math.random() * 8}s`;
    pollen.style.transform = `scale(${0.7 + Math.random() * 1.1})`;
    pollenLayer.appendChild(pollen);
  }
}

function splitName(name) {
  const parts = name.split(" ");

  if (parts.length <= 2) {
    return name;
  }

  const midpoint = Math.ceil(parts.length / 2);
  return `${parts.slice(0, midpoint).join(" ")}<br>${parts.slice(midpoint).join(" ")}`;
}

function matchesFilters(scientist) {
  const search = searchInput.value.trim().toLowerCase();
  const field = fieldFilter.value;
  const region = regionFilter.value;
  const century = centuryFilter.value;

  const text = [
    scientist.name,
    scientist.field,
    scientist.region,
    scientist.origin,
    scientist.century,
    scientist.branch,
    scientist.discovery,
    scientist.struggle,
    scientist.impact,
    scientist.keywords,
    scientist.leafLabel
  ].join(" ").toLowerCase();

  return (
    (!search || text.includes(search)) &&
    (field === "all" || scientist.field === field) &&
    (region === "all" || scientist.region === region) &&
    (century === "all" || scientist.century === century)
  );
}

function renderNodes() {
  const visible = scientists.filter(matchesFilters);
  nodeLayer.innerHTML = "";
  visibleCount.textContent = `${visible.length} visible`;

  emptyState.style.display = visible.length ? "none" : "block";

  if (!visible.length) {
    detailLayer.classList.add("hidden");
    return;
  }

  if (!visible.some((s) => s.id === selectedId)) {
    selectedId = visible[0].id;
  }

  visible.forEach((scientist, index) => {
    const slot = slots[index % slots.length];

    const button = document.createElement("button");
    button.type = "button";
    button.className = "scientist-node" + (scientist.id === selectedId ? " active" : "");
    button.style.left = `${slot.x}%`;
    button.style.top = `${slot.y}%`;
    button.setAttribute("aria-label", `Open details for ${scientist.name}`);

    button.innerHTML = `
      <span class="face-frame">
        <img src="${scientist.portrait}" alt="${scientist.name}" loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22%3E%3Crect width=%22120%22 height=%22120%22 fill=%22%23fff3f6%22/%3E%3Ccircle cx=%2260%22 cy=%2246%22 r=%2223%22 fill=%22%23c34966%22/%3E%3Cpath d=%22M24 110c7-26 65-26 72 0%22 fill=%22%238f2942%22/%3E%3C/svg%3E';" />
      </span>
      <span class="name-badge">${splitName(scientist.name)}</span>
    `;

    button.addEventListener("click", () => {
      selectedId = scientist.id;
      hasOpenedDetail = true;
      setDetails(scientist);
      renderNodes();
    });

    nodeLayer.appendChild(button);
  });

  if (hasOpenedDetail) {
    const selected = visible.find((s) => s.id === selectedId) || visible[0];
    setDetails(selected);
  }
}

function setDetails(scientist) {
  detailLayer.classList.remove("hidden");

  details.name.textContent = scientist.name;
  details.meta.textContent = `${scientist.years} · ${scientist.century}`;
  details.field.textContent = scientist.field;
  details.origin.textContent = scientist.origin;
  details.year.textContent = `Breakthrough ${scientist.breakthroughYear}`;
  details.portrait.src = scientist.portrait;
  details.portrait.alt = scientist.name;
  details.breakthrough.textContent = scientist.branch;
  details.discovery.textContent = scientist.discovery;
  details.struggle.textContent = scientist.struggle;
  details.impact.textContent = scientist.impact;
  details.quote.textContent = `“${scientist.quote || scientist.discovery}”`;
  details.source.href = scientist.sourceUrl;
  details.source.textContent = `Open source · ${scientist.source}`;

  updateAnalysis(scientist);
}

function countBy(items, key) {
  const map = new Map();

  items.forEach((item) => {
    map.set(item[key], (map.get(item[key]) || 0) + 1);
  });

  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function updateAnalysis(scientist) {
  const sorted = [...scientists].sort((a, b) => a.breakthroughYear - b.breakthroughYear);
  const rank = sorted.findIndex((s) => s.id === scientist.id) + 1;

  metrics.breakthroughYear.textContent = scientist.breakthroughYear;
  metrics.fieldPeers.textContent = scientists.filter((s) => s.field === scientist.field).length;
  metrics.regionPeers.textContent = scientists.filter((s) => s.region === scientist.region).length;
  metrics.eraRank.textContent = `${rank}/${scientists.length}`;

  renderTimeline(sorted, scientist);
  renderDistribution(fieldChart, countBy(scientists, "field"), scientist.field);
  renderDistribution(regionChart, countBy(scientists, "region"), scientist.region);
}

function renderTimeline(sorted, selected) {
  timelineChart.innerHTML = "";

  const minYear = sorted[0].breakthroughYear;
  const maxYear = sorted[sorted.length - 1].breakthroughYear;
  const span = Math.max(1, maxYear - minYear);

  sorted.forEach((scientist) => {
    const bar = document.createElement("div");
    const relative = scientist.breakthroughYear - minYear;
    const height = 18 + (relative / span) * 50;

    bar.className = "timeline-bar" + (scientist.id === selected.id ? " selected" : "");
    bar.style.height = `${height}px`;
    bar.dataset.year = scientist.breakthroughYear;

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

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = item.value;

    track.appendChild(fill);
    row.append(label, track, value);
    container.appendChild(row);
  });
}

function resetTree() {
  searchInput.value = "";
  fieldFilter.value = "all";
  regionFilter.value = "all";
  centuryFilter.value = "all";
  selectedId = scientists[0]?.id || null;
  hasOpenedDetail = false;
  detailLayer.classList.add("hidden");
  renderNodes();
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
    buildQuotes();
    buildPollen();
    renderNodes();
  } catch (error) {
    console.error(error);
    emptyState.style.display = "block";
    emptyState.querySelector("h3").textContent = "Dataset could not load";
    emptyState.querySelector("p").textContent = "Check that docs/data/scientists.json exists.";
  }
}

searchInput.addEventListener("input", renderNodes);
fieldFilter.addEventListener("change", renderNodes);
regionFilter.addEventListener("change", renderNodes);
centuryFilter.addEventListener("change", renderNodes);
resetFilters.addEventListener("click", resetTree);
closeLayer.addEventListener("click", () => detailLayer.classList.add("hidden"));

init();
