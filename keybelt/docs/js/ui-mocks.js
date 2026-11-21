/* Static UI structure mocks for docs (non-interactive except Keys Editor playground) */
window.UI_MOCKS = {


  Offseter: {
    title: "Offseter",
    oneshot: true,
    hint: "No window — toggles offset mode from timeline / launch.",
    blocks: [
      { type: "status", text: "Mode: OFF → ON" },
      { type: "btns", items: ["Toggle Offset"] },
      { type: "note", text: "Viewport deltas shift selected keys or full curves." }
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
    hint: "No window — resets keyable attrs on selection when launched.",
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
      { type: "note", text: "Floating pie — hotkey (default Alt+Q). Not a form window." },
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

  function mount(root, toolId, accent) {
    if (!root) return;
    var mock = window.UI_MOCKS && window.UI_MOCKS[toolId];
    if (!mock) {
      root.innerHTML =
        '<div class="mock-ui-panel"><p class="mock-note">No UI preview for this tool.</p></div>';
      return;
    }
    var color = accent || "#5f87cd";
    var html =
      '<div class="mock-ui-panel" style="--mock-accent:' +
      color +
      '">' +
      '<div class="mock-titlebar">' +
      "<strong>" +
      esc(mock.title || toolId) +
      "</strong>" +
      '<span class="mock-tag">' +
      (mock.oneshot ? "One-shot" : "UI layout") +
      "</span>" +
      "</div>";
    if (mock.hint) {
      html += '<p class="mock-hint">' + esc(mock.hint) + "</p>";
    }
    html += '<div class="mock-body">';
    (mock.blocks || []).forEach(function (b) {
      html += renderBlock(b);
    });
    html += "</div></div>";
    root.innerHTML = html;
  }

  return { mount: mount };
})();
