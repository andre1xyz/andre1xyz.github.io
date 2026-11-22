/* Static UI structure mocks for docs (non-interactive except Keys Editor playground) */
window.UI_MOCKS = {


  Offseter: {
    title: "Offseter blend (frames)",
    hint: "Popup from MMB on the Offseter toolbar button. Offseter itself has no window.",
    blocks: [
      { type: "section", label: "Offseter blend (frames)" },
      { type: "btns", items: ["0", "2", "4", "6", "8", "12", "16", "24"] },
      { type: "row", items: [{ kind: "field", label: "Custom" }] }
    ]
  },

  Baker: {
    title: "Baker",
    blocks: [
      { type: "section", label: "Spaces" },
      { type: "list", items: ["world", "custom_space…"] },
      { type: "btns", items: ["Refresh Lists", "Create Space", "Delete Space"] },
      { type: "section", label: "Bake" },
      { type: "check", text: "Bake Full Animation Range" },
      { type: "check", text: "Override Layer" },
      { type: "btns", items: ["Bake to Circle", "Delete Circle"] },
      { type: "btns", items: ["Bake Down", "Fast Bake Selected"] },
      { type: "section", label: "Baked" },
      { type: "list", items: ["(empty)"] }
    ]
  },









  Reset_All: {
    title: "Reset All",
    oneshot: true,
    hint: "No window. Resets keyable attrs on selection when launched.",
    blocks: [
      { type: "status", text: "Select controls → launch" },
      { type: "btns", items: ["Reset Keyables"] },
      { type: "note", text: "Skips locked / unsettable channels." }
    ]
  },











  MotionTrail: {
    title: "Motion Trail",
    blocks: [
      { type: "check", text: "Trail enabled" },
      { type: "btns", items: ["Track object", "Update trail"] },
      { type: "check", text: "Auto process" },
      { type: "row", items: [{ kind: "combo", label: "Camera" }] },
      { type: "btns", items: ["Color", "R"] },
      { type: "row", items: [{ kind: "label", text: "Fade" }, { kind: "slider" }] }
    ]
  },










  Selector: {
    title: "Selector",
    blocks: [
      { type: "grid", items: ["Body", "Face", "Hands", "Feet"] },
      { type: "btns", items: ["+"] },
      { type: "note", text: "Click set → select · color swatches on cards" }
    ]
  },



  RadialMenu: {
    title: "Radial Menu",
    blocks: [
      { type: "note", text: "Floating pie, opened with the hotkey (default Alt+Q). Not a form window." },
      { type: "radial" },
      { type: "note", text: "Tool list edited in Settings → Radial & Viewport Bar." }
    ]
  },

  TimelineToolbarSettings: {
    title: "KeyBelt Settings",
    blocks: [
      { type: "tabs", items: ["General", "Toolbars", "Hotkeys", "Radial & Viewport Bar", "Docs"] },
      { type: "section", label: "General" },
      { type: "btns", items: ["Align Left", "Center", "Right"] },
      { type: "check", text: "Show KeysEditor sliders" },
      { type: "row", items: [{ kind: "field", label: "Slider count" }] },
      { type: "check", text: "Show timeline HUD while time dragging" },
      { type: "btns", items: ["Revert", "Save"] }
    ]
  }
};

