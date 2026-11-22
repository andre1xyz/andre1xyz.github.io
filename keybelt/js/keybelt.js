/* KeyBelt site. Vanilla JS, no dependencies. Loaded with defer from every page. */

/* Web3Forms access key for the feedback form. The ONLY place it is set.
   Empty = the form shows "coming online shortly" and the submit button stays disabled. */
const WEB3FORMS_KEY = "cc39fa0c-7976-4183-8eaf-e7579d97efdf";

(function () {
  "use strict";

  var SCRIPT = document.currentScript || document.querySelector('script[src*="keybelt.js"]');
  var BASE = new URL("../", SCRIPT.src).href;               // .../keybelt/
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var SVGNS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) { el.setAttribute(k, attrs[k]); }
    if (parent) { parent.appendChild(el); }
    return el;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text != null) { e.textContent = text; }
    return e;
  }
  function icon(name, cls) {
    var s = svg("svg", { "class": "ico " + (cls || ""), "aria-hidden": "true", viewBox: "0 0 24 24" });
    svg("use", { href: "#i-" + name }, s);
    return s;
  }

  /* ---------- old single-page anchors (#changelog etc.) -> new pages ---------- */
  (function () {
    var map = { "#changelog": "changelog/", "#download": "download/", "#install": "download/", "#features": "features/", "#roadmap": "editions/", "#toolbox": "editions/" };
    var go = map[location.hash];
    if (go && /\/keybelt\/(index\.html)?$/.test(location.pathname)) { location.replace(BASE + go); }
  })();

  /* ---------- theme toggle (initial theme is applied by the inline head script) ---------- */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("kb-theme", t); } catch (e) { /* storage blocked */ }
    var m = $('meta[name="theme-color"]');
    if (m) { m.setAttribute("content", t === "light" ? "#F7F7F5" : "#0D0D0D"); }
    $$(".kb-theme-btn").forEach(function (b) { b.setAttribute("aria-pressed", t === "light" ? "true" : "false"); });
  }
  function toggleTheme() { setTheme(currentTheme() === "light" ? "dark" : "light"); }
  $$(".kb-theme-btn").forEach(function (b) {
    b.setAttribute("aria-pressed", currentTheme() === "light" ? "true" : "false");
    b.addEventListener("click", toggleTheme);
  });

  /* ---------- mobile drawer ---------- */
  var menuBtn = $(".kb-menu-btn"), nav = $("#kb-nav");
  function setMenu(open) {
    if (!menuBtn || !nav) { return; }
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenu(false); } });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) { setMenu(false); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 1060) { setMenu(false); } });
  }

  /* ---------- toast + copy ---------- */
  var toast;
  function showToast(msg) {
    if (!toast) {
      toast = el("div", "kb-toast");
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) { return navigator.clipboard.writeText(text); }
    return new Promise(function (resolve, reject) {
      var ta = el("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0;top:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) { return; }
    var target = document.getElementById(b.getAttribute("data-copy"));
    var text = target ? target.textContent.trim() : "";
    if (!text || text === "-") { return; }
    copyText(text).then(function () {
      showToast("Copied to clipboard");
      var lbl = $(".lbl", b), old = lbl && lbl.textContent;
      if (lbl) { lbl.textContent = "Copied"; setTimeout(function () { lbl.textContent = old; }, 1600); }
    }, function () { showToast("Copy failed. Select the text and copy it."); });
  });

  /* ---------- live version badge ---------- */
  var versionPromise = null;
  function getVersion() {
    if (!versionPromise) {
      versionPromise = fetch(BASE + "version.json", { cache: "no-cache" })
        .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); });
    }
    return versionPromise;
  }
  var badge = $(".kb-version");
  if (badge) {
    getVersion().then(function (v) {
      if (v && v.version) { badge.textContent = "v" + v.version; badge.setAttribute("aria-label", "Latest version " + v.version); }
    }).catch(function () { /* keep the static value */ });
  }

  /* ---------- scroll reveal ---------- */
  (function () {
    var items = $$(".reveal");
    if (!items.length) { return; }
    if (reduce.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ---------- command palette (Ctrl/Cmd+K) ---------- */
  var ITEMS = [
    ["Pages", "page", "Home", "", "Overview, start here", "home"],
    ["Pages", "page", "Features", "features/", "All tools and interface features", "bolt"],
    ["Pages", "page", "Download", "download/", "Get KeyBelt, version, checksum, install", "download"],
    ["Pages", "page", "Editions and roadmap", "editions/", "Free (beta), Pro (planned), upcoming tools", "layers"],
    ["Pages", "page", "Changelog", "changelog/", "Release notes, what is new", "list"],
    ["Pages", "page", "License", "license/", "EULA summary, free to use, not open source", "shield"],
    ["Pages", "page", "Documentation", "docs/", "Full documentation app", "book"],
    ["Pages", "page", "Feedback", "feedback/", "Report a bug, suggest an idea, ask a question", "chat"],
    ["Pages", "page", "Tools on the main site", "../tools/", "Andreu Pellisa, tools overview", "external"],
    ["Pages", "page", "Portfolio site", "../", "Andreu Pellisa, 3D animation portfolio", "external"],
    ["Features", "feat", "Keys Editor", "features/#keyseditor", "sliders smooth push pull interpolate ease wave offset cleanup", "keyseditor"],
    ["Features", "feat", "Baker", "features/#baker", "bake world space camera object space", "baker"],
    ["Features", "feat", "Offseter", "features/#offseter", "offset animation transform", "offseter"],
    ["Features", "feat", "Reset All", "features/#resetall", "reset channels defaults", "resetall"],
    ["Features", "feat", "Selector", "features/#selector", "selection sets hud colour chips", "selector"],
    ["Features", "feat", "Motion Trail", "features/#motiontrail", "motion trails viewport handles agora", "motiontrail"],
    ["Features", "feat", "Radial menu", "features/#radialmenu", "wheel alt q marking menu", "radial"],
    ["Features", "feat", "Timeline toolbar", "features/#timelinetoolbarsettings", "toolbar under timeline sliders buttons settings", "timelinetoolbarsettings"],
    ["Features", "feat", "Graph Editor toolbar", "features/#graph-toolbar", "graph editor sliders toolbar", "graph"],
    ["Features", "feat", "Viewport bar", "features/#viewport-bar", "floating bar favorite tools", "bar"],
    ["Features", "feat", "Time Dragger HUD", "features/#time-dragger", "scrub endless timeline hud", "clock"],
    ["Docs", "doc", "Docs: Keys Editor", "docs/#keyseditor", "documentation", "keyseditor"],
    ["Docs", "doc", "Docs: Baker", "docs/#baker", "documentation", "baker"],
    ["Docs", "doc", "Docs: Offseter", "docs/#offseter", "documentation", "offseter"],
    ["Docs", "doc", "Docs: Reset All", "docs/#resetall", "documentation", "resetall"],
    ["Docs", "doc", "Docs: Selector", "docs/#selector", "documentation", "selector"],
    ["Docs", "doc", "Docs: Motion Trail", "docs/#motiontrail", "documentation", "motiontrail"],
    ["Docs", "doc", "Docs: Radial Menu", "docs/#radialmenu", "documentation", "radialmenu"],
    ["Docs", "doc", "Docs: Settings", "docs/#timelinetoolbarsettings", "documentation toolbars hotkeys", "timelinetoolbarsettings"],
    ["Actions", "act", "Send feedback", "feedback/", "bug idea question report beta", "chat"],
    ["Actions", "act", "Buy me a coffee", "https://ko-fi.com/andreupellisa", "support ko-fi", "coffee"],
    ["Actions", "act", "Toggle light / dark theme", "#theme", "theme appearance", "sun"]
  ];
  var MASK_ICONS = { keyseditor: 1, baker: 1, offseter: 1, resetall: 1, selector: 1, motiontrail: 1, timelinetoolbarsettings: 1 };

  var dlg, input, list, sel = 0, shown = [];
  function buildPalette() {
    dlg = el("dialog", "kb-pal");
    dlg.setAttribute("aria-label", "Quick search");
    var row = el("div", "pal-input");
    row.appendChild(icon("search"));
    input = el("input");
    input.type = "text"; input.placeholder = "Search pages, features, docs";
    input.setAttribute("aria-label", "Search"); input.setAttribute("autocomplete", "off"); input.setAttribute("spellcheck", "false");
    input.setAttribute("role", "combobox"); input.setAttribute("aria-expanded", "true"); input.setAttribute("aria-controls", "pal-list");
    row.appendChild(input);
    var esc = el("kbd", "", "Esc"); row.appendChild(esc);
    list = el("ul", "pal-list"); list.id = "pal-list"; list.setAttribute("role", "listbox");
    var foot = el("div", "pal-foot");
    foot.innerHTML = "<span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span>";
    dlg.appendChild(row); dlg.appendChild(list); dlg.appendChild(foot);
    document.body.appendChild(dlg);
    input.addEventListener("input", function () { sel = 0; render(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); go(shown[sel]); }
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) { dlg.close(); } });
    list.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) { return; }
      e.preventDefault(); go(shown[+a.getAttribute("data-i")]);
    });
  }
  function resolve(path) {
    return /^(https?:)?\/\//.test(path) ? path : new URL(path, BASE).href;
  }
  function go(item) {
    if (!item) { return; }
    var path = item[3];
    dlg.close();
    if (path === "#theme") { toggleTheme(); return; }
    var url = resolve(path);
    if (/^https?:\/\/ko-fi/.test(url)) { window.open(url, "_blank", "noopener"); return; }
    location.href = url;
  }
  function move(d) {
    sel = (sel + d + shown.length) % shown.length;
    $$(".pal-item", list).forEach(function (li, i) { li.classList.toggle("sel", i === sel); li.setAttribute("aria-selected", i === sel ? "true" : "false"); });
    var cur = $$(".pal-item", list)[sel]; if (cur) { cur.scrollIntoView({ block: "nearest" }); }
  }
  function render() {
    var q = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    shown = ITEMS.map(function (it) {
      var hay = (it[2] + " " + it[4]).toLowerCase(), label = it[2].toLowerCase(), score = 0;
      for (var i = 0; i < q.length; i++) {
        if (hay.indexOf(q[i]) < 0) { return null; }
        score += label.indexOf(q[i]) === 0 ? 3 : (label.indexOf(q[i]) >= 0 ? 2 : 1);
      }
      return { it: it, score: score };
    }).filter(Boolean);
    if (q.length) { shown.sort(function (a, b) { return b.score - a.score; }); }
    shown = shown.map(function (s) { return s.it; });
    list.textContent = "";
    if (!shown.length) { list.appendChild(el("li", "pal-empty", "No results")); return; }
    var group = "";
    shown.forEach(function (it, i) {
      if (!q.length && it[0] !== group) { group = it[0]; var g = el("li", "pal-group", group); g.setAttribute("role", "presentation"); list.appendChild(g); }
      var li = el("li", "pal-item" + (i === sel ? " sel" : "")); li.setAttribute("role", "option"); li.setAttribute("aria-selected", i === sel ? "true" : "false");
      var a = el("a"); a.href = resolve(it[3] === "#theme" ? "" : it[3]); a.setAttribute("data-i", i);
      var ic = it[5];
      if (MASK_ICONS[ic]) { var s = el("span", "ico ico-" + ic); s.setAttribute("aria-hidden", "true"); a.appendChild(s); } else { a.appendChild(icon(ic)); }
      a.appendChild(el("span", "", it[2]));
      a.appendChild(el("small", "", q.length ? it[0] : ""));
      li.appendChild(a); list.appendChild(li);
    });
  }
  function openPalette() {
    if (!dlg) { buildPalette(); }
    if (dlg.open) { return; }
    input.value = ""; sel = 0; render();
    if (dlg.showModal) { dlg.showModal(); } else { dlg.setAttribute("open", ""); }
    input.focus();
  }
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
  });
  $$(".kb-search-btn").forEach(function (b) { b.addEventListener("click", openPalette); });

  /* ---------- download page ---------- */
  var dl = $("#dl-root");
  if (dl) {
    getVersion().then(function (v) {
      var soon = !v || !v.size || !v.sha256;
      dl.classList.toggle("is-soon", soon);
      var set = function (id, txt) { var n = document.getElementById(id); if (n && txt) { n.textContent = txt; } };
      set("dl-ver", v.version ? "KeyBelt " + v.version : "");
      if (v.released) {
        var d = new Date(v.released + "T00:00:00Z");
        set("dl-date", isNaN(d) ? v.released : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }));
      }
      set("dl-size", v.size ? (v.size / 1048576).toFixed(1) + " MB (zip)" : "Not published yet");
      set("dl-sha", v.sha256 || "-");
      if (v.maya && v.maya.length) { set("dl-maya", "Maya " + v.maya[0] + " to " + v.maya[v.maya.length - 1]); }
      var btn = document.getElementById("dl-btn");
      if (btn) {
        if (soon) { btn.setAttribute("aria-disabled", "true"); btn.removeAttribute("href"); btn.removeAttribute("download"); $(".lbl", btn).textContent = "Coming soon"; }
        else { btn.removeAttribute("aria-disabled"); btn.setAttribute("href", BASE + "releases/KeyBelt-latest.zip"); }
      }
    }).catch(function () {
      dl.classList.add("is-soon");
      var s = document.getElementById("dl-soon"); if (s) { s.textContent = "Could not load the version info. Try again in a moment."; }
    });
  }

  /* ---------- changelog page ---------- */
  var cl = $("#cl-root");
  if (cl) {
    fetch(BASE + "changelog.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
      .then(function (rels) {
        cl.textContent = "";
        if (!rels || !rels.length) { cl.appendChild(el("p", "muted", "No releases yet.")); return; }
        var fmt = function (s) {
          var d = new Date(s + "T00:00:00Z");
          return isNaN(d) ? s : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
        };
        var fill = function (ul, items, limit) {
          items.forEach(function (txt, i) {
            var li = el("li"), m = /^([^:.]{3,48}):\s+([\s\S]*)$/.exec(txt);
            if (m) { li.appendChild(el("b", "", m[1] + ": ")); li.appendChild(document.createTextNode(m[2])); } else { li.textContent = txt; }
            if (limit && i >= limit) { li.hidden = true; li.className = "extra"; }
            ul.appendChild(li);
          });
        };
        rels.forEach(function (r, idx) {
          var items = r.items || [];
          if (idx === 0) {
            var art = el("article", "rel reveal in"), head = el("header");
            head.appendChild(el("h3", "", r.version)); head.appendChild(el("span", "kb-badge", "Latest"));
            var t = el("time", "", fmt(r.date)); t.setAttribute("datetime", r.date); head.appendChild(t);
            art.appendChild(head);
            var ul = el("ul"); fill(ul, items, 5); art.appendChild(ul);
            if (items.length > 5) {
              var more = el("button", "kb-btn rel-more", "Show all " + items.length + " changes");
              more.type = "button"; more.setAttribute("aria-expanded", "false");
              more.addEventListener("click", function () {
                var open = more.getAttribute("aria-expanded") !== "true";
                $$("li.extra", ul).forEach(function (li) { li.hidden = !open; });
                more.setAttribute("aria-expanded", open ? "true" : "false");
                more.textContent = open ? "Show fewer" : "Show all " + items.length + " changes";
              });
              art.appendChild(more);
            }
            cl.appendChild(art);
            if (rels.length > 1) { var h = el("h2", "", "Earlier releases"); h.style.cssText = "font-size:1.2rem;margin:36px 0 14px"; cl.appendChild(h); }
          } else {
            var a = el("article", "rel"), det = el("details"), sum = el("summary");
            sum.appendChild(el("h3", "", r.version));
            var tt = el("time", "", fmt(r.date)); tt.setAttribute("datetime", r.date); sum.appendChild(tt);
            sum.appendChild(el("span", "kb-badge kb-badge-plain", items.length + (items.length === 1 ? " change" : " changes")));
            det.appendChild(sum);
            var u2 = el("ul"); fill(u2, items, 0); det.appendChild(u2);
            a.appendChild(det); cl.appendChild(a);
          }
        });
      }).catch(function () {
        cl.textContent = "";
        var p = el("p", "muted", "Could not load the changelog. ");
        var a = el("a", "", "Open changelog.json"); a.href = BASE + "changelog.json"; p.appendChild(a); cl.appendChild(p);
      });
  }

  /* ---------- curve helper: Catmull-Rom through points -> cubic path ---------- */
  function curvePath(pts) {
    if (pts.length < 2) { return ""; }
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += "C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }
  function diamond(x, y, r) { return "M" + x + " " + (y - r) + "l" + r + " " + r + " " + (-r) + " " + r + " " + (-r) + " " + (-r) + "z"; }

  /* ---------- hero: Time Slider illustration (ruler, red key ticks, playhead) ---------- */
  var tl = $("#tl");
  if (tl) {
    var W = 960, H = 76, PAD = 18, F0 = 1, F1 = 120, R0 = 1, R1 = 96;
    var PX = (W - 2 * PAD) / (F1 - F0);
    var KEYS = [1, 9, 17, 24, 33, 41, 52, 60, 71, 80, 88, 96];
    var fx = function (f) { return PAD + (f - F0) * PX; };
    var sv = svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Illustration of a Maya Time Slider: frame numbers, red ticks where keys are set, and a playhead moving across frames 1 to 96" }, tl);
    svg("rect", { "class": "range", x: fx(R0), y: 0, width: fx(R1) - fx(R0), height: H }, sv);
    for (var f = F0; f <= F1; f++) {
      var major = f % 10 === 0 || f === 1, mid = f % 5 === 0;
      svg("line", { "class": "tick" + (major ? " tick-major" : ""), x1: fx(f), x2: fx(f), y1: major ? 20 : (mid ? 24 : 28), y2: 34 }, sv);
      if (major) { var tx = svg("text", { "class": "tl-label", x: fx(f), y: 14, "text-anchor": "middle" }, sv); tx.textContent = f; }
    }
    KEYS.forEach(function (k) { svg("line", { "class": "ktick", x1: fx(k), x2: fx(k), y1: 38, y2: H - 6 }, sv); });
    var head = svg("g", { "class": "head" }, sv);
    svg("line", { x1: 0, x2: 0, y1: 18, y2: H }, head);
    svg("rect", { x: -16, y: 1, width: 32, height: 17, rx: 3 }, head);
    var ft = svg("text", { x: 0, y: 13.5 }, head);
    var setF = function (fr) {
      var n = Math.max(R0, Math.min(R1, Math.round(fr)));
      head.setAttribute("transform", "translate(" + fx(n).toFixed(1) + " 0)");
      ft.textContent = n;
    };
    var running = false, visible = true, t0 = 0, DUR = 4000, HOLD = 700;
    var frame = function (now) {
      if (!running) { return; }
      if (!t0) { t0 = now; }
      var el_ = (now - t0) % (DUR + HOLD);
      setF(R0 + Math.min(1, el_ / DUR) * (R1 - R0));
      requestAnimationFrame(frame);
    };
    var sync = function () {
      var want = !reduce.matches && visible && !document.hidden;
      if (want && !running) { running = true; t0 = 0; requestAnimationFrame(frame); }
      else if (!want) { running = false; if (reduce.matches) { setF(41); } }
    };
    if ("IntersectionObserver" in window) { new IntersectionObserver(function (en) { visible = en[0].isIntersecting; sync(); }).observe(tl); }
    document.addEventListener("visibilitychange", sync);
    if (reduce.addEventListener) { reduce.addEventListener("change", sync); }
    setF(reduce.matches ? 41 : 1); sync();
  }

  /* ---------- feedback form (Web3Forms) ---------- */
  var fb = $("#fb-form");
  if (fb) {
    var fbSend = $("#fb-send"), fbStatus = $("#fb-status"), fbSoon = $("#fb-soon"), fbFrom = $("#fb-from"), fbVer = $("#fb-kb");
    var params = new URLSearchParams(location.search), fromApp = params.get("from") === "app";
    var qv = (params.get("v") || "").trim();
    var live = !!WEB3FORMS_KEY;
    if (qv && /^[0-9A-Za-z.+_-]{1,24}$/.test(qv)) { fbVer.value = qv; if (fromApp && fbFrom) { fbFrom.hidden = false; } }
    else { getVersion().then(function (v) { if (v && v.version && !fbVer.dataset.touched) { fbVer.value = v.version; } }).catch(function () {}); }
    fbVer.addEventListener("input", function () { fbVer.dataset.touched = "1"; });
    var qm = (params.get("maya") || "").trim(), fbMaya = $("#fb-maya");
    if (fbMaya && /^20\d\d$/.test(qm)) {
      var known = Array.prototype.some.call(fbMaya.options, function (o) { return o.value === qm; });
      fbMaya.value = known ? qm : "other";
    }
    if (live) { if (fbSoon) { fbSoon.hidden = true; } fbSend.disabled = false; }
    var say = function (cls, msg) {
      fbStatus.className = "kb-state" + (cls ? " " + cls : "");
      fbStatus.textContent = "";
      if (msg) { fbStatus.appendChild(el("p", "", msg)); }
    };
    fb.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!live) { return; }
      var f = fb.elements;
      if (f.botcheck && f.botcheck.checked) { say("ok", "Thanks, your message was sent."); fb.reset(); return; }  // honeypot: pretend success
      if (!fb.checkValidity()) { fb.reportValidity(); return; }
      var type = f.type.value;
      var payload = {
        access_key: WEB3FORMS_KEY,
        subject: "KeyBelt feedback: " + type,
        from_name: "KeyBelt site",
        type: type,
        message: f.message.value.trim(),
        maya_version: f.maya_version.value.trim() || "not given",
        keybelt_version: f.keybelt_version.value.trim() || "not given",
        source: fromApp ? "in-app link" : "website",
        page: location.href.split("?")[0]
      };
      if (f.name.value.trim()) { payload.name = f.name.value.trim(); }
      if (f.email.value.trim()) { payload.email = f.email.value.trim(); }
      fbSend.disabled = true; $(".lbl", fbSend).textContent = "Sending";
      say("", "Sending your message.");
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j && res.j.success) {
            say("ok", "Thanks, your message was sent. If you left an email address, I will reply there.");
            fb.reset(); fbVer.value = qv || fbVer.value;
          } else { throw new Error((res.j && res.j.message) || "failed"); }
        }).catch(function () {
          say("err", "The message could not be sent. Nothing was lost: it is still in the form. Try again in a moment.");
        }).then(function () {
          fbSend.disabled = false; $(".lbl", fbSend).textContent = "Send feedback";
          fbStatus.focus();
        });
    });
  }

  /* ---------- interactive Keys Editor slider demo ---------- */
  var demo = $("#demo");
  if (demo) {
    var BASEV = [.18, .78, .34, .88, .3, .66, .2, .55];
    var DW = 420, DH = 250, DP = 26, N = BASEV.length;
    var EFFECTS = {
      smooth: { label: "Smooth", min: 0, max: 100, fn: function (v, a) {
        var s = v.slice(); for (var it = 0; it < 4; it++) { var n = s.slice(); for (var i = 1; i < N - 1; i++) { n[i] = .25 * s[i - 1] + .5 * s[i] + .25 * s[i + 1]; } s = n; }
        return v.map(function (x, i) { return x + (s[i] - x) * a / 100; });
      } },
      pushpull: { label: "Push / Pull", min: -100, max: 100, fn: function (v, a) {
        var k = 1 + (a >= 0 ? a / 100 * 1.6 : a / 100);
        return v.map(function (x, i) { var c = v[0] + (v[N - 1] - v[0]) * i / (N - 1); return c + (x - c) * k; });
      } },
      wave: { label: "Wave", min: -100, max: 100, fn: function (v, a) {
        return v.map(function (x, i) { return x + a / 100 * .2 * Math.sin(i * 1.5 + .4) * Math.sin(Math.PI * i / (N - 1)); });
      } }
    };
    var mode = "smooth", target = 0, cur = 0, raf = 0;
    var dsv = svg("svg", { viewBox: "0 0 " + DW + " " + DH, role: "img", "aria-label": "Preview of a curve changing as the slider moves" });
    [0, 1, 2, 3, 4].forEach(function (i) { var y = DP + i * (DH - 2 * DP) / 4; svg("line", { "class": "grid-line", x1: 0, x2: DW, y1: y, y2: y }, dsv); });
    var ghost = svg("path", { "class": "ghost" }, dsv), live = svg("path", { "class": "live" }, dsv);
    var dk = BASEV.map(function () { return svg("path", { "class": "dkey" }, dsv); });
    var lab = svg("text", { "class": "dlabel", x: 8, y: DH - 6 }, dsv); lab.textContent = "ctrl.translateY";
    $("#demo-stage").appendChild(dsv);
    var xy = function (v) { return v.map(function (val, i) { return [DP + i * (DW - 2 * DP) / (N - 1), DP + (1 - Math.max(-.1, Math.min(1.1, val))) * (DH - 2 * DP)]; }); };
    ghost.setAttribute("d", curvePath(xy(BASEV)));
    var slider = $("#demo-slider"), out = $("#demo-out"), nm = $("#demo-name");
    var draw = function () {
      var P = xy(EFFECTS[mode].fn(BASEV, cur));
      live.setAttribute("d", curvePath(P));
      P.forEach(function (p, i) { dk[i].setAttribute("d", diamond(p[0].toFixed(1), p[1].toFixed(1), 7)); });
    };
    var tick = function () {
      var diff = target - cur;
      if (reduce.matches || Math.abs(diff) < .05) { cur = target; raf = 0; } else { cur += diff * .2; raf = requestAnimationFrame(tick); }
      draw();
    };
    var apply = function () {
      var e = EFFECTS[mode];
      slider.min = e.min; slider.max = e.max;
      slider.value = target;
      out.textContent = Math.round(target);
      slider.style.setProperty("--fill", ((target - e.min) / (e.max - e.min) * 100) + "%");
      nm.textContent = e.label;
      if (!raf) { raf = requestAnimationFrame(tick); }
    };
    slider.addEventListener("input", function () { target = +slider.value; apply(); });
    slider.addEventListener("dblclick", function () { target = 0; apply(); });
    $$("#demo-modes button").forEach(function (b) {
      b.addEventListener("click", function () {
        mode = b.getAttribute("data-mode"); target = 0; cur = 0;
        $$("#demo-modes button").forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        apply();
      });
    });
    apply();
    // gentle intro: nudge the slider once when it scrolls into view
    if (!reduce.matches && "IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { io2.disconnect(); target = 55; apply(); }
      }, { threshold: .6 });
      io2.observe(demo);
    }
  }
})();
