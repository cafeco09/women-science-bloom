
const DATA_URL = './data/scientists.json';

const treeSvg = document.getElementById('treeSvg');
const searchInput = document.getElementById('searchInput');
const fieldFilter = document.getElementById('fieldFilter');
const regionFilter = document.getElementById('regionFilter');
const centuryFilter = document.getElementById('centuryFilter');
const resetFilters = document.getElementById('resetFilters');
const emptyState = document.getElementById('emptyState');
const visibleCount = document.getElementById('visibleCount');
const pollenLayer = document.getElementById('pollenLayer');
const quoteTrack = document.getElementById('quoteTrack');
const detailLayer = document.getElementById('detailLayer');
const closeLayer = document.getElementById('closeLayer');

const details = {
  name: document.getElementById('detailName'),
  meta: document.getElementById('detailMeta'),
  field: document.getElementById('detailField'),
  origin: document.getElementById('detailOrigin'),
  year: document.getElementById('detailYear'),
  breakthrough: document.getElementById('detailBreakthrough'),
  discovery: document.getElementById('detailDiscovery'),
  struggle: document.getElementById('detailStruggle'),
  impact: document.getElementById('detailImpact'),
  source: document.getElementById('detailSource'),
  quote: document.getElementById('detailQuote'),
  portrait: document.getElementById('detailPortrait')
};

const metrics = {
  breakthroughYear: document.getElementById('metricBreakthroughYear'),
  fieldPeers: document.getElementById('metricFieldPeers'),
  regionPeers: document.getElementById('metricRegionPeers'),
  eraRank: document.getElementById('metricEraRank')
};

const timelineChart = document.getElementById('timelineChart');
const fieldChart = document.getElementById('fieldChart');
const regionChart = document.getElementById('regionChart');

let scientists = [];
let selectedId = null;

const unique = (values) => [...new Set(values)].sort();

function countBy(items, key) {
  const map = new Map();
  items.forEach((item) => map.set(item[key], (map.get(item[key]) || 0) + 1));
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function populateFilters() {
  unique(scientists.map((s) => s.field)).forEach((field) => {
    const option = document.createElement('option');
    option.value = field;
    option.textContent = field;
    fieldFilter.appendChild(option);
  });

  unique(scientists.map((s) => s.region)).forEach((region) => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionFilter.appendChild(option);
  });

  unique(scientists.map((s) => s.century)).forEach((century) => {
    const option = document.createElement('option');
    option.value = century;
    option.textContent = century;
    centuryFilter.appendChild(option);
  });
}

function buildQuotes() {
  const snippets = scientists
    .map((s) => `<span class="quote-chip"><b>${s.name}</b><span>“${s.quote || s.discovery}”</span></span>`)
    .join('');
  quoteTrack.innerHTML = snippets + snippets;
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
  ].join(' ').toLowerCase();

  return (
    (!search || text.includes(search)) &&
    (field === 'all' || scientist.field === field) &&
    (region === 'all' || scientist.region === region) &&
    (century === 'all' || scientist.century === century)
  );
}

function setDetails(scientist, openLayer = true) {
  selectedId = scientist.id;

  if (openLayer) {
    detailLayer.classList.remove('hidden');
  }

  details.name.textContent = scientist.name;
  details.meta.textContent = `${scientist.years} · ${scientist.century}`;
  details.field.textContent = scientist.field;
  details.origin.textContent = scientist.origin;
  details.year.textContent = `Breakthrough ${scientist.breakthroughYear}`;
  details.breakthrough.textContent = scientist.branch;
  details.discovery.textContent = scientist.discovery;
  details.struggle.textContent = scientist.struggle;
  details.impact.textContent = scientist.impact;
  details.quote.textContent = `“${scientist.quote || scientist.discovery}”`;
  details.source.textContent = `Open source · ${scientist.source}`;
  details.source.href = scientist.sourceUrl;
  details.portrait.src = scientist.portrait;
  details.portrait.alt = scientist.name;

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
  renderDistribution(fieldChart, countBy(scientists, 'field'), scientist.field);
  renderDistribution(regionChart, countBy(scientists, 'region'), scientist.region);
}

