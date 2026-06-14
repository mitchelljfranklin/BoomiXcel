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

// Ctrl+Alt+T (Test) — REMOVED. The new Boomi platform test button does not respond to
// programmatic clicks from within a keyboard event handler. Approaches tried and failed:
//
// 1. Vanilla .click() — no response
// 2. dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })) — no response
// 3. dispatchEvent(new PointerEvent("pointerdown/up")) + MouseEvent("click") — no response
// 4. jQuery $(btn).click() — works from console but NOT from inside the keydown handler
// 5. focus() + dispatchEvent(new KeyboardEvent("keydown/keypress/keyup", { key: "Enter" })) — no response
// 6. setTimeout delays (10ms, 150ms) with jQuery click — no response
// 7. Shadow DOM traversal with composed: true events — no response
// 8. Restored original shortcut.js library + jQuery approach — no response
//
// Root cause: the new Boomi test button likely checks event.isTrusted or uses a
// gesture-restricted GWT mechanism that blocks programmatic clicks originating
// from input event handlers. The button responds to $().click() in the console
// (idle context) but not during active keyboard event processing.
