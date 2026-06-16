var documentViewerRawContent = null;

var isDbContent = function (raw) {
  return raw && raw.startsWith("DBSTART|");
};

var parseDbFormat = function (raw) {
  var body = raw
    .replace(/^DBSTART\|[\s\S]*?\|@?\|/, "")
    .replace(/\|@?\|DBEND\|[\s\S]*$/, "")
    .replace(/^BEGIN\|\d+\|@\|OUT_START\|\d+\|@\|/, "");

  var segments = body
    .split("|#|")
    .map(function (segment) { return segment.trim(); })
    .filter(function (segment) { return segment && !/^OUT_END/.test(segment) && !/^END/.test(segment); });

  if (!raw.includes("|DBEND|") && segments.length) {
    segments.pop();
  }

  var rows = segments.map(function (segment) { return segment.split("|^|"); });
  var columnCount = Math.max.apply(null, rows.map(function (row) { return row.length; }));
  rows.forEach(function (row) {
    while (row.length < columnCount) { row.push(""); }
  });

  var headers = [];
  for (var i = 0; i < columnCount; i++) {
    headers.push("Column " + (i + 1));
  }

  return { headers: headers, rows: rows };
};

var findVisibleTextarea = function (modal) {
  var textareas = Array.from(modal.querySelectorAll("textarea.gwt-TextArea"));
  var visibleTextarea = textareas.find(function (textarea) {
    return textarea.offsetParent !== null;
  });
  return visibleTextarea || null;
};

var restoreTextarea = function (container, textarea) {
  container.innerHTML = "";
  container.appendChild(textarea);
};

var buildTable = function (container, parsedData) {
  var allRows = parsedData.rows;
  var allHeaders = parsedData.headers;
  var rowsPerPage = 25;
  var currentSortColumn = null;
  var sortAscending = true;
  var currentPage = 0;
  var searchQuery = "";

  container.innerHTML = "";

  var searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "dbview-search";
  searchInput.placeholder = "Search...";
  container.appendChild(searchInput);

  var tableWrapper = document.createElement("div");
  tableWrapper.className = "dbview-table-wrapper";
  container.appendChild(tableWrapper);

  var paginationBar = document.createElement("div");
  paginationBar.className = "dbview-pagination";
  container.appendChild(paginationBar);

  var getFilteredRows = function () {
    if (!searchQuery) return allRows.slice();
    var query = searchQuery.toLowerCase();
    return allRows.filter(function (row) {
      return row.some(function (cell) {
        return cell.toLowerCase().includes(query);
      });
    });
  };

  var getSortedRows = function (filteredRows) {
    if (currentSortColumn === null) return filteredRows;
    var sorted = filteredRows.slice();
    sorted.sort(function (a, b) {
      var cellA = (a[currentSortColumn] || "").toLowerCase();
      var cellB = (b[currentSortColumn] || "").toLowerCase();
      var numA = parseFloat(cellA);
      var numB = parseFloat(cellB);
      var comparison;
      if (!isNaN(numA) && !isNaN(numB)) {
        comparison = numA - numB;
      } else {
        comparison = cellA.localeCompare(cellB);
      }
      return sortAscending ? comparison : -comparison;
    });
    return sorted;
  };

  var renderPagination = function (totalRows) {
    var totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    paginationBar.innerHTML = "";

    var prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.className = "dbview-page-btn";
    prevButton.disabled = currentPage === 0;
    prevButton.addEventListener("click", function () {
      if (currentPage > 0) {
        currentPage--;
        render();
      }
    });
    paginationBar.appendChild(prevButton);

    var pageInfo = document.createElement("span");
    pageInfo.className = "dbview-page-info";
    pageInfo.textContent = "Page " + (currentPage + 1) + " of " + totalPages;
    paginationBar.appendChild(pageInfo);

    var nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "dbview-page-btn";
    nextButton.disabled = currentPage >= totalPages - 1;
    nextButton.addEventListener("click", function () {
      if (currentPage < totalPages - 1) {
        currentPage++;
        render();
      }
    });
    paginationBar.appendChild(nextButton);
  };

  var renderTable = function (headers, rows) {
    tableWrapper.innerHTML = "";

    var table = document.createElement("table");
    table.className = "dbview-table";

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    headers.forEach(function (header, columnIndex) {
      var th = document.createElement("th");
      th.textContent = header;
      th.addEventListener("click", function () {
        if (currentSortColumn === columnIndex) {
          sortAscending = !sortAscending;
        } else {
          currentSortColumn = columnIndex;
          sortAscending = true;
        }
        render();
      });
      if (currentSortColumn === columnIndex) {
        th.classList.add("dbview-sorted");
        var arrow = document.createElement("span");
        arrow.className = "dbview-sort-arrow";
        arrow.textContent = sortAscending ? " \u25B2" : " \u25BC";
        th.appendChild(arrow);
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (cell) {
        var td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    tableWrapper.appendChild(table);
  };

  var render = function () {
    var filtered = getFilteredRows();
    var sorted = getSortedRows(filtered);
    var startIndex = currentPage * rowsPerPage;
    var pageRows = sorted.slice(startIndex, startIndex + rowsPerPage);
    renderTable(allHeaders, pageRows);
    renderPagination(filtered.length);
  };

  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value;
    currentPage = 0;
    render();
  });

  render();
};

var injectControls = function (modal, textarea) {
  if (modal.querySelector(".dbview-controls")) return;

  documentViewerRawContent = textarea.value;

  var controls = document.createElement("div");
  controls.className = "dbview-controls";

  var toggleRow = document.createElement("div");
  toggleRow.className = "dbview-toggle-row";

  var toggleLabel = document.createElement("span");
  toggleLabel.textContent = "See table";

  var labelElement = document.createElement("label");
  labelElement.className = "toggle toggle-sm";

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  var slider = document.createElement("span");
  slider.className = "slider";

  labelElement.appendChild(checkbox);
  labelElement.appendChild(slider);

  toggleRow.appendChild(toggleLabel);
  toggleRow.appendChild(labelElement);
  controls.appendChild(toggleRow);

  var maximizeButton = document.createElement("button");
  maximizeButton.className = "dbview-maximize-btn";
  maximizeButton.innerHTML = SVG_MAXIMIZE_ICON;
  maximizeButton.title = "Maximize";
  maximizeButton.addEventListener("click", function () {
    modal.classList.toggle("dbview-maximized");
    var isMaximized = modal.classList.contains("dbview-maximized");
    maximizeButton.innerHTML = isMaximized ? SVG_RESTORE_ICON : SVG_MAXIMIZE_ICON;
    maximizeButton.title = isMaximized ? "Restore" : "Maximize";
  });
  controls.appendChild(maximizeButton);

  modal.appendChild(controls);

  checkbox.addEventListener("change", function () {
    var container = modal.querySelector(".documentViewer");
    if (!container) return;

    if (checkbox.checked) {
      var parsedData = parseDbFormat(documentViewerRawContent);
      buildTable(container, parsedData);
    } else {
      restoreTextarea(container, textarea);
    }
  });
};

var documentViewer_listener = function (dialog) {
  if (dialog.querySelector(".dbview-controls")) return;

  var textarea = findVisibleTextarea(dialog);
  if (!textarea || !isDbContent(textarea.value)) return;

  injectControls(dialog, textarea);
};
