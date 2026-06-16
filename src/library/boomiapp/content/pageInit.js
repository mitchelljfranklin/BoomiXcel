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
    }
    onNavigationChange();
    updateNotificationCheck();
  }
}, 250);
