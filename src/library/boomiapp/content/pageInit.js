let boomi_title = document.title;
let boomiPageLoaded = setInterval(() => {
  if (boomi_title != document.title) {
    clearInterval(boomiPageLoaded);

    var subHeaderContainerNav =
      document.getElementsByClassName("qm-c-servicenav")[0];
    var headerAdd = document.getElementsByClassName(
      "qm-c-servicenav__navbar",
    )[0];

    if (
      headerAdd &&
      subHeaderContainerNav &&
      subHeaderContainerNav.style.display != "none" &&
      !subHeaderContainerNav.classList.contains("no_display")
    ) {
      chrome.storage.local.get(["headerVisible"], function (result) {
        if (result.headerVisible == false) {
          document
            .getElementsByClassName("qm-c-masthead")[0]
            .classList.add("headerHide");
        }
        var headerVisibilityState =
          !e.headerVisible && typeof e.headerVisible !== "undefined"
            ? "Show"
            : "Hide";
        $("#" + headerAdd.id).append(
          '<li id="showHeaderbtn" class="qm-c-servicenav__nav-item"><a class="gwt-Anchor qm-c-servicenav__nav-link qm-a--alternate"><span id="showHeaderspan" class="">' +
            headerVisibilityState +
            " Header</span></a></li>",
        );
      });
    }
    onNavigationChange();
    updateNotificationCheck();
  }
}, 250);
