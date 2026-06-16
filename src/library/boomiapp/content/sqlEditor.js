document.arrive(
  '.gwt-TextArea.validatable[data-locator="formrow-sql"]',
  function () {
    var progShape = $(this).closest(".prog_cmd_panel");
    if (progShape.length === 0) return;

    var bpeButtonId = `#bpe-sql-editor-button-${this.id}`;
    $(progShape)
      .find(`button[data-locator="button-edit-sql"]`)
      .parent()
      .remove();
    $(this)
      .parent()
      .append(
        `<button type="button" class="gwt-Button qm-button--primary-action" id="bpe-sql-editor-button-${this.id}" textareaid="${this.id}"style="display: block">Edit SQL</button>`,
      );

    $(bpeButtonId).click(function (e) {
      let textAreaId = `#${e.target.getAttribute("textareaid")}`;

      $("body").append(renderMessageEditorPopup(this.id, "sql"));

      var code = $(textAreaId)[0].value;

      var editor = CodeMirror($("#bpe-message-editor")[0], {
        value: code,
        mode: "sql",
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      });

      var theme = $("html").hasClass("qm-u-theme-dark")
        ? "twilight"
        : "default";
      editor.setOption("theme", theme);

      $("#bpe-message-editor-ok").click(function () {
        let code = editor.getValue();
        $(textAreaId)[0].value = code;
        $("#popup_on_popup_content, #popup_on_popup").remove();
      });

      $("#bpe-message-editor-cancel").click(function () {
        $("#popup_on_popup_content, #popup_on_popup").remove();
      });

      $("#bpe-message-editor-language").change(function (e) {
        editor.setOption("mode", langs[e.target.value].mode);
      });
    });
  },
);
