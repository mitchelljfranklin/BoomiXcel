var LOGO_SELECTOR = '[data-testid="header-masthead-brand-logo"] img, .styles-module_header__brand-image__jyNga';
var LOGO_URL = chrome.runtime.getURL("logo/XcelLogo.png");

function setLogo(img) {
  img.src = LOGO_URL;
  img.classList.add("bph-brand-logo");
}

function watchLogo() {
  var img = document.querySelector(LOGO_SELECTOR);
  if (img) setLogo(img);

  new MutationObserver(function () {
    var img = document.querySelector(LOGO_SELECTOR);
    if (img && (img.src !== LOGO_URL || !img.classList.contains("bph-brand-logo"))) {
      setLogo(img);
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "class"] });
}

chrome.storage.sync.get(["brand_logo"], function (result) {
  if (result.brand_logo !== "on") {
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.brand_logo && changes.brand_logo.newValue === "on") watchLogo();
    });
    return;
  }
  watchLogo();
});
