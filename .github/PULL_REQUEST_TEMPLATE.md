## Description

<!-- Describe your changes in detail. What does this PR do? Why is it needed? -->

## Related Issue

<!-- Link to the issue this PR addresses, if applicable. Use "Fixes #123" or "Closes #123". -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement / UI improvement
- [ ] Build / dependency update
- [ ] Documentation

## Testing

<!-- Describe how you tested your changes. -->

**Browsers tested:**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge

**Boomi pages tested:**
- [ ] Build canvas
- [ ] Process Reporting
- [ ] Dashboard
- [ ] Options page
- [ ] Other: ______

## Checklist

- [ ] I have read the [contributing guidelines](../README.md#-contributing)
- [ ] New content scripts are added to `CONTENT_ORDER` in `scripts/build.js`
- [ ] New page-context scripts are added to `web_accessible_resources` in `src/manifest.json`
- [ ] All CSS is in `library/css/boomi.css` — no inline styles
- [ ] All modals use `renderBoomiModal()`, toasts use `showToast()`
- [ ] I have run `npm run build` and it completes without errors
- [ ] I have verified my changes on `https://platform.boomi.com/`
- [ ] The README and USER_GUIDE have been updated if features or scripts changed

## Screenshots

<!-- If your change includes visual updates, add before/after screenshots here. -->
