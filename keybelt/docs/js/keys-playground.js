/* Keys Editor UI mock + playground — effect math mirrors KeysEditor.py */
window.KeysPlayground = (function () {
  "use strict";

  var ROWS = [
    { id: "smooth", label: "S", title: "Smooth", color: "#5f87cd", demo: true, range: [0, 100] },
    { id: "push_pull", label: "PP", title: "Push / Pull", color: "#cd5f5f", demo: true, range: [-100, 100] },
    { id: "interpolate", label: "I", title: "Interpolate", color: "#5fcd87", demo: true, range: [-100, 100] },
    { id: "wave", label: "WN", title: "Wave / Noise", color: "#cd87cd", demo: true, range: [-100, 100], wave: true },
    { id: "offset", label: "OF", title: "Offset", color: "#a87bff", demo: true, range: [-100, 100] },
    { id: "infinity", label: "INF", title: "Infinity", color: "#ff9f6e", demo: true, range: [-100, 100] },
    { id: "hierarchy_offset", label: "HOF", title: "Hierarchy Offset", color: "#7fb5ff", demo: true, range: [-200, 200], multi: true },
    { id: "hierarchy_offset_push_pull", label: "HPP", title: "Hierarchy Push / Pull", color: "#5fcdff", demo: true, range: [-200, 200], multi: true },
    { id: "ease", label: "EL", title: "Ease Linear", color: "#cdcd5f", demo: true, range: [-100, 100] },
    { id: "directional_ease", label: "DE", title: "Directional Ease", color: "#87cdcd", demo: true, range: [-100, 100] },
    { id: "blend_direction", label: "BD", title: "Blend Direction", color: "#cd875f", demo: true, range: [-100, 100] },
    { id: "scale_from_end", label: "SE", title: "Scale From End", color: "#9acd5f", demo: true, range: [-100, 100] },
    { id: "uniform_to_end", label: "UE", title: "Uniform To End", color: "#5fcda8", demo: true, range: [-100, 100] },
    { id: "blend_default", label: "DF", title: "Blend Default", color: "#7fcf7f", demo: true, range: [0, 100] },
    { id: "push_to_peak", label: "PK", title: "Push To Peak", color: "#e8a030", demo: true, range: [-100, 100] },
    { id: "world_xform_blend", label: "WX", title: "World Xform Blend", color: "#d58cff", demo: true, range: [-100, 100] }
  ];

  var PRESETS = {
    bump: {
      label: "Bump (1 curve)",
      curves: [{ name: "ctrl.translateY", color: "#5f87cd", times: [0, 4, 8, 12, 16, 20, 24, 28], values: [0, 2, 6, 10, 7, 3, 1, 0] }]
    },
    arc: {
      label: "Arc (1 curve)",
      curves: [{ name: "ctrl.rotateZ", color: "#cd5f5f", times: [0, 5, 10, 15, 20, 25, 30], values: [0, 12, 28, 40, 32, 14, 2] }]
    },
    noisy: {
      label: "Noisy (1 curve)",
      curves: [{ name: "ctrl.translateX", color: "#cd87cd", times: [0, 3, 6, 9, 12, 15, 18, 21, 24], values: [0, 4, 2, 8, 5, 9, 3, 7, 1] }]
    },
    step: {
      label: "Stepped flats (Del Flat)",
      curves: [{ name: "ctrl.translateY", color: "#5fcd87", times: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], values: [0, 0, 0, 0, 5, 5, 5, 5, 10, 10, 10, 10] }]
    },
    redundant: {
      label: "Redundant keys (Del Redundant)",
      curves: [{ name: "ctrl.translateY", color: "#e8a030", times: [0, 2, 4, 6, 8, 10, 12, 14, 16], values: [0, 2.5, 5, 7.5, 10, 7.5, 5, 2.5, 0] }]
    },
    offframe: {
      label: "Off-frame keys (SNP)",
      curves: [{ name: "ctrl.translateY", color: "#a87bff", times: [0, 3.4, 7.2, 11.6, 16.1, 20.8, 24], values: [0, 4, 9, 11, 7, 3, 0] }]
    },
    sparse: {
      label: "Sparse (Bake)",
      curves: [{ name: "ctrl.translateY", color: "#4EC9B0", times: [0, 8, 16, 24], values: [0, 10, 4, 0] }]
    },
    hierarchy: {
      label: "Hierarchy ×3 (HOF / HPP)",
      multi: true,
      curves: [
        { name: "root.translateY", color: "#7fb5ff", times: [0, 4, 8, 12, 16, 20, 24, 28], values: [0, 3, 8, 10, 8, 4, 1, 0] },
        { name: "mid.translateY", color: "#5fcdff", times: [0, 4, 8, 12, 16, 20, 24, 28], values: [0, 3, 8, 10, 8, 4, 1, 0] },
        { name: "tip.translateY", color: "#d58cff", times: [0, 4, 8, 12, 16, 20, 24, 28], values: [0, 3, 8, 10, 8, 4, 1, 0] }
      ]
    },
    hierarchy_stagger: {
      label: "Hierarchy staggered",
      multi: true,
      curves: [
        { name: "spine1.ry", color: "#7fb5ff", times: [0, 5, 10, 15, 20, 25, 30], values: [0, 8, 18, 22, 16, 6, 0] },
        { name: "spine2.ry", color: "#5fcdff", times: [0, 5, 10, 15, 20, 25, 30], values: [0, 6, 14, 20, 14, 5, 0] },
        { name: "spine3.ry", color: "#d58cff", times: [0, 5, 10, 15, 20, 25, 30], values: [0, 4, 10, 16, 12, 4, 0] }
      ]
    }
  };

  var CARD_TO_ROW = {
    smooth: "smooth",
    push_pull: "push_pull",
    interpolate: "interpolate",
    wave_noise: "wave",
    ease_linear: "ease",
    directional_ease: "directional_ease",
    blend_direction: "blend_direction",
    scale_from_end: "scale_from_end",
    uniform_to_end: "uniform_to_end",
    push_to_peak: "push_to_peak",
    blend_default: "blend_default",
    world_xform_blend: "world_xform_blend",
    offset: "offset",
    infinity: "infinity",
    hierarchy_offset: "hierarchy_offset",
    hierarchy_offset_push_pull: "hierarchy_offset_push_pull",
    del_flat: "_btn_del_flat",
    del_redundant: "_btn_del_redundant",
    bake: "_btn_bake",
    snp: "_btn_snp",
    shift: "_btn_shift"
  };

  var HINTS = {
    smooth: "Smooth: soften neighbors (Gaussian).",
    push_pull: "Push (+): exaggerate vs linear chord. Pull (−): squash toward chord.",
    interpolate: "I (+): blend toward RIGHT end. I (−): toward LEFT end.",
    wave: "WN (+): sine. WN (−): noise. F / A tune freq & amp.",
    offset: "OF: rotate key values along the curve (circular shift).",
    infinity: "INF (+): follow previous slope outward. INF (−): follow next slope.",
    ease: "EL (+): ease toward ends. EL (−): blend toward linear chord.",
    directional_ease: "DE: exponential ease bias — (+) left-weighted, (−) right-weighted.",
    blend_direction: "BD: blend toward right (+) or left (−) end, stronger near that side.",
    scale_from_end: "SE: scale around right (+) or left (−) anchor.",
    uniform_to_end: "UE: same delta for all keys toward right (+) or left (−) end.",
    blend_default: "DF: blend toward channel default (0 for translate demo).",
    push_to_peak: "PK (+): toward peaks/valleys. PK (−): straighten between extrema.",
    world_xform_blend: "WX (approx): blend toward rest/world zero — real tool uses world matrices.",
    hierarchy_offset: "HOF: deeper curves shift values further (Hierarchy preset).",
    hierarchy_offset_push_pull: "HPP: push/pull strength grows down the chain."
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function copyCurve(c) {
    return { name: c.name, color: c.color, times: c.times.slice(), values: c.values.slice() };
  }
  function copyPreset(key) {
    var p = PRESETS[key];
    return { label: p.label, multi: !!p.multi, curves: p.curves.map(copyCurve) };
  }
  function findRow(id) {
    for (var i = 0; i < ROWS.length; i++) if (ROWS[i].id === id) return ROWS[i];
    return null;
  }
  function interpAt(times, values, t) {
    if (!times.length) return 0;
    if (t <= times[0]) return values[0];
    if (t >= times[times.length - 1]) return values[values.length - 1];
    for (var i = 0; i < times.length - 1; i++) {
      if (t >= times[i] && t <= times[i + 1]) {
        var u = (t - times[i]) / (times[i + 1] - times[i] || 1);
        return lerp(values[i], values[i + 1], u);
      }
    }
    return values[values.length - 1];
  }

  /* —— Slider effects —— */
  function gaussianSmooth(values) {
    var out = values.slice();
    var next = values.slice();
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 1; i < values.length - 1; i++) {
        next[i] = out[i - 1] * 0.25 + out[i] * 0.5 + out[i + 1] * 0.25;
      }
      out = next.slice();
    }
    return out;
  }

  function applySmooth(curve, amount) {
    var r = Math.abs(amount) / 100;
    if (r < 0.01) return curve.values.slice();
    var sm = gaussianSmooth(curve.values);
    return curve.values.map(function (v, i) {
      return lerp(v, sm[i], r);
    });
  }

  function applyPushPull(curve, amount) {
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    if (n < 3) return vals.slice();
    var leftV = vals[0];
    var rightV = vals[n - 1];
    var totalT = times[n - 1] - times[0];
    var pushAmt = amount / 100;
    var out = vals.slice();
    for (var i = 1; i < n - 1; i++) {
      var ratio = totalT !== 0 ? (times[i] - times[0]) / totalT : 0.5;
      var linear = leftV + (rightV - leftV) * ratio;
      var diff = vals[i] - linear;
      out[i] = pushAmt >= 0 ? linear + diff * (1 + pushAmt * 2) : linear + diff * (1 + pushAmt);
    }
    return out;
  }

  function applyInterpolate(curve, amount) {
    var vals = curve.values;
    var n = vals.length;
    if (n < 2) return vals.slice();
    var leftV = vals[0];
    var rightV = vals[n - 1];
    var out = vals.slice();
    if (amount >= 0) {
      var blendR = amount / 100;
      for (var i = 0; i < n - 1; i++) out[i] = vals[i] * (1 - blendR) + rightV * blendR;
    } else {
      var blendL = -amount / 100;
      for (var j = 1; j < n; j++) out[j] = vals[j] * (1 - blendL) + leftV * blendL;
    }
    return out;
  }

  function applyEase(curve, amount) {
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    if (n < 3) return vals.slice();
    var leftV = vals[0];
    var rightV = vals[n - 1];
    var totalT = times[n - 1] - times[0];
    var out = vals.slice();
    for (var i = 1; i < n - 1; i++) {
      var timeRatio = totalT !== 0 ? (times[i] - times[0]) / totalT : 0.5;
      if (amount >= 0) {
        var easeRatio = timeRatio;
        for (var p = 0; p < 3; p++) easeRatio = easeRatio * easeRatio * (3 - 2 * easeRatio);
        var blend = Math.pow(amount / 100, 0.5);
        out[i] = vals[i] * (1 - blend) + (leftV + (rightV - leftV) * easeRatio) * blend;
      } else {
        var blendL = Math.pow(-amount / 100, 2);
        var linear = leftV + (rightV - leftV) * timeRatio;
        out[i] = vals[i] * (1 - blendL) + linear * blendL;
      }
    }
    return out;
  }

  function applyDirectionalEase(curve, amount) {
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    if (n < 3 || amount === 0) return vals.slice();
    var leftV = vals[0];
    var rightV = vals[n - 1];
    var totalT = times[n - 1] - times[0];
    var strength = Math.abs(amount) / 100;
    var power = 2 + strength * 3;
    var out = vals.slice();
    for (var i = 1; i < n - 1; i++) {
      var timeRatio = totalT !== 0 ? (times[i] - times[0]) / totalT : 0.5;
      var easeRatio = amount < 0 ? Math.pow(timeRatio, power) : 1 - Math.pow(1 - timeRatio, power);
      var eased = leftV + (rightV - leftV) * easeRatio;
      out[i] = vals[i] * (1 - strength) + eased * strength;
    }
    return out;
  }

  function applyBlendDirection(curve, amount) {
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    if (n < 3 || amount === 0) return vals.slice();
    var leftV = vals[0];
    var rightV = vals[n - 1];
    var totalT = times[n - 1] - times[0];
    var target = amount >= 0 ? rightV : leftV;
    var out = vals.slice();
    for (var i = 1; i < n - 1; i++) {
      var pos = totalT !== 0 ? (times[i] - times[0]) / totalT : 0.5;
      var blendStrength = amount >= 0 ? pos : 1 - pos;
      blendStrength = Math.pow(blendStrength, 2);
      var blendAmount = (Math.abs(amount) / 100) * blendStrength;
      out[i] = vals[i] * (1 - blendAmount) + target * blendAmount;
    }
    return out;
  }

  function applyScaleFromEnd(curve, amount) {
    var vals = curve.values;
    var n = vals.length;
    if (n < 2 || amount === 0) return vals.slice();
    var strength = Math.min(Math.abs(amount) / 100, 1);
    var scale = 1 + strength;
    var anchor = amount < 0 ? vals[0] : vals[n - 1];
    var out = vals.slice();
    for (var i = 0; i < n; i++) {
      if ((amount < 0 && i === 0) || (amount >= 0 && i === n - 1)) continue;
      var scaled = anchor + (vals[i] - anchor) * scale;
      out[i] = vals[i] * (1 - strength) + scaled * strength;
    }
    return out;
  }

  function applyUniformToEnd(curve, amount) {
    var vals = curve.values;
    var n = vals.length;
    if (n < 2 || amount === 0) return vals.slice();
    var strength = Math.min(Math.abs(amount) / 100, 1);
    var target = amount < 0 ? vals[0] : vals[n - 1];
    var boundary = amount < 0 ? vals[0] : vals[n - 1];
    // In real tool boundary is first/last of selection vs neighbor; here ends are anchors
    // Use opposite end as the edge being pulled when selecting whole curve:
    boundary = amount < 0 ? vals[n - 1] : vals[0];
    var delta = (target - boundary) * strength;
    return vals.map(function (v) {
      return v + delta;
    });
  }

  function applyBlendDefault(curve, amount) {
    var strength = Math.min(Math.abs(amount) / 100, 1);
    if (strength < 0.01) return curve.values.slice();
    var def = 0; // translate default
    return curve.values.map(function (v) {
      return v * (1 - strength) + def * strength;
    });
  }

  function applyWorldXform(curve, amount) {
    // Approx: real WX uses world matrices; demo blends toward rest + slight chord
    var strength = Math.min(Math.abs(amount) / 100, 1);
    if (strength < 0.01) return curve.values.slice();
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    var leftV = vals[0];
    var rightV = vals[n - 1];
    var totalT = times[n - 1] - times[0];
    var out = vals.slice();
    for (var i = 0; i < n; i++) {
      var ratio = totalT !== 0 ? (times[i] - times[0]) / totalT : 0.5;
      var worldish = (leftV + (rightV - leftV) * ratio) * 0.35;
      out[i] = vals[i] * (1 - strength) + worldish * strength;
    }
    return out;
  }

  function applyWave(curve, amount, freq, amp) {
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    if (n < 2 || amount === 0) return vals.slice();
    var t0 = times[0];
    var span = times[n - 1] - t0 || 1;
    var vmin = Math.min.apply(null, vals);
    var vmax = Math.max.apply(null, vals);
    var valueSpan = vmax - vmin || 1;
    var strength = (Math.abs(amount) / 100) * valueSpan * (amp || 1) * 0.5;
    var f = Math.max(freq || 2.5, 0.01);
    var out = vals.slice();
    var isNoise = amount < 0;
    for (var i = 0; i < n; i++) {
      var u = (times[i] - t0) / span;
      var wave;
      if (isNoise) {
        var s = Math.sin((u * 12.9898 + i * 78.233) * 43758.5453);
        wave = (s - Math.floor(s)) * 2 - 1;
      } else {
        wave = Math.sin(u * Math.PI * 2 * f);
      }
      out[i] = vals[i] + wave * strength;
    }
    return out;
  }

  function applyOffset(curve, amount) {
    var vals = curve.values;
    var n = vals.length;
    if (n < 2) return vals.slice();
    var steps = Math.round((amount / 100) * Math.max(1, Math.floor(n / 2)));
    if (steps === 0) return vals.slice();
    var shift = Math.abs(steps) % n;
    if (shift === 0) return vals.slice();
    return steps > 0
      ? vals.slice(n - shift).concat(vals.slice(0, n - shift))
      : vals.slice(shift).concat(vals.slice(0, shift));
  }

  function rotateValuesFractional(values, shiftAmount) {
    var length = values.length;
    if (length < 2) return values.slice();
    var result = [];
    for (var i = 0; i < length; i++) {
      var src = (i - shiftAmount) % length;
      if (src < 0) src += length;
      var low = Math.floor(src);
      var high = (low + 1) % length;
      var frac = src - low;
      result.push(values[low] * (1 - frac) + values[high] * frac);
    }
    return result;
  }

  function applyHierarchyOffset(curve, amount, objIndex) {
    var shiftAmount = (amount / 100) * objIndex;
    if (Math.abs(shiftAmount) < 0.01) return curve.values.slice();
    return rotateValuesFractional(curve.values, shiftAmount);
  }

  function applyHierarchyPushPull(curve, amount, objIndex) {
    var chain = (amount / 100) * objIndex;
    if (Math.abs(chain) < 0.01) return curve.values.slice();
    return applyPushPull(curve, clamp(chain * 50, -100, 100));
  }

  function applyPushToPeak(curve, amount) {
    var vals = curve.values;
    var n = vals.length;
    if (n < 3 || amount === 0) return vals.slice();
    var extrema = [];
    for (var i = 0; i < n; i++) {
      var isMax = (i === 0 || vals[i] >= vals[i - 1]) && (i === n - 1 || vals[i] >= vals[i + 1]);
      var isMin = (i === 0 || vals[i] <= vals[i - 1]) && (i === n - 1 || vals[i] <= vals[i + 1]);
      if (isMax || isMin) extrema.push(i);
    }
    if (!extrema.length) extrema = [0, n - 1];
    var blend = Math.min(Math.abs(amount) / 100, 1);
    var towardLinear = amount < 0;
    var out = vals.slice();
    for (var k = 0; k < n; k++) {
      var nearest = extrema[0];
      var best = Math.abs(k - nearest);
      for (var e = 1; e < extrema.length; e++) {
        var d = Math.abs(k - extrema[e]);
        if (d < best) {
          best = d;
          nearest = extrema[e];
        }
      }
      if (towardLinear) {
        var ei = extrema.indexOf(nearest);
        var leftE = extrema[Math.max(0, ei - 1)];
        var rightE = extrema[Math.min(extrema.length - 1, ei + 1)];
        if (k === nearest) continue;
        var span = rightE - leftE || 1;
        out[k] = lerp(vals[k], lerp(vals[leftE], vals[rightE], (k - leftE) / span), blend * 0.85);
      } else {
        out[k] = lerp(vals[k], vals[nearest], blend * (1 - best / Math.max(n - 1, 1)));
      }
    }
    return out;
  }

  function applyInfinity(curve, amount) {
    var vals = curve.values;
    var times = curve.times;
    var n = vals.length;
    if (n < 3 || amount === 0) return vals.slice();
    var strength = Math.min(Math.abs(amount) / 100, 1);
    var out = vals.slice();
    if (amount > 0) {
      // follow previous slope from start
      var slope = (vals[1] - vals[0]) / (times[1] - times[0] || 1);
      for (var i = 1; i < n; i++) {
        var predicted = vals[0] + slope * (times[i] - times[0]);
        out[i] = vals[i] * (1 - strength) + predicted * strength;
      }
    } else {
      var slopeR = (vals[n - 1] - vals[n - 2]) / (times[n - 1] - times[n - 2] || 1);
      for (var j = 0; j < n - 1; j++) {
        var predictedR = vals[n - 1] + slopeR * (times[j] - times[n - 1]);
        out[j] = vals[j] * (1 - strength) + predictedR * strength;
      }
    }
    return out;
  }

  function applyEffectToCurve(curve, effect, amount, freq, amp, objIndex) {
    switch (effect) {
      case "smooth":
        return applySmooth(curve, amount);
      case "push_pull":
        return applyPushPull(curve, amount);
      case "interpolate":
        return applyInterpolate(curve, amount);
      case "ease":
        return applyEase(curve, amount);
      case "directional_ease":
        return applyDirectionalEase(curve, amount);
      case "blend_direction":
        return applyBlendDirection(curve, amount);
      case "scale_from_end":
        return applyScaleFromEnd(curve, amount);
      case "uniform_to_end":
        return applyUniformToEnd(curve, amount);
      case "blend_default":
        return applyBlendDefault(curve, amount);
      case "world_xform_blend":
        return applyWorldXform(curve, amount);
      case "wave":
        return applyWave(curve, amount, freq, amp);
      case "offset":
        return applyOffset(curve, amount);
      case "infinity":
        return applyInfinity(curve, amount);
      case "hierarchy_offset":
        return applyHierarchyOffset(curve, amount, objIndex || 0);
      case "hierarchy_offset_push_pull":
        return applyHierarchyPushPull(curve, amount, objIndex || 0);
      case "push_to_peak":
        return applyPushToPeak(curve, amount);
      default:
        return curve.values.slice();
    }
  }

  /* —— Button ops (mutate curves) —— */
  function opDelFlat(curves) {
    return curves.map(function (c) {
      var times = [];
      var values = [];
      for (var i = 0; i < c.values.length; i++) {
        var keep = true;
        if (i > 0 && i < c.values.length - 1) {
          if (
            Math.abs(c.values[i] - c.values[i - 1]) < 1e-6 &&
            Math.abs(c.values[i] - c.values[i + 1]) < 1e-6
          ) {
            keep = false;
          }
        }
        if (keep) {
          times.push(c.times[i]);
          values.push(c.values[i]);
        }
      }
      return { name: c.name, color: c.color, times: times, values: values };
    });
  }

  function opDelRedundant(curves) {
    return curves.map(function (c) {
      var times = [c.times[0]];
      var values = [c.values[0]];
      for (var i = 1; i < c.values.length - 1; i++) {
        var t0 = c.times[i - 1];
        var t1 = c.times[i + 1];
        var expected = lerp(c.values[i - 1], c.values[i + 1], (c.times[i] - t0) / (t1 - t0 || 1));
        var amp = Math.abs(c.values[i + 1] - c.values[i - 1]) || 1;
        if (Math.abs(c.values[i] - expected) > Math.max(0.001, amp * 0.03)) {
          times.push(c.times[i]);
          values.push(c.values[i]);
        }
      }
      times.push(c.times[c.times.length - 1]);
      values.push(c.values[c.values.length - 1]);
      return { name: c.name, color: c.color, times: times, values: values };
    });
  }

  function opBake(curves) {
    return curves.map(function (c) {
      var t0 = Math.ceil(c.times[0]);
      var t1 = Math.floor(c.times[c.times.length - 1]);
      var times = [];
      var values = [];
      for (var t = t0; t <= t1; t++) {
        times.push(t);
        values.push(interpAt(c.times, c.values, t));
      }
      if (!times.length) return copyCurve(c);
      return { name: c.name, color: c.color, times: times, values: values };
    });
  }

  function opSmartSnap(curves) {
    return curves.map(function (c) {
      var map = {};
      for (var i = 0; i < c.times.length; i++) {
        var tf = Math.round(c.times[i]);
        // keep value sampled at integer from original curve feel
        var v = Math.abs(c.times[i] - tf) < 1e-4 ? c.values[i] : interpAt(c.times, c.values, tf);
        map[tf] = v;
      }
      var times = Object.keys(map)
        .map(Number)
        .sort(function (a, b) {
          return a - b;
        });
      return {
        name: c.name,
        color: c.color,
        times: times,
        values: times.map(function (t) {
          return map[t];
        })
      };
    });
  }

  function opShift(curves, frames) {
    return curves.map(function (c) {
      return {
        name: c.name,
        color: c.color,
        times: c.times.map(function (t) {
          return t + frames;
        }),
        values: c.values.slice()
      };
    });
  }

  function mount(root) {
    if (!root) return null;

    var state = {
      effect: "smooth",
      amount: 40,
      freq: 2.5,
      amp: 1,
      preset: "bump",
      baseline: copyPreset("bump"),
      amounts: {},
      status: ""
    };
    ROWS.forEach(function (r) {
      state.amounts[r.id] = 0;
    });
    state.amounts.smooth = 40;

    var rowsHtml = ROWS.map(function (r) {
      return (
        '<div class="ke-ui-row ke-ui-demo" data-effect="' +
        r.id +
        '" style="--row-color:' +
        r.color +
        '" title="' +
        r.title +
        '">' +
        '<span class="ke-ui-lab">' +
        r.label +
        "</span>" +
        '<input type="range" class="ke-ui-range" data-effect="' +
        r.id +
        '" min="' +
        r.range[0] +
        '" max="' +
        r.range[1] +
        '" value="' +
        (r.id === "smooth" ? 40 : 0) +
        '" />' +
        "</div>" +
        (r.wave
          ? '<div class="ke-ui-wave" id="keWaveFields">' +
            '<label>F <input type="number" id="keFreqNum" min="1" max="8" step="0.5" value="2.5" /></label>' +
            '<label>A <input type="number" id="keAmpNum" min="0" max="5" step="0.1" value="1" /></label>' +
            "</div>"
          : "")
      );
    }).join("");

    var presetOpts = Object.keys(PRESETS)
      .map(function (k) {
        return (
          '<option value="' +
          k +
          '"' +
          (k === "bump" ? " selected" : "") +
          ">" +
          PRESETS[k].label +
          "</option>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="ke-ui-panel">' +
      '<div class="ke-ui-titlebar"><strong>Keys Editor</strong><span class="ke-ui-demo-tag">UI + demo</span></div>' +
      '<div class="ke-ui-btns">' +
      '<button type="button" class="ke-ui-btn ke-ui-btn-live" data-action="del_flat" title="Remove flat middle keys">Del Flat</button>' +
      '<button type="button" class="ke-ui-btn ke-ui-btn-live" data-action="del_redundant" title="Remove collinear redundant keys">Del Redundant</button>' +
      '<button type="button" class="ke-ui-btn ke-ui-btn-live" data-action="bake" title="Bake sample every 1 frame">Bake</button>' +
      '<button type="button" class="ke-ui-btn ke-ui-btn-live" data-action="snp" title="Snap off-frame keys to integers">SNP</button>' +
      '<button type="button" class="ke-ui-btn ke-ui-btn-sm ke-ui-btn-live" data-action="shift_left">−</button>' +
      '<input type="number" class="ke-ui-spin" id="keShiftN" value="1" min="1" max="100" />' +
      '<button type="button" class="ke-ui-btn ke-ui-btn-sm ke-ui-btn-live" data-action="shift_right">+</button>' +
      "</div>" +
      '<div class="ke-ge">' +
      '<div class="ke-ge-head"><span>Graph preview</span><select id="kePreset">' +
      presetOpts +
      "</select></div>" +
      '<canvas id="keCanvas" width="560" height="220" aria-label="Curve preview"></canvas>' +
      '<div class="ke-legend" id="keLegend"></div>' +
      '<p class="ke-hint-line" id="keEffectHint"></p>' +
      '<p class="ke-status" id="keStatus"></p>' +
      "</div>" +
      '<div class="ke-ui-active" id="keActiveLabel">Active: Smooth</div>' +
      '<div class="ke-ui-sliders">' +
      rowsHtml +
      "</div>" +
      '<p class="ke-note">All sliders interactive. Buttons mutate the graph (try Stepped / Redundant / Off-frame / Sparse presets). Double-click slider → reset.</p>' +
      "</div>";

    var canvas = root.querySelector("#keCanvas");
    var ctx = canvas.getContext("2d");
    var activeLabel = root.querySelector("#keActiveLabel");
    var waveFields = root.querySelector("#keWaveFields");
    var presetEl = root.querySelector("#kePreset");
    var legendEl = root.querySelector("#keLegend");
    var hintEl = root.querySelector("#keEffectHint");
    var statusEl = root.querySelector("#keStatus");
    var shiftSpin = root.querySelector("#keShiftN");

    function setStatus(msg) {
      state.status = msg || "";
      statusEl.textContent = state.status;
    }

    function resetSliderAmounts() {
      ROWS.forEach(function (r) {
        state.amounts[r.id] = 0;
      });
      var ranges = root.querySelectorAll(".ke-ui-range");
      for (var i = 0; i < ranges.length; i++) ranges[i].value = "0";
      state.amount = 0;
    }

    function commitCurves(curves, msg) {
      state.baseline.curves = curves.map(copyCurve);
      resetSliderAmounts();
      setStatus(msg);
      draw();
    }

    function editedCurves() {
      return state.baseline.curves.map(function (c, idx) {
        return {
          name: c.name,
          color: c.color,
          times: c.times.slice(),
          values: applyEffectToCurve(c, state.effect, state.amount, state.freq, state.amp, idx),
          original: c.values,
          originalTimes: c.times
        };
      });
    }

    function bounds(curves) {
      var tMin = Infinity,
        tMax = -Infinity,
        vMin = Infinity,
        vMax = -Infinity;
      curves.forEach(function (c) {
        c.times.forEach(function (t) {
          tMin = Math.min(tMin, t);
          tMax = Math.max(tMax, t);
        });
        (c.originalTimes || c.times).forEach(function (t) {
          tMin = Math.min(tMin, t);
          tMax = Math.max(tMax, t);
        });
        c.values.concat(c.original || []).forEach(function (v) {
          vMin = Math.min(vMin, v);
          vMax = Math.max(vMax, v);
        });
      });
      if (!isFinite(tMin)) {
        tMin = 0;
        tMax = 1;
      }
      if (vMax === vMin) {
        vMin -= 1;
        vMax += 1;
      }
      var pad = (vMax - vMin) * 0.12;
      return { tMin: tMin, tMax: tMax, vMin: vMin - pad, vMax: vMax + pad };
    }

    function draw() {
      var w = canvas.width;
      var h = canvas.height;
      var padL = 36,
        padR = 12,
        padT = 14,
        padB = 28;
      var curves = editedCurves();
      var b = bounds(curves);
      var row = findRow(state.effect);
      var activeColor = row ? row.color : "#5f87cd";

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, w, h);

      function xOf(t) {
        return padL + ((t - b.tMin) / (b.tMax - b.tMin || 1)) * (w - padL - padR);
      }
      function yOf(v) {
        return padT + (1 - (v - b.vMin) / (b.vMax - b.vMin || 1)) * (h - padT - padB);
      }

      ctx.font = "10px Segoe UI, sans-serif";
      ctx.lineWidth = 1;
      for (var g = 0; g <= 4; g++) {
        var vv = b.vMin + ((b.vMax - b.vMin) * g) / 4;
        var gy = yOf(vv);
        ctx.strokeStyle = "#2e2e2e";
        ctx.beginPath();
        ctx.moveTo(padL, gy);
        ctx.lineTo(w - padR, gy);
        ctx.stroke();
        ctx.fillStyle = "#888";
        ctx.textAlign = "right";
        ctx.fillText(vv.toFixed(1), padL - 4, gy + 3);
      }
      for (var tg = 0; tg <= 4; tg++) {
        var tt = b.tMin + ((b.tMax - b.tMin) * tg) / 4;
        var gx = xOf(tt);
        ctx.strokeStyle = "#2e2e2e";
        ctx.beginPath();
        ctx.moveTo(gx, padT);
        ctx.lineTo(gx, h - padB);
        ctx.stroke();
        ctx.fillStyle = "#888";
        ctx.textAlign = "center";
        ctx.fillText(String(Math.round(tt * 10) / 10) + "f", gx, h - 8);
      }

      function pathFor(times, values, stroke, width, dash) {
        if (!times.length) return;
        ctx.beginPath();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.setLineDash(dash || []);
        for (var i = 0; i < times.length; i++) {
          var x = xOf(times[i]);
          var y = yOf(values[i]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        for (var j = 0; j < times.length; j++) {
          var px = xOf(times[j]);
          var py = yOf(values[j]);
          ctx.beginPath();
          ctx.fillStyle = stroke;
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#c8c8c8";
          ctx.font = "9px Segoe UI, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(values[j].toFixed(1), px + 5, py - 5);
        }
      }

      curves.forEach(function (c) {
        pathFor(c.originalTimes || c.times, c.original, "#555", 1.4, [3, 3]);
        pathFor(c.times, c.values, c.color, 2.2);
      });

      ctx.fillStyle = activeColor;
      ctx.fillRect(0, 0, 3, h);

      legendEl.innerHTML =
        curves
          .map(function (c) {
            return (
              '<span class="ke-leg-item"><span class="ke-leg" style="background:' +
              c.color +
              '"></span>' +
              c.name +
              " (" +
              c.times.length +
              "k)</span>"
            );
          })
          .join("") +
        '<span class="ke-leg-item"><span class="ke-leg ke-leg-orig"></span> baseline</span>';

      hintEl.textContent = HINTS[state.effect] || "";
      hintEl.style.borderColor = activeColor;
    }

    function setActive(effectId) {
      state.effect = effectId;
      var row = findRow(effectId);
      activeLabel.textContent = "Active: " + (row ? row.title : effectId);
      activeLabel.style.borderColor = row ? row.color : "#5f87cd";
      var rows = root.querySelectorAll(".ke-ui-row");
      for (var i = 0; i < rows.length; i++) {
        rows[i].classList.toggle("active", rows[i].getAttribute("data-effect") === effectId);
      }
      if (waveFields) {
        if (effectId === "wave") waveFields.classList.add("open");
        else waveFields.classList.remove("open");
      }
      if (row && row.multi && !state.baseline.multi) {
        state.preset = "hierarchy";
        state.baseline = copyPreset("hierarchy");
        presetEl.value = "hierarchy";
      }
      state.amount = state.amounts[effectId] || 0;
      draw();
    }

    root.querySelectorAll(".ke-ui-row").forEach(function (el) {
      el.addEventListener("click", function () {
        setActive(el.getAttribute("data-effect"));
      });
    });

    root.querySelectorAll(".ke-ui-range").forEach(function (input) {
      var id = input.getAttribute("data-effect");
      input.addEventListener("input", function () {
        state.amounts[id] = parseInt(input.value, 10) || 0;
        setActive(id);
        state.amount = state.amounts[id];
        draw();
      });
      input.addEventListener("dblclick", function (ev) {
        ev.preventDefault();
        input.value = "0";
        state.amounts[id] = 0;
        setActive(id);
        state.amount = 0;
        draw();
      });
    });

    presetEl.addEventListener("change", function () {
      state.preset = presetEl.value;
      state.baseline = copyPreset(state.preset);
      resetSliderAmounts();
      setStatus("Loaded preset: " + PRESETS[state.preset].label);
      draw();
    });

    var freqNum = root.querySelector("#keFreqNum");
    var ampNum = root.querySelector("#keAmpNum");
    if (freqNum) {
      freqNum.addEventListener("change", function () {
        state.freq = parseFloat(freqNum.value) || 2.5;
        draw();
      });
    }
    if (ampNum) {
      ampNum.addEventListener("change", function () {
        state.amp = parseFloat(ampNum.value) || 1;
        draw();
      });
    }

    function runAction(action) {
      var before = state.baseline.curves.reduce(function (n, c) {
        return n + c.times.length;
      }, 0);
      var next;
      var msg;
      if (action === "del_flat") {
        if (state.preset !== "step") {
          state.preset = "step";
          state.baseline = copyPreset("step");
          presetEl.value = "step";
        }
        next = opDelFlat(state.baseline.curves);
        var after = next.reduce(function (n, c) {
          return n + c.times.length;
        }, 0);
        msg = "Del Flat removed " + (before - after) + " key(s).";
      } else if (action === "del_redundant") {
        if (state.preset !== "redundant") {
          state.preset = "redundant";
          state.baseline = copyPreset("redundant");
          presetEl.value = "redundant";
        }
        next = opDelRedundant(state.baseline.curves);
        after = next.reduce(function (n, c) {
          return n + c.times.length;
        }, 0);
        msg = "Del Redundant removed " + (before - after) + " key(s).";
      } else if (action === "bake") {
        if (state.preset !== "sparse") {
          state.preset = "sparse";
          state.baseline = copyPreset("sparse");
          presetEl.value = "sparse";
        }
        next = opBake(state.baseline.curves);
        after = next.reduce(function (n, c) {
          return n + c.times.length;
        }, 0);
        msg = "Bake → " + after + " keys (1f samples).";
      } else if (action === "snp") {
        if (state.preset !== "offframe") {
          state.preset = "offframe";
          state.baseline = copyPreset("offframe");
          presetEl.value = "offframe";
        }
        next = opSmartSnap(state.baseline.curves);
        msg = "SNP snapped keys to integer frames.";
      } else if (action === "shift_left" || action === "shift_right") {
        var n = parseInt(shiftSpin.value, 10) || 1;
        if (action === "shift_left") n = -n;
        next = opShift(state.baseline.curves, n);
        msg = "Shifted keys by " + n + " frame(s).";
      }
      if (next) commitCurves(next, msg);
    }

    root.querySelectorAll(".ke-ui-btn-live").forEach(function (btn) {
      btn.addEventListener("click", function () {
        runAction(btn.getAttribute("data-action"));
      });
    });

    root._setEffectFromCard = function (cardId) {
      var mapped = CARD_TO_ROW[cardId] || cardId;
      if (mapped.indexOf("_btn_") === 0) {
        var act = mapped.replace("_btn_", "");
        if (act === "shift") act = "shift_right";
        runAction(act);
        return;
      }
      var row = findRow(mapped);
      if (!row) return;
      setActive(mapped);
      if (!state.amounts[mapped]) {
        var def = mapped === "smooth" ? 40 : mapped.indexOf("hierarchy") === 0 ? 80 : 50;
        state.amounts[mapped] = def;
        var inp = root.querySelector('.ke-ui-range[data-effect="' + mapped + '"]');
        if (inp) inp.value = String(def);
        state.amount = def;
      }
      draw();
    };

    setActive("smooth");
    return root;
  }

  return { mount: mount };
})();
