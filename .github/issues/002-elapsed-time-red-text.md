---
title: "Elapsed time counter red text not displaying"
labels: [bug]
assignees: mitchelljfranklin
---

## Describe the bug

The pending executions elapsed time clock on the Process Reporting page is supposed to show in red text. After the refactor, the red text styling is no longer applying correctly.

## Where does it happen?

- Process Reporting page
- Active processes with an elapsed time counter

## Steps to reproduce

1. Enable auto-refresh on Process Reporting
2. View a process that has been running for some time
3. The elapsed time counter appears but does not show in red text as expected

## Expected behavior

The elapsed time for active processes should display in red text to visually distinguish running processes from completed ones.

## Possible fix

Check `src/library/boomiapp/content/customRefresh.js` around line 32 where the color is set via `element.style.color`. After the refactor, verify:

1. The `BoomiPlatform` config is populated before the script runs (race condition with `listenerGlobal.js`)
2. The inline `style.color` assignment is still in place and not overridden by CSS
3. The target element selector still matches the current Boomi DOM structure

## Related files

- `src/library/boomiapp/content/customRefresh.js`
