/* Atlas places: optional ambient sound (PACK_FORMAT 22). Off until the visitor turns it on. Everything is
   synthesised with Web Audio: wind and surf from filtered noise, a low hum for cities and stations, and short
   bursts for event scenes. No files are loaded. */
(function () {
  "use strict";
  let ctx = null,
    master = null,
    noiseBuf = null;
  let layers = [];
  let on = false;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < d.length; i++) {
      /* brown-ish noise: softer than white */
      b = (b + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = b * 3.5;
    }
    return ctx;
  }
  function noise() {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    return s;
  }
  function stopLayers() {
    layers.forEach(n => {
      try {
        n.stop();
      } catch (e) {
        /* already stopped */
      }
    });
    layers = [];
  }
  /* one bed of sound per kind of place */
  function bed(kind) {
    stopLayers();
    if (!ctx) return;
    const wind = ["desert", "ice", "mountain", "wilds", "crater", "tombs", "ruins", "battlefield", "camp", "monastery"].includes(kind);
    const sea = ["sea", "port"].includes(kind);
    const city = ["city", "capital", "town", "palace", "fortress", "spaceport", "industrial", "library", "arena", "dome", "temple", "castle", "village"].includes(kind);
    const hum = ["station", "habitat", "underground", "sietch"].includes(kind) || city;
    const add = (src, f, q, g, lfo) => {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = f;
      bp.Q.value = q;
      const gn = ctx.createGain();
      gn.gain.value = g;
      src.connect(bp).connect(gn).connect(master);
      if (lfo) {
        const o = ctx.createOscillator(),
          og = ctx.createGain();
        o.frequency.value = lfo;
        og.gain.value = g * 0.8;
        o.connect(og).connect(gn.gain);
        o.start();
        layers.push(o);
      }
      src.start();
      layers.push(src);
    };
    if (wind || (!sea && !hum)) add(noise(), 420, 0.6, 0.5, 0.07);
    if (sea) add(noise(), 300, 0.4, 0.8, 0.11);
    if (city) add(noise(), 900, 0.9, 0.16, 0.03);
    if (hum) {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = kind === "station" || kind === "habitat" ? 58 : 46;
      g.gain.value = 0.05;
      o.connect(g).connect(master);
      o.start();
      layers.push(o);
    }
  }
  /* short sounds for event scenes */
  function burst(kind) {
    if (!on || !ctx) return;
    const t = ctx.currentTime;
    const boom = (at, dur, f, g) => {
      const s = noise(),
        lp = ctx.createBiquadFilter(),
        gn = ctx.createGain();
      lp.type = "lowpass";
      lp.frequency.value = f;
      gn.gain.setValueAtTime(0, at);
      gn.gain.linearRampToValueAtTime(g, at + 0.02);
      gn.gain.exponentialRampToValueAtTime(0.001, at + dur);
      s.connect(lp).connect(gn).connect(master);
      s.start(at);
      s.stop(at + dur + 0.1);
    };
    if (kind === "blast") boom(t, 5, 220, 2.2);
    else if (kind === "bombard" || kind === "eruption" || kind === "quake") for (let i = 0; i < 8; i++) boom(t + 1 + i * 1.1 + Math.random() * 0.5, 2.2, 260, 1.4);
    else if (kind === "battle") for (let i = 0; i < 24; i++) boom(t + Math.random() * 9, 0.4, 900, 0.5);
    else if (kind === "launch" || kind === "arrival" || kind === "fleet") boom(t + 0.5, 8, 160, 1.1);
    else if (kind === "storm" || kind === "worm") boom(t, 10, 500, 0.9);
    else if (kind === "fire") boom(t, 9, 700, 0.5);
  }
  window.AtlasPlacesAudio = {
    get on() {
      return on;
    },
    set(v, kind) {
      on = !!v;
      if (on && !ensure()) {
        on = false;
        return false;
      }
      if (!ctx) return on;
      if (ctx.state === "suspended") ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.5 : 0, ctx.currentTime + 0.8);
      if (on) bed(kind);
      else setTimeout(() => !on && stopLayers(), 900);
      return on;
    },
    place(kind) {
      if (on && ctx) bed(kind);
    },
    leave() {
      if (ctx) stopLayers();
    },
    burst,
  };
})();
