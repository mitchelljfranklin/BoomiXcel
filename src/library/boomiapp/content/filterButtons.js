document.arrive(".filter_panel_dialog_popup_panel", function (filterpanel) {
  if (filterpanel.querySelector(".filterable_tree_loading_container")) {
    var buttonBar = document.getElementsByClassName("button-bar");
    buttonBar[0].insertAdjacentHTML(
      "beforeend",
      '<button id="collapseFolders" type="button" class="gwt-Button bph-collapse-btn">' +
      '<svg class="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="11 17 6 12 11 7"/>' +
      '<polyline points="18 17 13 12 18 7"/>' +
      '</svg>' +
      'Collapse All' +
      '</button>',
    );
  }
});

$(document).on("click", "#collapseFolders", function () {
  [
    ...document
      .getElementsByClassName("filter_panel_dialog_popup_panel")[0]
      .querySelectorAll(".open"),
  ]
    .reverse()
    .forEach((element) => {
      closeNode(element);
    });

  function closeNode(targetNode) {
    ["mouseover", "mousedown", "mouseup"].forEach(function (eventType) {
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent(eventType, true, true);
      targetNode.dispatchEvent(clickEvent);
    });
  }
});

document.arrive("[data-locator='button-schedules']", function (schedulebutton) {
  //Add Collapse All Button
  schedulebutton.parentNode.insertAdjacentHTML(
    "beforeend",
    '<button type="button" id="collapseDeployedFolders" class="gwt-Button drop_button qm-button--primary-action closeall_doing_action bph-collapse-btn">' +
    '<svg class="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="11 17 6 12 11 7"/>' +
    '<polyline points="18 17 13 12 18 7"/>' +
    '</svg>' +
    'Collapse All' +
    '</button>',
  );
});

// allow sidebar items to be clicked anywhere to open and components to be opened with a single click
// maybe this should probably be an option you can turn on or turn off at some point?
document.arrive(".rail.simplify .gwt-FastTree .treeItemContent", function (treeItem) {
  if (!treeItem.onclick) {
    treeItem.onclick = function (clickEvent) {
      // turn single-click to double-click
      if (this.parentElement.parentElement.classList.contains("children")) {
        doubleClickNode(clickEvent.target);
        return;
      }
      clickNode(
        this.parentElement.parentElement.querySelector(".closed,.open"),
      );
    };
  }
  function clickNode(targetNode) {
    ["mouseover", "mousedown", "mouseup"].forEach(function (eventType) {
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent(eventType, true, true);
      targetNode.dispatchEvent(clickEvent);
    });
  }
  function doubleClickNode(targetNode) {
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("dblclick", true, true);
    targetNode.dispatchEvent(clickEvent);
  }
});

$(document).on("click", "#collapseDeployedFolders", function () {
  [
    ...document
      .getElementsByClassName("deployed_processes_panel")[0]
      .querySelectorAll(".open"),
  ]
    .reverse()
    .forEach((element) => {
      closeNode(element);
    });
  function closeNode(targetNode) {
    ["mouseover", "mousedown", "mouseup"].forEach(function (eventType) {
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent(eventType, true, true);
      targetNode.dispatchEvent(clickEvent);
    });
  }
});
