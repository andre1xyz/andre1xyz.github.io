(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function fmtSize(bytes) {
    if (!bytes) { return "–"; }
    var mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function getJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) { throw new Error(url + " " + r.status); }
      return r.json();
    });
  }

  // Mobile menu
  var menuBtn = document.querySelector(".kb-menu-btn");
  var links = $("kb-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function markComingSoon(btn, note) {
    btn.textContent = "Coming soon";
    btn.removeAttribute("href");
    btn.removeAttribute("download");
    btn.setAttribute("aria-disabled", "true");
    btn.classList.add("kb-disabled");
    note.textContent = "The first release is not published yet. Check back soon.";
  }

  // Download button, driven by version.json
  getJSON("version.json").then(function (v) {
    $("kb-version").textContent = v.version || "";
    $("kb-released").textContent = v.released || "–";
    if (v.maya && v.maya.length) {
      $("kb-maya").textContent = v.maya[0] + " – " + v.maya[v.maya.length - 1];
    }
    $("kb-size").textContent = fmtSize(v.size);

    var btn = $("kb-dl-btn");
    var note = $("kb-dl-note");
    if (v.url && v.size > 0 && v.sha256) {
      btn.href = v.url;
      btn.textContent = "Download KeyBelt " + v.version;
      note.textContent = "SHA-256: " + v.sha256;
    } else {
      markComingSoon(btn, note);
    }
  }).catch(function () {
    markComingSoon($("kb-dl-btn"), $("kb-dl-note"));
  });

  // Changelog, rendered from changelog.json (static fallback stays on failure)
  getJSON("changelog.json").then(function (list) {
    if (!Array.isArray(list) || !list.length) { return; }
    // Short by default: the newest release shows its first few items, the rest
    // (and older releases) sit behind "Show all" so the page stays compact.
    var SHOWN = 5;
    $("kb-changelog").innerHTML = list.map(function (r, idx) {
      var all = (r.items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; });
      var date = r.date ? ' <span class="kb-date">' + esc(r.date) + "</span>" : "";
      var head = esc(r.version) + date;
      if (idx > 0) {
        return '<details class="kb-release"><summary><h3>' + head + "</h3></summary><ul>" + all.join("") + "</ul></details>";
      }
      var more = all.length > SHOWN
        ? '<details class="kb-more"><summary>Show all ' + all.length + " changes</summary><ul>" + all.slice(SHOWN).join("") + "</ul></details>"
        : "";
      return '<article class="kb-release"><h3>' + head + "</h3><ul>" + all.slice(0, SHOWN).join("") + "</ul>" + more + "</article>";
    }).join("");
    // The changelog loads after the browser jumped to a deep link (#roadmap ...):
    // jump again now that the layout above the target has its final height.
    if (location.hash && location.hash !== "#changelog") {
      var target = document.getElementById(location.hash.slice(1));
      if (target) { target.scrollIntoView(); }
    }
  }).catch(function () { /* keep static fallback */ });
})();
