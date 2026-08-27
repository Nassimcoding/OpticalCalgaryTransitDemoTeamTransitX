# Calgary Transit Mobile App Prototype

A mobile-first UI/UX prototype for Calgary Transit, built as a lightweight static site with HTML, CSS, and vanilla JavaScript.

## Features

- Mobile app-style layout
- Home, Plan, Departures, and Status pages
- Routes, Saved, and Settings pages
- Light, Dark, and System themes
- Accessibility preferences: larger text, high contrast, and reduced motion
- Route and stop search
- Mock departure times and service alerts
- Interactive Leaflet map with OpenStreetMap tiles
- Pan, zoom, touch interaction, markers, and popups
- Route and stop detail bottom sheets
- Mobile bottom-tab pagination
- Local preference persistence with `localStorage`

## Pages

- **Home** — nearby map, current stop, and next departure
- **Plan** — origin, destination, and route options
- **Departures** — stop map, stop search, and departure times
- **Status** — network status and service alerts
- **Routes** — route search, filters, and route details
- **Saved** — saved stop entry point
- **Settings** — appearance, accessibility, and travel preferences

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Leaflet 1.9.4
- OpenStreetMap tiles
- No backend or build step
- No npm dependencies required

## Run Locally

Open `index.html` directly in a browser, or run a local static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

The project can be deployed to any static hosting provider that serves HTML, CSS, and JavaScript files.

## Map

The map uses Leaflet to render OpenStreetMap tiles:

```text
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

Supported interactions include panning, zooming, touch gestures, transit stop markers, marker popups, and stop-to-departures navigation.

OpenStreetMap tile usage is subject to the [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/). For production or high-traffic use, choose an approved tile provider or provide appropriate tile infrastructure.

## Data

Demo data is stored in `app.js`:

- `routes` — transit routes
- `stops` — stops and departure times
- `alerts` — service alerts
- `trips` — trip-planning results

The current data is local mock data and is not connected to the Calgary Transit real-time API.

## File Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── PLAN.md
└── ref/
    └── 1.png
```

## Design Principles

- Mobile-first
- Minimal Home dashboard
- Independent app pages
- Bottom-tab navigation
- Large touch targets
- Clear route colors and status hierarchy
- Light and dark mode support
- Basic accessibility preferences
- Minimal dependencies

## Limitations

This is a UI/UX prototype. Real-time transit data, GPS vehicle tracking, production route calculation, account synchronization, cloud-saved stops, Street View, and production-grade map tile delivery are not connected.

## Attribution

Calgary Transit prototype for demonstration purposes.

Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

Leaflet © [Leaflet contributors](https://leafletjs.com/).
