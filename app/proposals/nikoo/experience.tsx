"use client";
import Arrow from "./arrow";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/components/magnetic";
import portrait from "@/public/media/nikoo/nikoo-office.jpeg";
import s from "./nikoo.module.css";

const services = ["Behaviour support", "Life skills", "Recovery coaching", "Community connection", "Family support", "Service navigation"];

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [chapter, setChapter] = useState(0);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    const el = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastProgress = -1;
    let currentX = 0, currentY = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, el.offsetHeight - innerHeight)));
      if (p === lastProgress && (rect.bottom <= 0 || rect.top >= innerHeight)) return;
      lastProgress = p;
      progress.current = p;
      el.style.setProperty("--p", String(p));
      el.style.setProperty("--intro", String(1 - Math.min(1, p * 3)));
      el.style.setProperty("--reveal", String(Math.max(0, Math.min(1, (p - .36) * 3))));
      setChapter(p > .55 ? 1 : 0);
      currentX += (pointer.current.x - currentX) * .09;
      currentY += (pointer.current.y - currentY) * .09;
      el.style.setProperty("--mx", String(currentX));
      el.style.setProperty("--my", String(currentY));
      if (Math.abs(pointer.current.x - currentX) + Math.abs(pointer.current.y - currentY) > .001) frame = requestAnimationFrame(update);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const move = (e: PointerEvent) => {
      if (reduced.matches || pausedRef.current || e.pointerType !== "mouse") return;
      pointer.current = { x: e.clientX / innerWidth - .5, y: e.clientY / innerHeight - .5 };
      schedule();
    };
    const leave = () => { pointer.current = { x: 0, y: 0 }; schedule(); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    schedule();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    // The editorial composition remains available if WebGL is unavailable.
    import("three").then(THREE => {
      if (disposed || !canvas.current) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ canvas: canvas.current, alpha: true, antialias: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia("(pointer: coarse)").matches ? 1 : 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
      camera.position.z = 10;
      const group = new THREE.Group();
      scene.add(group);
      scene.add(new THREE.AmbientLight(0x66889a, 2));
      const light = new THREE.PointLight(0xb6f7f2, 80); light.position.set(3, 3, 4); scene.add(light);
      const warm = new THREE.PointLight(0xe7a47b, 55); warm.position.set(-4, -2, 3); scene.add(warm);
      const geometry = new THREE.TorusGeometry(2.15, .024, 8, 96);
      const material = new THREE.MeshStandardMaterial({ color: 0xbee5e3, metalness: .8, roughness: .23 });
      const rings: InstanceType<typeof THREE.Mesh>[] = [];
      for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.set(.45 + i * .37, i * .49, i * .2);
        ring.scale.setScalar(1 + i * .10);
        group.add(ring); rings.push(ring);
      }
      const dotsGeo = new THREE.BufferGeometry();
      const coords = new Float32Array(240 * 3);
      for (let i = 0; i < 240; i++) {
        const a = i * 2.39996, radius = 2.8 + (i % 13) * .045;
        coords[i * 3] = Math.cos(a) * radius;
        coords[i * 3 + 1] = Math.sin(a) * radius;
        coords[i * 3 + 2] = Math.sin(i * .71) * 1.1;
      }
      dotsGeo.setAttribute("position", new THREE.BufferAttribute(coords, 3));
      const dotsMat = new THREE.PointsMaterial({ color: 0xc2e9e1, size: .018, transparent: true, opacity: .6 });
      group.add(new THREE.Points(dotsGeo, dotsMat));
      const resize = () => { const el = canvas.current; if (!el) return; const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
      const observer = new ResizeObserver(resize); observer.observe(canvas.current); resize();
      const reduce = matchMedia("(prefers-reduced-motion: reduce)");
      let frame = 0, time = 0, previous = 0, visible = false, lastPaint = 0;
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !document.hidden && !frame) frame = requestAnimationFrame(render); });
      const resume = () => { if (!document.hidden && visible && !frame) frame = requestAnimationFrame(render); };
      document.addEventListener("visibilitychange", resume);
      const render = (now: number) => {
        frame = 0;
        const active = visible && !document.hidden;
        if (!active) return;
        if (now - lastPaint < 1000 / 30) { frame = requestAnimationFrame(render); return; }
        lastPaint = now;
        if (active) {
          if (!pausedRef.current && !reduce.matches) time += Math.min((now - previous) / 1000, .04);
          const p = progress.current;
          group.rotation.y = time * .045 + pointer.current.x * .22;
          group.rotation.x = pointer.current.y * .15;
          rings.forEach((ring, i) => {
            ring.rotation.x = (.45 + i * .37) * (1 - p) + p * 1.25;
            ring.rotation.y = i * .49 * (1 - p) + time * .025 * (i % 2 ? 1 : -1);
            ring.position.y = p * (i - 2) * .18;
          });
          renderer.render(scene, camera);
        }
        previous = now; frame = requestAnimationFrame(render);
      };
      if (root.current) visibility.observe(root.current);
      cleanup = () => { cancelAnimationFrame(frame); visibility.disconnect(); document.removeEventListener("visibilitychange", resume); observer.disconnect(); geometry.dispose(); material.dispose(); dotsGeo.dispose(); dotsMat.dispose(); renderer.dispose(); };
    }).catch(() => {});
    return () => { disposed = true; cleanup(); };
  }, []);

  const explore = () => {
    const el = root.current!;
    window.scrollTo({ top: scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * .94, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <main ref={root} className={s.page} data-paused={paused}>
    <div className={s.stage}>
      <div className={s.grid} aria-hidden="true" />
      <header className={s.header}>
        <Link href="/" aria-label="Nexlytic home" className={s.brand}>nexlytic<span>®</span></Link>
        <span className={s.prepared}>A PERSONAL PROPOSAL <i /> NIK SUPPORTS</span>
        <button className={s.motion} onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume motion" : "Pause motion"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>
      </header>

      <div className={s.intro} aria-hidden={chapter === 1}>
        <p className={s.eyebrow}><i /> FOR NIKOO. FROM SAMAN.</p>
        <h1>Your instinct.<br />Your impact.<br /><span>Your next.</span></h1>
        <p className={s.lead}>You know how to connect with young people.<br />Let’s build a business that connects with them, too.</p>
        <Magnetic><button onClick={explore} className={s.cta} tabIndex={chapter ? -1 : 0}>Find your direction <span aria-hidden="true"><Arrow direction="up-right"/></span></button></Magnetic>
      </div>

      <div className={s.universe} aria-hidden="true">
        <div className={s.halo} />
        <canvas ref={canvas} className={s.canvas} />
        <div className={s.portrait}>
          <Image src={portrait} alt="" fill preload placeholder="blur" sizes="(max-width: 760px) 50vw, 28vw" />
          <div className={s.portraitShade} />
          <span className={s.portraitTop}>THE HUMAN AT THE CENTRE</span>
          <span className={s.name}>Nikoo<span>NIK SUPPORTS / THE BEGINNING</span></span>
          <div className={s.cross}>+</div>
        </div>
        <div className={s.orbitLabels}>{services.map((name, i) => <span key={name} style={{ "--i": i } as React.CSSProperties}><small>0{i+1}</small>{name}<b><Arrow direction="up-right"/></b></span>)}</div>
        <span className={s.axis}>EXPERIENCE <Arrow direction="right"/> POSSIBILITY</span>
      </div>

      <section className={s.focus} aria-label="Proposed starting direction" aria-hidden={chapter === 0}>
        <p className={s.eyebrow}>01 / FROM POSSIBILITY TO FOCUS</p>
        <h2>Many possibilities.<br /><span>One clear beginning.</span></h2>
        <p className={s.focusLead}>Build around your connection with young people.<br />Define the support. Make the value clear. Create a way in.</p>
        <div className={s.steps}>
          <article><span>01 / POSITION</span><h3>Find your focus.</h3><p>Choose an audience and services grounded in your qualifications and capacity.</p></article>
          <article><span>02 / EXPRESSION</span><h3>Make it felt.</h3><p>A distinctive identity and website that make your approach easy to understand.</p></article>
          <article><span>03 / CONNECTION</span><h3>Open the door.</h3><p>A clear enquiry and referral journey for young people, families and partners.</p></article>
        </div>
        <p className={s.provisional}>A proposed direction, shaped together. Service scope to be confirmed.</p>
      </section>

      <footer className={s.footer}>
        <span>0{chapter + 1} / {chapter ? "THE DIRECTION" : "THE POSSIBILITY"}</span>
        <div className={s.progress}><span>SCROLL TO BRING IT TOGETHER</span><div><i /></div></div>
        <span className={s.signature}>STRATEGY & DESIGN <b>SAMAN / NEXLYTIC</b></span>
      </footer>
    </div>
  </main>;
}
