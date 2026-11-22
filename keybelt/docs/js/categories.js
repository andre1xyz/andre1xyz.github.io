/* Category config + tool registry — mirrors keybelt_core._build_category_config (shipped tools only) */
window.DOCS_CATEGORIES = [
  {
    id: "keys",
    label: "Key tools",
    color: "#569CD6",
    tools: ["KeysEditor", "Offseter"]
  },
  {
    id: "curve_tools",
    label: "Baking / curve tools",
    color: "#FFFF00",
    tools: ["Baker", "MotionTrail"]
  },
  {
    id: "execute",
    label: "One-shot utilities",
    color: "#FF8080",
    tools: ["Reset_All"]
  },
  {
    id: "management",
    label: "Management / viewer",
    color: "#B8D7A3",
    tools: ["Selector"]
  },
  {
    id: "system",
    label: "System / UI",
    color: "#D16969",
    tools: ["RadialMenu", "TimelineToolbarSettings"]
  }
];

/** Relative icon paths from Documentation/ */
window.DOCS_ICONS = {
  Baker: "icons/baker.png",
  KeysEditor: "icons/keysEditor.png",
  MotionTrail: "icons/motionTrail.png",
  Offseter: "icons/offseter.png",
  RadialMenu: "icons/keybelt_ui_mark.png",
  Reset_All: "icons/Reset_All.png",
  Selector: "icons/selector.png",
  TimelineToolbarSettings: "icons/timelineToolbarSettings.png"
};

window.DOCS_LABELS = {
  Baker: "Baker",
  KeysEditor: "Keys Editor",
  MotionTrail: "Motion Trail",
  Offseter: "Offseter",
  RadialMenu: "Radial Menu",
  Reset_All: "Reset All",
  Selector: "Selector",
  TimelineToolbarSettings: "Settings"
};

/** Tools shipped as BETA (mirrors the BETA marker file in the tool folder) */
window.DOCS_BETA = {};

window.DOCS_FALLBACK_ICON = "icons/keybelt_ui_mark.png";

window.docsSlug = function (id) {
  return String(id || "").toLowerCase().replace(/_/g, "");
};

window.docsFindToolMeta = function (toolId) {
  for (var i = 0; i < window.DOCS_CATEGORIES.length; i++) {
    var cat = window.DOCS_CATEGORIES[i];
    if (cat.tools.indexOf(toolId) !== -1) {
      return { category: cat, label: window.DOCS_LABELS[toolId] || toolId };
    }
  }
  return {
    category: { id: "other", label: "Other", color: "#808080" },
    label: window.DOCS_LABELS[toolId] || toolId
  };
};
