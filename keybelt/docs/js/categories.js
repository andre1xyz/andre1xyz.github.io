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
    tools: ["Baker"]
  },
  {
    id: "execute",
    label: "One-shot utilities",
    color: "#FF8080",
    tools: ["Reset_All"]
  },
  {
    id: "secondary_motion",
    label: "Secondary motion",
    color: "#C586C0",
    tools: ["MotionTrail"]
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
  Baker: "../Baker/baker.png",
  KeysEditor: "../KeysEditor/keysEditor.png",
  MotionTrail: "../MotionTrail/motionTrail.png",
  Offseter: "../Offseter/offseter.png",
  RadialMenu: "img/keybelt_ui_mark.png",
  Reset_All: "../Reset_All/Reset_All.png",
  Selector: "../Selector/selector.png",
  TimelineToolbarSettings: "../TimelineToolbarSettings/timelineToolbarSettings.png"
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
window.DOCS_BETA = {
  MotionTrail: true
};

window.DOCS_FALLBACK_ICON = "img/keybelt_ui_mark.png";

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
