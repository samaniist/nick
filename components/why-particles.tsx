"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   Particle sculpture for "Why Nexlytic?". Thousands of ink particles on the
   white section morph between four shapes — one per reason:
     0 medal (proven expertise)   1 target + arrow (results)
     2 connected team (people)    3 stopwatch with running hands (on time)
   Physics runs on the CPU (springs + damping), which keeps the shapes easy
   to animate (clock hands) and lets particles scatter away from the pointer. */

type Shape = { pos: Float32Array; hands?: { i: number; hand: 0 | 1; t: number; j: [number, number, number] }[] };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildShapes(N: number): Shape[] {
  const rnd = mulberry32(7);
  const TAU = Math.PI * 2;
  const g = () => (rnd() + rnd() + rnd() - 1.5) / 1.5; // soft gaussian-ish in [-1,1]
  const HAND = 1e9; // marker for clock-hand particles

  type P = [number, number, number];
  const torus = (R: number, r: number): P => {
    const u = rnd() * TAU;
    const v = rnd() * TAU;
    return [(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)];
  };
  const disc = (rad: number, z: number, thick = 0.03): P => {
    const r = rad * Math.sqrt(rnd());
    const a = rnd() * TAU;
    return [r * Math.cos(a), r * Math.sin(a), z + g() * thick];
  };
  const ring = (r0: number, r1: number, z: number, thick = 0.04): P => {
    const r = Math.sqrt(r0 * r0 + rnd() * (r1 * r1 - r0 * r0));
    const a = rnd() * TAU;
    return [r * Math.cos(a), r * Math.sin(a), z + g() * thick];
  };
  const seg = (a: P, b: P, rad: number): P => {
    const t = rnd();
    return [a[0] + (b[0] - a[0]) * t + g() * rad, a[1] + (b[1] - a[1]) * t + g() * rad, a[2] + (b[2] - a[2]) * t + g() * rad];
  };
  const sphere = (c: P, r: number, fill = false): P => {
    const u = rnd() * 2 - 1;
    const a = rnd() * TAU;
    const s = Math.sqrt(1 - u * u);
    const k = fill ? Math.cbrt(rnd()) : 1;
    return [c[0] + r * k * s * Math.cos(a), c[1] + r * k * u, c[2] + r * k * s * Math.sin(a)];
  };
  const dust = (): P => {
    const p = sphere([0, 0, 0], 1, false);
    const r = 1.45 + rnd() * 0.6;
    return [p[0] * r, p[1] * r * 0.8, p[2] * r];
  };
  // star polygon (5 points) for the medal relief
  const starPoly: [number, number][] = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * TAU + Math.PI / 2;
    const r = i % 2 ? 0.26 : 0.6;
    return [Math.cos(a) * r, Math.sin(a) * r + 0.18];
  });
  const inPoly = (x: number, y: number, poly: [number, number][]) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };

  const fill = (parts: [number, () => P][]) => {
    const out: P[] = [];
    const total = parts.reduce((s, [w]) => s + w, 0);
    parts.forEach(([w, f], k) => {
      const n = k === parts.length - 1 ? N - out.length : Math.round((w / total) * N);
      for (let i = 0; i < n; i++) out.push(f());
    });
    return out;
  };

  const shapes: { pts: [number, number, number][]; hands?: Shape["hands"] }[] = [];

  // 0 — medal: rim, face, raised star, two ribbon tails
  shapes.push({
    pts: fill([
      [18, () => { const p = torus(0.78, 0.06); return [p[0], p[1] + 0.18, p[2]]; }],
      [14, () => { const p = disc(0.72, 0); return [p[0], p[1] + 0.18, p[2]]; }],
      [22, () => {
        for (;;) {
          const x = (rnd() - 0.5) * 1.2;
          const y = (rnd() - 0.5) * 1.2 + 0.18;
          if (inPoly(x, y, starPoly)) return [x, y, 0.1 + g() * 0.03];
        }
      }],
      [11, () => seg([-0.28, -0.45, -0.02], [-0.55, -1.2, 0.05], 0.07)],
      [11, () => seg([0.28, -0.45, -0.02], [0.55, -1.2, 0.05], 0.07)],
      [12, () => seg([-0.14, -0.5, -0.04], [-0.3, -1.25, -0.02], 0.07)],
      [12, () => seg([0.14, -0.5, -0.04], [0.3, -1.25, -0.02], 0.07)],
      [10, dust],
    ]),
  });

  // 1 — target with an arrow in the bullseye
  const dir: P = [0.55, 0.42, 0.72];
  const dl = Math.hypot(...dir);
  const d: P = [dir[0] / dl, dir[1] / dl, dir[2] / dl];
  const tail: P = [d[0] * 1.55, d[1] * 1.55, d[2] * 1.55];
  shapes.push({
    pts: fill([
      [16, () => ring(0.98, 1.08, 0)],
      [14, () => ring(0.66, 0.76, 0)],
      [11, () => ring(0.34, 0.44, 0)],
      [8, () => disc(0.14, 0)],
      [8, () => disc(1.08, -0.05, 0.015)],
      [12, () => seg([0, 0, 0.02], tail, 0.018)],
      [10, () => {
        // fletching: three small fins at the tail
        const f = Math.floor(rnd() * 3);
        const a = (f / 3) * TAU;
        const t = rnd();
        const w = rnd() * 0.22 * (1 - t * 0.4);
        const base: P = [tail[0] - d[0] * 0.35 * t, tail[1] - d[1] * 0.35 * t, tail[2] - d[2] * 0.35 * t];
        return [base[0] + Math.cos(a) * w, base[1] + Math.sin(a) * w, base[2] - Math.cos(a) * w * 0.5];
      }],
      [10, dust],
    ]),
  });

  // 2 — team: five busts on an arc, linked by a network of arcs
  const people: { c: P; s: number }[] = [
    { c: [-1.22, -0.2, -0.35], s: 0.82 },
    { c: [-0.62, -0.12, 0.08], s: 0.92 },
    { c: [0, -0.05, 0.32], s: 1.05 },
    { c: [0.62, -0.12, 0.08], s: 0.92 },
    { c: [1.22, -0.2, -0.35], s: 0.82 },
  ];
  const head = (p: { c: P; s: number }): P => [p.c[0], p.c[1] + 0.52 * p.s, p.c[2]];
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [2, 4], [1, 3]];
  shapes.push({
    pts: fill([
      [26, () => { const p = people[Math.floor(rnd() * 5)]; return sphere(head(p), 0.19 * p.s); }],
      [40, () => {
        // shoulders: upper half of an ellipsoid shell
        const p = people[Math.floor(rnd() * 5)];
        const q = sphere([0, 0, 0], 1);
        const y = Math.abs(q[1]);
        return [p.c[0] + q[0] * 0.38 * p.s, p.c[1] - 0.05 + y * 0.36 * p.s - 0.3 * p.s, p.c[2] + q[2] * 0.26 * p.s];
      }],
      [22, () => {
        // arcs between heads
        const [a, b] = links[Math.floor(rnd() * links.length)];
        const A = head(people[a]);
        const B = head(people[b]);
        const t = rnd();
        const lift = Math.sin(t * Math.PI) * 0.35;
        return [A[0] + (B[0] - A[0]) * t + g() * 0.012, A[1] + (B[1] - A[1]) * t + lift + 0.12, A[2] + (B[2] - A[2]) * t + g() * 0.012];
      }],
      [12, dust],
    ]),
  });

  // 3 — stopwatch: rim, ticks, face, crown & button, hub, running hands
  const handSlots: Shape["hands"] = [];
  const clock = fill([
    [22, () => torus(0.95, 0.06)],
    [12, () => {
      const k = Math.floor(rnd() * 12);
      const a = (k / 12) * TAU;
      const long = k % 3 === 0;
      const r = 0.78 + rnd() * (long ? 0.12 : 0.07);
      return [Math.sin(a) * r + g() * 0.015, Math.cos(a) * r + g() * 0.015, 0.02 + g() * 0.02];
    }],
    [12, () => disc(0.9, -0.04, 0.015)],
    [7, () => seg([0, 1.02, 0], [0, 1.22, 0], 0.05)], // stem
    [5, () => disc(0.14, 0, 0.04).map((v, i) => (i === 0 ? v : i === 1 ? v * 0.5 + 1.28 : v)) as P], // crown
    [4, () => { const p = seg([0.62, 0.8, 0], [0.74, 0.95, 0], 0.04); return p; }], // side button
    [3, () => sphere([0, 0, 0.04], 0.06, true)],
    [13, () => [HAND, 0, 0]], // hands — marker; placed every frame
    [12, dust],
  ]);
  shapes.push({ pts: clock, hands: handSlots });

  // shuffle each shape independently so morphs scatter and re-form
  // (hand slots are tagged after the shuffle)
  const result: Shape[] = shapes.map((s, si) => {
    const idx = Array.from({ length: N }, (_, i) => i);
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const pos = new Float32Array(N * 3);
    const hands: NonNullable<Shape["hands"]> = [];
    idx.forEach((src, dst) => {
      const p = s.pts[src];
      const isHand = p[0] === HAND;
      pos[dst * 3] = isHand ? 0 : p[0];
      pos[dst * 3 + 1] = p[1];
      pos[dst * 3 + 2] = p[2];
      if (isHand) {
        const hand: 0 | 1 = rnd() < 0.42 ? 0 : 1;
        hands.push({ i: dst, hand, t: rnd(), j: [g() * 0.018, g() * 0.018, 0.05 + g() * 0.02] });
      }
    });
    return { pos, hands: si === 3 ? hands : undefined };
  });
  return result;
}

