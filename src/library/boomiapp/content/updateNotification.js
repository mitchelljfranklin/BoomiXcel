function updateNotificationCheck() {
  var integration = document.getElementsByClassName("qm-c-servicenav__service-name")[0]
    || document.querySelector('[data-testid="header-masthead-brand-logo"]');

  if (!integration) return;

  var storedVersion = localStorage.getItem("bph_update_notification_version");
  var currentVersion = chrome.runtime.getManifest().version;

  if (storedVersion === currentVersion) return;

  for (var i = localStorage.length - 1; i >= 0; i--) {
    var key = localStorage.key(i);
    if (key && key.indexOf("boomiplatenhanUpdateNot") === 0) {
      localStorage.removeItem(key);
    }
  }

  localStorage.setItem("bph_update_notification_version", currentVersion);
  showUpdateChangelog();

  function showUpdateChangelog() {
    var changelogHtml = renderBoomiModal({
      overlayClass: "BoomiUpdateOverlay",
      modern: true,
      body:
        '<h1>BoomiXcel Extension Updates</h1>' +
        '<p>Explore the latest additions to the BoomiXcel Extension, including new features and bug fixes:</p>' +
        UPDATE_CHANGELOG_HTML +
        '<p>For more information about the BoomiXcel Extension, visit the <a href="https://github.com/mitchelljfranklin/BoomiXcel/blob/master/USER_GUIDE.md" target="_blank">Extensions GitHub user guide page</a>.</p>',
      buttons: [{ id: "closeUpdate", className: "gwt-Button", text: "Close" }],
    });

    removeBoomiOverlay("BoomiUpdateOverlay");
    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", changelogHtml);
  }
}
