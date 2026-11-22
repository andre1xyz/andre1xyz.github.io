/* Hand-written animator docs, not TOOL_INFO dumps */
window.TOOL_DOCS = {

  KeysEditor: {
    what: "Sculpt and clean animation curves on selected controls. Drag a slider while keys (or a range) are selected and the effect applies live. Double-click any slider to reset it to zero. The same effects are available as sliders in the toolbars, next to a set of one-click buttons for cleanup and timing.",
    when: [
      "Curves look noisy or stepped after blocking",
      "Need ease-in/out, wave/noise, or peak shaping on a range",
      "Want to stagger timing down a hierarchy or strip flat/redundant keys"
    ],
    how: [
      "Select controls. Optionally select key ranges in the Graph Editor.",
      "Drag the slider for the effect you want (or use a timeline Keys slider).",
      "Release when the shape looks right. Double-click slider → reset to 0.",
      "Use the buttons for cleanup and timing: Del Flat, Del Redundant, Bake, SNP, Shift. They also exist in the toolbars."
    ],
    playground: true,
    sectionsBefore: [
      {
        title: "In the toolbars",
        html:
          '<p>Keys Editor is not only a window. Its sliders <strong>and</strong> its buttons can sit in the toolbars you already use. The screenshot is the timeline toolbar, the strip under Maya\'s Time Slider.</p>' +
          '<div data-shot="TimelineToolbar" data-w="620" data-marks="6.7:1,87.8:1,19.2:2,31.2:3,45.8:4,65.5:4" data-caption="KeyBelt timeline toolbar (real screenshot). The numbers match the list below."></div>' +
          '<ol class="fig-legend">' +
          '<li><span class="fig-n">1</span><div><strong>Tool buttons.</strong> Launch tools: Offseter, Keys Editor, Baker, Reset All, Motion Trail, Selector.</div></li>' +
          '<li><span class="fig-n">2</span><div><strong>Action buttons.</strong> Coloured one-click buttons: delete redundant, delete flat, bake, smart snap, Euler filter, tangents, invert. See <a href="#" class="jump" data-jump="ke-buttons">Buttons</a>.</div></li>' +
          '<li><span class="fig-n">3</span><div><strong>Shift and frames.</strong> Arrows to move keys or insert / remove frames, with the frames field (N) between them.</div></li>' +
          '<li><span class="fig-n">4</span><div><strong>Sliders.</strong> Effect sliders such as Smooth (S) and Wave / Noise (WN). See <a href="#" class="jump" data-jump="ke-sliders">Sliders</a>.</div></li>' +
          '</ol>' +
          '<h4>Where they appear</h4>' +
          '<ul>' +
          '<li><strong>Timeline toolbar</strong> under Maya\'s Time Slider: sliders and buttons.</li>' +
          '<li><strong>Graph Editor toolbar:</strong> the buttons. Turn it on in Settings, Toolbars, Graph Editor Toolbar.</li>' +
          '<li><strong>Viewport Bar</strong> (optional): a floating bar over the 3D view with sliders and buttons. See Viewport Bar.</li>' +
          '</ul>' +
          '<p>Which buttons show is set in <strong>Settings, Toolbars, Keys Action Buttons</strong>. It is one list: each row has a <em>Timeline</em> and a <em>Graph Editor</em> toggle, so a button can be on both toolbars, one, or neither. The timeline toolbar shows the buttons together with its Keys sliders. The Viewport Bar has its own list under Radial &amp; Viewport Bar.</p>'
      }
    ],
    slidersIntro: "A slider applies one effect live while you drag. Click a dot on the slider to jump to that preset. The small glyph on each card is the effect icon shown next to the slider in the Keys Editor window.",
    buttonsIntro: "Buttons are not sliders. One click runs the action on the selected keys or objects. The icons below are the real toolbar buttons. They appear in the Keys Editor window and in the toolbars (see above); the cards underneath drive the playground.",
    buttonsHtml: KB_FIG.actionButtonsHtml() + KB_FIG.shiftButtonsHtml(),
    controlCards: [
      {
        id: "smooth",
        icon: "fx_smooth",
        title: "Smooth",
        color: "#5f87cd",
        demo: true,
        body: "Gaussian soften across neighboring keys. Softens noise and hard corners without fully flattening the pose."
      },
      {
        id: "push_pull",
        icon: "fx_push_pull",
        title: "Push / Pull",
        color: "#cd5f5f",
        demo: true,
        body: "Push (+): amplify how far mid keys sit from the linear chord between neighbors (up to 3×). Pull (−): squash toward that chord. Ends stay anchors."
      },
      {
        id: "interpolate",
        icon: "fx_interpolate",
        title: "Interpolate",
        color: "#5fcd87",
        demo: true,
        body: "Not flatten-to-linear. (+) blends every key toward the RIGHT end value. (−) blends toward the LEFT end value. Use to bias a range left or right."
      },
      {
        id: "wave_noise",
        icon: "fx_wave_noise",
        title: "Wave / Noise",
        color: "#cd87cd",
        demo: true,
        body: "Adds oscillation on top of the curve. Use Frequency and Amplitude fields when visible. Good for vibration, jitter, or organic texture."
      },
      {
        id: "ease_linear",
        icon: "fx_ease_linear",
        title: "Ease Linear",
        color: "#cdcd5f",
        demo: true,
        body: "(+) Ease: reshape toward smooth ease-in/out between ends. (−) Linear: blend mid keys toward the straight chord."
      },
      {
        id: "directional_ease",
        icon: "fx_directional_ease",
        title: "Directional Ease",
        color: "#87cdcd",
        demo: true,
        body: "Exponential ease bias. (+)=ease weighted toward left, (−)=toward right. Blend strength follows slider."
      },
      {
        id: "blend_direction",
        icon: "fx_blend_direction",
        title: "Blend Direction",
        color: "#cd875f",
        demo: true,
        body: "Blend toward right (+) or left (−) end value; stronger near that side of the range."
      },
      {
        id: "scale_from_end",
        icon: "fx_scale_from_end",
        title: "Scale From End",
        color: "#9acd5f",
        demo: true,
        body: "Scale values around the right (+) or left (−) anchor. Grows/shrinks the move relative to that end."
      },
      {
        id: "uniform_to_end",
        icon: "fx_uniform_to_end",
        title: "Uniform To End",
        color: "#5fcda8",
        demo: true,
        body: "Same delta applied to all keys toward the right (+) or left (−) end value."
      },
      {
        id: "push_to_peak",
        icon: "fx_push_to_peak",
        title: "Push To Peak",
        color: "#e8a030",
        demo: true,
        body: "(+) Attract keys toward nearest peak/valley. (−) Straighten slopes between extrema."
      },
      {
        id: "blend_default",
        icon: "fx_blend_default",
        title: "Blend Default",
        color: "#7fcf7f",
        demo: true,
        body: "Blend toward channel default (0 for translate in the demo). Dial intensity down without deleting keys."
      },
      {
        id: "world_xform_blend",
        icon: "fx_world_xform_blend",
        title: "World Xform Blend",
        color: "#d58cff",
        demo: true,
        body: "Real tool blends via world matrices. Demo approximates a blend toward a calmer world-space chord / rest."
      },
      {
        id: "offset",
        icon: "fx_offset",
        title: "Offset",
        color: "#a87bff",
        demo: true,
        body: "Circularly rotates key VALUES along the selection (later ↔ earlier frames). Not a vertical value nudge."
      },
      {
        id: "infinity",
        icon: "fx_infinity",
        title: "Infinity",
        color: "#ff9f6e",
        demo: true,
        body: "(+) Follow previous key slope outward. (−) Follow next key slope. Extends continuation feel."
      },
      {
        id: "hierarchy_offset",
        icon: "fx_hierarchy_offset",
        title: "Hierarchy Offset",
        color: "#7fb5ff",
        demo: true,
        body: "Offsets value timing down the selection order (root → tip). Deeper objects shift more. Try Hierarchy presets."
      },
      {
        id: "hierarchy_offset_push_pull",
        icon: "fx_hierarchy_offset_push_pull",
        title: "Hierarchy Push / Pull",
        color: "#5fcdff",
        demo: true,
        body: "Push/pull strength scales by chain index. Root barely moves; tip exaggerates more. Use Hierarchy presets."
      },
      {
        id: "del_flat",
        icon: "delete_flat",
        title: "Del Flat",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Removes middle keys inside flat plateaus (same value as neighbors). Try Stepped flats preset, then click."
      },
      {
        id: "del_redundant",
        icon: "delete_redundant",
        title: "Del Redundant",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Removes keys that sit on the straight line between neighbors (shape-preserving). Try Redundant keys preset."
      },
      {
        id: "bake",
        icon: "bake",
        title: "Bake",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Samples every 1 frame across the range (dense keys). Try Sparse preset, then Bake."
      },
      {
        id: "snp",
        icon: "snap",
        title: "SNP (Smart Snap)",
        color: "#a0a0a0",
        kind: "button",
        demo: true,
        body: "Snaps off-frame keys to nearest integer frame. Try Off-frame keys preset."
      },
      {
        id: "shift",
        icon: "shift_left",
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
    what: "Moves keys that already exist while you transform an object. With Offseter on, moving, rotating or scaling in the viewport does not set a new key. It shifts the existing keys by the same amount. There is no window: it is a toggle.",
    when: [
      "Reposition a keyed section without re-keying it",
      "Shift a whole curve by a few units and keep every key",
      "Offset a range and let the change fade out into the rest of the animation"
    ],
    how: [
      "Click the Offseter button (timeline toolbar, radial menu or Viewport Bar). While it is active the button is green and blinks.",
      "Choose which keys move: highlight a range on the Time Slider, or select keys, or select nothing. See Which keys move.",
      "With a range, set the blend frames (MMB on the toolbar button, or the ring in the radial menu).",
      "Move, rotate or scale the object in the viewport. The keys shift by the same delta.",
      "Click the button again to switch Offseter off."
    ],
    sections: [
      {
        title: "Which keys move",
        text: "Offseter checks these in order and uses the first one that applies:",
        html:
          '<ol>' +
          '<li><strong>A range on the Time Slider</strong> (Shift+drag on the Time Slider). The range gets the full offset and the offset fades out over the blend frames on each side. This is the only case with a blend.</li>' +
          '<li><strong>Selected keys</strong> (in the Graph Editor or on the timeline). Only those keys move. No blend.</li>' +
          '<li><strong>Nothing selected.</strong> The whole curve moves.</li>' +
          '</ol>' +
          '<p>Offseter works on the objects you have selected. If you select other objects, they are tracked instead.</p>'
      },
      {
        title: "How each case looks",
        html:
          '<p>One channel before (dashed gray) and after (green) a viewport move. Yellow keys are the selected ones.</p>' +
          KB_FIG.offseterCasesHtml()
      },
      {
        title: "Range and blend on the Time Slider",
        html:
          '<p>While Offseter is on and a range exists, a translucent green overlay on the Time Slider shows what will move. The solid part is the plateau: those frames get the full offset. The ramps on each side are the blend: the offset fades to zero over N frames with a smooth (smoothstep) falloff. Thin lines mark the outer edges of the blend. With blend 0 there are no ramps and only the range moves.</p>' +
          KB_FIG.offseterTimeSliderHtml() +
          '<ul>' +
          '<li><strong>Anchor keys.</strong> Offseter adds shape-preserving keys at the start and end of the range and at start minus N and end plus N. It only does this inside the curve\'s existing keys and only where there is no key yet, so animation outside the blend window is not touched.</li>' +
          '<li><strong>The range is sticky.</strong> It survives Maya clearing the highlight when you select or manipulate something. It is dropped when you scrub the Time Slider. A new highlight replaces it.</li>' +
          '</ul>'
      },
      {
        title: "Setting the blend frames",
        html:
          '<ul>' +
          '<li><strong>MMB on the Offseter toolbar button.</strong> Opens the Offseter blend (frames) popup, shown in the Tool UI panel. Click a preset (0, 2, 4, 6, 8, 12, 16, 24; the current one is green) or type a number in the field and press Enter.</li>' +
          '<li><strong>Radial menu.</strong> Hover the Offseter slice. An outer ring shows 0f, 3f, 6f, 10f, 15f. Click one. This also switches Offseter on.</li>' +
          '</ul>' +
          '<div data-shot="RadialOffseterBlend" data-caption="Radial menu with the cursor on Offseter: the blend ring (0f, 3f, 6f, 10f, 15f) appears around the slice."></div>' +
          '<p>The toolbar button\'s tooltip shows the current value: &ldquo;Offseter &mdash; blend 6f (MMB to change)&rdquo;. The value is remembered between sessions. The Viewport Bar button toggles Offseter but has no blend popup.</p>'
      },
      {
        title: "Undo",
        text: "One drag is one undo step. Undo and redo do not apply the offset a second time."
      }
    ],
    tips: [
      "Switch Offseter off when you are done. While it is on, a viewport move shifts keys instead of setting one.",
      "For a soft edge, highlight the range first, then set the blend, then move the object.",
      "Blend only works with a Time Slider range. For selected keys use the Graph Editor to pick exactly which keys move."
    ]
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
      "Bake to Camera: bake into the space of a camera",
      "Baked Circles tabs: All, or one tab per space",
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
    what: "Draws the path of an object in the viewport, in world space or relative to a camera. Ticks, frame numbers, spacing heat and a gray past help you read arcs and spacing; path handles let you reshape the arc directly.",
    credit: "Built on the Agora Community motion trail, used as the base and then modified and improved for KeyBelt. It is not an Agora product and is not endorsed by Agora.",
    when: [
      "Checking arcs and spacing in the viewport",
      "Reading motion as the camera sees it (camera space)",
      "Reshaping an arc without digging through curves"
    ],
    how: [
      "Select an object and click the object chip (or turn on Follow selection).",
      "Press the power button to switch the trail on.",
      "Pick World or a camera in Space. Set colour and fade length.",
      "With Live on, the trail follows your edits. With Live off, press Update."
    ],
    controls: [
      "Power: trail on / off. Object chip: the tracked object. Magnet: follow selection",
      "Space: world or any camera. Colour swatch. Fade dots: fade length in frames",
      "Eye: show / hide the trail. Update / Live: rebuild now or follow edits",
      "Heat: spacing colours (blue tight, yellow average, red wide). HUD: 1-axis spacing view. Gray past: frames before the current time in gray",
      "Ticks / Numbers: click to cycle off, keys, every frame",
      "Handles: add, auto, delete, clear, show / hide and rebuild span on the path"
    ],
    scheme:
      '<svg viewBox="0 0 420 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif" font-size="10" fill="#e8e8e8">' +
      '<path d="M24 78 C60 30 110 22 150 40" fill="none" stroke="#7a7a7a" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M150 40 C190 58 210 76 250 70" fill="none" stroke="#5f87cd" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M250 70 C290 64 320 30 352 26" fill="none" stroke="#e8c547" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M352 26 C372 24 386 30 398 40" fill="none" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/>' +
      '<g fill="#f0f0f0"><circle cx="24" cy="78" r="3"/><circle cx="88" cy="32" r="3"/><circle cx="150" cy="40" r="3"/><circle cx="250" cy="70" r="3"/><circle cx="352" cy="26" r="3"/><circle cx="398" cy="40" r="3"/></g>' +
      '<g fill="#a0a0a0" text-anchor="middle"><text x="24" y="94">1</text><text x="88" y="22">8</text><text x="150" y="30">14</text><text x="250" y="88">22</text><text x="352" y="16">30</text><text x="398" y="56">34</text></g>' +
      '<circle cx="150" cy="40" r="7" fill="none" stroke="#f0f0f0" stroke-width="1.5"/>' +
      '<text x="14" y="106" fill="#7a7a7a">gray past</text><text x="200" y="106" fill="#5f87cd">tight</text><text x="296" y="106" fill="#e8c547">average</text><text x="372" y="106" fill="#E5484D">wide</text>' +
      "</svg>",
    schemeCaption: "Trail with key ticks, frame numbers, gray past and spacing heat"
  },











  Selector: {
    what: "A small always-on-top HUD strip of coloured selection sets. Click a chip to select its members; the colour dots filter which chips you see.",
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
      "+ : add a set with a colour",
      "Click a chip → select members",
      "Colour dots: show only the sets of that colour",
      "Grip on the left: drag to move the HUD",
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

  ViewportBar: {
    what: "A small floating bar drawn over the 3D view of every model panel. It holds the tools, sliders and buttons you use most, so you can reach them without leaving the viewport.",
    when: [
      "Want Offseter, Baker or a few Keys Editor sliders right where you are working",
      "Do not want to look down at the timeline toolbar while posing in the viewport"
    ],
    how: [
      "Turn it on: Settings, Radial & Viewport Bar, Show viewport bar (the radial menu also has a toggle).",
      "Drag the grip (the dots on the left edge) to put the bar where you want it. Double-click the grip to reset the position.",
      "Use it like the toolbar: click tool and action buttons, drag the sliders.",
      "Change what it holds in Settings, Radial & Viewport Bar, then Save."
    ],
    sections: [
      {
        title: "What it looks like",
        html:
          '<div data-shot="ViewportBar" data-w="640" data-caption="Hover: the bar at full opacity. The real widget, rendered offscreen over a stand-in viewport colour (not a Maya capture)."></div>' +
          '<div data-shot="ViewportBarIdle" data-w="640" data-caption="Idle: the same bar at the default idle opacity of 0.55."></div>'
      },
      {
        title: "Default items",
        html:
          '<ul>' +
          '<li><strong>Tools:</strong> Baker, Offseter, Reset All. Offseter turns green and blinks while it is active.</li>' +
          '<li><strong>Sliders:</strong> Interpolate, Push / Pull, World Xform Blend.</li>' +
          '<li><strong>Buttons:</strong> Bake, Smart snap, Shift (arrows with the frames field), Insert frames, Remove frames.</li>' +
          '</ul>' +
          '<p>Tool buttons behave like the ones in the timeline toolbar: a click launches the tool. The Offseter blend popup (MMB) is a timeline toolbar feature and is not on the Viewport Bar. Pick the blend in the radial menu or the toolbar.</p>'
      },
      {
        title: "Behaviour",
        items: [
          "Idle opacity is about 0.55. The bar goes to full opacity when the cursor is over it.",
          "Position is remembered per panel.",
          "The bar is hidden while Maya is not the active application and when the viewport is very small.",
          "It never takes keyboard focus, so your hotkeys keep working. The one exception is the frames field while you type in it.",
          "Sliders and buttons do the same as their toolbar versions."
        ]
      },
      {
        title: "Settings",
        text: "Settings, Radial & Viewport Bar has a Viewport Bar section:",
        items: [
          "Show viewport bar: on / off.",
          "The item list: add tools (double-click or drag from the tool palette), add sliders and buttons from the drop-downs, reorder with drag or Up / Down, Remove deletes the selected row.",
          "Idle opacity and Hover opacity sliders.",
          "Reset to defaults. Nothing is applied until you press Save."
        ]
      }
    ],
    tips: [
      "Keep the bar short: it floats over your picture. Three or four sliders and the buttons you press daily are enough.",
      "Not on the bar: Invert. Add it to the timeline or Graph Editor toolbar instead."
    ]
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
        title: "Toolbars page",
        text: "Three parts, top to bottom:",
        items: [
          "Toolbar Tools: which tools show on the timeline toolbar, their order and their colour category.",
          "Graph Editor Toolbar: Enable Graph Editor toolbar attaches the KeyBelt toolbar to the Graph Editor.",
          "Keys Action Buttons: one list of the Keys Editor buttons (delete redundant, delete flat, bake, smart snap, Euler filter, tangents, invert, shift). Each row has a Timeline and a Graph Editor toggle, so a button can be on both toolbars, one, or neither. Drag rows to set the Graph Editor order; the timeline toolbar keeps a fixed order."
        ],
        after: "The buttons are described under Keys Editor. The Viewport Bar has its own item list on the Radial & Viewport Bar page."
      },
      {
        title: "Radial & Viewport Bar page",
        text: "One shared tool palette feeds both. Drag a tool onto a radial wheel slice or into the viewport bar list. The Viewport Bar section has the on / off checkbox, the item list, and idle and hover opacity. Edits are pending until Save."
      },
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
