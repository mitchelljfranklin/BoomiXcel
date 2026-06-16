# Convention Cleanup Plan

## Priority 1 — Implicit globals (will break in strict mode)

These must be fixed first. Currently work in sloppy mode but will crash if `"use strict"` is ever added.

| # | File | Line | Current | Fix |
|---|---|---|---|---|
| 1 | `shapePopup.js` | 45 | `quick_shape_added = { added: false, ... }` | `var quick_shape_added = { added: false, ... }` |
| 2 | `shapePopup.js` | 56 | `shapes_array_sorted = Object.keys(...)` | `var shapes_array_sorted = Object.keys(...)` |
| 3 | `messageEditor.js` | 29 | `editor = CodeMirror(...)` | `var editor = CodeMirror(...)` |
| 4 | `sqlEditor.js` | 25 | `editor = CodeMirror(...)` | `var editor = CodeMirror(...)` |
| 5 | `listenerGlobal.js` | 103 | `notegroupbutton_html = \`...\`` | `var notegroupbutton_html = \`...\`` |

## Priority 2 — `const`/`let` for cross-file declarations (12)

Current code uses `const`/`let` which works with esbuild's IIFE but violates the documented contract (AGENTS.md). If bundling changes, these could break. Must be `var`.

| # | File | Declaration | Change |
|---|---|---|---|
| 1 | `canvas.js:1` | `const add_canvas_listener` | `var add_canvas_listener` |
| 2 | `shapes.js:1` | `const add_shape_listener` | `var add_shape_listener` |
| 3 | `shapes.js:88` | `const add_path_listener` | `var add_path_listener` |
| 4 | `endpointGlow.js:1` | `const add_endpoint_listener` | `var add_endpoint_listener` |
| 5 | `tableWrap.js:1` | `const add_table_listener` | `var add_table_listener` |
| 6 | `imageCapture.js:1` | `const process_to_image` | `var process_to_image` |
| 7 | `groups.js:4` | `const create_note_group` | `var create_note_group` |
| 8 | `connectionOperations.js:1` | `const add_connector_list` | `var add_connector_list` |
| 9 | `versionNotification.js:1` | `const add_notification_close` | `var add_notification_close` |
| 10 | `modalButtons.js:1` | `const modal_listener` | `var modal_listener` |
| 11 | `customRefresh.js:121` | `const refreshInterval_listener` | `var refreshInterval_listener` |
| 12 | `messageEditor.js:1` | `const langs` | `var langs` |

## Priority 3 — Abbreviated parameter names (44)

Callback parameters using single-letter or abbreviated names. Mechanical rename only — no logic changes.

### `contentScript.js`
| Line | Current | Fix |
|---|---|---|
| 42 | `function (e)` | `function (clickEvent)` |

### `pageInit.js`
| Line | Current | Fix |
|---|---|---|
| 18 | `function (e)` | `function (result)` |

### `favicon.js`
| Line | Current | Fix |
|---|---|---|
| 6 | `function (e)` | `function (config)` |

### `shapePalette.js`
| Line | Current | Fix |
|---|---|---|
| 21 | `function DisplayPalette(toggle, el)` | `function DisplayPalette(toggle, element)` |
| 36 | `function ExpandPalette(toggle, el)` | `function ExpandPalette(toggle, element)` |
| 47 | `function InitCollapsiblePanel(p)` | `function InitCollapsiblePanel(panel)` |

### `keyboardShortcuts.js`
| Line | Current | Fix |
|---|---|---|
| 5 | `var btns` | `var saveButtons` |

### `messageEditor.js`
| Line | Current | Fix |
|---|---|---|
| 19 | `function (e)` | `function (clickEvent)` |
| 87 | `function (e)` | `function (changeEvent)` |
| 101 | `const [k, v]` | `const [key, value]` |

### `reminders.js`
| Line | Current | Fix |
|---|---|---|
| 7 | `function (e)` | `function (config)` |

### `buildFilters.js`
| Line | Current | Fix |
|---|---|---|
| 8 | `function (e)` | `function (prefs)` |

### `filterButtons.js`
| Line | Current | Fix |
|---|---|---|
| 41 | `function (el)` | `function (treeItem)` |
| 43 | `function (e)` | `function (clickEvent)` |

### `shapePopup.js`
| Line | Current | Fix |
|---|---|---|
| 8, 18 | `function (e)` | `function (event)` |
| 28 | `(el) =>` | `(element) =>` |
| 44 | `function rendorQuickShapePopup(obj, ...)` | `...rendorQuickShapePopup(processPanel, ...)` |
| 99 | `function (e)` | `function (keyEvent)` |
| 144 | `function (e)` | `function (mouseEvent)` |

