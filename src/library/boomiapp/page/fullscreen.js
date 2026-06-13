window.BoomiPlatform = window.BoomiPlatform || {};
window.addEventListener("message", function (e) {
  if (e.data.BoomiPlatformconfig) {
    Object.assign(window.BoomiPlatform, e.data);
  }
}, false);

window.addEventListener("keydown", function (event) {
  var el = event.target,
    nodeName = el.nodeName.toLowerCase();
  if (
    el.nodeType == 1 &&
    (nodeName == "textarea" ||
      el.isContentEditable ||
      (nodeName == "input" &&
        /^(?:text|email|number|search|tel|url|password)$/i.test(el.type)))
  )
    return;

  if (event.isComposing || event.keyCode === 229) return;

  if (
    event.keyCode === (parseInt(BoomiPlatform.full_screen_shortcut) || 192)
  ) {
    if (BoomiPlatform.full_screen_shortcut_alt && !event.altKey) return;
    if (BoomiPlatform.full_screen_shortcut_ctrl && !event.ctrlKey) return;
    if (BoomiPlatform.full_screen_shortcut_shift && !event.shiftKey) return;

    // Step 1: click "More" button to reveal the menu
    var moreBtn = document.querySelector('[data-locator="link-more"]');
    if (!moreBtn) return;
    moreBtn.click();

    // Step 2: wait briefly for the menu to render, then click enter/exit fullscreen
    setTimeout(function () {
      var enterBtn = document.querySelector('[data-locator="link-enter-full-screen"]');
      var exitBtn = document.querySelector('[data-locator="link-exit-full-screen"]');
      var target = enterBtn || exitBtn;
      if (target) target.click();
    }, 100);
  }
});
