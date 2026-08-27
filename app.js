const transitData = {
  routes: [
    { number: '201', name: 'Red Line', type: 'c-train', label: 'CTrain', color: 'red', stops: 'Somerset–Bridlewood ↔ Tuscany', next: '3 min', detail: 'Every 10 minutes' },
    { number: '202', name: 'Blue Line', type: 'c-train', label: 'CTrain', color: 'blue', stops: 'Saddletowne ↔ 69 Street SW', next: '6 min', detail: 'Every 10 minutes' },
    { number: '301', name: 'BRT Airport / Centre St', type: 'brt', label: 'MAX BRT', color: 'red', stops: 'Airport ↔ Downtown', next: '8 min', detail: 'Every 15 minutes' },
    { number: '3', name: 'Sandstone / Heritage', type: 'bus', label: 'Bus', color: 'blue', stops: 'Sandstone ↔ Heritage LRT', next: '12 min', detail: 'Every 20 minutes' },
    { number: '17', name: 'Renfrew / Heritage', type: 'bus', label: 'Bus', color: 'yellow', stops: 'Renfrew ↔ Heritage LRT', next: '15 min', detail: 'Every 20 minutes' },
    { number: '52', name: 'Woodlands / Dalhousie', type: 'bus', label: 'Bus', color: 'blue', stops: 'Woodlands ↔ Dalhousie', next: '18 min', detail: 'Every 30 minutes' }
  ],
  stops: [
    { name: '7 Street SW', area: 'Downtown Calgary', lines: ['201', '202'], departures: [['201', 'Red Line — Southbound', '3 min'], ['202', 'Blue Line — Saddletowne', '9 min'], ['201', 'Red Line — Southbound', '13 min']] },
    { name: 'City Hall', area: 'Downtown Calgary', lines: ['201', '202', '301'], departures: [['202', 'Blue Line — 69 Street', '5 min'], ['301', 'MAX Airport — Eastbound', '11 min']] },
    { name: 'Heritage Station', area: 'South Calgary', lines: ['3', '17'], departures: [['3', 'Sandstone — Northbound', '7 min'], ['17', 'Renfrew — Northbound', '16 min']] }
  ],
  alerts: [
    { route: '201 Red Line', severity: 'red', title: 'Reduced service on Red Line', copy: 'Trains are running every 15 minutes between City Hall and Somerset–Bridlewood.', time: 'Updated 4 minutes ago' },
    { route: 'Downtown', severity: 'yellow', title: 'Platform changes at 7 Street SW', copy: 'Use the east platform for southbound trains until 6:00 PM today.', time: 'Updated 18 minutes ago' }
  ],
  trips: [
    { badge: 'FASTEST', time: '28 min', arrival: 'Arrive by 5:42 PM', summary: 'Walk 4 min  ·  CTrain Red Line  ·  0 transfers', steps: [['Walk', '7 Street SW', '4 min'], ['201 Red Line', 'Southbound to City Hall', '18 min'], ['Walk', 'Your destination', '6 min']] },
    { badge: 'FEWEST TRANSFERS', time: '34 min', arrival: 'Arrive by 5:48 PM', summary: 'Walk 6 min  ·  Bus 301  ·  0 transfers', steps: [['Walk', '7 Street SW to 3 Street', '6 min'], ['301 MAX BRT', 'Eastbound to destination', '28 min']] }
  ]
};

let transitMap;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderDepartures(stop = transitData.stops[0]) {
  const stopName = $('#nearbyStopName');
  const parent = $('#nearbyDepartures');
  if (!stopName || !parent) return;
  stopName.textContent = stop.name;
  parent.innerHTML = stop.departures.map(([route, name, time]) => `<div class="departure-row"><span class="route-chip ${route === '202' ? 'route-chip-blue' : 'route-chip-red'}">${route}</span><span><strong>${name}</strong><small>Scheduled service</small></span><span class="departure-time"><strong>${time}</strong><small>on time</small></span></div>`).join('');
}

function renderRoutes(filter = 'all', search = '') {
  const query = search.trim().toLowerCase();
  const routes = transitData.routes.filter((route) => {
    const matchesFilter = filter === 'all' || route.type === filter;
    const matchesSearch = !query || [route.number, route.name, route.label, route.stops, ...transitData.stops.filter((stop) => stop.lines.includes(route.number)).map((stop) => stop.name)].join(' ').toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  const routeGrid = $('#routeGrid');
  if (!routeGrid) return;
  routeGrid.innerHTML = routes.map((route) => `<article class="route-card" tabindex="0" data-route="${route.number}"><div class="route-card-top"><span class="route-number ${route.color === 'blue' ? 'route-chip-blue' : ''}" style="${route.color === 'yellow' ? 'background:#c08a23' : ''}">${route.number}</span><div><h3>${route.name}</h3><p>${route.label}</p></div></div><div class="route-meta"><span>${route.stops}</span><strong>Next ${route.next}</strong></div></article>`).join('');
  const routeEmpty = $('#routeEmpty');
  if (routeEmpty) routeEmpty.hidden = routes.length > 0;
  $$('#routeGrid .route-card').forEach((card) => { const show = () => openRoute(card.dataset.route); card.addEventListener('click', show); card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(); } }); });
}

