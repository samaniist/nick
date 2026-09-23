"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import "./keyboard-ball.css";

/* ---------------------------------------------------------------------------
   Legends. Text is drawn with the site font; icons are 24×24 SVG path data
   (lucide-style strokes) rendered through Path2D. */
type Legend = { text: string; small?: boolean } | { icon: string[] };

const LEGENDS: Legend[] = [
  { text: "</>" },
  { text: "SEO", small: true },
  { text: "{ }" },
  {
    icon: ["M4 10.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0", "m15.5 15.5 5 5"],
  },
  { icon: ["M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"] }, // ⌘ as a path: canvas text could fall back to an emoji font on phones
  { text: "ADS", small: true },
  { text: "#" },
  { text: "HTML", small: true },
  { icon: ["M13 2 3 14h7l-1 8 10-12h-7l1-8Z"] },
  { text: "@" },
  { text: "CSS", small: true },
  { text: "/" },
  { text: "ROI", small: true },
  { icon: ["M3 3v18h18", "m7 15 4-4 3 3 6-6"] },
  { text: "%" },
  { text: "JS", small: true },
  { icon: ["M20 6 9 17l-5-5"] },
  { icon: ["M5 12h14", "m13 6 6 6-6 6"] }, // arrow
  { text: "UX", small: true },
  {
    icon: [
      "M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
      "M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
    ],
  },
  { text: "GEO", small: true },
  { text: "€" },
  { text: "KPI", small: true },
  {
    icon: [
      "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    ],
  },
  { text: "*" },
  { text: "CTR", small: true },
  { icon: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"] },
  { text: ";" },
  { text: "404", small: true },
  { text: "$" },
];

/* ---------------------------------------------------------------------------
   Sphere layout: caps on latitude rings, as many per ring as the
   circumference allows, alternate rings offset half a step (brickwork),
   one cap on each pole. Units: sphere radius = 1. */
const R = 1;
const CAP = 0.35; // cap footprint
const CAP_H = 0.16; // cap height (outward)
const PITCH = 0.385; // arc distance between cap centres (tight gaps)
const LATS = [-90, -67.5, -45, -22.5, 0, 22.5, 45, 67.5, 90];
const DEG = Math.PI / 180;

const SLOTS = LATS.flatMap((lat, ring) => {
  const count =
    Math.abs(lat) === 90
      ? 1
      : Math.max(
          1,
          Math.floor((2 * Math.PI * R * Math.cos(lat * DEG)) / PITCH),
        );
  const step = 360 / count;
  const offset = ring % 2 ? step / 2 : 0;
  return Array.from({ length: count }, (_, i) => ({
    lat: lat * DEG,
    lon: (offset + i * step) * DEG,
  }));
});

/** Rounded box, tapered toward the top like a sculpted keycap. */
function keycapGeometry() {
  const g = new RoundedBoxGeometry(CAP, CAP, CAP_H, 6, 0.055);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = (p.getZ(i) + CAP_H / 2) / CAP_H; // 0 bottom … 1 top
    const f = 1 - 0.12 * t;
    p.setXY(i, p.getX(i) * f, p.getY(i) * f);
  }
  g.computeVertexNormals();
  return g;
}

/** Legend bitmap. With `blur` it becomes the LED bloom drawn around it. */
function legendTexture(l: Legend, font: string, blur = 0) {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  if (blur) ctx.filter = `blur(${blur}px)`;
  const passes = blur ? 2 : 1; // stack the blurred pass for a denser bloom
  for (let pass = 0; pass < passes; pass++) {
    ctx.save();
    if ("text" in l) {
      ctx.font = `600 ${l.small ? 58 : 104}px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (l.small)
        (
          ctx as CanvasRenderingContext2D & { letterSpacing: string }
        ).letterSpacing = "6px";
      ctx.fillText(l.text, S / 2, S / 2 + 4);
    } else {
      const k = 4.4;
      ctx.translate(S / 2 - 12 * k, S / 2 - 12 * k);
      ctx.scale(k, k);
      ctx.lineWidth = 1.9;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = blur ? 2.6 : 1.9;
      l.icon.forEach((d) => ctx.stroke(new Path2D(d)));
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function glowTexture() {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Product-photo studio for reflections: black void lit by a few softbox
    strips, so glass stays dark and only picks up crisp highlight lines. */
function studioScene() {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x000000);
  const box = (
    w: number,
    h: number,
    power: number,
    pos: [number, number, number],
  ) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(power, power, power),
        side: THREE.DoubleSide,
      }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  box(6, 2.2, 4, [0, 6, 2]); // overhead key softbox
  box(0.7, 7, 3, [-6, 1, 3]); // tall strip, left
  box(0.5, 6, 5, [5.5, 0.5, -3.5]); // rim strip, back right
  box(4, 0.4, 1.2, [0, -5, 4]); // low front kicker
  return env;
}

const CANVAS_SCALE = 1.6;
const HALO_IDLE = 0.55; // LED bloom strength on idle keys
const BASE_SPIN = 0.18; // rad/s idle rotation
const TILT = 0.24; // rad, top of the globe leans toward the viewer

/**
 * WebGL globe of sculpted glass keycaps (three.js). Real geometry and lighting:
 * tapered rounded caps in smoked, lightly frosted glass with studio reflections, a key
 * light plus a cool rim light. Caps on the front type themselves (press in,
 * legend lights up); hover presses a cap; drag spins the globe with inertia.
 */
export default function KeyboardBall() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL: the hero simply shows its backlight
    }
    const phone = window.matchMedia("(max-width: 767px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, phone ? 1.5 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "gk-canvas";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const studio = studioScene();
    const envTex = pmrem.fromScene(studio, 0.02).texture;
    studio.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
    scene.environment = envTex;
    scene.environmentIntensity = 1.3;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    // The canvas is CANVAS_SCALE× the host box (see .gk-canvas) so the orbit
    // lines have room; the camera backs off by the same factor so the globe
    // keeps its size.
    camera.position.set(0, 0, 5.1 * CANVAS_SCALE);

    // The studio environment does most of the lighting (glass lit by strong
    // direct lights turns milky silver); two faint lights only shape the form.
    const key = new THREE.DirectionalLight(0xffffff, 0.5);
    key.position.set(-3, 4, 5);
    const rim = new THREE.DirectionalLight(0xdfe8ff, 1.3);
    rim.position.set(4, 1.5, -4);
    scene.add(key, rim);

    const float = new THREE.Group(); // gentle bob
    const tilt = new THREE.Group(); // pointer lean
    const globe = new THREE.Group(); // spin
    scene.add(float);
    float.add(tilt);
    tilt.add(globe);
    // Opaque black disc behind the globe (invisible on the pure-black hero).
    // The glass rims refract whatever is behind them; with a transparent
    // canvas that is "nothing" and they turn milky silver.
    const backdropGeo = new THREE.CircleGeometry(1.26, 96);
    const backdropMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.z = -0.35;
    float.add(backdrop);

    // dark core fills the gaps between caps
    const coreGeo = new THREE.SphereGeometry(R * 0.97, 64, 48);
    // matte black core: keeps the glass reading as dark smoked glass
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050506,
      roughness: 0.75,
      metalness: 0,
    });
    globe.add(new THREE.Mesh(coreGeo, coreMat));

    const font =
      getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
    const capGeo = keycapGeometry();
    const legendGeo = new THREE.PlaneGeometry(CAP * 0.62, CAP * 0.62);
    const haloGeo = new THREE.PlaneGeometry(CAP * 0.95, CAP * 0.95);
    const spillGeo = new THREE.PlaneGeometry(CAP * 1.7, CAP * 1.7);
    const glowTex = glowTexture();
    const legendTextures = LEGENDS.map((l) => legendTexture(l, font));
    const haloTextures = LEGENDS.map((l) => legendTexture(l, font, 12));

    const baseCap = new THREE.MeshStandardMaterial({
      color: 0x1a1b1e,
      metalness: 0.2,
      roughness: 0.3,
      envMapIntensity: 1,
      emissive: 0xffffff,
      emissiveIntensity: 0,
    });

    type Key = {
      cap: THREE.Mesh;
      capMat: THREE.MeshStandardMaterial;
      legendMat: THREE.MeshBasicMaterial;
      haloMat: THREE.MeshBasicMaterial;
      spillMat: THREE.MeshBasicMaterial;
      slot: THREE.Group;
      spill: THREE.Mesh;
      normal: THREE.Vector3;
      press: number;
      target: number;
      until: number;
    };

    const TOP = CAP_H / 2 + 0.001;
    const keys: Key[] = SLOTS.map((s, i) => {
      const slot = new THREE.Group();
      slot.rotation.set(-s.lat, s.lon, 0, "YXZ");
      slot.position
        .set(
          Math.cos(s.lat) * Math.sin(s.lon),
          Math.sin(s.lat),
          Math.cos(s.lat) * Math.cos(s.lon),
        )
        .multiplyScalar(R);
      const normal = slot.position.clone().normalize();

      const capMat = baseCap.clone();
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.z = CAP_H / 2 - 0.035;
      cap.userData.index = i;

      const li = (i * 7) % LEGENDS.length;
      const legendMat = new THREE.MeshBasicMaterial({
        map: legendTextures[li],
        transparent: true,
        depthWrite: false,
        color: new THREE.Color(1, 1, 1),
        toneMapped: false,
      });
      const legend = new THREE.Mesh(legendGeo, legendMat);
      legend.position.z = TOP;

      // white LED bloom around every legend (always on, flares on press)
      const haloMat = new THREE.MeshBasicMaterial({
        map: haloTextures[li],
        transparent: true,
        opacity: HALO_IDLE,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.z = TOP + 0.002;

      // light spilling out of a pressed key onto its neighbours
      const spillMat = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const spill = new THREE.Mesh(spillGeo, spillMat);
      spill.position.z = TOP + 0.004;

      cap.add(legend, halo, spill);
      slot.add(cap);
      globe.add(slot);
      return {
        slot,
        spill,
        cap,
        capMat,
        legendMat,
        haloMat,
        spillMat,
        normal,
        press: 0,
        target: 0,
        until: 0,
      };
    });
    const capMeshes = keys.map((k) => k.cap);

    // orbit rings with travelling nodes
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      toneMapped: false,
    });
    const ringMat2 = ringMat.clone();
    ringMat2.opacity = 0.2;
    // wide, faint additive tube around each line = soft neon bloom
    const bloomMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const nodeMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const makeOrbit = (
      radius: number,
      tube: number,
      rx: number,
      rz: number,
      mat: THREE.Material,
      nodes: number[],
    ) => {
      const g = new THREE.Group();
      g.rotation.set(rx, 0, rz);
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 8, 320),
        mat,
      );
      const bloom = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube * 6, 8, 320),
        bloomMat,
      );
      g.add(torus, bloom);
      const spinner = new THREE.Group();
      nodes.forEach((a, i) => {
        const s = new THREE.Sprite(nodeMat);
        s.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
        s.scale.setScalar(i === 0 ? 0.2 : 0.12);
        spinner.add(s);
      });
      g.add(spinner);
      tilt.add(g);
      return { group: g, torus, spinner };
    };
    const orbitA = makeOrbit(
      1.48,
      0.006,
      66 * DEG,
      -18 * DEG,
      ringMat,
      [0, 2.4, 4.3],
    );
    const orbitB = makeOrbit(1.64, 0.0045, 76 * DEG, 24 * DEG, ringMat2, [1]);

    // ---- sizing
    const resize = () => {
      const w = Math.round(host.clientWidth * CANVAS_SCALE);
      const h = Math.round(host.clientHeight * CANVAS_SCALE);
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) draw(0, 0);
    };

    // ---- state
    let spin = -0.4;
    let vel = BASE_SPIN;
    const ptr = { x: 0, y: 0 };
    const lean = { x: 0, y: 0 };
    const q = new THREE.Quaternion();
    const n = new THREE.Vector3();

    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let hover = -1;
    const ndc = new THREE.Vector2();
    let ndcValid = false;
    const ray = new THREE.Raycaster();
    let nextType = 0;

    const draw = (t: number, dt: number) => {
      if (!dragging) {
        vel += (BASE_SPIN - vel) * Math.min(1, dt * 1.5);
        spin += vel * dt;
      }
      lean.x += (ptr.x - lean.x) * 0.05;
      lean.y += (ptr.y - lean.y) * 0.05;
      globe.rotation.y = spin;
      tilt.rotation.set(TILT + lean.y * 0.12, lean.x * 0.16, 0);
      float.position.y = reduced ? 0 : Math.sin(t * 1.05) * 0.035;
      orbitA.spinner.rotation.z = t * 0.24;
      orbitB.spinner.rotation.z = -t * 0.16;

      // hover → press the cap under the pointer
      if (ndcValid && !dragging) {
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(capMeshes, false)[0];
        hover = hit ? (hit.object.userData.index as number) : -1;
      } else hover = -1;

      // self-typing on the front-facing side
      if (!reduced && t > nextType) {
        tilt.getWorldQuaternion(q);
        const burst = Math.random() < 0.3 ? 2 : 1;
        for (let b = 0; b < burst; b++) {
          for (let tries = 0; tries < 14; tries++) {
            const k = keys[Math.floor(Math.random() * keys.length)];
            n.copy(k.normal)
              .applyAxisAngle(THREE.Object3D.DEFAULT_UP, spin)
              .applyQuaternion(q);
            if (n.z > 0.55) {
              k.until = t + 0.16 + Math.random() * 0.18;
              break;
            }
          }
        }
        nextType = t + 0.22 + Math.random() * 0.38;
      }

      // cull keys on the far side (hidden behind the core anyway): roughly
      // halves the draw calls, which matters twice over with glass
      tilt.getWorldQuaternion(q);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        n.copy(k.normal).applyAxisAngle(THREE.Object3D.DEFAULT_UP, spin).applyQuaternion(q);
        k.slot.visible = n.z > -0.3;
        k.target = i === hover || t < k.until ? 1 : 0;
        const rate = k.target > k.press ? 26 : 9; // fast down, softer spring back
        k.press += (k.target - k.press) * Math.min(1, dt * rate);
        const p = k.press;
        k.cap.position.z = CAP_H / 2 - 0.035 - p * 0.055;
        k.capMat.emissiveIntensity = p * 0.05;
        k.haloMat.opacity = HALO_IDLE + p * (1 - HALO_IDLE);
        k.spillMat.opacity = p * 0.2;
        k.spill.visible = p > 0.01; // only drawn while a key is lit
      }

      renderer.render(scene, camera);
    };

    // ---- input
    const el = renderer.domElement;
    const setNdc = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ndc.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
      ndcValid = true;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      host.setPointerCapture(e.pointerId);
      host.classList.add("is-dragging");
    };
    const onCanvasMove = (e: PointerEvent) => {
      setNdc(e);
      if (!dragging) return;
      const now = performance.now();
      const d = (e.clientX - lastX) * 0.008;
      spin += d;
      vel = (d / Math.max(1, now - lastT)) * 1000;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      dragging = false;
      host.classList.remove("is-dragging");
    };
    const onLeave = () => {
      ndcValid = false;
    };
    const onWindowMove = (e: PointerEvent) => {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onCanvasMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onWindowMove, { passive: true });

    // ---- loop (paused off screen / in background tabs)
    let raf = 0;
    let running = false;
    let prev = 0;
    const clock0 = performance.now();
    const loop = (now: number) => {
      // cap at ~60 fps: 120 Hz screens would otherwise double the GPU work
      if (now - prev < 15) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      draw((now - clock0) / 1000, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    /* The hero is position: sticky — later sections slide OVER it, so it
       never leaves the viewport as far as IntersectionObserver is concerned.
       Without the "covered" check the globe would keep rendering (glass and
       all) underneath the whole page. */
    let visible = false;
    let covered = false;
    const heroSection = host.closest("section");
    const sync = () => (visible && !covered && !document.hidden ? start() : stop());
    const onPageScroll = () => {
      const h = heroSection?.offsetHeight ?? window.innerHeight;
      const c = window.scrollY > h - 8;
      if (c !== covered) {
        covered = c;
        sync();
      }
    };
    window.addEventListener("scroll", onPageScroll, { passive: true });
    onPageScroll();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(host);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    // repaint legends once the web font is ready
    document.fonts?.ready.then(() => {
      LEGENDS.forEach((l, i) => {
        const fresh = legendTexture(l, font);
        legendTextures[i].image = fresh.image;
        legendTextures[i].needsUpdate = true;
        fresh.dispose();
        const bloom = legendTexture(l, font, 12);
        haloTextures[i].image = bloom.image;
        haloTextures[i].needsUpdate = true;
        bloom.dispose();
      });
      if (reduced) draw(0, 0);
    });

    requestAnimationFrame(() => host.classList.add("is-ready"));

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onPageScroll);
      window.removeEventListener("pointermove", onWindowMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onCanvasMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      [
        coreMat,
        baseCap,
        ringMat,
        ringMat2,
        bloomMat,
        nodeMat,
        ...keys.flatMap((k) => [k.capMat, k.legendMat, k.haloMat, k.spillMat]),
      ].forEach((m) => m.dispose());
      [glowTex, envTex, ...legendTextures, ...haloTextures].forEach((t) =>
        t.dispose(),
      );
      pmrem.dispose();
      renderer.dispose();
      el.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="gk-stage relative aspect-square w-[340px] cursor-grab touch-pan-y select-none sm:w-[480px] lg:w-[600px] xl:w-[720px]"
    />
  );
}
