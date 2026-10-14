"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import MagIcon from "./mag-icon";
import Link from "next/link";
import s from "./mag-chapters.module.css";

const services = [
  { title: "Repenser.", category: "INTÉRIEURS", detail: "Du sol au plafond, un espace qui vous ressemble.", tags: "Volumes · Peinture · Revêtements", shape: "room" },
  { title: "Savourer.", category: "CUISINES & BAINS", detail: "Des matières qui se touchent. Des espaces qui se vivent.", tags: "Cuisine · Salle de bain · Plomberie", shape: "tiles" },
  { title: "Respirer.", category: "EXTÉRIEURS", detail: "Prolonger votre intérieur, au-delà des murs.", tags: "Terrasse · Jardin · Véranda", shape: "arches" },
];
const steps = [
  { title: "On vous écoute.", text: "Votre lieu, vos envies, votre quotidien. Tout commence par une conversation.", tag: "01 — RENCONTRE" },
  { title: "On imagine.", text: "Volumes, matières et lumière : nous donnons une direction à votre projet.", tag: "02 — VISION" },
  { title: "On transforme.", text: "Les savoir-faire se rencontrent. Votre nouvel espace prend forme, détail après détail.", tag: "03 — RÉALISATION" },
  { title: "Vous habitez.", text: "La porte s’ouvre sur un lieu qui vous ressemble. Votre nouveau chapitre commence.", tag: "04 — NOUVEAU DÉPART" },
];
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export default function MagChapters() {
  const root = useRef<HTMLDivElement>(null);
  const process = useRef<HTMLElement>(null);
  const [project, setProject] = useState("Rénovation complète");
  const [warmth, setWarmth] = useState(65);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const scenes = Array.from(host.querySelectorAll<HTMLElement>("[data-scene]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const render = () => {
      raf = 0;
      for (const scene of scenes) {
        const r = scene.getBoundingClientRect();
        const p = reduced.matches ? 1 : clamp(-r.top / Math.max(1, r.height - window.innerHeight));
        scene.style.setProperty("--p", p.toFixed(4));
        scene.style.setProperty("--entrance", clamp((window.innerHeight - r.top) / window.innerHeight).toFixed(4));
        scene.dataset.step = String(Math.min(3, Math.floor(p * 4)));
        const rail = scene.querySelector<HTMLElement>("[data-rail]");
        if (rail) {
          const distance = Math.max(0, rail.scrollWidth - window.innerWidth + window.innerWidth * .1);
          rail.style.transform = reduced.matches ? "none" : `translate3d(${-p * distance}px,0,0)`;
        }
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
    const resize = new ResizeObserver(schedule);
    scenes.forEach(scene => resize.observe(scene));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    render();
    return () => { cancelAnimationFrame(raf); resize.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);

  function goToStep(index: number) {
    const scene = process.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.scrollTo({ top: window.scrollY + scene.getBoundingClientRect().top + (scene.offsetHeight - window.innerHeight) * ((index + .4) / 4), behavior: "smooth" });
  }

  return <div ref={root} className={s.chapters}>
    <section className={s.expertise} data-scene aria-labelledby="expertise-title">
      <div className={s.sticky}>
        <div className={s.chapterLabel}><span>03 / LE SAVOIR-FAIRE</span><span>UNE VISION. TOUS LES MÉTIERS.</span></div>
        <h2 id="expertise-title" className={s.expertiseTitle}>Changer de <em>perspective.</em><span aria-hidden="true"><MagIcon name="down-right" /></span></h2>
        <div className={s.serviceRail} data-rail>
          {services.map((service, i) => <article key={service.title} className={s.serviceCard} style={{ "--i": i } as CSSProperties}>
            <div className={s.cardInner}>
              <div className={s.cardTop}><span>{service.category}</span><span>0{i + 1}</span></div>
              <div className={`${s.sculpture} ${s[service.shape]}`} aria-hidden="true">{Array.from({length:7},(_,j)=><i key={j} style={{"--j":j} as CSSProperties}/>)}</div>
              <h3>{service.title}</h3><p>{service.detail}</p>
              <div className={s.cardBottom}><span>{service.tags}</span><a href="#contact-mag" aria-label={`Parlons de votre projet : ${service.category}`} onClick={()=>setProject(i===0?"Rénovation complète":i===1?"Cuisine / Salle de bain":"Extérieur")}><MagIcon name="up-right" /></a></div>
            </div>
          </article>)}
          <div className={s.railEnd}><span>VOTRE ESPACE.</span><strong>Sans<br /><em>limites.</em></strong><a href="#contact-mag">À vous de jouer <MagIcon name="up-right" /></a></div>
        </div>
        <div className={s.railFooter}><span>LE MOUVEMENT CONTINUE</span><div><i/></div><span>SCROLLEZ POUR EXPLORER <MagIcon name="right" /></span></div>
      </div>
    </section>

    <section ref={process} className={s.process} data-scene data-step="0" aria-labelledby="process-title">
      <div className={s.sticky}>
        <div className={s.blueprintGrid} aria-hidden="true"/>
        <div className={s.chapterLabel}><span>04 / DE L’IDÉE À LA CLÉ</span><span>FAITES DÉFILER. PRENEZ DE LA HAUTEUR.</span></div>
        <h2 id="process-title" className={s.processTitle}>Tout se <em>construit.</em></h2>
        <div className={s.blueprint} aria-hidden="true">
          <div className={s.building}>
            <div className={`${s.layer} ${s.floor}`}><span>01 / LES FONDATIONS</span><i/><i/><i/></div>
            <div className={`${s.layer} ${s.plan}`}><span>02 / LES VOLUMES</span><i/><i/><i/></div>
            <div className={`${s.layer} ${s.finish}`}><span>03 / LES MATIÈRES</span><Image src="/mag/after.jpg" alt="" fill sizes="45vw" /></div>
            <div className={`${s.layer} ${s.roof}`}><span>04 / VOTRE NOUVELLE VIE</span><b>mag®</b></div>
          </div>
          <span className={s.dimension}>UNE NOUVELLE DIMENSION <MagIcon name="up-right" /></span>
        </div>
        <div className={s.stepList}>{steps.map((step,i)=><button key={step.tag} onClick={()=>goToStep(i)} className={s.step} data-index={i}><span>{step.tag}</span><h3>{step.title}</h3><p>{step.text}</p></button>)}</div>
        <div className={s.processBottom}><span>DU PREMIER ÉCHANGE AU DERNIER DÉTAIL.</span><div><i/></div><span>MAG RÉNOVATION</span></div>
      </div>
    </section>

    <section id="contact-mag" className={s.finale} data-scene aria-labelledby="final-title" style={{"--warmth":warmth/100} as CSSProperties}>
      <div className={s.sticky}>
        <div className={s.iris} aria-hidden="true"><Image src="/mag/after.jpg" alt="" fill sizes="100vw"/><div/></div>
        <div className={s.chapterLabel}><span>05 / À VOUS D’IMAGINER</span><span>BORDEAUX & NOUVELLE-AQUITAINE</span></div>
        <div className={s.finalContent}>
          <p className={s.invitation}>LE PLUS BEAU PROJET, C’EST LE VÔTRE.</p>
          <h2 id="final-title">Et si on<br /><em>osait ?</em><span aria-hidden="true"><MagIcon name="up-right" /></span></h2>
          <fieldset className={s.projectChoices}><legend>QU’AVEZ-VOUS ENVIE DE TRANSFORMER ?</legend>{["Rénovation complète","Cuisine / Salle de bain","Extérieur"].map(item=><button type="button" key={item} aria-pressed={project===item} onClick={()=>setProject(item)}>{item}<span><MagIcon name={project===item?"up-right":"plus"} /></span></button>)}</fieldset>
          <div className={s.finalActions}><a href="tel:+33695331511" className={s.call}>Donnons vie à votre projet <span><MagIcon name="up-right" /></span></a><span>Un premier échange. Un devis gratuit.<br/><b>06 95 33 15 11</b></span></div>
          <p className={s.selection} aria-live="polite">Votre envie : {project.toLowerCase()}.</p>
        </div>
        <label className={s.lightControl}>DESSINEZ VOTRE LUMIÈRE <input type="range" min="0" max="100" value={warmth} onChange={e=>setWarmth(Number(e.target.value))} aria-label="Chaleur de la lumière"/><span>CLAIR <MagIcon name="compare" /> CHALEUREUX</span></label>
        <footer className={s.footer}><a href="/mag" aria-label="Retour en haut">mag<span>®</span></a><span>RÉNOVATION INTÉRIEURE & EXTÉRIEURE</span><a href="https://www.instagram.com/mag.renovation33/" target="_blank" rel="noreferrer">INSTAGRAM <MagIcon name="up-right" /></a><small>CONCEPT & DESIGN — <Link href="/">NEXLYTIC</Link></small></footer>
      </div>
    </section>
  </div>;
}
