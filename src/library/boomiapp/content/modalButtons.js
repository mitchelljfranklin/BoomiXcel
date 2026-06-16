var modal_listener = function (modal) {
  if (BoomiPlatform.reverse_modal !== "on") return;

  var buttonSet = modal.querySelector(".button_set");
  if (!buttonSet) return;

  var buttons = Array.from(buttonSet.children).filter(function (button) {
    return button.tagName === "BUTTON" && button.style.display !== "none";
  });
  if (buttons.length < 2) return;

  var lastButton = buttons[buttons.length - 1];
  var lastButtonText = lastButton.innerText.trim();
  if (lastButtonText !== "Cancel" && lastButtonText !== "No") return;

  $(lastButton).insertBefore(buttons[0]);
};
