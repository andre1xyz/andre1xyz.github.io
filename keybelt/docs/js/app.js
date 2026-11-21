/* Docs app: nav, hash routing, content render, mobile menu, search */
(function () {
  "use strict";

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

  function buildNav() {
    navEl.innerHTML = "";
    DOCS_CATEGORIES.forEach(function (cat) {
      var block = document.createElement("div");
      block.className = "cat-block";
      block.dataset.cat = cat.id;

      var header = document.createElement("div");
      header.className = "cat-header";
      header.innerHTML =
        '<span class="cat-bar" style="background:' +
        cat.color +
        '"></span><span>' +
        cat.label +
        "</span>";
      block.appendChild(header);

      cat.tools.forEach(function (toolId) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tool-link";
        btn.dataset.tool = toolId;
        btn.dataset.slug = docsSlug(toolId);
        btn.dataset.label = (DOCS_LABELS[toolId] || toolId).toLowerCase();
        btn.style.setProperty("--cat-color", cat.color);

        var iconSrc = DOCS_ICONS[toolId];
        if (iconSrc) {
          var img = document.createElement("img");
          img.className = "tool-icon";
          img.src = iconSrc;
          img.alt = "";
          img.onerror = function () {
            img.replaceWith(fallbackIcon(cat.color));
          };
          btn.appendChild(img);
        } else {
          btn.appendChild(fallbackIcon(cat.color));
        }

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

  function fallbackIcon(color) {
    var d = document.createElement("span");
    d.className = "tool-icon-fallback";
    d.style.setProperty("--cat-color", color);
    return d;
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
    var links = navEl.querySelectorAll(".tool-link");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle("active", links[i].dataset.tool === toolId);
    }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
      '<p class="ke-cards-hint">Cards with <span class="ke-badge">Demo</span> drive the playground (sliders or buttons).</p>' +
      '<div class="ke-cards">';
    cards.forEach(function (card) {
      var kind = card.kind === "button" ? "button" : "slider";
      html +=
        '<button type="button" class="ke-card' +
        (card.demo ? " ke-card-demo" : "") +
        '" data-effect="' +
        esc(card.id) +
        '" style="--card-color:' +
        esc(card.color || "#5f87cd") +
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
      "<h2>Welcome</h2>" +
      "<p>Pick a tool on the left. Learn what it is for and how to use it — workflows, controls, and visual schemes when helpful.</p>" +
      "</section>";
    setActiveNav(null);
  }

  function renderTool(toolId) {
    var meta = docsFindToolMeta(toolId);
    var doc = (window.TOOL_DOCS && window.TOOL_DOCS[toolId]) || null;
    var icon = DOCS_ICONS[toolId] || window.DOCS_FALLBACK_ICON;
    var color = meta.category.color;
    playgroundHost = null;

    var hasPlayground = !!(doc && doc.playground);
    var hasUiMock = !!(window.UI_MOCKS && window.UI_MOCKS[toolId]);
    var useSplit = hasPlayground || hasUiMock;
    contentEl.classList.toggle("has-wide-doc", useSplit);
    var html = "";
    html +=
      '<article class="doc' +
      (useSplit ? " doc-wide" : "") +
      '" style="--cat-color:' +
      color +
      '">' +
      '<header class="doc-header">' +
      '<img src="' +
      esc(icon) +
      '" alt="" onerror="this.style.display=\'none\'" />' +
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
    contentEl.focus();

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