### `menuOpen.js`
| Line | Current | Fix |
|---|---|---|
| 16 | `anchor.css("width", "14em")` | Remove; add CSS rule in boomi.css |

### `scheduleIcons.js`
| Line | Current | Fix |
|---|---|---|
| 2 | `function (e)` | `function (prefs)` |

### `endpointGlow.js`
| Line | Current | Fix |
|---|---|---|
| 61 | `(el) =>` | `(element) =>` |

### `groups.js`
| Line | Current | Fix |
|---|---|---|
| 4 | `function (el)` → `function (element)` | Also part of priority 2 (const→var) |

### `connectionOperations.js`
| Line | Current | Fix |
|---|---|---|
| 11 | `for (var b = 0; ...)` | `for (var j = 0; ...)` (standard nested loop index) |

### `modalHelper.js`
| Line | Current | Fix |
|---|---|---|
| 29 | `var o = options \|\| {}` | `var opts = options \|\| {}` |
| 40 | `function (b)` | `function (buttonDef)` |

### `copyDocument.js`
| Line | Current | Fix |
|---|---|---|
| 32 | `function (e)` | `function (event)` |
| 37 | `function (t)` | `function (textarea)` |
| 37 | `function (c)` | `function (content)` |
| 51 | `var ta` | `var fallbackTextarea` |

### `headerActions.js`
| Line | Current | Fix |
|---|---|---|
| 9 | `function (e)` | `function (event)` |

### `listenerGlobal.js`
| Line | Current | Fix |
|---|---|---|
| 140 | `(el) => {` | `(element) => {` |
| 143 | `callback.forEach((cb) => {` | `callback.forEach((handler) => {` |

### `shapePalette.js` — abbreviated locals
| Line | Current | Fix |
|---|---|---|
| 48 | `var el = p.children[1]` | `var collapsibleElement` |
| 49 | `var cdp = p.children[2]` | `var draggerPanel` |
| 51 | `var cd = cdp.children[0]` | `var dragger` |
| 53 | `var ebt = cd.children[0]` | `var expandButton` |
| 54 | `var cbt = cd.children[2]` | `var closeButton` |
| 91 | `var ps` | `var panels` |
| 98 | `var el` | `var initializedPanel` |

## Priority 4 — Inline styles (52)

Static styles in JS (either `element.style.*` assignments or `style="..."` in injected HTML) that should be CSS classes in `boomi.css`. Files affected:

| File | Count | Type |
|---|---|---|
| `shapePalette.js` | 10 | Inline `element.style.*` + dynamic width from computed values |
| `messageEditor.js` | 9 | `style="..."` in injected HTML |
| `menuOpen.js` | 9 | jQuery `.css()` + `style="..."` |
| `endpointGlow.js` | 4 | Inline `element.style.*` + `style="..."` |
| `tableWrap.js` | 3 | Inline `element.style.*` |
| `groups.js` | 7 | `style="..."` in HTML + `element.style.*` |
| `shapePopup.js` | 2 | `style="..."` in injected HTML |
| `filterButtons.js` | 1 | `style="..."` in injected HTML |
| `reminders.js` | 1 | `style="..."` in injected HTML |
| `imageCapture.js` | 5 | `style="..."` in injected HTML (hack tolerated) |
| `versionNotification.js` | 1 | `style="..."` in injected HTML |
| `toastHelper.js` | 1 | `container.style.cssText` (static) |
| `copyDocument.js` | 1 | `ta.style.cssText` (clipboard fallback, hack tolerated) |

**Note:** Dynamic/computed values (e.g., `el.style.width = computedWidth + "px"` for drag/resize) are acceptable exceptions per convention. This priority focuses on static values that can trivially become CSS classes.

## Order of execution

1. Priority 1 — implicit globals (5 fixes, 3 files)
2. Priority 2 — `const`/`let` → `var` (12 fixes, 11 files)  
3. Priority 3 — abbreviated names (44 fixes, ~18 files)
4. Priority 4 — inline styles (52 fixes, ~12 files)

Commits between each priority so each change is isolated and revertible.

## Excluded

| File | Reason |
|---|---|
| `bundle.js` | Build artifact, gitignored |
| `iconSets.js` | Data-only, no executable code |
| `downloadRename.js` | Already cleaned |
| `processDuration.js` | Already cleaned |
| `documentViewer.js` | Already cleaned |
| `global.js` | Already cleaned |
| `brandLogo.js` | Already cleaned |
| `svgAssets.js` | Already cleaned |
| `updateNotification.js` | Already clean |
