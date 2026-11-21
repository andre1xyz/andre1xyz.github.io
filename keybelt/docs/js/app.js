/* Docs app: nav, hash routing, content render, mobile menu, search, theme */
(function () {
  "use strict";

  var FEEDBACK_URL = "https://andre1xyz.github.io/keybelt/feedback/";

  var navEl = document.getElementById("nav");
  var contentEl = document.getElementById("content");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var menuToggle = document.getElementById("menuToggle");
  var searchInput = document.getElementById("searchInput");
  var playgroundHost = null;

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.hidden = true;
  }

  function openMenu() {
    sidebar.classList.add("open");
    overlay.hidden = false;
  }

  menuToggle.addEventListener("click", function () {
    if (sidebar.classList.contains("open")) closeMenu();
    else openMenu();
  });
  overlay.addEventListener("click", closeMenu);

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Tool icons are drawn as a CSS mask filled with the current text colour (same
     style as the website). The mask rule is in docs.css (.mask). */
  /* url() inside a custom property resolves against the stylesheet, so use absolute URLs */
  function abs(src) {
    try { return new URL(src, document.baseURI).href; } catch (e) { return src; }
  }

  /* Chromium refuses CSS masks from file:// (the offline docs), so there the same icon is a
     plain <img> that docs.css turns monochrome with a filter. Same look, no network needed. */
  var USE_MASK = location.protocol !== "file:" && !/[?&]nomask(&|$)/.test(location.search);

  function iconEl(src, cls) {
    var el;
    if (USE_MASK) {
      el = document.createElement("span");
      el.className = "mask " + cls;
      el.style.setProperty("--i", "url(" + JSON.stringify(abs(src)) + ")");
    } else {
      el = document.createElement("img");
      el.className = "ico-img " + cls;
      el.src = src;
      el.alt = "";
    }
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  function iconHtml(src, cls) {
    if (USE_MASK) {
      return (
        '<span class="mask ' + cls + '" aria-hidden="true" style="--i:url(' +
        esc(JSON.stringify(abs(src))) + ')"></span>'
      );
    }
    return '<img class="ico-img ' + cls + '" aria-hidden="true" alt="" src="' + esc(src) + '" />';
  }

  function buildNav() {
    navEl.innerHTML = "";

    var home = document.createElement("button");
    home.type = "button";
    home.className = "nav-home";
    home.id = "navHome";
    home.appendChild(iconEl(window.DOCS_FALLBACK_ICON, "tool-ico"));
    var homeLabel = document.createElement("span");
    homeLabel.textContent = "Welcome";
    home.appendChild(homeLabel);
    home.addEventListener("click", function () {
      goHome();
      closeMenu();
    });
    navEl.appendChild(home);

    DOCS_CATEGORIES.forEach(function (cat) {
      var block = document.createElement("div");
      block.className = "cat-block";
      block.dataset.cat = cat.id;

      var header = document.createElement("div");
      header.className = "cat-header";
      header.textContent = cat.label;
      block.appendChild(header);

      cat.tools.forEach(function (toolId) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tool-link";
        btn.dataset.tool = toolId;
        btn.dataset.slug = docsSlug(toolId);
        btn.dataset.label = (DOCS_LABELS[toolId] || toolId).toLowerCase();

        btn.appendChild(iconEl(DOCS_ICONS[toolId] || window.DOCS_FALLBACK_ICON, "tool-ico"));

        var span = document.createElement("span");
        span.textContent = DOCS_LABELS[toolId] || toolId;
        btn.appendChild(span);
        if (window.DOCS_BETA && window.DOCS_BETA[toolId]) {
          var badge = document.createElement("span");
          badge.className = "beta-badge";
          badge.textContent = "BETA";
          btn.appendChild(badge);
        }

        btn.addEventListener("click", function () {
          location.hash = docsSlug(toolId);
          closeMenu();
        });

        block.appendChild(btn);
      });

      navEl.appendChild(block);
    });
  }

  function goHome() {
    if (location.hash) location.hash = "";
    else route();
  }

  /* ---------- theme: dark by default, choice kept when storage allows ---------- */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("kb-theme", t); } catch (e) { /* storage blocked */ }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "light" ? "#F7F7F5" : "#0D0D0D");
  }

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  var logoEl = document.getElementById("logo");
  if (logoEl) {
    if (USE_MASK) {
      logoEl.style.setProperty("--i", "url(" + JSON.stringify(abs("img/keybelt_logo_horizontal_ivory.png")) + ")");
    } else {
      var logoImg = document.createElement("img");
      logoImg.className = "logo-fallback";
      logoImg.src = "img/keybelt_logo_horizontal_ivory.png";
      logoImg.alt = "KeyBelt";
      logoEl.parentNode.replaceChild(logoImg, logoEl);
    }
  }

  var logoLink = document.querySelector(".logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", function (ev) {
      ev.preventDefault();
      goHome();
    });
  }

  function resolveToolFromHash() {
    var hash = (location.hash || "").replace(/^#/, "").toLowerCase();
    if (!hash) return null;
    var found = null;
    DOCS_CATEGORIES.forEach(function (cat) {
      cat.tools.forEach(function (id) {
        if (docsSlug(id) === hash) found = id;
      });
    });
    return found;
  }

  function setActiveNav(toolId) {
    var homeBtn = document.getElementById("navHome");
    if (homeBtn) homeBtn.classList.toggle("active", !toolId);
    var links = navEl.querySelectorAll(".tool-link");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle("active", links[i].dataset.tool === toolId);
    }
  }

  function listHtml(items, ordered) {
    if (!items || !items.length) return "";
    var tag = ordered ? "ol" : "ul";
    return (
      "<" +
      tag +
      ">" +
      items
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("") +
      "</" +
      tag +
      ">"
    );
  }

  function controlCardsHtml(cards) {
    if (!cards || !cards.length) return "";
    var html =
      '<section class="doc-section"><h3>Sliders &amp; buttons</h3>' +
      '<p class="ke-cards-hint">Cards marked <span class="ke-badge">Demo</span> drive the playground (sliders or buttons).</p>' +
      '<div class="ke-cards">';
    cards.forEach(function (card) {
      var kind = card.kind === "button" ? "button" : "slider";
      html +=
        '<button type="button" class="ke-card' +
        (card.demo ? " ke-card-demo" : "") +
        '" data-effect="' +
        esc(card.id) +
        '" style="--card-color:' +
        esc(card.color || "#E5484D") +
        '">' +
        '<div class="ke-card-top">' +
        '<span class="ke-card-swatch"></span>' +
        "<strong>" +
        esc(card.title) +
        "</strong>" +
        '<span class="ke-kind">' +
        kind +
        "</span>" +
        (card.demo ? '<span class="ke-badge">Demo</span>' : "") +
        "</div>" +
        "<p>" +
        esc(card.body) +
        "</p>" +
        "</button>";
    });
    html += "</div></section>";
    return html;
  }

  function renderWelcome() {
    playgroundHost = null;
    contentEl.classList.remove("has-wide-doc");
    contentEl.innerHTML =
      '<section class="welcome">' +
      "<h2>Welcome to KeyBelt</h2>" +
      '<p class="lead">KeyBelt is a set of animation tools for Maya. Pick a tool on the left to see what it does and how to use it.</p>' +
      '<p><span class="beta-tag">Public beta</span>&nbsp; Everything in KeyBelt is a public beta. The tools work and are used on real shots, but they are still changing, so expect rough edges.</p>' +
      '<div class="welcome-card"><h3>Why KeyBelt exists</h3>' +
      "<p>KeyBelt is made by animators, for animators. I build these tools to solve problems that come up on real shots, and each one has been used in production before it is shared here.</p>" +
      "<p>The goal is simple: control every aspect of the animation with the least technical difficulty possible.</p></div>" +
      "<h3>Working with KeyBelt windows</h3>" +
      "<p>Every KeyBelt window can be moved and resized from anywhere on the window, not only from the title bar.</p>" +
      "<ul>" +
      "<li><strong>Move:</strong> hold the middle mouse button (MMB) and drag.</li>" +
      "<li><strong>Resize:</strong> hold the right mouse button (RMB) and drag.</li>" +
      "<li><strong>Context menu:</strong> an RMB click without dragging still opens the context menu as usual.</li>" +
      "</ul>" +
      "<p>One exception: Keys Editor sliders use MMB for their own shortcut popup, so start the window drag from somewhere else on the window.</p>" +
      "<h3>Feedback</h3>" +
      "<p>Something broken, unclear or missing? Tell me what happened and which Maya version you use.</p>" +
      '<p><a class="btn-link" href="' + FEEDBACK_URL + '" target="_blank" rel="noopener">Send feedback</a></p>' +
      "</section>";
    setActiveNav(null);
  }

  function renderTool(toolId) {
    var meta = docsFindToolMeta(toolId);
    var doc = (window.TOOL_DOCS && window.TOOL_DOCS[toolId]) || null;
    var icon = DOCS_ICONS[toolId] || window.DOCS_FALLBACK_ICON;
    var color = "#E5484D";
    playgroundHost = null;

    var hasPlayground = !!(doc && doc.playground);
    var hasUiMock = !!(window.UI_MOCKS && window.UI_MOCKS[toolId]);
    var useSplit = hasPlayground || hasUiMock;
    contentEl.classList.toggle("has-wide-doc", useSplit);
    var html = "";
    html +=
      '<article class="doc' +
      (useSplit ? " doc-wide" : "") +
      '">' +
      '<header class="doc-header">' +
      iconHtml(icon, "doc-ico") +
      "<div>" +
      "<h2>" +
      esc(meta.label) +
      (window.DOCS_BETA && window.DOCS_BETA[toolId] ? ' <span class="beta-badge">BETA</span>' : "") +
      "</h2>" +
      '<span class="doc-cat">' +
      esc(meta.category.label) +
      "</span>" +
      "</div></header>";

    if (!doc) {
      html +=
        '<p class="missing">Docs for this tool are not available yet.</p></article>';
      contentEl.innerHTML = html;
      setActiveNav(toolId);
      return;
    }

    if (useSplit) html += '<div class="doc-split"><div class="doc-split-main">';

    if (doc.what) {
      html +=
        '<section class="doc-section"><h3>What it is</h3><p>' +
        esc(doc.what) +
        "</p></section>";
    }
    if (doc.when && doc.when.length) {
      html +=
        '<section class="doc-section"><h3>When to use</h3>' +
        listHtml(doc.when, false) +
        "</section>";
    }
    if (doc.how && doc.how.length) {
      html +=
        '<section class="doc-section"><h3>How it works</h3>' +
        listHtml(doc.how, true) +
        "</section>";
    }
    if (doc.controlCards && doc.controlCards.length) {
      html += controlCardsHtml(doc.controlCards);
    } else if (doc.controls && doc.controls.length) {
      html +=
        '<section class="doc-section"><h3>Main controls</h3>' +
        listHtml(doc.controls, false) +
        "</section>";
    }
    if (doc.sections && doc.sections.length) {
      doc.sections.forEach(function (sec) {
        html +=
          '<section class="doc-section"><h3>' + esc(sec.title) + "</h3>" +
          (sec.text ? "<p>" + esc(sec.text) + "</p>" : "") +
          listHtml(sec.items, false) +
          (sec.after ? "<p>" + esc(sec.after) + "</p>" : "") +
          "</section>";
      });
    }
    if (doc.scheme) {
      html +=
        '<section class="doc-section"><h3>Scheme</h3><div class="scheme">' +
        doc.scheme +
        (doc.schemeCaption
          ? '<p class="scheme-caption">' + esc(doc.schemeCaption) + "</p>"
          : "") +
        "</div></section>";
    }
    if (doc.tips && doc.tips.length) {
      html +=
        '<section class="doc-section tips"><h3>Tips</h3>' +
        listHtml(doc.tips, false) +
        "</section>";
    }
    if (doc.credit) {
      html +=
        '<section class="doc-section"><h3>Credit</h3><p class="credit">' +
        esc(doc.credit) +
        "</p></section>";
    }

    if (useSplit) {
      var sideTitle = hasPlayground ? "Tool UI + playground" : "Tool UI";
      html +=
        '</div><aside class="doc-split-side">' +
        '<section class="doc-section ke-side-section">' +
        "<h3>" +
        sideTitle +
        "</h3>" +
        '<div id="toolUiRoot"></div>' +
        "</section></aside></div>";
    }

    html += "</article>";
    contentEl.innerHTML = html;
    setActiveNav(toolId);
    contentEl.focus({ preventScroll: true });

    var root = document.getElementById("toolUiRoot");
    if (hasPlayground && window.KeysPlayground && root) {
      playgroundHost = KeysPlayground.mount(root);
      var cards = contentEl.querySelectorAll(".ke-card-demo");
      for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", function (ev) {
          var id = ev.currentTarget.getAttribute("data-effect");
          if (playgroundHost && playgroundHost._setEffectFromCard) {
            playgroundHost._setEffectFromCard(id);
          }
        });
      }
    } else if (hasUiMock && window.UiMocks && root) {
      UiMocks.mount(root, toolId, color);
    }
  }

  function route() {
    var toolId = resolveToolFromHash();
    if (toolId) renderTool(toolId);
    else renderWelcome();
  }

  searchInput.addEventListener("input", function () {
    var q = searchInput.value.trim().toLowerCase();
    var blocks = navEl.querySelectorAll(".cat-block");
    for (var b = 0; b < blocks.length; b++) {
      var block = blocks[b];
      var links = block.querySelectorAll(".tool-link");
      var any = false;
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var match =
          !q ||
          link.dataset.label.indexOf(q) !== -1 ||
          link.dataset.tool.toLowerCase().indexOf(q) !== -1;
        link.classList.toggle("hidden", !match);
        if (match) any = true;
      }
      block.classList.toggle("hidden-all", !any);
    }
  });

  window.addEventListener("hashchange", route);
  buildNav();
  route();
})();
