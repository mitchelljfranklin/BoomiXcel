const add_shape_listener = (shape) => {
  if (BoomiPlatform.path_trace_highlight == "off") return false;
  let rect = shape.getBoundingClientRect();
  if (
    !([24, 32, 34].includes(rect.width) && [24, 32, 34].includes(rect.height))
  )
    return false;

  let iconTitle = shape.querySelector(".gwt-Image:not([title])");
  let iconTitle2 = shape.querySelector('.gwt-Image[title="Note"]');
  if (iconTitle || iconTitle2) return false;
  let timer = null;

  setTimeout(() => {
    shape.addEventListener("mouseover", function (e) {
      timer = setTimeout(() => {
        if (
          document.getElementsByClassName("processShapeBoundingBox") &&
          document.getElementsByClassName("processShapeBoundingBox")[0].style
            .display !== "none"
        ) {
          return;
        }

        [
          ...document.querySelectorAll(`.gwt-connectors-path-connected`),
        ].forEach((line) => {
          line.classList.add("BoomiPlatform-linetrace");
        });

        var down = new MouseEvent("mousedown");
        var move = new MouseEvent("mousemove", {
          clientX: 5,
          clientY: 0,
        });
        var up = new MouseEvent("mouseup", {
          clientX: 0,
          clientY: 0,
        });

        shape.closest(".dragdrop-draggable").dispatchEvent(down);
        shape.closest(".dragdrop-draggable").dispatchEvent(move);
        document.querySelector('body > div[tabindex="0"]').dispatchEvent(up);

        setTimeout(() => {
          [
            ...document.querySelectorAll(
              `.gwt-connectors-path-connected:not(.BoomiPlatform-linetrace)`,
            ),
          ].forEach((line) => {
            line.parentNode.classList.add("BoomiPlatform-lineparent");
            line.classList.add(
              BoomiPlatform.path_trace_highlight == "solid"
                ? "BoomiPlatform-linetrace-active-solid"
                : "BoomiPlatform-linetrace-active-dash",
            );
          });
        }, 0);
      }, 750);
    });

    shape.addEventListener("mouseout", function (e) {
      clearTimeout(timer);
      [...document.querySelectorAll(`.gwt-connectors-path-connected`)].forEach(
        (line) => {
          line.classList.remove("BoomiPlatform-linetrace");
          line.parentNode.classList.remove("BoomiPlatform-lineparent");
          line.classList.remove("BoomiPlatform-linetrace-active");
          line.classList.remove("BoomiPlatform-linetrace-active-dash");
        },
      );
    });

    shape.addEventListener("mousedown", function (e) {
      clearTimeout(timer);
      [...document.querySelectorAll(`.gwt-connectors-path-connected`)].forEach(
        (line) => {
          line.classList.remove("BoomiPlatform-linetrace");
          line.parentNode.classList.remove("BoomiPlatform-lineparent");
          line.classList.remove("BoomiPlatform-linetrace-active");
          line.classList.remove("BoomiPlatform-linetrace-active-dash");
        },
      );
    });
  }, 250);
};

const add_path_listener = (path) => {
  if (BoomiPlatform.path_trace_highlight == "off") return false;
  let timer = null;

  setTimeout(() => {
    path.addEventListener("mouseover", function (e) {
      timer = setTimeout(() => {
        if (
          document.getElementsByClassName("processShapeBoundingBox") &&
          document.getElementsByClassName("processShapeBoundingBox")[0].style
            .display !== "none"
        ) {
          return;
        }

        [
          ...document.querySelectorAll(`.gwt-connectors-path-connected`),
        ].forEach((line) => {
          line.classList.add("BoomiPlatform-linetrace");
        });

        e.target.parentNode
          .querySelector(".gwt-connectors-path-connected")
          .classList.add(
            BoomiPlatform.path_trace_highlight == "solid"
              ? "BoomiPlatform-linetrace-active-solid"
              : "BoomiPlatform-linetrace-active-dash",
          );
      }, 750);
    });

    path.addEventListener("mouseout", function (e) {
      clearTimeout(timer);
      [...document.querySelectorAll(`.gwt-connectors-path-connected`)].forEach(
        (line) => {
          line.classList.remove("BoomiPlatform-linetrace");
          line.parentNode.classList.remove("BoomiPlatform-lineparent");
          line.classList.remove("BoomiPlatform-linetrace-active");
          line.classList.remove("BoomiPlatform-linetrace-active-dash");
        },
      );
    });

    path.addEventListener("mousedown", function (e) {
      clearTimeout(timer);
      [...document.querySelectorAll(`.gwt-connectors-path-connected`)].forEach(
        (line) => {
          line.classList.remove("BoomiPlatform-linetrace");
          line.parentNode.classList.remove("BoomiPlatform-lineparent");
          line.classList.remove("BoomiPlatform-linetrace-active");
          line.classList.remove("BoomiPlatform-linetrace-active-dash");
        },
      );
    });
  }, 250);
};
