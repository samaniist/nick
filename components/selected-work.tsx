"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import "./selected-work.css";
import NextChapter, { BrandPreview, SystemsPreview, LeadsPreview, growthPaths } from "./next-chapter";

function CommerceOverview() {
  return <div className="commerce-overview" aria-label="Illustrative commerce dashboard: sales up 28.4 percent, operating costs down 18 percent. Demo data, not client results.">
    <header><span className="commerce-brand">N<span>↗</span></span><span>Nexlytic <b>/ Commerce overview</b></span><small>DEMO DATA</small></header>
    <div className="commerce-summary"><div><p>Total revenue <span>↗ 28.4%</span></p><strong>€128,400<span>.00</span></strong><small>Across all your sales channels</small></div><div className="commerce-cost"><p>Operating costs</p><strong>€24,600</strong><span>↓ 18.0% vs. previous period</span></div></div>
    <div className="commerce-chart"><div className="commerce-chart-heading"><span>Growth, connected.</span><small>LAST 6 MONTHS</small></div><svg viewBox="0 0 600 155" fill="none" aria-hidden="true"><defs><linearGradient id="commerce-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#61e6f7" stopOpacity=".23"/><stop offset="1" stopColor="#61e6f7" stopOpacity="0"/></linearGradient><linearGradient id="commerce-line"><stop stopColor="#347d9a"/><stop offset=".55" stopColor="#67e8f9"/><stop offset="1" stopColor="#c4fff0"/></linearGradient></defs>{[25,65,105,145].map(y=><path key={y} d={`M0 ${y} H600`} stroke="#ffffff" strokeOpacity=".06"/>)}<path d="M0 137 C40 137 46 110 90 114 S150 98 184 104 S245 68 285 79 S345 46 380 55 S450 40 476 29 S540 31 600 5 V155 H0Z" fill="url(#commerce-fill)"/><path className="commerce-line-glow" d="M0 137 C40 137 46 110 90 114 S150 98 184 104 S245 68 285 79 S345 46 380 55 S450 40 476 29 S540 31 600 5" stroke="#62e7f4" strokeWidth="6"/><path className="commerce-line" d="M0 137 C40 137 46 110 90 114 S150 98 184 104 S245 68 285 79 S345 46 380 55 S450 40 476 29 S540 31 600 5" stroke="url(#commerce-line)" strokeWidth="2.5" pathLength="1"/><path className="commerce-flow" d="M0 137 C40 137 46 110 90 114 S150 98 184 104 S245 68 285 79 S345 46 380 55 S450 40 476 29 S540 31 600 5" stroke="#ecffff" strokeWidth="3.5" pathLength="1"/><circle className="commerce-endpoint" cx="596" cy="7" r="4" fill="#c4fff0"/></svg><div className="commerce-months">{['Jan','Feb','Mar','Apr','May','Jun'].map(m=><span key={m}>{m}</span>)}</div></div>
    <div className="commerce-channels">{[{name:'Amazon',amount:'€64,200',share:'50%',icon:'a'},{name:'Online shop',amount:'€44,940',share:'35%',icon:'↗'},{name:'eBay',amount:'€19,260',share:'15%',icon:'e'}].map(c=><div key={c.name}><i>{c.icon}</i><span>{c.name}<strong>{c.amount}</strong></span><small>{c.share}</small></div>)}</div>
    <footer><span className="commerce-live-feed"><i/><span>Amazon · New order €129</span><span>Online shop · New order €249</span><span>eBay · New order €89</span></span><span>Illustrative demo · Not client results</span></footer>
  </div>;
}

