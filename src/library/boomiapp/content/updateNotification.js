function updateNotificationCheck() {
  let integration = document.getElementsByClassName(
    "qm-c-servicenav__service-name",
  )[0];

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
        '<h1>Boomi Platform Enhancer Extension Updates</h1>' +
        '<p>Check out the following new features and or bug fixes for the Boomi Platform Enhancer Extension:</p>' +
        htmlUpdateContents +
        '<p>For more detail on what each feature does and how to use it visit the <a href="https://github.com/matt-flaig/Boomi-Platform-Extension/wiki" target="_blank">Extension Wiki</a></p>',
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
