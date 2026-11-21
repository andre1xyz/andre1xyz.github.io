/* Hand-written animator docs, not TOOL_INFO dumps */
window.TOOL_DOCS = {

  KeysEditor: {
    what: "Sculpt and clean animation curves on selected controls. Drag a slider while keys (or a range) are selected and the effect applies live. Double-click any slider to reset it to zero. Optional timeline toolbar sliders drive the same effects from the timeline.",
    when: [
      "Curves look noisy or stepped after blocking",
      "Need ease-in/out, wave/noise, or peak shaping on a range",
      "Want to stagger timing down a hierarchy or strip flat/redundant keys"
    ],
    how: [
      "Select controls. Optionally select key ranges in the Graph Editor.",
      "Drag the slider for the effect you want (or use a timeline Keys slider).",
      "Release when the shape looks right. Double-click slider → reset to 0.",
      "Use top buttons for cleanup: Del Flat, Del Redundant, Bake, SNP, Shift −/+."
    ],
    playground: true,
    controlCards: [
      {
        id: "smooth",
        title: "Smooth",
        color: "#5f87cd",
        demo: true,
        body: "Gaussian soften across neighboring keys. Softens noise and hard corners without fully flattening the pose."
      },
      {
        id: "push_pull",
        title: "Push / Pull",
        color: "#cd5f5f",
        demo: true,
        body: "Push (+): amplify how far mid keys sit from the linear chord between neighbors (up to 3×). Pull (−): squash toward that chord. Ends stay anchors."
      },
      {
        id: "interpolate",
        title: "Interpolate",
        color: "#5fcd87",
        demo: true,
        body: "Not flatten-to-linear. (+) blends every key toward the RIGHT end value. (−) blends toward the LEFT end value. Use to bias a range left or right."
      },
      {
        id: "wave_noise",
        title: "Wave / Noise",
        color: "#cd87cd",
        demo: true,
        body: "Adds oscillation on top of the curve. Use Frequency and Amplitude fields when visible. Good for vibration, jitter, or organic texture."
      },
      {
        id: "ease_linear",
        title: "Ease Linear",
        color: "#cdcd5f",
        demo: true,
        body: "(+) Ease: reshape toward smooth ease-in/out between ends. (−) Linear: blend mid keys toward the straight chord."
      },
      {
        id: "directional_ease",
        title: "Directional Ease",
        color: "#87cdcd",
        demo: true,
        body: "Exponential ease bias. (+)=ease weighted toward left, (−)=toward right. Blend strength follows slider."
      },
      {
        id: "blend_direction",
        title: "Blend Direction",
        color: "#cd875f",
        demo: true,
        body: "Blend toward right (+) or left (−) end value; stronger near that side of the range."
      },
      {
        id: "scale_from_end",
        title: "Scale From End",
        color: "#9acd5f",
        demo: true,
        body: "Scale values around the right (+) or left (−) anchor. Grows/shrinks the move relative to that end."
      },
      {
        id: "uniform_to_end",
        title: "Uniform To End",
        color: "#5fcda8",
        demo: true,
        body: "Same delta applied to all keys toward the right (+) or left (−) end value."
      },
      {
        id: "push_to_peak",
        title: "Push To Peak",
        color: "#e8a030",
        demo: true,
        body: "(+) Attract keys toward nearest peak/valley. (−) Straighten slopes between extrema."
      },
      {
        id: "blend_default",
        title: "Blend Default",
        color: "#7fcf7f",
        demo: true,
        body: "Blend toward channel default (0 for translate in the demo). Dial intensity down without deleting keys."
      },
      {
        id: "world_xform_blend",
        title: "World Xform Blend",
        color: "#d58cff",
        demo: true,
        body: "Real tool blends via world matrices. Demo approximates a blend toward a calmer world-space chord / rest."
      },
      {
        id: "offset",
        title: "Offset",
        color: "#a87bff",
        demo: true,
        body: "Circularly rotates key VALUES along the selection (later ↔ earlier frames). Not a vertical value nudge."
      },
      {
        id: "infinity",
        title: "Infinity",
        color: "#ff9f6e",
        demo: true,
        body: "(+) Follow previous key slope outward. (−) Follow next key slope. Extends continuation feel."
      },
      {
        id: "hierarchy_offset",
        title: "Hierarchy Offset",
        color: "#7fb5ff",
        demo: true,
        body: "Offsets value timing down the selection order (root → tip). Deeper objects shift more. Try Hierarchy presets."
      },
      {
        id: "hierarchy_offset_push_pull",
        title: "Hierarchy Push / Pull",
        color: "#5fcdff",
        demo: true,
        body: "Push/pull strength scales by chain index. Root barely moves; tip exaggerates more. Use Hierarchy presets."
      },
      {
        id: "del_flat",
        title: "Del Flat",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Removes middle keys inside flat plateaus (same value as neighbors). Try Stepped flats preset, then click."
      },
      {
        id: "del_redundant",
        title: "Del Redundant",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Removes keys that sit on the straight line between neighbors (shape-preserving). Try Redundant keys preset."
      },
      {
        id: "bake",
        title: "Bake",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Samples every 1 frame across the range (dense keys). Try Sparse preset, then Bake."
      },
      {
        id: "snp",
        title: "SNP (Smart Snap)",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Snaps off-frame keys to nearest integer frame. Try Off-frame keys preset."
      },
      {
        id: "shift",
        title: "Shift − / +",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Shifts all keys left (−) or right (+) by N frames from the spin box. Timing nudge without changing values."
      }
    ],
    scheme:
      '<svg viewBox="0 0 520 90" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif" font-size="12" fill="#e8e8e8">' +
      '<rect x="8" y="28" width="100" height="36" rx="6" fill="#3a3a3a" stroke="#E5484D"/>' +
      '<text x="58" y="50" text-anchor="middle">Select keys</text>' +
      '<path d="M118 46h28" stroke="#a0a0a0" stroke-width="2"/>' +
      '<rect x="156" y="28" width="110" height="36" rx="6" fill="#3a3a3a" stroke="#E5484D"/>' +
      '<text x="211" y="50" text-anchor="middle">Drag slider</text>' +
      '<path d="M276 46h28" stroke="#a0a0a0" stroke-width="2"/>' +
      '<rect x="314" y="28" width="90" height="36" rx="6" fill="#3a3a3a" stroke="#E5484D"/>' +
      '<text x="359" y="50" text-anchor="middle">Shape OK</text>' +
      '<path d="M414 46h28" stroke="#a0a0a0" stroke-width="2"/>' +
      '<rect x="452" y="28" width="60" height="36" rx="6" fill="#E5484D"/>' +
      '<text x="482" y="50" text-anchor="middle" fill="#1a1a1a" font-weight="700">Bake?</text>' +
      "</svg>",
    schemeCaption: "Select → drag slider → release → optional bake / cleanup",
    tips: [
      "Double-click any slider → reset to zero.",
      "All sliders are interactive now (DE, BD, SE, UE, DF, INF, WX too).",
      "Buttons change the graph. Try matching presets: Stepped→Del Flat, Redundant→Del Redundant, Off-frame→SNP, Sparse→Bake.",
      "Click Demo cards on the left to drive sliders or fire buttons.",
      "Hierarchy presets needed for HOF / HPP."
    ]
  },



  Offseter: {
    what: "Live offset tool: move/rotate/scale in the viewport and selected keys (or whole curves) shift by that delta. Toggle from the timeline for fast timing fixes.",
    when: [
      "Need to nudge a keyed pose without re-keying by hand",
      "Graph Editor key selection should move together with viewport edit"
    ],
    how: [
      "Enable Offseter (timeline button toggles active state).",
      "Select keys or leave selection empty to affect full curves.",
      "Transform in the viewport. The deltas apply to keys.",
      "Disable when done so normal editing returns."
    ],
    controls: [
      "Toggle on/off from timeline toolbar",
      "Offsets timeline range or GE key selection",
      "Falls back to full curve if nothing selected",
      "Tracks translate / rotate / scale"
    ],
    tips: ["Leave it off when not offsetting. It avoids surprise curve edits."]
  },

  Baker: {
    what: "Bake selection into temporary circle controllers in a chosen space, animate or adjust there, then bake back down to the originals.",
    when: [
      "Need a cleaner space to polish a section",
      "Want reference spaces for baking without destroying the rig"
    ],
    how: [
      "Create or pick a reference space.",
      "Bake to Circle on the selection.",
      "Animate or fix on the circles.",
      "Bake Down (or Fast Bake / full range) back to originals. Delete spaces when finished."
    ],
    controls: [
      "Create / delete reference spaces",
      "Bake to Circle + Bake Down",
      "Fast Bake Selected",
      "Bake Full Animation Range",
      "Optional override anim layer"
    ],
    scheme:
      '<svg viewBox="0 0 520 90" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif" font-size="11" fill="#e8e8e8">' +
      '<rect x="6" y="28" width="88" height="36" rx="6" fill="#3a3a3a" stroke="#E5484D"/>' +
      '<text x="50" y="50" text-anchor="middle">Originals</text>' +
      '<path d="M100 46h24" stroke="#a0a0a0" stroke-width="2"/>' +
      '<rect x="130" y="28" width="88" height="36" rx="6" fill="#3a3a3a" stroke="#E5484D"/>' +
      '<text x="174" y="50" text-anchor="middle">Space</text>' +
      '<path d="M224 46h24" stroke="#a0a0a0" stroke-width="2"/>' +
      '<circle cx="290" cy="46" r="22" fill="#3a3a3a" stroke="#E5484D" stroke-width="2"/>' +
      '<text x="290" y="50" text-anchor="middle">Circles</text>' +
      '<path d="M318 46h24" stroke="#a0a0a0" stroke-width="2"/>' +
      '<rect x="348" y="28" width="70" height="36" rx="6" fill="#3a3a3a" stroke="#E5484D"/>' +
      '<text x="383" y="50" text-anchor="middle">Polish</text>' +
      '<path d="M424 46h20" stroke="#a0a0a0" stroke-width="2"/>' +
      '<rect x="450" y="28" width="64" height="36" rx="6" fill="#E5484D"/>' +
      '<text x="482" y="50" text-anchor="middle" fill="#1a1a1a" font-weight="700">Bake↓</text>' +
      "</svg>",
    schemeCaption: "Originals → space → circles → polish → bake down"
  },









  Reset_All: {
    what: "One-click reset of all keyable attributes on the selection back to defaults. No UI, it runs when launched.",
    when: [
      "Controls drifted from default pose",
      "Need a clean zero before starting a new beat"
    ],
    how: [
      "Select controls.",
      "Launch Reset All from toolbar / radial / toolbox.",
      "Keyable channels reset; locked or unsettable attrs are skipped."
    ],
    controls: [
      "TRS + other keyable channels",
      "Skips locked / unsettable",
      "No dialog, it acts immediately"
    ],
    tips: ["Undo once if you fired it by mistake."]
  },










  MotionTrail: {
    what: "A visual motion path that shows how an object travels over time. World or camera-relative trails with fade, color, and optional mesh rivets.",
    credit: "Built on the Agora Community motion trail, used as the base and then modified and improved for KeyBelt. It is not an Agora product and is not endorsed by Agora.",
    when: [
      "Checking arc quality in the viewport",
      "Camera-relative path needed for screen-space motion"
    ],
    how: [
      "Select tracking object(s). Open Motion Trail.",
      "Choose world or camera-relative mode.",
      "Process (auto or manual). Tune fade frames and color.",
      "Optional mesh rivet tracking; trails update on play."
    ],
    controls: [
      "World or camera-relative trails",
      "Auto / manual process; fade frames",
      "Color; mesh rivet tracking",
      "Auto-select mode; live updates on play"
    ],
    scheme:
      '<svg viewBox="0 0 420 90" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif" font-size="11" fill="#e8e8e8">' +
      '<path d="M30 60 C80 20 140 20 180 45 S280 85 360 30" fill="none" stroke="#E5484D" stroke-width="3" opacity="0.9"/>' +
      '<circle cx="360" cy="30" r="8" fill="#E5484D"/>' +
      '<text x="210" y="82" text-anchor="middle" fill="#a0a0a0">Object path over time</text>' +
      "</svg>",
    schemeCaption: "Trail draws the motion arc through the shot"
  },











  Selector: {
    what: "Named colored selection sets with membership editing. Click a set to select members; add or remove from the current selection.",
    when: [
      "Repeat selection of the same control groups",
      "Color-code sets for body parts or props"
    ],
    how: [
      "Add a set and pick a color.",
      "With members selected, add them to the set.",
      "Click the set button later to reselect.",
      "Rename, delete, or remove members as needed."
    ],
    controls: [
      "Add set (+ color)",
      "Click set → select members",
      "Add / Remove selection; rename; delete",
      "Membership indicators on selection change"
    ]
  },



  RadialMenu: {
    what: "Hotkey pie menu (default Alt+Q) centered on the cursor. Hover for labels, click to launch tools. Tool list is configurable in settings.",
    when: [
      "Want tools under the cursor without hunting the toolbar",
      "Custom subset of tools for a shot workflow"
    ],
    how: [
      "Hold/press the radial hotkey near the cursor.",
      "Move toward a wedge and its label appears.",
      "Click to launch. Release/cancel to dismiss.",
      "Edit the tool list under Settings → Radial & Viewport Bar."
    ],
    controls: [
      "Cursor-centered wheel",
      "Hover label + click launch",
      "Configurable tool set",
      "Category-tinted icons"
    ],
    scheme:
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif" font-size="10" fill="#e8e8e8">' +
      '<circle cx="100" cy="100" r="70" fill="#333" stroke="#E5484D" stroke-width="2"/>' +
      '<circle cx="100" cy="100" r="22" fill="#2b2b2b" stroke="#505050"/>' +
      '<line x1="100" y1="30" x2="100" y2="78" stroke="#505050"/>' +
      '<line x1="100" y1="122" x2="100" y2="170" stroke="#505050"/>' +
      '<line x1="30" y1="100" x2="78" y2="100" stroke="#505050"/>' +
      '<line x1="122" y1="100" x2="170" y2="100" stroke="#505050"/>' +
      '<text x="100" y="48" text-anchor="middle">Tool</text>' +
      '<text x="100" y="160" text-anchor="middle">Tool</text>' +
      '<text x="48" y="104" text-anchor="middle">Tool</text>' +
      '<text x="152" y="104" text-anchor="middle">Tool</text>' +
      "</svg>",
    schemeCaption: "Pie wedges around cursor → click to launch"
  },

  TimelineToolbarSettings: {
    what: "KeyBelt preferences: timeline and Graph Editor toolbars, the Time Dragger HUD, hotkeys, radial menu and viewport bar contents, and this documentation entry point.",
    when: [
      "Reorder / hide toolbar tools",
      "Assign hotkeys or edit radial menu",
      "Change alignment or Keys Editor sliders",
      "Turn the Time Dragger timeline HUD on / off",
      "Turn off asset-centric selection / cycle check warnings"
    ],
    how: [
      "Open from the gear on the timeline toolbar.",
      "Edit General, Toolbars, Hotkeys, or Radial & Viewport Bar.",
      "Save to apply. Revert discards unsaved UI edits.",
      "Documentation tab opens this local site in the browser.",
      "Time Dragger HUD (General, on by default): hold the Time Dragger key (Hotkeys tab, Maya default K) anywhere in Maya. A thin line-only timeline shows above the cursor: playback range (solid) vs outside it (dashed), keys of the selection (red, breakdowns green), time slider bookmarks, and the current frame (amber + offset when outside the range).",
      "While holding the key: LMB / MMB drag = scrub, endless (the cursor wraps at the screen edge). Shift = fine, Ctrl = coarse, wheel = one frame, Esc = back to the start frame. Off = Maya's own Time Dragger.",
      "Maya Preferences (General, on by default): turns off asset-centric selection (select objects inside containers) and Maya's cycle check warnings. Reapplied every time KeyBelt launches; unticking restores your previous Maya values."
    ],
    sections: [
      {
        title: "Window controls",
        text: "Every KeyBelt window, including this one, can be moved and resized from anywhere on the window, not only from the title bar.",
        items: [
          "Move: hold the middle mouse button (MMB) and drag.",
          "Resize: hold the right mouse button (RMB) and drag.",
          "An RMB click without dragging still opens the context menu as usual.",
          "Keys Editor sliders use MMB for their own shortcut popup, so start the window drag from somewhere else."
        ]
      },
      {
        title: "Feedback",
        text: "General > Updates has a Send feedback button. It opens the KeyBelt feedback page in your browser."
      }
    ],
    controls: [
      "General: alignment, keys sliders, Time Dragger HUD",
      "Toolbars: timeline + Graph Editor order / visibility / categories",
      "Hotkeys + Radial & Viewport Bar tool lists",
      "Documentation → Access to Documentation"
    ]
  }
};
