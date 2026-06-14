function updateNotificationCheck() {
  // Check both old and new Boomi UI for the integration service name
  var integration = document.getElementsByClassName("qm-c-servicenav__service-name")[0]
    || document.querySelector('[data-testid="header-masthead-brand-logo"]');

  if (integration) {
    let currentAppver = chrome.runtime.getManifest().version;
    if (typeof Storage !== "undefined") {
      localStorage.getItem("boomiplatenhanUpdateNot" + currentAppver);
      if (
        localStorage.getItem("boomiplatenhanUpdateNot" + currentAppver) ===
          null ||
        localStorage.getItem("boomiplatenhanUpdateNot" + currentAppver) === ""
      ) {
        localStorage.setItem("boomiplatenhanUpdateNot" + currentAppver, "done");
        updateNotificationAlert();
      } else {
        //No action Required in that its actually already alerted
        //alert(localStorage.getItem("boomiplatenhanUpdateNot" + currentAppver))
      }
    } else {
      alert("No Access to Local Storage");
    }
  }

  //Add Notification Details HERE!
  function updateNotificationAlert() {
    var changelog = [
      "Bugfix: Fixed an issue where the icon overrides stopped working in Chrome.",
      "Bugfix: Fixed an issue where note content might overflow the note area.",
    ];

    var htmlUpdateContents = "<ul>" + changelog.map(function (item) {
      return "<li><p>" + item + "</p></li>";
    }).join("") + "</ul>";

    let updateHtml = renderBoomiModal({
      overlayClass: "BoomiUpdateOverlay",
      body:
        '<h1>BoomiXcel Extension Updates</h1>' +
        '<p>Explore the latest additions to the BoomiXcel Extension, including new features and bug fixes:</p>' +
        htmlUpdateContents +
        '<p>For more information about the BoomiXcel Extension, visit the <a href="https://github.com/mitchelljfranklin/BoomiXcel" target="_blank">Extensions GitHub page</a>.</p>',
      buttons: [{ id: "closeUpdate", className: "gwt-Button", text: "Close" }],
    });

    removeBoomiOverlay("BoomiUpdateOverlay");

    setTimeout(() => {
      document
        .getElementsByTagName("body")[0]
        .insertAdjacentHTML("beforeend", updateHtml);
    }, 1000);
  }
}