function renderAlerts() {
  const alerts = $('#alertsList');
  if (!alerts) return;
  alerts.innerHTML = transitData.alerts.map((alert) => `<article class="alert-card"><span class="alert-severity ${alert.severity}"></span><div><h3>${alert.route} · ${alert.title}</h3><p>${alert.copy}</p><time>${alert.time}</time></div></article>`).join('');
  const count = $('#alertCount'); if (count) count.textContent = `${transitData.alerts.length} active`;
}

function renderTrips() {
  $('#tripResults').innerHTML = transitData.trips.map((trip, index) => `<article class="trip-card ${index === 0 ? 'recommended' : ''}"><div class="trip-top"><div><span class="trip-badge">${trip.badge}</span><div class="trip-time">${trip.time} <span class="muted-label">total</span></div></div><div class="muted-label">${trip.arrival}</div></div><p class="trip-summary">${trip.summary}</p><button class="trip-toggle" type="button">View trip details <span aria-hidden="true">↓</span></button><div class="trip-steps">${trip.steps.map(([type, destination, duration]) => `<div class="trip-step"><span class="step-marker"></span><div><strong>${type}</strong> — ${destination}<small>${duration}</small></div></div>`).join('')}</div></article>`).join('');
  $$('.trip-toggle').forEach((button) => button.addEventListener('click', () => { const card = button.closest('.trip-card'); card.classList.toggle('open'); button.innerHTML = card.classList.contains('open') ? 'Hide trip details <span aria-hidden="true">↑</span>' : 'View trip details <span aria-hidden="true">↓</span>'; }));
}

function initOpenStreetMap(elementId) {
  const element = document.getElementById(elementId);
  if (!element || typeof L === 'undefined' || element._leaflet_id) return null;
  const map = L.map(element, { zoomControl: true, attributionControl: true, scrollWheelZoom: true, dragging: true, tap: true }).setView([51.0467, -114.0719], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
  const stops = [{ name: '7 Street SW', coords: [51.0467, -114.0719], color: '#db4245' }, { name: 'City Hall', coords: [51.0453, -114.0631], color: '#317da5' }, { name: '1 Street SW', coords: [51.0478, -114.0687], color: '#efbc4b' }];
  stops.forEach((stop) => L.circleMarker(stop.coords, { radius: 8, color: '#fff', weight: 3, fillColor: stop.color, fillOpacity: 1 }).addTo(map).bindPopup(`<strong>${stop.name}</strong><br><small>Calgary Transit stop</small><br><button class="map-stop-action" type="button" data-map-stop="${stop.name}">View departures</button>`));
  map.on('popupopen', (event) => { const button = event.popup.getElement()?.querySelector('[data-map-stop]'); button?.addEventListener('click', () => { const stop = transitData.stops.find((item) => item.name === button.dataset.mapStop); if (stop) { renderDepartures(stop); switchPage('home'); } }); });
  return map;
}
function initMaps() { transitMap = initOpenStreetMap('osmMap'); initOpenStreetMap('departuresMap'); }
function refreshMaps() { [transitMap].forEach((map) => map?.invalidateSize()); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 2600); }
function openRoute(number) { const route = transitData.routes.find((item) => item.number === number); const stops = transitData.stops.filter((stop) => stop.lines.includes(number)); openModal(`<span class="section-kicker">ROUTE ${route.number}</span><h2>${route.name}</h2><p>${route.stops}</p><div class="departure-list">${stops.map((stop) => `<div class="departure-row"><span class="station-dot"></span><span><strong>${stop.name}</strong><small>${stop.area}</small></span><span class="departure-time"><strong>${stop.departures[0][2]}</strong><small>next</small></span></div>`).join('')}</div><button class="primary-button" id="nearbyFeedback" type="button">Rate a stop <span aria-hidden="true">→</span></button>`); $('#nearbyFeedback').addEventListener('click', openFeedback); }
function openFeedback() { openModal(`<span class="section-kicker">QUICK FEEDBACK</span><h2>Rate 7 Street SW</h2><p>How was your experience at this stop today?</p><div class="rating-options">${['Great', 'Okay', 'Needs work'].map((label) => `<button class="rating-button" type="button">${label}</button>`).join('')}</div><textarea id="feedbackText" placeholder="Anything else you want us to know? (optional)"></textarea><button class="primary-button" id="submitFeedback" type="button">Send feedback <span aria-hidden="true">→</span></button>`); $$('.rating-button').forEach((button) => button.addEventListener('click', () => { $$('.rating-button').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); })); $('#submitFeedback').addEventListener('click', () => { closeModal(); showToast('Thanks — your feedback helps us improve.'); }); }
function openModal(content) { $('#modalContent').innerHTML = content; $('#modalBackdrop').hidden = false; $('#modalClose').focus(); document.body.style.overflow = 'hidden'; }
function closeModal() { $('#modalBackdrop').hidden = true; document.body.style.overflow = ''; }

