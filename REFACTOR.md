# BoomiXcel v1.8.0.0 — Refactor & Change Log

A comprehensive comparison of the OLD project (`/root/github/OLD`) against the current BoomiXcel codebase. This document captures all architectural changes, new features, bug fixes, documentation improvements, and cleanup performed.

---

## Table of Contents

- [Architecture Changes](#architecture-changes)
- [New Features](#new-features)
- [Features Removed](#features-removed)
- [Bug Fixes](#bug-fixes)
- [Styling & UI](#styling--ui)
- [Documentation](#documentation)
- [CI/CD & Build](#cicd--build)
- [Security](#security)
- [Code Quality](#code-quality)
- [Content Script Inventory](#content-script-inventory)
- [Summary](#summary)

---

## Architecture Changes

| Area | OLD | Current |
|------|-----|---------|
| **Content script loading** | 21 individual JS files listed in manifest | Single `content/bundle.js` (esbuild IIFE bundle of 36 files) |
| **Page context scripts** | 10+ scripts loaded via `loadScript()` | Only `page/fullscreen.js` (Fullscreen API requires page context) |
| **Build system** | None — manual zip creation | `scripts/build.js` — esbuild bundling, 3-browser manifest generation, zip packaging, watch mode, release automation |
| **Manifests** | 3 static files in `Manifest/` directory | Single `src/manifest.json` → dynamically generates Chrome (V3), Firefox (V2), Edge (V3) |
| **Dependencies** | None (no `package.json`) | esbuild `^0.28.1`, archiver `^7.0.0` via npm |
| **jQuery** | 3.6 | 4.0 |
| **web_accessible_resources** | 22 entries exposed to pages | 3 entries (`*.png`, `*.jpg`, `page/fullscreen.js`) — significantly tightened security surface |
| **webRequest permission** | Present | Removed (no longer needed) |
| **permissions** | `storage`, `downloads`, `webRequest` | `storage`, `downloads` |
| **host_permissions** | Not present (implicit via content_scripts matches) | Explicit: `https://platform.boomi.com/*` |
| **manifest name** | `Boomi Platform Enhancer` | `BoomiXcel` |
| **version** | `1.7.4.8` | `1.8.0.0` |

### Bundle architecture

Content scripts in `src/library/boomiapp/content/` are concatenated in `CONTENT_ORDER` (defined in `scripts/build.js`) and bundled by esbuild into a single IIFE. This means `var`/`function` declarations at the top level of any content script are accessible from all other content scripts in the bundle — no need for `window.*` globals or `loadScript()`.

**Bundle order**: `contentScript.js` → `global.js` → `svgAssets.js` → `modalHelper.js` → `toastHelper.js` → `pageInit.js` → `favicon.js` → `headerActions.js` → `dashboard.js` → `shapePalette.js` → `keyboardShortcuts.js` → `updateNotification.js` → `messageEditor.js` → `reminders.js` → `buildFilters.js` → `filterButtons.js` → `shapePopup.js` → `menuOpen.js` → `copyDocument.js` → `downloadRename.js` → `scheduleIcons.js` → `iconSets.js` → `modalButtons.js` → `listenerGlobal.js` → `canvas.js` → `customRefresh.js` → `shapes.js` → `endpointGlow.js` → `tableWrap.js` → `imageCapture.js` → `groups.js` → `connectionOperations.js` → `versionNotification.js` → `sqlEditor.js` → `brandLogo.js`

---

## New Features

### Quick-Settings Popup
- Clicking the toolbar icon opens a 330px popup with 8 quick-toggle switches for commonly-used features
- Toggles: Canvas Grid, Brand Logo, Play/Pause Icons, Reverse Modal Buttons, Show Footer, Page Titles & Favicons, Default Process Filters, Schedule Reminder
- Changes save instantly to `chrome.storage.sync` with a "Saved" toast
- Full Settings button opens the complete options page; Reload Page button refreshes the active Boomi tab
- Files: `src/popup/popup.html`, `src/popup/popup.js`, `src/popup/popup.css`

### Brand Logo Replacement
- Replace the Boomi masthead brand logo with the BoomiXcel logo (configurable)
- File: `src/library/boomiapp/content/brandLogo.js`

### Platform Status with Colored Dot Indicator
- Fetches `https://status.boomi.com/api/v2/status.json` on every page load
- Renders a colored dot before the status text in the footer bar:
  - Green = All Systems Operational (`none`)
  - Orange = Partial Service Disruption (`minor`)
  - Red = Major Outage / Critical (`major`, `critical`)
  - Blue = Under Maintenance (`maintenance`)
- CSS classes in `boomi.css`: `.bph-status-dot`, `.bph-status-*`

### Page-Specific Favicons & Titles
- Unique favicon per Boomi subdomain (AtomSphere, MdmSphere, ApiSphere, Flow)
- Removes account name prefix from page titles
- Fallback favicon for new Boomi UI URL patterns and unknown subdomains
- Tab names simplified — account name removed from document title
- File: `src/library/boomiapp/content/favicon.js`

### Shared Modal Dialog Helper
- `renderBoomiModal({...})` renders a consistent Boomi-style modal/notification dialog
- `removeBoomiOverlay(className)` cleans up existing dialogs
- Used by `contentScript.js` (settings-changed dialog), `updateNotification.js` (changelog popup), `imageCapture.js` (capture options)
- File: `src/library/boomiapp/content/modalHelper.js`

### Shared Toast Notification Helper
- `showToast(message, duration, type)` shows a transient slide-in notification
- Available in content scripts (via bundle) and options page (via direct `<script>` tag)
- File: `src/library/boomiapp/content/toastHelper.js`

### Copy Document Content Button
- Clipboard icon appears in the Document Viewer dialog header
- Copies raw document content with "Copied" confirmation
- Uses shared SVG icons from `svgAssets.js`
- File: `src/library/boomiapp/content/copyDocument.js`

### Footer Visibility Toggle
- Option to keep the Boomi footer bar always visible (`mastfoot_show`)
- `MutationObserver` prevents the platform from re-hiding it during SPA navigation

### View in Process Reporting Quick-Link
- Quick-link icon appears next to the Description link on the build canvas
- Takes you directly to the Process Reporting page for the current component

### Endpoint Glow & Quick-Add Stop Shape
- Non-connected endpoints glow for visibility
- Hovering over a glowing endpoint shows a quick-add Stop shape button
- File: `src/library/boomiapp/content/endpointGlow.js`

### Automated GitHub Releases
- `npm run release` (alias for `node scripts/build.js --release`)
- Creates a GitHub release tagged `v{version}` with auto-generated notes from conventional commit messages since the last `v*` tag, grouped by category (`feat:`, `fix:`, `docs:`, `style:`, etc.)
- All 3 browser zips attached as assets
- Full changelog compare URL included
- Requires `gh` CLI authentication (`gh auth login` or `GITHUB_TOKEN`)

### Watch Mode
- `npm run watch` rebuilds the content bundle on file changes
- Includes `sourcemap: "inline"` for easier debugging in DevTools
- Stack traces show original source filenames (esbuild injects `// path/to/file.js` comments)

### Webstore Description Auto-Generation
- Build step extracts the Features section from README, converts markdown to plain text
- Handles both Unix (`\n`) and Windows (`\r\n`) line endings
- Replaces the old static `WebStore Text.md` manual process

### Dirty Indicator on Options Page
- Yellow dot appears when form has unsaved changes
- Disappears after save

### Reset Button on Options Page
- Restores all options to their `data-default` values
- Confirmation prompt + toast notification

### Collapsible Options Groups
- Settings organized into `<details>` sections: Appearance, Build Canvas, Process Reporting, Navigation & Shortcuts, Reminders
- All groups open by default

### Shields.io Badges
- README header badges: version, license, GitHub stars, Chrome/Firefox install counts
- Replaced static badge PNG files in OLD

---

## Features Removed

| Feature | Reason |
|---------|--------|
| `webRequest` permission | No longer needed by any feature |
| `shortcut.js` library | Replaced by native `addEventListener("keydown")` in `keyboardShortcuts.js` and `fullscreen.js` |
| Bootstrap popover for disclaimer | Replaced by static Bootstrap alert banner |
| Inline base64 SVG logo on options page | Replaced by `<img src="logo/XcelLogo.png">` |
| `notes.js` (content script) | Boomi platform now handles markdown rendering natively |
| `descriptionMarkdown.js` | Same reason |
| Static `Manifest/` directory (3 files) | Replaced by dynamic manifest generation in `scripts/build.js` |
| `boomi.js` (content script) | Functionality merged into other content scripts |
| `clickComponents.js` | Merged into `shapePopup.js` and other files |
| OLD `build/` zip artifacts (68 files) | Replaced by 3 auto-generated zips |
| `WebStore Text.md` (static) | Replaced by auto-generated `webstore-description.txt` |
| Static store badge PNGs (5 files) | Replaced by shields.io dynamic badges |
| `blocks.css` (options page stylesheet) | Merged into `boomi.css` under `/* Options page */` |

---

## Bug Fixes

### Firefox Manifest Generator (Critical)
The OLD Firefox manifest was generated incorrectly — it did not convert MV3 keys to their MV2 equivalents. The Firefox build was non-functional.
- `action` → `browser_action`
- `background.service_worker` → `background.scripts` (array)
- `host_permissions` → merged into `permissions` array
- `web_accessible_resources` object array → flattened string array

### Webstore Description Generator (Critical)
- Regex `## Features\n` did not match `## ✨ Features` (emoji in heading)
- Fixed to `## [^\n]*Features` with next `##` heading as boundary via lookahead
- Windows `\r\n` line endings caused missing spaces in output — now normalized at input

### Undefined `overlay` Variable
`contentScript.js` had `if (overlay) overlay.remove()` referencing an undeclared variable. `removeBoomiOverlay()` already handles cleanup. Removed the dangling line.

### Null Guard on Footer Injection
`document.getElementById("footer_links").insertAdjacentHTML()` could throw TypeError on pages without a footer. Wrapped in `if (footerLinks)` check.

### Duplicate `Connector` Key in iconSets.js
`minimalInvertedIconStyleColorCodes` object had `Connector: "#1B72C3"` declared twice (identical values). This caused a persistent esbuild warning. Removed the duplicate.

### SVG Icon Duplication
`copyDocument.js` defined `copySvg` and `checkSvg` variables that duplicated `SVG_COPY_ICON` and `SVG_CHECK_ICON` already in `svgAssets.js`. Refactored to use shared variables.

### Popup Toggle Defaults
First-time users (no saved storage keys) saw all popup toggles as OFF, even for features that default to ON (canvas grid, footer, favicons, schedule reminder). Added `defaultVal` fallback matching the options page `data-default` attributes.

### Settings-Changed Modal Firing from Popup
Changing a toggle in the popup triggered the "Settings Changed — Reload" modal, duplicating the popup's own "Reload Page" button. Fixed with a suppress flag in `chrome.storage.local` checked by the `onChanged` listener. Also filtered to `sync` area only to prevent double-fire from local storage writes.

### `buildFilters.js` Race Condition
5 separate `chrome.storage.sync.get()` calls could fire callbacks in non-deterministic order, causing the 5th callback to reference undefined variables from earlier callbacks. Combined into a single multi-key `get()` call.

### `updateNotification.js` Dead Call
`localStorage.getItem("boomiplatenhanUpdateNot" + currentAppver)` was called twice — once without assignment (dead), once with. Removed the dead call.

### Implicit Globals
- `dynamicShapeIconStyleData` in `listenerGlobal.js` — assigned without `var`/`let`/`const`. Would become `window` property in non-strict mode, breaking under strict mode. Now declared with `var`.
- `iconHrefData` in `favicon.js` — same issue. Now declared with `var`.

### Favicons Not Updating
Three separate issues:
1. New Boomi UI uses URLs like `/build` instead of `/AtomSphere.html` — `getPageNameWithoutExtension()` returned `"build"` which matched no switch case. Added `default` cases.
2. Data URI had a leading space (`data:image/svg+xml, %3Csvg...`) producing invalid XML. Removed the space.
3. Browsers cache favicons aggressively — changing `<link>` href didn't trigger refresh. Rewrote `changeFaviconImage` to always create a fresh `<link>` element with `data-bph-favicon` attribute, removing previous ones.

### Orphaned CSS Rules
`boomi.css` had orphaned `height`/`width` rules without a selector (cut-paste artifact from earlier edits). Removed.

### Stale `shortcut.js` References
README and AGENTS.md referenced `shortcut.js` as a bundled library, but it was removed and no file existed. Removed all references.

### Stale `boomi.js` Reference in AGENTS.md
AGENTS.md mentioned `boomi.js` as a file calling functions from `global.js`, but `boomi.js` had been merged into other scripts. Updated to `dashboard.js` and `pageInit.js`.

### Discord Channel Name
README referenced `#extension-enhancer` (old name pattern). Updated to `#boomi-xcel`.

### Permissions Documentation
README FAQ table listed `scripting` permission, but the manifest uses declared `content_scripts` instead (no `scripting` permission needed). Removed from documentation.

### PRIVACY.md Accuracy
Claimed no external requests are made, but `contentScript.js` fetches `status.boomi.com`. Updated to document this single API call.

---

## Styling & UI

### Options Page Redesign
- **OLD**: Full-page dark teal background, Bootstrap `bg-dark rounded-3` card with sidebar, all `<select>` dropdowns, popover for disclaimer, inline styles throughout
- **Current**: White centered card (`max-width: 720px`), mix of toggle switches and selects, collapsible `<details>` groups, yellow alert banner for disclaimer, no inline styles

### Toggle Switches Unified
- **OLD**: Bootstrap `form-check-input toggle-switch` checkboxes
- **Current**: Popup-style slider toggles (`.toggle` label wrapping `<input>` + `.slider` span), matching the toolbar popup

### CSS Changes
- **Added**: `.bph-brand-logo`, `.bph-status-*` (platform status), `.options-*` (options page), `.toggle`/`.slider` (switch toggles), `.sticky-save`, `.bph-toast` (toast notifications), `.bph-copy-*` (copy button)
- **Removed**: `.svg-foreground`, commented-out dark theme canvas grid variables (33 lines), dead `.ignoreBreaks` commented rule, duplicate brand-logo rules
- **Cleaned**: `#close` → `#bph-close-notification` (namespaced selector), large commented-out dark theme block, misc commented-out values

### Copy Document Button Styling
Inline `style.cssText` in `copyDocument.js` replaced with CSS classes:
- `.bph-copy-btn` — button appearance
- `.bph-copy-btn-hover` — hover/active opacity
- `.bph-copy-tooltip` — tooltip appearance
- `.bph-copy-tooltip-visible` — tooltip visibility
- `.bph-copy-container` — relative positioning on form header

### Options Logo
Inline `style="height: 60px"` on `<img>` moved to `.options-logo` CSS class.

---

## Documentation

| Document | OLD | Current |
|----------|-----|---------|
| **README.md** | 184 lines — basic project description, feature bullet list, store links | 519 lines — shields.io badges, categorized feature tables, architecture diagrams, Supported Browsers table, FAQ (8 Q&As), dev setup, build process with release automation, script reference table (39 files), conventions, contributors table |
| **USER_GUIDE.md** | Did not exist | 233 lines — installation, popup, options page, keyboard shortcuts, all features documented with usage instructions |
| **AGENTS.md** | Did not exist | ~800 lines — developer reference: architecture, bundle scope behavior, execution contexts, config flow, storage split, key libraries, script responsibilities table, refactoring rules, documentation sync rules, code style, CSS conventions, modal/toast helpers, options page form contract, rebuild scope |
| **PRIVACY.md** | Did not exist | Privacy policy — data collection disclosure, permission justification, status.boomi.com API call documented |
| **SECURITY.md** | Did not exist | Vulnerability reporting process, scope, supported versions |
| **LICENSE** | MIT (inline in README) | GPLv3 (674-line `LICENSE` file) |
| **webstore-description.txt** | `WebStore Text.md` (static, 44 lines) | Auto-generated from README Features section with version header |
| **PULL_REQUEST_TEMPLATE.md** | Did not exist | PR template with browser/page checklists, contributing checklist |
| **Issue templates** | Did not exist | Bug report + feature request templates with browser/version/page selectors |

### Documentation Improvements (this session)
- Added USER_GUIDE link to README TOC and body
- Added popup to Features, Script Reference, Project Structure
- Fixed script count: 40 → 39 (added `popup.js`)
- Removed broken `#screenshots` TOC link
- Fixed `boomi.js` → `dashboard.js, pageInit.js` in AGENTS.md
- Discord channel: `#extension-enhancer` → `#boomi-xcel`
- Legacy note on `boomiplatenhanUpdateNot` localStorage key
- `toggle-switch` → `toggle-input` in code examples
- README sections reordered: Features → Installing → Supported Browsers → User Guide → FAQ → Development → Contributing → Discussion → Privacy → Security → License → Contributors
- Fixed "Built With" orphaned under Development
- Added `var`/`const`/`let` convention rules
- Added CSS computed-style exception documentation
- Added cross-platform build consistency rules
- Added `npm run release` documentation
- Added prerequisites to Setup section (Node.js, npm, gh CLI)

---

## CI/CD & Build

| Item | OLD | Current |
|------|-----|---------|
| **Build system** | None | `scripts/build.js` (~398 lines) |
| **CI workflow** | None | `.github/workflows/build.yml` — builds on push/PR to master/main across Node 18/20/22, validates all 3 zips exist, validates Firefox manifest correctness (MV2 format, permissions, background.scripts) |
| **PR template** | None | `.github/PULL_REQUEST_TEMPLATE.md` |
| **Issue templates** | None | Bug report + feature request |
| **npm scripts** | None | `build`, `watch`, `release` |
| **Watch mode** | None | `npm run watch` — esbuild watch + inline sourcemaps |
| **Release** | Manual | `npm run release` — GitHub release with auto-generated notes + zip assets |

---

## Security

| Change | Details |
|--------|---------|
| **esbuild dependency** | Bumped from `^0.25.0` (0.25.12) → `^0.28.1`. Fixes GHSA-gv7w-rqvm-qjhr — missing binary integrity verification in Deno module enabling RCE via `NPM_CONFIG_REGISTRY` override. Also adds integrity checks to fallback download path. |
| **webRequest permission removed** | No longer needed — reduces extension's surface area |
| **web_accessible_resources reduced** | From 22 entries → 3 entries (`*.png`, `*.jpg`, `page/fullscreen.js`) |
| **host_permissions explicit** | Added `https://platform.boomi.com/*` — makes host access explicit rather than implicit via content_scripts |

---

## Code Quality

### Dead Code Removed
- `openExensionOptionsPage()` in `contentScript.js` — typo in name, never called, duplicated existing functionality
- 16-line comment block in `keyboardShortcuts.js` documenting removed Ctrl+Alt+T feature (condensed to 2 lines)
- `//debugger` statements in `buildFilters.js` and `reminders.js`
- `console.log()` calls in `shapePalette.js` and `customRefresh.js`
- `//for later` commented code in `connectionOperations.js`
- `//document.querySelectorAll(...)` commented code in `filterButtons.js`
- `// removed as adding pre to notes...` comment in `groups.js`
- 3 large commented-out CSS blocks in `boomi.css` (33+ lines)

### Refactoring
- Fragile XPath `//a[text()='Platform Status & Announcements']` → CSS selector `a[href*="status.boomi.com"]`
- `buildFilters.js`: 5 separate `chrome.storage.sync.get()` → 1 multi-key call
- `copyDocument.js`: Duplicate SVG definitions → references `svgAssets.js` variables
- `updateNotification.js`: Removed dead `localStorage.getItem()` call
- Build script: Line ending normalization (`\r\n` → `\n`) before regex processing

### Conventions Established
- `var` required for top-level declarations referenced across files in the bundle
- `const`/`let` preferred for file-local declarations
- No implicit globals (assignment without declaration keyword)
- CSS: static styles → `boomi.css` classes; computed/dynamic styles (positioning, transforms) acceptable as inline
- All regex operations in build script must handle both `\n` and `\r\n` line endings

---

## Content Script Inventory

### New files (no OLD equivalent)
| File | Purpose |
|------|---------|
| `pageInit.js` | Page-load detection, header visibility, button injection |
| `favicon.js` | Page-specific favicons, unique page titles, nav state listeners |
| `headerActions.js` | Header show/hide toggle, copy component ID/URL, update overlay close |
| `brandLogo.js` | Replace Boomi masthead brand logo with custom image |
| `svgAssets.js` | Shared SVG icon strings |
| `modalHelper.js` | Boomi-style modal dialog renderer |
| `toastHelper.js` | Shared toast notification utility |
| `endpointGlow.js` | Non-connected endpoint glow and quick-add Stop shape |

### Renamed/reorganized
| OLD file | Current file | Notes |
|----------|-------------|-------|
| `buildPallet.js` | `content/shapePalette.js` | Rewritten, new name |
| `shortCuts.js` | `content/keyboardShortcuts.js` | Rewritten, new name |
| `quickclickComponent.js` | `content/shapePopup.js` | Rewritten, new name |
| `dbsqlEditor.js` | `content/sqlEditor.js` | Migrated, archived in `.Old Scripts/` |
| `scripts/build/updateNotification.js` | `content/updateNotification.js` | Moved into bundle |

### Removed
| File | Reason |
|------|--------|
| `notes.js` | Boomi platform handles markdown natively |
| `descriptionMarkdown.js` | Same reason |
| `boomi.js` | Merged into other scripts |
| `clickComponents.js` | Merged into `shapePopup.js` / other files |
| `shortcut.js` | Replaced by native `addEventListener` |

### Moved from page context to bundle
Previously loaded via `loadScript()` (page context injection), now in content bundle:
`canvas.js`, `customRefresh.js`, `connectionOperations.js`, `versionNotification.js`, `modalButtons.js`, `tableWrap.js`, `imageCapture.js`, `groups.js`, `iconSets.js`, `listenerGlobal.js`

Only `fullscreen.js` remains in page context (Chrome restricts Fullscreen API from isolated world).

---

## Summary

| Metric | OLD | Current |
|--------|-----|---------|
| **Content scripts** | 33 flat files | 36 bundled + 1 page-context |
| **Build artifacts** | 68 manual zips | 3 auto-generated zips |
| **Documentation files** | 1 (README) | 6 (README, USER_GUIDE, AGENTS, PRIVACY, SECURITY, LICENSE) |
| **CI/CD** | None | GitHub Actions |
| **npm scripts** | None | build, watch, release |
| **New features** | — | 19 |
| **Bugs fixed** | — | 14 |
| **Code cleanups** | — | 22 |
| **web_accessible_resources** | 22 | 3 |
| **Permissions** | 3 (storage, downloads, webRequest) | 2 (storage, downloads) |
| **jQuery** | 3.6 | 4.0 |
| **Dependencies** | None | esbuild 0.28.1, archiver 7.0.0 |
| **~Lines of code** | ~4,500 | ~5,200 + ~1,500 docs |
