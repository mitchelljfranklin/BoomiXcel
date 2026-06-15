document.addEventListener("keydown", function (event) {
  if (!event.ctrlKey || !event.altKey) return;
  if (event.key === "s" || event.keyCode === 83) {
    event.preventDefault();
    var btns = document.querySelectorAll('[data-locator="button-save"]');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].offsetParent !== null) { btns[i].click(); break; }
    }
  }
});

// Ctrl+Alt+T (Test) was removed — the new Boomi test button blocks programmatic clicks
// from keyboard event handlers (likely checks event.isTrusted or uses a GWT gesture guard).