function bindPlanner(formSelector, fromSelector, toSelector, messageSelector, resultsSelector) { const form = $(formSelector); if (!form) return; form.addEventListener('submit', (event) => { event.preventDefault(); const from = $(fromSelector).value.trim(); const to = $(toSelector).value.trim(); if (!from || !to) { $(messageSelector).textContent = 'Add both locations to continue.'; return; } $(messageSelector).textContent = ''; $(resultsSelector).hidden = false; $(resultsSelector.replace('Results', 'Results').replace('Page', ''))?.classList.remove('unused'); const results = $(resultsSelector + ' .trip-results'); if (results) { results.innerHTML = transitData.trips.map((trip, index) => `<article class="trip-card ${index === 0 ? 'recommended' : ''}"><div class="trip-top"><div><span class="trip-badge">${trip.badge}</span><div class="trip-time">${trip.time} <span class="muted-label">total</span></div></div><div class="muted-label">${trip.arrival}</div></div><p class="trip-summary">${trip.summary}</p><button class="trip-toggle" type="button">View trip details <span>↓</span></button><div class="trip-steps">${trip.steps.map(([type, destination, duration]) => `<div class="trip-step"><span class="step-marker"></span><div><strong>${type}</strong> — ${destination}<small>${duration}</small></div></div>`).join('')}</div></article>`).join(''); bindTripToggles(results); } $(resultsSelector).scrollIntoView({ behavior: 'smooth' }); }); }
function bindTripToggles(parent = document) { parent.querySelectorAll('.trip-toggle').forEach((button) => button.addEventListener('click', () => { const card = button.closest('.trip-card'); card.classList.toggle('open'); button.innerHTML = card.classList.contains('open') ? 'Hide trip details <span>↑</span>' : 'View trip details <span>↓</span>'; })); }
bindPlanner('#plannerForm', '#fromInput', '#toInput', '#plannerMessage', '#plannerResults');
bindPlanner('#plannerFormPage', '#fromInputPage', '#toInputPage', '#plannerMessagePage', '#plannerResultsPage');
[['#swapButton','#fromInput','#toInput'],['#swapButtonPage','#fromInputPage','#toInputPage']].forEach(([buttonSelector, fromSelector, toSelector]) => $(buttonSelector)?.addEventListener('click', () => { const from = $(fromSelector); const to = $(toSelector); [from.value, to.value] = [to.value, from.value]; }));
$('#editPlan')?.addEventListener('click', () => switchPage('plan'));
$('#routeSearch')?.addEventListener('input', (event) => renderRoutes($('.filter-button.selected')?.dataset.filter || 'all', event.target.value));
function renderPageRoutes(filter = 'all', search = '') { const query = search.trim().toLowerCase(); const routes = transitData.routes.filter((route) => (filter === 'all' || route.type === filter) && (!query || `${route.number} ${route.name} ${route.label} ${route.stops}`.toLowerCase().includes(query))); const routeGridPage = $('#routeGridPage'); if (!routeGridPage) return; routeGridPage.innerHTML = routes.map((route) => `<article class="route-card" tabindex="0" data-route="${route.number}"><div class="route-card-top"><span class="route-number ${route.color === 'blue' ? 'route-chip-blue' : ''}">${route.number}</span><div><h3>${route.name}</h3><p>${route.label}</p></div></div><div class="route-meta"><span>${route.stops}</span><strong>Next ${route.next}</strong></div></article>`).join(''); if ($('#routeEmptyPage')) $('#routeEmptyPage').hidden = routes.length > 0; $$('#routeGridPage .route-card').forEach((card) => card.addEventListener('click', () => openRoute(card.dataset.route))); }
$('#routeSearchPage')?.addEventListener('input', (event) => renderPageRoutes($('.filter-button[data-page-filter].selected')?.dataset.pageFilter || 'all', event.target.value));
$$('[data-page-filter]').forEach((button) => button.addEventListener('click', () => { $$('[data-page-filter]').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); renderPageRoutes(button.dataset.pageFilter, $('#routeSearchPage').value); }));
function renderStops(search = '') { const stopList = $('#stopList'); if (!stopList) return; const query = search.trim().toLowerCase(); const stops = transitData.stops.filter((stop) => !query || `${stop.name} ${stop.area} ${stop.lines.join(' ')}`.toLowerCase().includes(query)); stopList.innerHTML = stops.map((stop) => `<button class="stop-list-item" data-stop-name="${stop.name}" type="button"><span class="station-dot"></span><span><strong>${stop.name}</strong><small>${stop.area} · Routes ${stop.lines.join(', ')}</small></span><b>›</b></button>`).join(''); $$('#stopList [data-stop-name]').forEach((button) => button.addEventListener('click', () => { const stop = transitData.stops.find((item) => item.name === button.dataset.stopName); renderDepartures(stop); switchPage('home'); })); }
$('#stopSearch')?.addEventListener('input', (event) => renderStops(event.target.value));
$$('.filter-button:not([data-page-filter])').forEach((button) => button.addEventListener('click', () => { $$('.filter-button:not([data-page-filter])').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); renderRoutes(button.dataset.filter, $('#routeSearch')?.value || ''); }));
$$('[data-stop]').forEach((button) => button.addEventListener('click', () => { const stop = transitData.stops.find((item) => item.name === button.dataset.stop); if (stop) openRoute(stop.lines[0]); }));
$('#refreshDepartures').addEventListener('click', () => { renderDepartures(transitData.stops[0]); showToast('Departure times refreshed.'); });
$('#locationButton').addEventListener('click', () => showToast('Location preview enabled — using 7 Street SW for this demo.'));
$('#mapLocation').addEventListener('click', () => { transitMap?.setView([51.0467, -114.0719], 15, { animate: true }); refreshMaps(); showToast('Map centred near 7 Street SW.'); });
$('#showAllRoutes')?.addEventListener('click', () => switchPage('routes'));
$('#openAlerts')?.addEventListener('click', () => openModal(`<span class="section-kicker">SERVICE STATUS</span><h2>Transit updates</h2><p>Here is what is happening across the network right now.</p><div class="alerts-list">${transitData.alerts.map((alert) => `<article class="alert-card"><span class="alert-severity ${alert.severity}"></span><div><h3>${alert.route} · ${alert.title}</h3><p>${alert.copy}</p><time>${alert.time}</time></div></article>`).join('')}</div>`));
$('#feedbackButton')?.addEventListener('click', openFeedback);
function switchPage(page) { $$('.app-page').forEach((view) => view.classList.toggle('active-page', view.dataset.page === page)); $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.pageTarget === page)); window.location.hash = page; window.scrollTo({ top: 0, behavior: 'smooth' }); if (page === 'routes') renderPageRoutes(); if (page === 'departures') setTimeout(() => { window.dispatchEvent(new Event('resize')); refreshMaps(); }, 100); if (page === 'home') setTimeout(refreshMaps, 100); }
function setTheme(theme) { const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches; document.body.classList.toggle('dark', theme === 'dark' || (theme === 'system' && systemDark)); $$('.theme-choice').forEach((button) => button.classList.toggle('selected', button.dataset.theme === theme)); localStorage.setItem('ct-theme', theme); }
function bindPreference(id, className) { const input = $(id); if (!input) return; const saved = localStorage.getItem(`ct-${id.slice(1)}`) === 'true'; input.checked = saved; document.body.classList.toggle(className, saved); input.addEventListener('change', () => { document.body.classList.toggle(className, input.checked); localStorage.setItem(`ct-${id.slice(1)}`, String(input.checked)); }); }
$$('.theme-choice').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));
$('#settingsButton')?.addEventListener('click', () => switchPage('settings'));
bindPreference('#largeTextToggle', 'large-text'); bindPreference('#contrastToggle', 'high-contrast'); bindPreference('#motionToggle', 'reduce-motion'); bindPreference('#accessibleToggle', 'accessible-routes'); bindPreference('#transferToggle', 'fewer-transfers');
setTheme(localStorage.getItem('ct-theme') || 'system');
$$('.tab[data-page-target], [data-page-target]').forEach((tab) => tab.addEventListener('click', () => { const page = tab.dataset.pageTarget; if (page) { switchPage(page); } }));
window.addEventListener('hashchange', () => { const page = window.location.hash.slice(1); if ($(`[data-page="${page}"]`)) switchPage(page); });
$('#modalClose').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !$('#modalBackdrop').hidden) closeModal(); });
$$('.bookmark-button').forEach((button) => button.addEventListener('click', () => { const saved = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed', String(!saved)); button.textContent = saved ? '♡' : '♥'; button.classList.toggle('saved', !saved); showToast(saved ? 'Stop removed from saved places.' : 'Stop saved for later.'); }));

renderDepartures(); renderRoutes(); renderAlerts(); renderStops(); renderPageRoutes(); initMaps();
const initialPage = window.location.hash.slice(1); if ($(`[data-page="${initialPage}"]`)) switchPage(initialPage);
