"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import MagIcon from "./mag-icon";
import styles from "./mag.module.css";
import MagChapters from "./mag-chapters";

const materials = [
  { name: "Pierre", detail: "La force du minéral.", color: "#696760", position: "73% 70%" },
  { name: "Bois", detail: "La chaleur du naturel.", color: "#98714e", position: "85% 45%" },
  { name: "Lumière", detail: "Le détail qui change tout.", color: "#e3b984", position: "65% 20%" },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

export default function MagExperience() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const intro = useRef<HTMLElement>(null);
  const vision = useRef<HTMLElement>(null);
  const progressLabel = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [material, setMaterial] = useState(0);
  const [comparison, setComparison] = useState(100);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = root.current;
    const rail = track.current;
    const media = film.current;
    const clip = video.current;
    if (!host || !rail || !media || !clip) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let progress = 0;
    let pointerFrame = 0;
    const render = () => {
      frame = 0;
      const h = window.innerHeight;
      const w = host.clientWidth;
      const mobile = w < 760;
      progress = clamp(-rail.getBoundingClientRect().top / Math.max(1, rail.offsetHeight - h));
      const morph = smooth((progress - 0.15) / 0.55);
      const reveal = smooth((progress - 0.32) / 0.4);
      host.style.setProperty("--progress", String(progress));
      host.style.setProperty("--reveal", String(reveal));
      if (reduced.matches) {
        clip.pause();
        intro.current?.removeAttribute("style");
        vision.current?.removeAttribute("style");
        if (vision.current) vision.current.inert = false;
        if (intro.current) intro.current.inert = false;
        return;
      }
      const start = mobile
        ? { x: w * .045, y: h * .24, width: w * .91, height: h * .49 }
        : { x: w * .285, y: h * .16, width: w * .675, height: h * .66 };
      const diameter = mobile ? Math.min(w * .25, 110) : Math.min(w * .15, 215);
      const end = { x: mobile ? w * .7 : w * .79, y: mobile ? h * .16 : h * .135, width: diameter, height: diameter };
      const mix = (a: number, b: number) => a + (b - a) * morph;
      Object.assign(media.style, {
        left: `${mix(start.x, end.x)}px`, top: `${mix(start.y, end.y)}px`,
        width: `${mix(start.width, end.width)}px`, height: `${mix(start.height, end.height)}px`,
        borderRadius: `${morph * diameter / 2}px`,
      });
      const fade = 1 - smooth((progress - .1) / .32);
      if (intro.current) {
        intro.current.style.opacity = String(fade);
        intro.current.style.transform = `translateY(${-80 * (1 - fade)}px)`;
        intro.current.inert = fade < .1;
      }
      if (vision.current) {
        vision.current.style.opacity = String(reveal);
        vision.current.style.transform = `translateY(${45 * (1 - reveal)}px)`;
        vision.current.inert = reveal < .8;
      }
      if (progressLabel.current) progressLabel.current.textContent = `${String(Math.round(progress * 100)).padStart(2, "0")}`;
      // Let the film play on arrival; the scroll then takes over its timeline.
      if (progress > .015) {
        clip.pause();
        if (Number.isFinite(clip.duration) && !clip.seeking) {
          const target = Math.min(clip.duration - .05, clamp(progress / .65) * clip.duration);
          if (Math.abs(clip.currentTime - target) > .075) clip.currentTime = target;
        }
      } else if (!paused && document.visibilityState === "visible") {
        void clip.play().catch(() => {});
      } else clip.pause();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onMove = (e: PointerEvent) => {
      if (reduced.matches || e.pointerType === "touch" || pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const r = host.getBoundingClientRect();
        host.style.setProperty("--pointer-x", `${((e.clientX - r.left) / r.width) * 100}%`);
        host.style.setProperty("--pointer-y", `${e.clientY}px`);
      });
    };
    const visibility = () => { if (document.hidden) clip.pause(); else schedule(); };
    const resize = new ResizeObserver(schedule);
    resize.observe(rail);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    host.addEventListener("pointermove", onMove, { passive: true });
    clip.addEventListener("loadedmetadata", schedule);
    clip.addEventListener("seeked", schedule);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", schedule);
    render();
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(pointerFrame); resize.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      host.removeEventListener("pointermove", onMove); clip.removeEventListener("loadedmetadata", schedule);
      clip.removeEventListener("seeked", schedule); document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", schedule);
    };
  }, [paused]);

  const discover = () => {
    const rail = track.current;
    if (!rail) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) vision.current?.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: window.scrollY + rail.getBoundingClientRect().top + (rail.offsetHeight - window.innerHeight) * .94, behavior: "smooth" });
  };

  return (
    <main ref={root} className={styles.root} lang="fr">
      <div ref={track} className={styles.track}>
        <div className={styles.stage}>
          <div className={styles.sheen} aria-hidden="true" />
          <div className={styles.horizon} aria-hidden="true" />
          <header className={styles.header}>
            <a href="/mag" className={styles.logo} aria-label="MAG Rénovation, accueil">mag<span>®</span><small>RÉNOVATION</small></a>
            <span className={styles.location}><i /> BORDEAUX · NOUVELLE-AQUITAINE</span>
            <a href="#contact-mag" className={styles.contactLink}>Parlons de votre projet <span><MagIcon name="up-right" /></span></a>
          </header>

          <div ref={film} className={styles.film}>
            <video ref={video} muted playsInline loop preload="auto" poster="/mag/before.jpg" aria-label="Transformation d’un intérieur ancien en cuisine contemporaine" onError={() => setFailed(true)}>
              <source src="/mag/renovation.mp4" type="video/mp4" />
            </video>
            {failed && <Image src="/mag/after.jpg" alt="Intérieur rénové, pierre sombre et bois chaleureux" fill sizes="100vw" />}
            <div className={styles.filmShade} />
            <span className={styles.filmCorner}>UNE AUTRE DIMENSION.</span>
            <div className={styles.scanline} aria-hidden="true" />
          </div>
          <div className={styles.orbitLabel} aria-hidden="true">LA VISION DEVIENT RÉELLE <span><MagIcon name="down-left" /></span></div>

          <section ref={intro} className={styles.intro} aria-labelledby="mag-heading">
            <div className={styles.eyebrow}><span>01 / L’IMPULSION</span><span>RÉNOVATION INTÉRIEURE & EXTÉRIEURE</span></div>
            <h1 id="mag-heading" className={styles.title}>
              <span className={styles.titleLine}><span style={{ "--delay": "90ms", "--tilt": "-5deg" } as CSSProperties}>L’ART DE</span></span>
              <span className={styles.titleLine}><span style={{ "--delay": "240ms", "--tilt": "4deg" } as CSSProperties}>TOUT</span><em style={{ "--delay": "360ms", "--tilt": "-8deg" } as CSSProperties}><MagIcon name="up-right" /></em></span>
              <span className={`${styles.titleLine} ${styles.outline}`}><span style={{ "--delay": "440ms", "--tilt": "-3deg" } as CSSProperties}>RÉINVENTER.</span></span>
            </h1>
            <div className={styles.heroBottom}>
              <p>Vos espaces ont un potentiel.<br /><span>Nous lui donnons vie.</span></p>
              <button onClick={discover} className={styles.discover}>Explorer la transformation <span><MagIcon name="down" /></span></button>
            </div>
            <div className={styles.reflection} aria-hidden="true">RÉINVENTER.</div>
          </section>

          <section ref={vision} id="vision-mag" className={styles.vision} aria-labelledby="vision-heading">
            <div className={styles.visionCopy}>
              <p className={styles.kicker}>02 / LA MÉTAMORPHOSE</p>
              <h2 id="vision-heading">Le même lieu.<br />Une tout autre<br /><em>émotion.</em></h2>
              <p className={styles.visionDescription}>Révéler les volumes. Faire dialoguer les matières. Dessiner la lumière. Chaque détail transforme votre façon d’habiter.</p>
              <div className={styles.materials} aria-label="Explorer les matières">
                {materials.map((item, index) => <button key={item.name} aria-pressed={material === index} onClick={() => setMaterial(index)} className={material === index ? styles.selectedMaterial : ""}><i style={{ background: item.color }} /><span>{item.name}</span></button>)}
              </div>
              <p className={styles.materialDetail} aria-live="polite">{materials[material].detail}</p>
              <a className={styles.visionCta} href="#contact-mag">Et si c’était chez vous ? <span><MagIcon name="up-right" /></span></a>
            </div>
            <div className={styles.project}>
              <div className={styles.projectTop}><span>ÉTUDE D’ATMOSPHÈRE / 001</span><span>MAG — BORDEAUX</span></div>
              <div className={styles.comparison} style={{ "--split": `${comparison}%`, "--detail-position": materials[material].position } as CSSProperties}>
                <Image src="/mag/before.jpg" alt="L’espace avant transformation" fill sizes="(max-width: 759px) 90vw, 44vw" />
                <div className={styles.after}><Image src="/mag/after.jpg" alt="Le dernier plan du film : cuisine rénovée, pierre et bois" fill sizes="(max-width: 759px) 90vw, 44vw" /></div>
                <div className={styles.materialLens} aria-hidden="true" />
                <span className={styles.imageTag}>{comparison < 50 ? "AVANT" : "APRÈS"}</span>
                <span className={styles.divider} aria-hidden="true"><b><MagIcon name="compare" /></b></span>
                <input className={styles.range} type="range" min="0" max="100" value={comparison} aria-label="Comparer avant et après rénovation" aria-valuetext={`${comparison} % de l’image après rénovation`} onChange={(e) => setComparison(Number(e.target.value))} />
              </div>
              <div className={styles.projectBottom}><span>Glissez pour révéler l’avant <span><MagIcon name="compare" /></span></span><small>VISUALISATION CONCEPTUELLE</small></div>
            </div>
          </section>

          <div className={styles.stageFooter}>
            <button className={styles.playToggle} aria-label={paused ? "Lancer le film" : "Mettre le film en pause"} aria-pressed={paused} onClick={() => setPaused(!paused)}><MagIcon name={paused ? "play" : "pause"} /><span>{paused ? "Lancer le film" : "Pause du film"}</span></button>
            <div className={styles.scrollTrack}><span>SCROLL TO TRANSFORM</span><div><i /></div><span ref={progressLabel}>00</span><small>/ 100</small></div>
            <span className={styles.signature}>IMAGINÉ POUR VOUS. <i>PAR MAG.</i></span>
          </div>
        </div>
      </div>
      <MagChapters />
    </main>
  );
}