window.UiMocks = (function () {
  "use strict";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderItem(item) {
    if (!item) return "";
    if (item.kind === "field") {
      return (
        '<label class="mock-field"><span>' +
        esc(item.label || "") +
        '</span><input type="text" disabled value="" /></label>'
      );
    }
    if (item.kind === "combo") {
      return (
        '<label class="mock-field"><span>' +
        esc(item.label || "") +
        '</span><select disabled><option>…</option></select></label>'
      );
    }
    if (item.kind === "btn") {
      return '<button type="button" class="mock-btn" disabled>' + esc(item.text) + "</button>";
    }
    if (item.kind === "label") {
      return '<span class="mock-inline-label">' + esc(item.text) + "</span>";
    }
    if (item.kind === "slider") {
      return '<input type="range" class="mock-range" disabled min="0" max="100" value="40" />';
    }
    if (item.kind === "swatch") {
      return '<span class="mock-swatch"></span>';
    }
    return "";
  }

  function renderBlock(block) {
    if (block.type === "section") {
      return '<div class="mock-section">' + esc(block.label) + "</div>";
    }
    if (block.type === "status") {
      return '<div class="mock-status">' + esc(block.text) + "</div>";
    }
    if (block.type === "note") {
      return '<p class="mock-note">' + esc(block.text) + "</p>";
    }
    if (block.type === "check") {
      return (
        '<label class="mock-check"><input type="checkbox" disabled /> ' +
        esc(block.text) +
        "</label>"
      );
    }
    if (block.type === "btns") {
      return (
        '<div class="mock-btns">' +
        block.items
          .map(function (t) {
            return '<button type="button" class="mock-btn" disabled>' + esc(t) + "</button>";
          })
          .join("") +
        "</div>"
      );
    }
    if (block.type === "row") {
      return (
        '<div class="mock-row">' +
        block.items.map(renderItem).join("") +
        "</div>"
      );
    }
    if (block.type === "list") {
      return (
        '<ul class="mock-list">' +
        block.items
          .map(function (t) {
            return "<li>" + esc(t) + "</li>";
          })
          .join("") +
        "</ul>"
      );
    }
    if (block.type === "tabs") {
      return (
        '<div class="mock-tabs">' +
        block.items
          .map(function (t, i) {
            return (
              '<span class="mock-tab' +
              (i === 0 ? " active" : "") +
              '">' +
              esc(t) +
              "</span>"
            );
          })
          .join("") +
        "</div>"
      );
    }
    if (block.type === "grid") {
      return (
        '<div class="mock-grid">' +
        block.items
          .map(function (t) {
            return '<button type="button" class="mock-grid-btn" disabled>' + esc(t) + "</button>";
          })
          .join("") +
        "</div>"
      );
    }
    if (block.type === "radial") {
      return (
        '<div class="mock-radial" aria-hidden="true">' +
        '<div class="mock-radial-ring"></div>' +
        '<div class="mock-radial-center"></div>' +
        '<span class="mock-radial-slot s1">A</span>' +
        '<span class="mock-radial-slot s2">B</span>' +
        '<span class="mock-radial-slot s3">C</span>' +
        '<span class="mock-radial-slot s4">D</span>' +
        "</div>"
      );
    }
    return "";
  }

  /* Real Qt screenshots (KeyBelt_dev/tools/capture_ui.py), shown at 1x of the 2x PNG */
  var SHOTS = {
    MotionTrail: { w: 380, h: 130, title: "Motion Trail" },
    Baker: { w: 294, h: 774, title: "Baker" },
    Selector: { w: 334, h: 36, title: "Selector", hud: true },
    RadialMenu: { w: 348, h: 376, title: "Radial Menu", hud: true },
    TimelineToolbarSettings: { w: 680, h: 520, title: "KeyBelt Settings" },
    /* Offseter has no window: its panel is the blend popup (MMB on the toolbar button) */
    Offseter: { src: "OffseterBlendPopup", w: 340, h: 61, title: "Offseter blend (frames)", tag: "Popup (MMB on the button)" },
    /* Figures placed in the page text with <div data-shot="Id">; see mountFigures */
    TimelineToolbar: { w: 786, h: 52, title: "Timeline toolbar", tag: "Screenshot" },
    RadialOffseterBlend: { w: 385, h: 380, title: "Radial menu, Offseter blend ring", tag: "Screenshot" },
    ViewportBar: { w: 778, h: 70, title: "Viewport Bar (hover)", tag: "Rendered widget", bg: "linear-gradient(#5a5a5a,#3c3c3c)" },
    ViewportBarIdle: { w: 778, h: 70, title: "Viewport Bar (idle)", tag: "Rendered widget", bg: "linear-gradient(#5a5a5a,#3c3c3c)" }
  };

  function frame(title, tag, bodyHtml, extraClass) {
    return (
      '<div class="mock-ui-panel' + (extraClass ? " " + extraClass : "") + '">' +
      '<div class="mock-titlebar"><strong>' + esc(title) + "</strong>" +
      '<span class="mock-tag">' + esc(tag) + "</span></div>" + bodyHtml + "</div>"
    );
  }

  function blockMock(mock, toolId) {
    var html = "";
    if (mock.hint) html += '<p class="mock-hint">' + esc(mock.hint) + "</p>";
    html += '<div class="mock-body">';
    (mock.blocks || []).forEach(function (b) {
      html += renderBlock(b);
    });
    html += "</div>";
    return frame(mock.title || toolId, mock.oneshot ? "One-shot" : "UI layout", html);
  }

  function mount(root, toolId) {
    if (!root) return;
    var mock = window.UI_MOCKS && window.UI_MOCKS[toolId];
    var shot = SHOTS[toolId];
    if (shot) {
      var title = shot.title || (mock && mock.title) || toolId;
      root.innerHTML = frame(
        title,
        shot.tag || "Actual window",
        '<div class="mock-shot-body' + (shot.hud ? " is-hud" : "") + '">' +
          '<img class="mock-shot" src="img/ui/' + (shot.src || toolId) + '.png" width="' + shot.w +
          '" height="' + shot.h + '" alt="' + esc(title) + ' window" loading="lazy" decoding="async" />' +
          "</div>"
      );
      var img = root.querySelector("img.mock-shot");
      if (img && mock) {
        img.addEventListener("error", function () {
          root.innerHTML = blockMock(mock, toolId);
        });
      }
      return;
    }
    if (!mock) {
      root.innerHTML = frame(toolId, "", '<div class="mock-body"><p class="mock-note">No UI preview for this tool.</p></div>');
      return;
    }
    root.innerHTML = blockMock(mock, toolId);
  }

  /* Figures inside the page text: <div data-shot="Id" data-w="minWidth" data-marks="pct:n,..." data-caption="..."> */
  function mountFigures(root) {
    var holes = root.querySelectorAll("[data-shot]");
    for (var i = 0; i < holes.length; i++) {
      var hole = holes[i];
      var id = hole.getAttribute("data-shot");
      var shot = SHOTS[id];
      if (!shot) continue;
      var minW = parseInt(hole.getAttribute("data-w") || "0", 10);
      var marks = (hole.getAttribute("data-marks") || "").split(",").filter(Boolean);
      var html = '<figure class="fig fig-shot"><div class="fig-scroll"' + (shot.bg ? ' style="background:' + shot.bg + '"' : "") + '><div class="fig-in" style="max-width:' + shot.w + "px" +
        (minW ? ";min-width:" + minW + "px" : "") + '">';
      if (marks.length) {
        html += '<div class="fig-marks" aria-hidden="true">';
        marks.forEach(function (m) {
          var p = m.split(":");
          html += '<span class="fig-mark" style="left:' + esc(p[0]) + '%">' + esc(p[1]) + "</span>";
        });
        html += "</div>";
      }
      html += '<img src="img/ui/' + (shot.src || id) + '.png" width="' + shot.w + '" height="' + shot.h +
        '" alt="' + esc(shot.title) + '" loading="lazy" decoding="async" />';
      html += '</div></div><figcaption><span class="fig-tag">' + esc(shot.tag || "Screenshot") + "</span> " +
        esc(hole.getAttribute("data-caption") || "") + "</figcaption></figure>";
      hole.outerHTML = html;
    }
  }

  return { mount: mount, mountFigures: mountFigures };
})();