const VERT = /* glsl */ `
  attribute float aSize;
  uniform float uPR;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPR * (6.0 / -mv.z);
    // nearer particles darker, far ones fade toward the paper
    vAlpha = clamp(0.95 - (-mv.z - 4.2) * 0.32, 0.18, 0.95);
  }
`;
const FRAG = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.3, d) * vAlpha;
    gl_FragColor = vec4(0.035, 0.035, 0.045, a);
  }
`;

/** Builds the scene into `host`; returns a disposer. */
function setupParticles(
  host: HTMLDivElement,
  stepRef: { current: number },
  onStepRef: { current: (s: number) => void },
): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const N = small ? 4200 : 9000;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return () => {};
  }
  const pr = Math.min(window.devicePixelRatio, small ? 1.5 : 1.75);
  renderer.setPixelRatio(pr);
  renderer.domElement.className = "absolute inset-0 h-full w-full";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 5);

  const shapes = buildShapes(N);
  const rnd = mulberry32(99);

  // start as a wide scattered cloud; assembles into shape 0 on first view
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = rnd() * 2 - 1;
    const a = rnd() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 2.5 + rnd() * 3;
    pos[i * 3] = r * s * Math.cos(a);
    pos[i * 3 + 1] = r * u;
    pos[i * 3 + 2] = r * s * Math.sin(a);
  }
  const sizes = new Float32Array(N);
  const phase = new Float32Array(N);
  const delay = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const accent = rnd() < (small ? 0.012 : 0.025);
    sizes[i] = accent ? (small ? 3 : 4) + rnd() * 1.5 : 1.3 + rnd() * 2;
    phase[i] = rnd() * Math.PI * 2;
    delay[i] = rnd() * 0.55;
  }

  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pos, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("position", posAttr);
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { uPR: { value: pr } },
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  // morph state: each particle switches target after its own small delay
  let cur = stepRef.current;
  let prev = cur;
  let switchedAt = -10;
  let assembled = false;
  let clockT = 0;

  onStepRef.current = (s: number) => {
    if (s === cur) return;
    prev = cur;
    cur = s;
    switchedAt = clockT;
    // swirl kick so the transition flows instead of snapping
    for (let i = 0; i < N; i++) {
      const x = pos[i * 3];
      const z = pos[i * 3 + 2];
      vel[i * 3] += -z * 0.9 + (rnd() - 0.5) * 0.6;
      vel[i * 3 + 1] += (rnd() - 0.2) * 0.8;
      vel[i * 3 + 2] += x * 0.9 + (rnd() - 0.5) * 0.6;
    }
  };

  // pointer → ray in the group's local space
  const ndc = new THREE.Vector2(9, 9);
  const ptr = { x: 0, y: 0 };
  const lean = { x: 0, y: 0 };
  const ray = new THREE.Raycaster();
  const inv = new THREE.Matrix4();
  const o = new THREE.Vector3();
  const dirV = new THREE.Vector3();
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ptr.x = Math.max(-1, Math.min(1, ndc.x));
    ptr.y = Math.max(-1, Math.min(1, ndc.y));
  };
  const onLeave = () => {
    ndc.set(9, 9);
    ptr.x = 0;
    ptr.y = 0;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerleave", onLeave);

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the sculpture fully in frame on tall/narrow boxes
    camera.position.z = camera.aspect < 1 ? 5 / Math.max(0.62, camera.aspect) : 5;
    camera.updateProjectionMatrix();
  };

  const tick = (dt: number) => {
    clockT += dt;
    const t = clockT;
    const shapeCur = shapes[cur];
    const shapePrev = shapes[prev];

    // running stopwatch hands (target positions for the hand particles)
    if (shapes[3].hands) {
      const aMin = -t * 1.1;
      const aHour = -t * 0.09;
      for (const h of shapes[3].hands) {
        const a = h.hand === 0 ? aHour : aMin;
        const L = h.hand === 0 ? 0.5 : 0.78;
        const k = h.t * L;
        const p = shapes[3].pos;
        p[h.i * 3] = Math.sin(-a) * k + h.j[0];
        p[h.i * 3 + 1] = Math.cos(-a) * k + h.j[1];
        p[h.i * 3 + 2] = h.j[2];
      }
    }

    // pointer ray in local space
    let useRay = false;
    if (ndc.x < 2) {
      ray.setFromCamera(ndc, camera);
      inv.copy(group.matrixWorld).invert();
      o.copy(ray.ray.origin).applyMatrix4(inv);
      dirV.copy(ray.ray.direction).transformDirection(inv);
      useRay = true;
    }

    const k = assembled ? 26 : 9; // spring
    const damp = Math.pow(assembled ? 0.86 : 0.9, dt * 60);
    const since = t - switchedAt;
    for (let i = 0; i < N; i++) {
      const src = since < delay[i] ? shapePrev.pos : shapeCur.pos;
      const breathe = Math.sin(t * 1.3 + phase[i]) * 0.012;
      const i3 = i * 3;
      const tx = src[i3] * (1 + breathe);
      const ty = src[i3 + 1] * (1 + breathe);
      const tz = src[i3 + 2] * (1 + breathe);
      let vx = vel[i3] + (tx - pos[i3]) * k * dt;
      let vy = vel[i3 + 1] + (ty - pos[i3 + 1]) * k * dt;
      let vz = vel[i3 + 2] + (tz - pos[i3 + 2]) * k * dt;

      if (useRay) {
        // distance from particle to the pointer ray
        const px = pos[i3] - o.x;
        const py = pos[i3 + 1] - o.y;
        const pz = pos[i3 + 2] - o.z;
        const along = px * dirV.x + py * dirV.y + pz * dirV.z;
        const cx = px - dirV.x * along;
        const cy = py - dirV.y * along;
        const cz = pz - dirV.z * along;
        const d2 = cx * cx + cy * cy + cz * cz;
        if (d2 < 0.16) {
          const f = (0.16 - d2) * 28 * dt / Math.sqrt(d2 + 1e-4);
          vx += cx * f;
          vy += cy * f;
          vz += cz * f;
        }
      }

      vx *= damp;
      vy *= damp;
      vz *= damp;
      vel[i3] = vx;
      vel[i3 + 1] = vy;
      vel[i3 + 2] = vz;
      pos[i3] += vx * dt;
      pos[i3 + 1] += vy * dt;
      pos[i3 + 2] += vz * dt;
    }
    posAttr.needsUpdate = true;

    // presentation: gentle sway + lean toward the pointer
    lean.x += (ptr.x - lean.x) * 0.05;
    lean.y += (ptr.y - lean.y) * 0.05;
    const sway = cur === 2 ? 0.25 : 0.55;
    group.rotation.y = Math.sin(t * 0.35) * sway + lean.x * 0.5;
    group.rotation.x = -lean.y * 0.25 + Math.sin(t * 0.27) * 0.06;
    group.updateMatrixWorld();
    renderer.render(scene, camera);
  };

  // loop, paused off screen
  let raf = 0;
  let running = false;
  let last = 0;
  const loop = (now: number) => {
    if (now - last < 15) {
      raf = requestAnimationFrame(loop); // ~60 fps cap
      return;
    }
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    tick(dt);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!assembled) window.setTimeout(() => (assembled = true), 2200);
      if (reduced) {
        // no motion: jump straight to the shape and draw once
        pos.set(shapes[stepRef.current].pos);
        posAttr.needsUpdate = true;
        renderer.render(scene, camera);
      } else start();
    } else stop();
  });
  const ro = new ResizeObserver(() => {
    resize();
    if (reduced) renderer.render(scene, camera);
  });
  ro.observe(host);
  io.observe(host);
  if (reduced) {
    onStepRef.current = (s: number) => {
      cur = s;
      pos.set(shapes[s].pos);
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };
  }

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    onStepRef.current = () => {};
    geo.dispose();
    mat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export default function WhyParticles({ step, className = "" }: { step: number; className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef(step);
  const onStepRef = useRef<(s: number) => void>(() => {});

  useEffect(() => {
    stepRef.current = step;
    onStepRef.current(step);
  }, [step]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    /* Build lazily: generating the shapes and compiling the shader is only
       worth doing once the visitor is getting close to this section. */
    let dispose: (() => void) | undefined;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !dispose) {
          near.disconnect();
          dispose = setupParticles(host, stepRef, onStepRef);
        }
      },
      { rootMargin: "900px 0px" },
    );
    near.observe(host);
    return () => {
      near.disconnect();
      dispose?.();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className={`relative ${className}`} />;
}
