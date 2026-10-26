# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, no-build, vanilla JS/HTML/CSS prototype for running **ESD (electrostatic discharge) audits** on the equipment catalog of "Línea 12" — one production line out of several in the plant; this prototype only covers that one line. Spanish UI/content throughout — keep new strings in Spanish matching existing tone. There is no backend; all state lives in the browser (`localStorage`) and is only persisted externally when the user explicitly downloads/imports an Excel file.

## Running it

No build step, no package manager, no dependencies to install.

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`. The QR camera scanner requires a secure context (`localhost` works; opening `index.html` directly via `file://` does not — camera access will fail).

There is no test suite, linter, or formatter configured in this repo.

## Architecture

Four plain `<script>` tags loaded in dependency order from `index.html` (no modules, no bundler): `data.js` → `excel.js` → `qr.js` → `app.js`. Each of `excel.js` and `qr.js` is an IIFE exposing a single global namespace object (`ExcelIO`, `QR`); `data.js`/`app.js` define globals directly. `vendor/` holds three third-party libs loaded as plain scripts before the app code: `qrious.min.js` (QR generation), `jsQR.js` (QR decoding from camera/image), `xlsx.full.min.js` (SheetJS, Excel read/write).

**State (`js/data.js`)**: `state = { equipos, historial, lastAuditor }` is the single source of truth, loaded from `localStorage` (key `cst-linea12-v1`) or seeded from the hardcoded `LINEA12` catalog array at the top of the file (the real 53-equipment list, originally from `data/Linea12.xlsx`). Every mutation goes through in-memory `state` + an explicit `persist()` call to localStorage — there's no reactive framework, so after changing `state` you must call `render()` (and usually `persist()`) yourself. `app.js` also does manual client-side routing: `currentPage` + `setPage()` swap the `#content` innerHTML between three page-render functions (`equiposPage`, `auditPage`, `historyPage`), each returning an HTML template string. Event handlers are mostly inline `onclick="..."` attributes calling functions explicitly exported onto `window` near the bottom of `app.js` (`Object.assign(window, {...})`) — when adding a new page action callable from generated HTML, it must be added to that export list.

**Excel I/O (`js/excel.js`, `ExcelIO` namespace)**: Owns the mapping between the app's internal record shape (`id, status, date (ISO), auditor, supervisor, engineer, coordinator, notes`) and spreadsheet rows. `HEADER_MAP` does fuzzy/accented header matching so an imported `.xlsx` doesn't need exact column names. `statusOf()` normalizes free-text status into the fixed `STATUS_VALUES` (`PENDIENTE`, `AUDITADO`, `OBSERVACION`, `NO CONFORME`). `parseBuffer()` reads a workbook and splits it into catalog + historial sheets by name pattern matching; `build()`/`download()` always emit a 3-sheet workbook: `Linea 12` (catalog), `Historial`, `Resumen` (computed stats). Dates are stored internally as ISO (`YYYY-MM-DD`) and only converted to `DD/MM/YYYY` for display/export via `toDisplay()`.

**QR (`js/qr.js`, `QR` namespace)**: QR payloads are namespaced as `cst://linea12/<encoded-id>` (see `PREFIX`/`payloadFor`/`parsePayload`), not raw IDs — so scanning a label round-trips through the app's own URL scheme. Generation (`QRious`) and decoding (`jsQR`) are separate libraries; `paintAll(root)` is called after every `render()` to (re)draw any `<canvas data-qr="...">` found in the newly-inserted DOM. Camera scanning runs a manual `requestAnimationFrame` loop (`scanLoop`) that grabs video frames onto a hidden canvas and feeds pixel data to `jsQR`, with debouncing (`lastCode`/`lastAt`) to avoid re-triggering on the same code every frame.

**CSS**: `css/app.css` is just `@import` glue, in load/override order: `tokens.css` (CSS custom properties) → `base.css` → `layout.css` → `components.css` → `qr.css` → `responsive.css` (media queries last, so they can override everything above).

## Working conventions seen in the code

- Minified/terse style: arrow functions, template-literal HTML generation, short helper names (`$`, `$$`, `esc`, `icon`). Match this density rather than introducing a more verbose style.
- All user-facing HTML insertion goes through `esc()` for escaping; use it for any new interpolated user/record data.
- Equipment IDs are matched case-insensitively/trimmed via `sameId()` — use it (not `===`) whenever comparing IDs.
- SVG icons live inline in the `ICONS` map in `data.js`; there's no icon font or external icon library.
