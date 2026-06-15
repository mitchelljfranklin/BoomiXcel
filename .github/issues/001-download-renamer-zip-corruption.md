---
title: "Download renamer corrupts ZIP/binary files — misidentified as CSV/TXT"
labels: [bug]
assignees: mitchelljfranklin
---

## Describe the bug

The `downloadRename.js` content script auto-renames downloaded documents to `<ProcessName>_<timestamp>.<ext>` by detecting the file type from the textarea content in the Document Viewer dialog. The `detectTypeFromText()` function checks if the content looks like JSON, XML, EDI, or CSV — and falls back to TXT. It does not account for binary files like ZIP archives.

When downloading a ZIP file, the content preview in the textarea may contain garbled binary data that happens to match one of the text-based patterns (or falls through to CSV/TXT), causing the download to be renamed with the wrong extension. Renaming it back to `.zip` afterward reveals the contents are corrupted.

## Where does it happen?

- Document Viewer dialog in Process Reporting
- Any binary file download (ZIP, PDF, image, etc.)

## Steps to reproduce

1. Navigate to Process Reporting
2. Open a document that is a ZIP file
3. Click the download link
4. The file is renamed with a `.csv` or `.txt` extension instead of `.zip`
5. Rename the file back to `.zip` and try to open it — contents are corrupted

## Expected behavior

- Binary files should be detected and not renamed, OR their original extension from the download URL should be preserved
- The `detectTypeFromText()` function should return `null` or `unknown` when content doesn't match any known text format, and `downloadRename.js` should fall back to the original file extension

## Possible fix

In `src/library/boomiapp/content/downloadRename.js`, the `detectTypeFromText()` function and/or the `guessExtensionFromFilename()` in `background.js` should:

1. Check if the download response includes a `Content-Type` header or the original filename extension
2. If the textarea content doesn't definitively match JSON/XML/EDI, fall back to the original extension from the download URL rather than guessing CSV/TXT
3. Alternatively, skip renaming entirely for known binary MIME types

## Related files

- `src/library/boomiapp/content/downloadRename.js`
- `src/background.js` — `guessExtensionFromFilename()` function
