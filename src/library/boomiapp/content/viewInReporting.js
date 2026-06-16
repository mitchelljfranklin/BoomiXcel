var bphReportingProcessName = null;
var bphReportingFilterAttempts = 0;
var bphReportingFilterStep = 0;

function slugifyProcessName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ── Deployed processes: inject "View in Process Reporting" menu item ─────────

// Capture process name from tree row when chevron is clicked, before the
// separate popup menu renders elsewhere in the DOM.
document.addEventListener("click", function (clickEvent) {
  var chevronLink = clickEvent.target.closest('a[data-locator="link"]');
  if (!chevronLink) return;
  var row = chevronLink.closest("tr");
  if (!row) return;
  var label = row.querySelector('.gwt-Label[title]');
  bphReportingProcessName = label ? label.getAttribute("title") : null;
}, true);

document.arrive('[data-locator="link-execute-process"]', { existing: true }, function (executeLink) {
  var menuGroup = executeLink.closest("ul");
  if (!menuGroup || menuGroup.querySelector(".bph-reporting-item")) return;
  if (!bphReportingProcessName) return;

  var accountId = getUrlParameter("accountId");
  if (!accountId) return;

  var separator = document.createElement("li");
  separator.className = "bph-reporting-separator";

  var listItem = document.createElement("li");
  listItem.className = "bph-reporting-item";
  listItem.innerHTML =
    '<a class="gwt-Anchor list_anchor_text" href="javascript:;">' +
    '<svg class="bph-reporting-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">' +
    '<title>View in Process Reporting</title>' +
    '<path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>' +
    "View in Process Reporting" +
    "</a>";

  listItem.querySelector("a").addEventListener("click", function (clickEvent) {
    clickEvent.preventDefault();
    localStorage.setItem("bph_reporting_process", bphReportingProcessName);
    window.open(
      "https://platform.boomi.com/AtomSphere.html#reporting;accountId=" + accountId,
      "_blank",
    );
  });

  menuGroup.appendChild(separator);
  menuGroup.appendChild(listItem);
});

// ── Process Reporting page: auto-apply process name filter ────────────────────

document.arrive('[data-locator="button-add-filter"]', { existing: true }, function (addFilterButton) {
  var processName = localStorage.getItem("bph_reporting_process");
  if (!processName) return;
  if (window.location.hash.indexOf("#reporting;") === -1) return;

  localStorage.removeItem("bph_reporting_process");
  bphReportingFilterStep = 0;
  bphReportingFilterAttempts = 0;

  function runFilterStep() {
    bphReportingFilterAttempts++;
    if (bphReportingFilterAttempts > 40) return;

    if (bphReportingFilterStep === 0) {
      addFilterButton.click();
      bphReportingFilterStep = 1;
      bphReportingFilterAttempts = 0;
      setTimeout(runFilterStep, 200);
      return;
    }

    if (bphReportingFilterStep === 1) {
      var processLink = document.querySelector('[data-locator="link-process"]:not(.no_display)');
      if (!processLink) { setTimeout(runFilterStep, 200); return; }
      processLink.click();
      bphReportingFilterStep = 2;
      bphReportingFilterAttempts = 0;
      setTimeout(runFilterStep, 200);
      return;
    }

    if (bphReportingFilterStep === 2) {
      var filterInput = document.querySelector(".filter_input.uneditable_text");
      if (!filterInput) { setTimeout(runFilterStep, 200); return; }
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeSetter.call(filterInput, processName);
      filterInput.dispatchEvent(new Event("input", { bubbles: true }));
      bphReportingFilterStep = 3;
      bphReportingFilterAttempts = 0;
      setTimeout(runFilterStep, 200);
      return;
    }

    if (bphReportingFilterStep === 3) {
      var slug = slugifyProcessName(processName);
      var checkboxItem = document.querySelector('[data-locator="item-' + slug + '"]');
      if (!checkboxItem) { setTimeout(runFilterStep, 200); return; }
      var checkbox = checkboxItem.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) checkbox.click();
      bphReportingFilterStep = 4;
      bphReportingFilterAttempts = 0;
      setTimeout(runFilterStep, 200);
      return;
    }

    if (bphReportingFilterStep === 4) {
      var applyButton = document.querySelector('[data-locator="button-apply"]:not([disabled])');
      if (!applyButton) { setTimeout(runFilterStep, 200); return; }
      applyButton.click();
      showToast("Filtered for: " + processName, 3000);
    }
  }

  setTimeout(runFilterStep, 800);
});
