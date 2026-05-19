const DATA_URL = "./data/scientists.json";

const flowerGrid = document.getElementById("flowerGrid");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const centuryFilter = document.getElementById("centuryFilter");
const resetFilters = document.getElementById("resetFilters");
const emptyState = document.getElementById("emptyState");
const visibleCount = document.getElementById("visibleCount");

const details = {
  name: document.getElementById("detailName"),
  meta: document.getElementById("detailMeta"),
  field: document.getElementById("detailField"),
  year: document.getElementById("detailYear"),
  breakthrough: document.getElementById("detailBreakthrough"),
  discovery: document.getElementById("detailDiscovery"),
  struggle: document.getElementById("detailStruggle"),
  impact: document.getElementById("detailImpact"),
  source: document.getElementById("detailSource")
};

let scientists = [];
let selectedId = null;

function unique(values) {
  return [...new Set(values)].sort();
}

function populateFilters() {
  unique(scientists.map((scientist) => scientist.field)).forEach((field) => {
    const option = document.createElement("option");
    option.value = field;
    option.textContent = field;
    fieldFilter.appendChild(option);
  });

  unique(scientists.map((scientist) => scientist.century)).forEach((century) => {
    const option = document.createElement("option");
    option.value = century;
    option.textContent = century;
    centuryFilter.appendChild(option);
  });
}

function matchesFilters(scientist) {
  const search = searchInput.value.trim().toLowerCase();
  const field = fieldFilter.value;
  const century = centuryFilter.value;

  const text = [
    scientist.name,
    scientist.field,
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
    (century === "all" || scientist.century === century)
  );
}

function selectScientist(scientist) {
  selectedId = scientist.id;

  details.name.textContent = scientist.name;
  details.meta.textContent = `${scientist.years} · ${scientist.century}`;
  details.field.textContent = scientist.field;
  details.year.textContent = `Breakthrough ${scientist.breakthroughYear}`;
  details.breakthrough.textContent = scientist.branch;
  details.discovery.textContent = scientist.discovery;
  details.struggle.textContent = scientist.struggle;
  details.impact.textContent = scientist.impact;
  details.source.textContent = `Open source · ${scientist.source}`;
  details.source.href = scientist.sourceUrl;

  document.querySelectorAll(".flower-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === selectedId);
  });
}

function createFlowerCard(scientist) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flower-card";
  button.dataset.id = scientist.id;
  button.setAttribute("aria-label", `Open story for ${scientist.name}`);

  button.innerHTML = `
    <div class="flower-head">
      <span class="bloom-icon" aria-hidden="true"></span>
      <span>
        <h3>${scientist.name}</h3>
        <span class="field">${scientist.field}</span>
      </span>
    </div>
    <div class="mini-story" aria-label="Short discovery labels">
      <span>${scientist.breakthroughYear}</span>
      <span>${scientist.leafLabel}</span>
      <span>${scientist.century}</span>
    </div>
  `;

  button.addEventListener("click", () => {
    selectScientist(scientist);
  });

  return button;
}

function renderGarden() {
  const filtered = scientists.filter(matchesFilters);

  flowerGrid.innerHTML = "";
  filtered.forEach((scientist) => {
    flowerGrid.appendChild(createFlowerCard(scientist));
  });

  emptyState.style.display = filtered.length ? "none" : "block";
  visibleCount.textContent = `${filtered.length} visible`;

  const selectedStillVisible = filtered.some((scientist) => scientist.id === selectedId);

  if (!selectedStillVisible && filtered[0]) {
    selectScientist(filtered[0]);
  } else {
    const selected = scientists.find((scientist) => scientist.id === selectedId) || filtered[0] || scientists[0];
    if (selected) selectScientist(selected);
  }
}

function resetGarden() {
  searchInput.value = "";
  fieldFilter.value = "all";
  centuryFilter.value = "all";
  selectedId = scientists[0]?.id || null;
  renderGarden();
}

async function init() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Unable to load ${DATA_URL}`);
    }

    scientists = await response.json();
    selectedId = scientists[0]?.id || null;
    populateFilters();
    renderGarden();
  } catch (error) {
    console.error(error);
    emptyState.style.display = "block";
    emptyState.querySelector("h3").textContent = "Dataset could not load";
    emptyState.querySelector("p").textContent = "Check that docs/data/scientists.json exists.";
  }
}

searchInput.addEventListener("input", renderGarden);
fieldFilter.addEventListener("change", renderGarden);
centuryFilter.addEventListener("change", renderGarden);
resetFilters.addEventListener("click", resetGarden);

init();
