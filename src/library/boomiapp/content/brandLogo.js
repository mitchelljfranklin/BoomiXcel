var LOGO_SELECTOR = '[data-testid="header-masthead-brand-logo"] img, .styles-module_header__brand-image__jyNga';
var LOGO_URL = chrome.runtime.getURL("logo/XcelLogo.png");

function setLogo(img) {
  img.src = LOGO_URL;
  img.classList.add("bph-brand-logo");
}

function watchLogo() {
  if (BoomiPlatform.brand_logo !== "on") return;
  var img = document.querySelector(LOGO_SELECTOR);
  if (img) setLogo(img);

  new MutationObserver(function () {
    var img = document.querySelector(LOGO_SELECTOR);
    if (img && (img.src !== LOGO_URL || !img.classList.contains("bph-brand-logo"))) {
      setLogo(img);
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "class"] });
}

// Defer until BoomiPlatform is populated by listenerGlobal.js
var brandLogoInitAttempts = 0;
var brandLogoInitInterval = setInterval(function () {
  brandLogoInitAttempts++;
  if (typeof BoomiPlatform !== "undefined" && BoomiPlatform.brand_logo) {
    clearInterval(brandLogoInitInterval);
    watchLogo();
  }
  if (brandLogoInitAttempts > 30) clearInterval(brandLogoInitInterval);
}, 300);
