var add_endpoint_listener = (endpoint) => {
  if (BoomiPlatform.endpoint_flash == "testing") {
    endpoint.classList.add("bph-endpoint-flash-testonly");
  } else if (BoomiPlatform.endpoint_flash != "off") {
    endpoint.classList.add("bph-endpoint-flash");
  }

  let endpointmenu_html = `
    <div class="BoomiPlatformEndpointMenu" tabindex="0" aria-hidden="true">
        <div>
            <div class="hover-menu-hidden-hotspot">
                <div class="hover-menu">
                    <ul class="menu-options">
                        <li><div class="gwt-Label gwt-ClickableLabel bph-stop">Stop</div></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `;

  endpoint.insertAdjacentHTML("beforeend", endpointmenu_html);

  endpoint
    .querySelector(".bph-stop")
    .addEventListener("mousedown", function (e) {
      let first = [
        ...endpoint
          .closest(".component_editor_panel")
          .querySelectorAll(".base_shape_container"),
      ].find(
        (shape) =>
          shape.querySelector(".gwt-Label").innerText.toLowerCase() == "stop",
      );

      if (!first) return false;

      let rect = endpoint.getBoundingClientRect();

      var down = new MouseEvent("mousedown");
      var up = new MouseEvent("mouseup", {
        clientX: rect.left + 15,
        clientY: rect.top - 15,
      });

      first.dispatchEvent(down);
      document.querySelector('body > div[tabindex="0"]').dispatchEvent(up);

      setTimeout(() => {
        endpoint.dispatchEvent(down);

        var up = new MouseEvent("mouseup", {
          clientX: rect.left + 25,
          clientY: rect.top + 5,
        });
        document.querySelector('body > div[tabindex="0"]').dispatchEvent(up);

        setTimeout(() => {
          let sidepanel = [
            ...document.querySelectorAll(".shape_side_panel .form_title_label"),
          ].find((element) => element.innerText == "Stop Step");
          sidepanel = sidepanel.closest(".shape_side_panel");

          document.querySelector(".glass_standard").style.display = "none";
          sidepanel.closest(".anchor_side_panel").style.display = "none";

          let okbutton = sidepanel.querySelector(
            'button[data-locator="button-ok"]',
          );
          okbutton.click();
        }, 0);
      }, 0);
    });
};
