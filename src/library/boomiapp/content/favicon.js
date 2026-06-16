function onNavigationChange() {
  try {
    if (BoomiPlatform.unique_titles_and_favicons == "on") {
      removeAccountPrefixFromDocumentTitle();
      changeFaviconBasedOnPage();
    }
  } catch (err) {}
}

window.addEventListener("popstate", onNavigationChange);
window.addEventListener("hashchange", onNavigationChange);
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState != "visible") {
    onNavigationChange();
  }
});

function removeAccountPrefixFromDocumentTitle() {
  setTimeout(function () {
    var accountEl = document.getElementsByClassName(
      "qm-c-inlinemenu__settings-menu-item-name",
    )[1];
    if (!accountEl) return;
    var title = document.title
      .replace(accountEl.innerHTML, "")
      .replace(/^(\s-\s)/, "");
    document.title = title;
  }, 250);
}

function changeFaviconBasedOnPage() {
  var subdomain = window.location.host.split(".")[0];
  var pageName = getPageNameWithoutExtension();
  var gwtPage = getGWTPageName();
  var svgIcon = "";

  if (subdomain === "platform") {
    if (pageName === "AtomSphere") {
      if (gwtPage === "atom") {
        svgIcon = FAVICON_ATOMSPHERE_ATOM;
      } else if (gwtPage === "build") {
        svgIcon = FAVICON_DEFAULT_BLUE;
      } else if (gwtPage === "deploy") {
        svgIcon = FAVICON_DEFAULT_GREEN;
      } else if (gwtPage === "dashboard") {
        svgIcon = FAVICON_DEFAULT_CORAL;
      } else if (gwtPage === "reporting") {
        svgIcon = FAVICON_DEFAULT_PURPLE;
      }
    } else if (pageName === "MdmSphere") {
      svgIcon = FAVICON_MDMSPHERE;
    } else if (pageName === "ApiSphere") {
      svgIcon = FAVICON_APISPHERE;
    } else if (pageName === "BoomiAI") {
      svgIcon = FAVICON_DEFAULT_PURPLE;
    }
  } else if (subdomain === "flow") {
    svgIcon = FAVICON_FLOW;
  }

  if (!svgIcon) {
    svgIcon = FAVICON_DEFAULT_NAVY;
  }

  changeFaviconImage(svgIcon);
}

function changeFaviconImage(link) {
  var head = document.getElementsByTagName("head")[0];

  var existing = head.querySelectorAll("link[data-bph-favicon]");
  for (var i = 0; i < existing.length; i++) {
    existing[i].remove();
  }

  var faviconIcon = document.createElement("link");
  faviconIcon.rel = "icon";
  faviconIcon.setAttribute("data-bph-favicon", "true");
  faviconIcon.href = link;
  head.appendChild(faviconIcon);
}
