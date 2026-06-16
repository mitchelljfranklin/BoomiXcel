var createCopyButton = function (options) {
  var container = options.container;
  var getContent = options.getContent;
  var tooltipText = options.tooltipText || "Copy";
  var buttonClassName = options.buttonClassName || "bph-copy-btn";
  var buttonId = options.buttonId || null;
  var containerClassName = options.containerClassName || "bph-copy-container";

  if (buttonId && document.getElementById(buttonId)) return;
  if (!container) return;

  var buttonElement = document.createElement("button");
  if (buttonId) buttonElement.id = buttonId;
  buttonElement.type = "button";
  buttonElement.className = buttonClassName;
  buttonElement.innerHTML = SVG_COPY_ICON;

  var tooltip = document.createElement("div");
  tooltip.className = "bph-copy-tooltip";
  tooltip.textContent = tooltipText;
  buttonElement.appendChild(tooltip);

  buttonElement.addEventListener("mouseenter", function () {
    buttonElement.classList.add("bph-copy-btn-hover");
    tooltip.classList.add("bph-copy-tooltip-visible");
  });
  buttonElement.addEventListener("mouseleave", function () {
    buttonElement.classList.remove("bph-copy-btn-hover");
    tooltip.classList.remove("bph-copy-tooltip-visible");
  });

  buttonElement.addEventListener("click", function (event) {
    event.stopPropagation();
    event.preventDefault();

    var content = getContent();
    if (!content || !content.trim()) return;

    function onCopied() {
      buttonElement.innerHTML = SVG_CHECK_ICON + '<span>Copied</span>';
      buttonElement.classList.add("bph-copy-btn-hover");
      setTimeout(function () {
        buttonElement.innerHTML = SVG_COPY_ICON;
        buttonElement.appendChild(tooltip);
        buttonElement.classList.remove("bph-copy-btn-hover");
      }, 1500);
    }

    navigator.clipboard.writeText(content).then(onCopied).catch(function () {
      var fallbackTextarea = document.createElement("textarea");
      fallbackTextarea.value = content;
      fallbackTextarea.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
      document.body.appendChild(fallbackTextarea);
      fallbackTextarea.select();
      document.execCommand("copy");
      document.body.removeChild(fallbackTextarea);
      onCopied();
    });
  });

  if (containerClassName) container.classList.add(containerClassName);
  container.appendChild(buttonElement);
};

document.arrive('[data-locator="link-download-original-document"]', { existing: true }, function (downloadBtn) {
  var dialog =
    downloadBtn.closest('[role="dialog"]') ||
    document.getElementById('popup_on_popup_content_DocumentDialogContents') ||
    document.body;

  var formHeader = dialog.querySelector('.form_header');
  if (!formHeader) return;

  createCopyButton({
    container: formHeader,
    containerClassName: "bph-copy-container",
    buttonClassName: "bph-copy-btn",
    buttonId: "bph-copy-document-btn",
    tooltipText: "Copy raw content",
    getContent: function () {
      var textareas = Array.from(dialog.querySelectorAll('.documentViewer textarea.gwt-TextArea'));
      var content = textareas.map(function (textarea) { return textarea.value || textarea.textContent; }).find(function (content) { return content.length > 0; }) || '';
      if (!content && documentViewerRawContent) content = documentViewerRawContent;
      return content;
    },
  });
});
