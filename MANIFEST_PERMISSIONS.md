# Manifest Permissions — BoomiXcel

This document explains every permission declared in `src/manifest.json` (Chrome Manifest V3), why it is needed, and what would break if it were removed.

## Requested permissions

### `storage`

| Aspect          | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -----------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Both `chrome.storage.sync` and `chrome.storage.local`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Why needed**  | The extension is configurable — users toggle ~30 features on/off, set refresh intervals, choose icon sets, and define keyboard shortcuts. All of these preferences are persisted via `chrome.storage.sync` so they follow the user across signed-in browsers. The `chrome.storage.local` backend is used for a single transient key (`headerVisible`) that tracks whether the Boomi header is currently shown or hidden — this is UI state, not a preference, and should not sync. |
| **Without it**  | Every setting would reset to defaults on every page load, making the extension effectively unusable beyond a single session. The quick-settings popup, options page, and all feature toggles would be non-functional.                                                                                                                                                                                                                                                              |
| **Alternative** | `localStorage` could store preferences but only per-browser (no cross-device sync). It would also require a different serialization approach since `localStorage` is synchronous and string-only. The `storage` permission is the idiomatic and user-friendly choice.                                                                                                                                                                                                              |

### `downloads`

| Aspect          | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -----------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Context**     | Used by `background.js` (service worker) via `chrome.downloads.onDeterminingFilename`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Why needed**  | When a user clicks the "Download Original Document" button in the Boomi Document Viewer dialog, the extension intercepts the click, extracts the process name and execution timestamp from the page DOM, and sends this context to the background service worker. The worker then renames the downloaded file from a generic/opaque filename (e.g., `download`) to a human-readable format: `<ProcessName>_<timestamp>.<ext>` (e.g., `MyProcess_20250617_143022.json`). The extension never reads the contents of any download — it only suggests a new filename before the file is written to disk. |
| **Without it**  | Downloaded documents would keep their default opaque filenames. Users would need to manually rename every downloaded file to identify which process and execution it belongs to — a significant productivity regression.                                                                                                                                                                                                                                                                                                                                                                             |
| **Alternative** | The `downloads` API provides `onDeterminingFilename`, which is the only way to programmatically rename a download at the correct moment (after the server responds but before the file is saved). There is no alternative API; any other approach would require the user to manually trigger a second download or copy a generated filename — far more intrusive and error-prone.                                                                                                                                                                                                                    |

### `host_permissions`

| Aspect | Detail |
|---|---|
| **Context** | `"host_permissions": ["https://platform.boomi.com/*"]` |
| **Why needed** | The extension is purpose-built for the Boomi integration platform. It injects CSS, content scripts (bundled into `bundle.js`), CodeMirror, jQuery 4.0, arrive.js, showdown, and rasterizeHTML.js exclusively into pages on `https://platform.boomi.com`. No other domain is touched. The host permission also makes `chrome.storage.onChanged` event listeners active on Boomi tabs so the extension can prompt users to reload when settings change. |
| **Without it** | The content scripts, CSS, and all injected libraries would not load on any Boomi page. The extension would do nothing. |
| **Alternative** | None — content scripts require `matches` patterns that must have host permission coverage. The narrower alternatives (`activeTab` or `<all_urls>`) are either inappropriate (the extension needs to auto-run on every Boomi page, not just after a toolbar click) or overly broad (it has no business on other sites). `https://platform.boomi.com/*` is the most restrictive scope that still works. |

## What is NOT requested

BoomiXcel requests only the permissions listed above. Notable absences:

| Permission | Why it is not needed |
|---|---|
| `tabs` | The extension does not need to query or modify tabs. The popup's "Reload Page" button uses `chrome.tabs.query` which is covered by `activeTab` — the popup has implicit access to the active tab without declaring `tabs`. |
| `activeTab` | Not declared because the content scripts need to run automatically on page load across all Boomi tabs. `activeTab` would limit injection to only tabs where the user clicks the toolbar icon. |
| `cookies`, `webRequest` | The extension does not inspect, modify, or intercept any network activity. The `webRequest` API is not used — see note below about the status check. |
| `<all_urls>` | The extension only operates on Boomi platform pages. Granting access to all websites would violate the principle of least privilege. |
| `notifications` | No desktop notifications are generated. All user-facing messages use in-page modals and toasts. |
| `clipboardRead` / `clipboardWrite` | The extension only writes to the clipboard via `navigator.clipboard.writeText()` (document viewer copy button), which does not require a manifest permission. |

## Implicit network access — platform status check

The extension makes one outbound network request that is **not** covered by any listed permission — it relies on the target server's CORS policy instead:

| Aspect | Detail |
|---|---|
| **What** | `fetch("https://status.boomi.com/api/v2/status.json")` in `contentScript.js` |
| **Why** | Displays the live Boomi platform status (operational/degraded/outage) as a colored dot in the Boomi footer bar on every page |
| **Permission needed?** | None declared. The `fetch()` call runs from the content script's isolated world. If `status.boomi.com` sends `Access-Control-Allow-Origin: *` (or the extension's origin), the request succeeds without `host_permissions` covering `status.boomi.com`. If the CORS headers were ever removed or tightened, the status indicator would silently stop updating — it would not break any other extension functionality. |
| **Why not add `host_permissions` for it?** | Adding `https://status.boomi.com/*` to `host_permissions` would expand the extension's declared scope beyond the platform it enhances, prompting an additional permission warning at install time. The status check is a non-essential cosmetic enhancement; relying on CORS keeps the permission surface minimal. |

## Contact

If you have questions about these permissions, open a [GitHub issue](https://github.com/mitchelljfranklin/BoomiXcel/issues) or join the [Boomi Discord](https://discord.gg/XcXRrYHVUa).