function renderTimeline(sorted, selected) {
  timelineChart.innerHTML = '';
  const minYear = sorted[0].breakthroughYear;
  const maxYear = sorted[sorted.length - 1].breakthroughYear;
  const span = Math.max(1, maxYear - minYear);

  sorted.forEach((scientist) => {
    const bar = document.createElement('div');
    const relative = scientist.breakthroughYear - minYear;
    const height = 20 + (relative / span) * 68;

    bar.className = 'timeline-bar' + (scientist.id === selected.id ? ' selected' : '');
    bar.style.height = `${height}px`;
    bar.dataset.year = scientist.breakthroughYear;
    bar.dataset.name = scientist.name;
    timelineChart.appendChild(bar);
  });
}

function renderDistribution(container, data, highlightLabel) {
  container.innerHTML = '';
  const max = Math.max(...data.map((d) => d.value), 1);

  data.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'bar-row' + (item.label === highlightLabel ? ' highlight' : '');

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = item.label;

    const track = document.createElement('div');
    track.className = 'bar-track';

    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${(item.value / max) * 100}%`;
    track.appendChild(fill);

    const value = document.createElement('div');
    value.className = 'bar-value';
    value.textContent = item.value;

    row.append(label, track, value);
    container.appendChild(row);
  });
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function buildAmbientParticles() {
  pollenLayer.innerHTML = '';

  for (let i = 0; i < 18; i += 1) {
    const pollen = document.createElement('span');
    pollen.className = 'pollen';
    pollen.style.left = `${Math.random() * 100}%`;
    pollen.style.bottom = `${Math.random() * 26}%`;
    pollen.style.animationDuration = `${8 + Math.random() * 9}s`;
    pollen.style.animationDelay = `${Math.random() * 8}s`;
    pollen.style.transform = `scale(${0.7 + Math.random() * 1.1})`;
    pollenLayer.appendChild(pollen);
  }
}

function clearRenderedSvg() {
  [...treeSvg.querySelectorAll(':scope > g, :scope > path, :scope > ellipse, :scope > clipPath, :scope > circle')].forEach((node) => node.remove());
}

function getSlots(count) {
  const tiers = [
    { y: 0.10, xs: [0.46, 0.54] },
    { y: 0.19, xs: [0.34, 0.46, 0.54, 0.66] },
    { y: 0.30, xs: [0.20, 0.32, 0.44, 0.56, 0.68, 0.80] },
    { y: 0.45, xs: [0.16, 0.28, 0.40, 0.60, 0.72, 0.84] },
    { y: 0.60, xs: [0.22, 0.36, 0.64, 0.78] }
  ];

  const slots = [];
  for (const tier of tiers) {
    for (const x of tier.xs) {
      if (slots.length < count) {
        slots.push({ x, y: tier.y });
      }
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
  const clusters = [
    [0.18, 0.35, 22],
    [0.28, 0.21, -16],
    [0.37, 0.17, 18],
    [0.63, 0.17, -18],
    [0.72, 0.21, 14],
    [0.82, 0.35, -20],
    [0.25, 0.50, 12],
    [0.75, 0.50, -14],
    [0.50, 0.08, 0],
    [0.50, 0.25, 16]
  ];

  clusters.forEach(([xf, yf, angle], idx) => {
    const leaf = svgEl('ellipse', {
      class: 'canopy-leaf',
      cx: width * xf,
      cy: height * yf,
      rx: 32 + (idx % 3) * 7,
      ry: 16 + (idx % 2) * 5,
      transform: `rotate(${angle} ${width * xf} ${height * yf})`
    });
    leaf.style.animationDelay = `${idx * 0.3}s`;
    treeSvg.appendChild(leaf);
  });
}

function renderStaticTree(width, height) {
  const cx = width * 0.5;
  const rootY = height * 0.94;
  const trunkTopY = height * 0.58;

  const trunk = svgEl('path', {
    class: 'trunk-path',
    d: `M ${cx} ${rootY} C ${cx - 18} ${height * 0.84}, ${cx + 24} ${height * 0.70}, ${cx} ${trunkTopY}`,
    'stroke-width': 21
  });
  treeSvg.appendChild(trunk);

  const boughs = [
    { start: [cx, height * 0.68], end: [cx - width * 0.19, height * 0.56] },
    { start: [cx, height * 0.68], end: [cx + width * 0.19, height * 0.56] },
    { start: [cx, height * 0.60], end: [cx - width * 0.11, height * 0.40] },
    { start: [cx, height * 0.60], end: [cx + width * 0.11, height * 0.40] },
    { start: [cx, trunkTopY], end: [cx, height * 0.24] },
    { start: [cx - width * 0.19, height * 0.56], end: [cx - width * 0.29, height * 0.42] },
    { start: [cx + width * 0.19, height * 0.56], end: [cx + width * 0.29, height * 0.42] }
  ];

  boughs.forEach((b) => {
    treeSvg.appendChild(svgEl('path', {
      class: 'bough-path',
      d: cubicPath(b.start[0], b.start[1], b.end[0], b.end[1], 0.35)
    }));
  });

  renderCanopyLeaves(width, height);

  return {
    top: [cx, height * 0.24],
    leftUpper: [cx - width * 0.11, height * 0.40],
    rightUpper: [cx + width * 0.11, height * 0.40],
    leftMid: [cx - width * 0.19, height * 0.56],
    rightMid: [cx + width * 0.19, height * 0.56],
    leftOuter: [cx - width * 0.29, height * 0.42],
    rightOuter: [cx + width * 0.29, height * 0.42]
  };
}

function chooseAnchor(slot, anchors) {
  if (slot.y <= 0.12) return anchors.top;
  if (slot.x < 0.23) return anchors.leftOuter;
  if (slot.x > 0.77) return anchors.rightOuter;
  if (slot.x < 0.5 && slot.y < 0.36) return anchors.leftUpper;
  if (slot.x > 0.5 && slot.y < 0.36) return anchors.rightUpper;
  if (slot.x < 0.5) return anchors.leftMid;
  return anchors.rightMid;
}

function makeDiscoveryLeaf(x, y, label) {
  const group = svgEl('g', {
    class: 'discovery-leaf',
    transform: `translate(${x}, ${y}) rotate(-12)`
  });
  group.appendChild(svgEl('path', { d: 'M 0 0 C 18 -22 52 -18 66 0 C 52 20 18 24 0 0 Z' }));

  const text = svgEl('text', { x: 33, y: 4 });
  text.textContent = label;
  group.appendChild(text);

  return group;
}

function makeSeedTag(x, y) {
  const group = svgEl('g', { class: 'seed-tag', transform: `translate(${x}, ${y})` });
  group.appendChild(svgEl('circle', { cx: 0, cy: 0, r: 11 }));

  const text = svgEl('text', { x: 0, y: 4 });
  text.textContent = 'impact';
  group.appendChild(text);

  return group;
}

function makeThornTag(x, y, rotation = 0) {
  const group = svgEl('g', { class: 'thorn-tag', transform: `translate(${x}, ${y}) rotate(${rotation})` });
  group.appendChild(svgEl('path', { d: 'M 0 0 L 18 -8 L 14 10 Z' }));

  const text = svgEl('text', { x: 26, y: 4 });
  text.textContent = 'thorn';
  group.appendChild(text);

  return group;
}

function makeNameBadge(x, y, name, slot) {
  const width = Math.max(76, Math.min(132, name.length * 6.5));
  let bx = x;
  let by = y + 38;

  if (slot.y > 0.50) {
    by = y - 40;
  }
  if (slot.x < 0.22) {
    bx = x + 64;
    by = y + 4;
  }
  if (slot.x > 0.78) {
    bx = x - 64;
    by = y + 4;
  }

  const group = svgEl('g', {
    class: 'name-badge',
    transform: `translate(${bx}, ${by})`
  });

  group.appendChild(svgEl('rect', {
    x: -width / 2,
    y: -12,
    width,
    height: 24,
    rx: 12,
    ry: 12
  }));

  const text = svgEl('text', { x: 0, y: 4 });
  text.textContent = name;
  group.appendChild(text);

  return group;
}

function makeNode(x, y, scientist, selected = false, slot = { x: 0.5, y: 0.5 }) {
  const group = svgEl('g', {
    class: `node-group ${selected ? 'active' : ''}`,
    tabindex: '0',
    role: 'button',
    'aria-label': `${scientist.name}, ${scientist.field}`
  });

  const clipId = `clip-${scientist.id}`;
  const clip = svgEl('clipPath', { id: clipId });
  clip.appendChild(svgEl('circle', { cx: x, cy: y, r: 22 }));
  treeSvg.appendChild(clip);

  group.appendChild(svgEl('circle', { class: 'portrait-ring', cx: x, cy: y, r: 27 }));
  group.appendChild(svgEl('circle', { class: 'portrait-inner', cx: x, cy: y, r: 22 }));

  group.appendChild(svgEl('image', {
    href: scientist.portrait,
    x: x - 22,
    y: y - 22,
    width: 44,
    height: 44,
    'clip-path': `url(#${clipId})`,
    preserveAspectRatio: 'xMidYMid slice',
    crossorigin: 'anonymous'
  }));

  group.appendChild(makeNameBadge(x, y, scientist.name, slot));

  if (selected) {
    group.appendChild(makeDiscoveryLeaf(x + 32, y - 18, scientist.leafLabel || 'discovery'));
    group.appendChild(makeSeedTag(x + 17, y + 50));
    group.appendChild(makeThornTag(x - 32, y - 7, -20));
  }

  const activate = () => {
    selectedId = scientist.id;
    setDetails(scientist, true);
    renderTree(false);
  };

  group.addEventListener('click', activate);
  group.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });

  return group;
}

