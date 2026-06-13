// Shared SVG assets used across multiple content scripts.
// Reference these instead of inline SVG strings to reduce duplication.

// Info/alert icon — used by contentScript.js, updateNotification.js, global.js
var SVG_INFO_ICON = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PC9kZWZzPjx0aXRsZT5BbGVydC1JY29uczwvdGl0bGU+PHBhdGggZmlsbD0iIzMzMzMzMyIgZD0iTTEwLjgxLDE5LjA5YTQuMjMsNC4yMywwLDAsMCwxLjkzLS41OSw5Ljg5LDkuODksMCwwLDAsMi41My0xLjcxbC0uNDUtLjU5YTMuNjMsMy42MywwLDAsMS0xLjYzLjg5Yy0uMTUsMC0uMy0uMy0uMTUtLjg5bDEtMy44NmMuNDQtMS40OS4zLTIuMjMtLjYtMi4yM2E1LDUsMCwwLDAtMi4wNy43NCw4LjQ4LDguNDgsMCwwLDAtMi42OCwxLjc4bC40NS42QTIuNDMsMi40MywwLDAsMSwxMSwxMi4zNGMuMTUsMCwuMTUuMjksMCwuNzRsLS44OSwzLjU2QzkuNDgsMTguMjcsOS43NywxOS4wOSwxMC44MSwxOS4wOVoiLz48cGF0aCBmaWxsPSIjMzMzMzMzIiBkPSJNMTMuNjMsNC45MWExLjg5LDEuODksMCwwLDAtMS40OC42LDEuODUsMS44NSwwLDAsMC0uNiwxLjE4LDIuMiwyLjIsMCwwLDAsLjMsMUExLjY5LDEuNjksMCwwLDAsMTMsOC4xOGExLjg4LDEuODgsMCwwLDAsMS40OC0uNiwxLjg2LDEuODYsMCwwLDAsLjYtMS4zMywxLDEsMCwwLDAtMS0xLjM0WiIvPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0xMiwxLjA5QTEwLjkxLDEwLjkxLDAsMSwxLDEuMDksMTIsMTAuOTIsMTAuOTIsMCwwLDEsMTIsMS4wOU0xMiwwQTEyLDEyLDAsMSwwLDI0LDEyLDEyLDEyLDAsMCwwLDEyLDBaIi8+PC9zdmc+";

// Copy icon — used by copyDocument.js
var SVG_COPY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

// Check icon — used by copyDocument.js
var SVG_CHECK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