export default function SelectedWork({ sectionRef, nextRef }: { sectionRef: RefObject<HTMLElement | null>; nextRef: RefObject<HTMLElement | null> }) {
  const router = useRouter();
  const device = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const navigating = useRef(false);
  const [paused, setPaused] = useState(false);
  const [goal, setGoal] = useState(1);
  const [fourth, setFourth] = useState(false);
  useEffect(() => {
    const root = sectionRef.current!;
    const observer = new MutationObserver(() => setFourth(root.dataset.fourth === 'true'));
    observer.observe(root, { attributes: true, attributeFilter: ['data-fourth'] });
    queueMicrotask(() => setFourth(root.dataset.fourth === 'true'));
    return () => observer.disconnect();
  }, [sectionRef]);
  useEffect(() => {
    const node = device.current;
    if (!node) return;
    const resize = new ResizeObserver(([entry]) => node.style.setProperty('--device-scale', String(entry.contentRect.width / 780)));
    resize.observe(node);
    return () => resize.disconnect();
  }, []);
  const [lens, setLens] = useState(2);
  const perspectives = [
    { name: "Design", copy: "A distinct identity. An unmistakable first impression. Every detail gives people a reason to remember you." },
    { name: "Experience", copy: "Intuitive journeys. Effortless decisions. Digital experiences that turn attention into action." },
    { name: "Growth", copy: "Beautiful is the beginning. We connect design, technology and commerce to turn ambition into measurable growth." },
  ];
  function moveButton(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--magnet-x', `${(event.clientX - box.left - box.width / 2) * .09}px`);
    event.currentTarget.style.setProperty('--magnet-y', `${(event.clientY - box.top - box.height / 2) * .16}px`);
  }
  function resetButton(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty('--magnet-x', '0px');
    event.currentTarget.style.setProperty('--magnet-y', '0px');
  }
  useEffect(() => () => { navigating.current = false; animation.current?.cancel(); }, []);

  async function enterWork() {
    if (navigating.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { router.push('/case-studies'); return; }
    const laptop = device.current!, display = screen.current!;
    const box = display.getBoundingClientRect();
    const laptopBox = laptop.getBoundingClientRect();
    const scale = Math.max(window.innerWidth / box.width, window.innerHeight / box.height) * 1.05;
    const dx = window.innerWidth / 2 - (box.left + box.width / 2);
    const dy = window.innerHeight / 2 - (box.top + box.height / 2);
    navigating.current = true;
    sectionRef.current!.dataset.entering = 'true';
    // Transform around the screen centre so its contents cover the viewport.
    laptop.style.transformOrigin = `${box.left + box.width / 2 - laptopBox.left}px ${box.top + box.height / 2 - laptopBox.top}px`;
    animation.current = laptop.animate([{ transform: 'translate3d(0,0,0) scale(1)' }, { transform: `translate3d(${dx}px,${dy}px,0) scale(${scale})` }], { duration: 1050, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' });
    try { await animation.current.finished; if (navigating.current) router.push('/case-studies'); } catch { /* Unmounted during navigation. */ }
  }

  return <section ref={sectionRef} id="selected-work" className="selected-work" data-paused={paused} data-lens={lens} aria-labelledby="selected-work-title">
    <div className="work-copy">
      <p className="work-eyebrow"><span>03</span><i/> Selected work</p>
      <h2 id="selected-work-title"><span className="work-title-line"><span>Built to move</span></span><span className="work-title-line"><span className="work-title-accent">business.</span></span></h2>
      <div className="work-lenses" role="group" aria-label="Explore our approach">{perspectives.map((perspective, index) => <button key={perspective.name} type="button" aria-pressed={lens === index} onClick={() => setLens(index)}><span className="work-lens-number">0{index + 1}</span>{perspective.name}<i/></button>)}</div>
      <div className="work-description-stage" aria-live="polite"><p key={lens} className="work-description">{perspectives[lens].copy}</p></div>
      <Link className="work-explore" href="/case-studies" onPointerMove={moveButton} onPointerLeave={resetButton} onMouseEnter={() => router.prefetch('/case-studies')} onNavigate={event => { event.preventDefault(); void enterWork(); }}><span className="work-cta-label">Explore our work</span><span className="work-cta-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5"/></svg></span></Link>
      <p className="work-footnote"><i/> Strategy meets craft. Results follow.</p>
    </div>
    <div className="work-device-wrap"><div ref={device} className="work-device">
      <div className="work-reference-scene"><div className="work-reference-photo" aria-hidden="true"/><div ref={screen} className="work-screen work-reference-screen"><div key={fourth ? goal : "commerce"} className="work-screen-content">{fourth && goal === 0 ? <BrandPreview/> : fourth && goal === 2 ? <SystemsPreview/> : fourth && goal === 3 ? <LeadsPreview/> : <CommerceOverview/>}</div><span className="work-screen-reflection" aria-hidden="true"/></div></div>
    </div><div className="work-preview-caption"><span><i/>{fourth ? `Nexlytic / ${growthPaths[goal].title}` : "Nexlytic / Commerce overview"}</span><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Play dashboard animation" : "Pause dashboard animation"}>{paused ? "Play ▷" : "Pause Ⅱ"}</button></div></div>
    <NextChapter sectionRef={nextRef} selected={goal} onSelect={setGoal}/>
  </section>;
}
