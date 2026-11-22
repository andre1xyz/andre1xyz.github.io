/* Static figure builders for the docs: HTML/SVG strings, no libraries, no network.
   Used by content.js (window.KB_FIG). Screenshot figures are mounted by ui-mocks.js. */
window.KB_FIG = (function () {
  "use strict";

  var ICONS = "img/ui/icons/";

  /* ---------- toolbar action buttons (icons are renders of the real buttons) ---------- */
  var ACTION_ROWS = [
    { img: "delete_redundant", name: "Delete redundant",
      text: "Delete redundant keys. Removes keys that sit on the straight line between their neighbours; the curve keeps its shape." },
    { img: "delete_flat", name: "Delete flat",
      text: "Delete flat keys (constant-value segments). Removes the middle keys of a flat stretch." },
    { img: "bake", name: "Bake",
      text: "Bake keys / channels. Puts a key on every frame." },
    { img: "snap", name: "Smart snap",
      text: "Smart snap off-frame keys to the nearest integer frame." },
    { img: "euler", name: "Euler filter",
      text: "Euler filter on rotation curves." },
    { img: "tangents", name: "Tangents",
      text: "Toggle tangents on the active keys." },
    { img: "invert", name: "Invert",
      text: "Invert selected keys or curves (negates the values). Timeline and Graph Editor toolbars only." }
  ];

  var SHIFT_ROWS = [
    { img: "shift_left", name: "Move keys left", text: "Move selected keys left by N frames." },
    { img: "shift_right", name: "Move keys right", text: "Move selected keys right by N frames." },
    { img: "shift_insert", name: "Insert frames", text: "Insert N frames after the current frame (selected objects)." },
    { img: "shift_remove", name: "Remove frames", text: "Remove N frames after the current frame (selected objects)." },
    { img: "shift_frames", name: "Frames field (N)", text: "The number the four arrows use. Default 1. The tooltips show the current N." }
  ];

  function rowHtml(r) {
    return (
      '<div class="btn-row">' +
      '<span class="btn-ico"><img src="' + ICONS + r.img + '.png" alt="" style="height:22px;width:auto" /></span>' +
      "<div><strong>" + r.name + "</strong><p>" + r.text + "</p></div></div>"
    );
  }

  function actionButtonsHtml() {
    return (
      '<div class="btn-group"><h4>Action buttons</h4><div class="btn-table">' +
      ACTION_ROWS.map(rowHtml).join("") +
      "</div></div>"
    );
  }

  function shiftButtonsHtml() {
    return (
      '<div class="btn-group"><h4>Shift, insert and remove (with the frames field)</h4><div class="btn-table">' +
      SHIFT_ROWS.map(rowHtml).join("") +
      "</div></div>"
    );
  }

  /* ---------- Offseter diagrams ---------- */
  var GREEN = "#5fcd87";
  var FONT = 'font-family="Segoe UI,sans-serif" font-size="11"';
  var uid = 0;

  function smoothstep(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return x * x * (3 - 2 * x);
  }

  function r1(n) { return Math.round(n * 10) / 10; }

  /* Gradient that follows the same smoothstep falloff as the real overlay (alpha 0.35 at the plateau) */
  function rampGradient(id, reverse) {
    var s = '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">';
    for (var i = 0; i <= 8; i++) {
      var f = i / 8;
      var a = 0.35 * smoothstep(reverse ? 1 - f : f);
      s += '<stop offset="' + f + '" stop-color="' + GREEN + '" stop-opacity="' + r1(a * 1000) / 1000 + '"/>';
    }
    return s + "</linearGradient>";
  }

  /* Time Slider strip: blend 0 vs blend 6 for the same range */
  function timeSliderSvg() {
    var id = "ofs" + (++uid);
    var X0 = 24, CELL = 13.5, W = 600, H = 232;
    function x(f) { return r1(X0 + f * CELL); }
    var start = 17, end = 24, blend = 6;

    function strip(top, withBlend) {
      var h = 46, s = "";
      s += '<rect x="' + X0 + '" y="' + top + '" width="' + r1(41 * CELL) + '" height="' + h + '" fill="#2b2b2b" stroke="#1d1d1d"/>';
      for (var f = 0; f <= 41; f++) {
        var long = f % 5 === 0;
        s += '<line x1="' + x(f) + '" y1="' + (top + h) + '" x2="' + x(f) + '" y2="' + (top + h - (long ? 12 : 6)) + '" stroke="#5a5a5a"/>';
        if (long && f < 41) s += '<text x="' + (x(f) + 2) + '" y="' + (top + 13) + '" fill="#8f8f8f" font-size="10" ' + FONT.replace(' font-size="11"', "") + '>' + f + "</text>";
      }
      /* plateau: whole cells start..end */
      s += '<rect x="' + x(start) + '" y="' + top + '" width="' + r1((end + 1 - start) * CELL) + '" height="' + h + '" fill="' + GREEN + '" fill-opacity="0.35"/>';
      if (withBlend) {
        s += '<rect x="' + x(start - blend) + '" y="' + top + '" width="' + r1(blend * CELL) + '" height="' + h + '" fill="url(#' + id + 'u)"/>';
        s += '<rect x="' + x(end + 1) + '" y="' + top + '" width="' + r1(blend * CELL) + '" height="' + h + '" fill="url(#' + id + 'd)"/>';
        s += '<line x1="' + x(start - blend) + '" y1="' + top + '" x2="' + x(start - blend) + '" y2="' + (top + h) + '" stroke="' + GREEN + '" stroke-opacity="0.67"/>';
        s += '<line x1="' + x(end + 1 + blend) + '" y1="' + top + '" x2="' + x(end + 1 + blend) + '" y2="' + (top + h) + '" stroke="' + GREEN + '" stroke-opacity="0.67"/>';
      }
      return s;
    }

    function dim(x1, x2, y, label) {
      var m = r1((x1 + x2) / 2);
      return (
        '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" stroke="#9a9a9a"/>' +
        '<line x1="' + x1 + '" y1="' + (y - 4) + '" x2="' + x1 + '" y2="' + (y + 4) + '" stroke="#9a9a9a"/>' +
        '<line x1="' + x2 + '" y1="' + (y - 4) + '" x2="' + x2 + '" y2="' + (y + 4) + '" stroke="#9a9a9a"/>' +
        '<text x="' + m + '" y="' + (y + 15) + '" text-anchor="middle" fill="#d8d8d8" ' + FONT + ">" + label + "</text>"
      );
    }

    var svg =
      '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Time Slider strips: with blend 0 only the range is shaded; with blend 6 the shading fades out over 6 frames on each side">' +
      "<defs>" + rampGradient(id + "u", false) + rampGradient(id + "d", true) + "</defs>" +
      '<text x="' + X0 + '" y="20" fill="#e8e8e8" font-weight="600" ' + FONT + ">Blend 0</text>" +
      strip(28, false) +
      dim(x(start), x(end + 1), 92, "range: full offset") +
      '<text x="' + X0 + '" y="130" fill="#e8e8e8" font-weight="600" ' + FONT + ">Blend 6</text>" +
      strip(138, true) +
      dim(x(start - blend), x(start), 202, "fade 6 f") +
      dim(x(start), x(end + 1), 202, "range") +
      dim(x(end + 1), x(end + 1 + blend), 202, "fade 6 f") +
      "</svg>";
    return svg;
  }

  /* Catmull-Rom through the points, as cubic Beziers */
  function curvePath(pts) {
    var d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C" + r1(p1[0] + (p2[0] - p0[0]) / 6) + " " + r1(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        r1(p2[0] - (p3[0] - p1[0]) / 6) + " " + r1(p2[1] - (p3[1] - p1[1]) / 6) + " " +
        r1(p2[0]) + " " + r1(p2[1]);
    }
    return d;
  }

  /* One channel before (gray) and after (green) an offset, for each way Offseter picks keys */
  function curveSvg(mode) {
    var id = "ofc" + (++uid);
    var W = 220, H = 150, STEP = 20.2, X0 = 14, DELTA = -36;
    var base = [108, 90, 98, 66, 76, 54, 76, 94, 82, 100];
    var weights, selected = [], label;
    if (mode === "range") {
      weights = [0, 0, 0, 0.5, 1, 1, 1, 0.5, 0, 0];
      label = "Time Slider range with blend: the range moves fully, the keys next to it follow partly, the rest stays";
    } else if (mode === "keys") {
      weights = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
      selected = [4, 5];
      label = "Only the selected keys move";
    } else {
      weights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      label = "The whole curve moves";
    }
    var before = [], after = [];
    base.forEach(function (y, i) {
      var px = X0 + i * STEP;
      before.push([px, y]);
      after.push([px, y + DELTA * weights[i]]);
    });
    var s =
      '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '">';
    s += "<defs>" + rampGradient(id + "u", false) + rampGradient(id + "d", true) + "</defs>";
    s += '<rect width="' + W + '" height="' + H + '" rx="6" fill="#2b2b2b"/>';
    for (var g = 1; g < 5; g++) s += '<line x1="0" y1="' + g * 30 + '" x2="' + W + '" y2="' + g * 30 + '" stroke="#353535"/>';
    if (mode === "range") {
      var xa = before[4][0], xb = before[6][0], xlo = before[2][0], xhi = before[8][0];
      s += '<rect x="' + r1(xa) + '" y="0" width="' + r1(xb - xa) + '" height="' + H + '" fill="' + GREEN + '" fill-opacity="0.2"/>';
      s += '<rect x="' + r1(xlo) + '" y="0" width="' + r1(xa - xlo) + '" height="' + H + '" fill="url(#' + id + 'u)"/>';
      s += '<rect x="' + r1(xb) + '" y="0" width="' + r1(xhi - xb) + '" height="' + H + '" fill="url(#' + id + 'd)"/>';
    }
    s += '<path d="' + curvePath(before) + '" fill="none" stroke="#8a8a8a" stroke-width="1.5" stroke-dasharray="4 3"/>';
    s += '<path d="' + curvePath(after) + '" fill="none" stroke="' + GREEN + '" stroke-width="2"/>';
    before.forEach(function (p, i) {
      if (weights[i] > 0) {
        s += '<line x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(after[i][0]) + '" y2="' + r1(after[i][1]) + '" stroke="#9a9a9a" stroke-opacity="0.55" stroke-dasharray="2 2"/>';
      }
      s += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="2.5" fill="#2b2b2b" stroke="#8a8a8a"/>';
    });
    after.forEach(function (p, i) {
      var sel = selected.indexOf(i) !== -1;
      s += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + (sel ? 4 : 3) + '" fill="' + (sel ? "#ffd84d" : "#e8e8e8") + '"/>';
    });
    return s + "</svg>";
  }

  function figure(svg, caption, cls) {
    return '<figure class="fig fig-svg' + (cls ? " " + cls : "") + '">' + svg + "<figcaption>" + caption + "</figcaption></figure>";
  }

  function offseterCasesHtml() {
    return (
      '<div class="fig-grid">' +
      figure(curveSvg("range"), "<strong>Range + blend.</strong> Shift+drag a range on the Time Slider. The range moves fully, the blend frames on each side fade out.") +
      figure(curveSvg("keys"), "<strong>Selected keys.</strong> Only the selected keys move. No blend.") +
      figure(curveSvg("all"), "<strong>Nothing selected.</strong> The whole curve moves.") +
      "</div>" +
      '<p class="fig-key"><span class="fig-key-line gray"></span> before &nbsp; <span class="fig-key-line green"></span> after the viewport move</p>'
    );
  }

  function offseterTimeSliderHtml() {
    return figure(
      timeSliderSvg(),
      "The green overlay on the Time Slider for the same range, with blend 0 and blend 6. The thin lines mark the outer edges of the blend.",
      "fig-wide"
    );
  }

  return {
    actionButtonsHtml: actionButtonsHtml,
    shiftButtonsHtml: shiftButtonsHtml,
    offseterCasesHtml: offseterCasesHtml,
    offseterTimeSliderHtml: offseterTimeSliderHtml
  };
})();