function renderTree(openLayerIfNeeded = false) {
  const visibleScientists = scientists.filter(matchesFilters);
  visibleCount.textContent = `${visibleScientists.length} visible · ${scientists.length} total`;
  emptyState.style.display = visibleScientists.length ? 'none' : 'block';

  const width = treeSvg.clientWidth || treeSvg.parentElement.clientWidth || 1000;
  const height = treeSvg.clientHeight || treeSvg.parentElement.clientHeight || 700;

  clearRenderedSvg();
  const anchors = renderStaticTree(width, height);

  if (!visibleScientists.length) {
    detailLayer.classList.add('hidden');
    return;
  }

  const slots = getSlots(visibleScientists.length);

  if (!visibleScientists.some((s) => s.id === selectedId)) {
    selectedId = visibleScientists[0].id;
  }

  visibleScientists.forEach((scientist, index) => {
    const slot = slots[index];
    const endX = width * slot.x;
    const endY = height * slot.y;
    const anchor = chooseAnchor(slot, anchors);

    treeSvg.appendChild(svgEl('path', {
      class: `twig-path ${scientist.id === selectedId ? 'active' : ''}`,
      d: cubicPath(anchor[0], anchor[1], endX, endY, 0.28)
    }));

    treeSvg.appendChild(makeNode(endX, endY, scientist, scientist.id === selectedId, slot));
  });

  const selected = visibleScientists.find((s) => s.id === selectedId) || visibleScientists[0];
  if (selected) {
    setDetails(selected, openLayerIfNeeded);
  }
}

function resetAll() {
  searchInput.value = '';
  fieldFilter.value = 'all';
  regionFilter.value = 'all';
  centuryFilter.value = 'all';
  selectedId = scientists[0]?.id || null;
  detailLayer.classList.add('hidden');
  renderTree(false);
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);

    scientists = await response.json();
    selectedId = scientists[0]?.id || null;
    populateFilters();
    buildQuotes();
    buildAmbientParticles();
    renderTree(false);
  } catch (error) {
    console.error(error);
    emptyState.style.display = 'block';
    emptyState.querySelector('h3').textContent = 'Dataset could not load';
    emptyState.querySelector('p').textContent = 'Check that docs/data/scientists.json exists.';
  }
}

searchInput.addEventListener('input', () => renderTree(false));
fieldFilter.addEventListener('change', () => renderTree(false));
regionFilter.addEventListener('change', () => renderTree(false));
centuryFilter.addEventListener('change', () => renderTree(false));
resetFilters.addEventListener('click', resetAll);
closeLayer.addEventListener('click', () => detailLayer.classList.add('hidden'));

window.addEventListener('resize', () => {
  window.clearTimeout(window.__treeResize);
  window.__treeResize = window.setTimeout(() => renderTree(false), 160);
});

init();
