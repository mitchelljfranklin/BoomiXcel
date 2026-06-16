function extractXmlFromDiv(htmlDiv) {
  var clone = htmlDiv.cloneNode(true);
  clone.querySelectorAll("br").forEach(function (br) {
    br.parentNode.replaceChild(document.createTextNode("\n"), br);
  });
  return clone.textContent.replace(/\u00a0/g, " ");
}

document.arrive("div.gwt-HTML", { existing: true }, function (htmlDiv) {
  var popupContent = htmlDiv.closest(".popupContent");
  var dialog = popupContent
    ? popupContent.parentElement
    : (htmlDiv.closest('[role="dialog"]') || htmlDiv.parentElement);
  if (!dialog) return;

  var titleLabel = dialog.querySelector(".form_title_label:not(.no_display)");
  if (!titleLabel || titleLabel.textContent.trim() !== "Component XML") return;

  var formHeader = dialog.querySelector(".form_header");
  if (!formHeader) return;

  createCopyButton({
    container: formHeader,
    containerClassName: "bph-copy-container",
    buttonClassName: "bph-copy-btn",
    buttonId: "bph-copy-xml-btn",
    tooltipText: "Copy as XML",
    getContent: function () {
      return extractXmlFromDiv(htmlDiv);
    },
  });
});
