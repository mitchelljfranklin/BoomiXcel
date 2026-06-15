document.arrive('[data-locator="link-download-original-document"]', { existing: true }, function (downloadBtn) {
  var dialog =
    downloadBtn.closest('[role="dialog"]') ||
    document.getElementById('popup_on_popup_content_DocumentDialogContents') ||
    document.body;

  if (dialog.querySelector('#bph-copy-document-btn')) return;

  var formHeader = dialog.querySelector('.form_header');
  if (!formHeader) return;

  var copyBtn = document.createElement('button');
  copyBtn.id = 'bph-copy-document-btn';
  copyBtn.type = 'button';
  copyBtn.className = 'bph-copy-btn';
  copyBtn.innerHTML = SVG_COPY_ICON;

  var tooltip = document.createElement('div');
  tooltip.className = 'bph-copy-tooltip';
  tooltip.textContent = 'Copy raw content';
  copyBtn.appendChild(tooltip);

  copyBtn.addEventListener('mouseenter', function () {
    copyBtn.classList.add('bph-copy-btn-hover');
    tooltip.classList.add('bph-copy-tooltip-visible');
  });
  copyBtn.addEventListener('mouseleave', function () {
    copyBtn.classList.remove('bph-copy-btn-hover');
    tooltip.classList.remove('bph-copy-tooltip-visible');
  });

  copyBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();

    var textareas = Array.from(dialog.querySelectorAll('.documentViewer textarea.gwt-TextArea'));
    var content = textareas.map(function (t) { return t.value || t.textContent; }).find(function (c) { return c.length > 0; }) || '';
    if (!content) return;

    function onCopied() {
      copyBtn.innerHTML = SVG_CHECK_ICON + '<span>Copied</span>';
      copyBtn.classList.add('bph-copy-btn-hover');
      setTimeout(function () {
        copyBtn.innerHTML = SVG_COPY_ICON;
        copyBtn.classList.remove('bph-copy-btn-hover');
      }, 1500);
    }

    navigator.clipboard.writeText(content).then(onCopied).catch(function () {
      var ta = document.createElement('textarea');
      ta.value = content;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onCopied();
    });
  });

  formHeader.classList.add('bph-copy-container');
  formHeader.appendChild(copyBtn);
});
