"use client";
import { useEffect, useRef, useState } from "react";
import s from "./partnership.module.css";
const steps=[
 {name:"BE DISCOVERED",who:"NEXLYTIC",text:"We build the identity, website and discovery routes that make your confirmed offer clear.",left:"Brand, website & discovery",right:"Confirm your services & scope",x:24,y:25},
 {name:"MAKE CONTACT",who:"NEXLYTIC + NIKOO",text:"We build the enquiry route and agreed response workflow. You or your nominated contact responds to the person.",left:"Enquiry journey & workflow",right:"Acknowledge & respond",x:50,y:48},
 {name:"CHECK THE FIT",who:"NIKOO",text:"You assess suitability, availability and the next step. Professional judgement and service decisions stay with you.",left:"Clear information & referral tools",right:"Suitability & service decisions",x:76,y:68},
 {name:"LEARN TOGETHER",who:"SHARED",text:"Together, we review anonymised enquiry patterns and capacity to decide what to improve next.",left:"Marketing review & improvements",right:"Outcome feedback & capacity",x:50,y:89},
];
export default function Partnership(){
 const root=useRef<HTMLElement>(null),closing=useRef<HTMLElement>(null);const [step,setStep]=useState(0);
 useEffect(()=>{const el=root.current!;let raf=0;const update=()=>{raf=0;const p=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight)));el.style.setProperty('--p',String(p));setStep(Math.min(3,Math.floor(p*4)));const end=closing.current;if(end){const reveal=Math.max(0,Math.min(1,(innerHeight-end.getBoundingClientRect().top)/innerHeight));end.style.setProperty('--reveal',String(reveal))}};const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)}},[]);
 const go=(i:number)=>{const el=root.current!;window.scrollTo({top:scrollY+el.getBoundingClientRect().top+(el.offsetHeight-innerHeight)*(i+.1)/4,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})};
 const current=steps[step];
 return <><section ref={root} id="working-together" className={s.rail} aria-label="How we work together"><div className={s.stage}>
 <header className={s.header}><span>05 / BUILT TOGETHER</span><span>PROPOSED RESPONSIBILITIES · AGREED IN SCOPE</span></header>
 <h2 className={s.title}>You support people.<br/><span>We support your business.</span></h2>
 <div className={s.scene}>
 <div className={s.ownerLeft}><span>THE BUSINESS EXPERIENCE</span><h3>SAMAN<br/>/ NEXLYTIC</h3><p>{current.left}</p></div>
 <div className={s.ownerRight}><span>THE HUMAN CONNECTION</span><h3>NIKOO<br/>/ NIK SUPPORTS</h3><p>{current.right}</p></div>
 <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path d="M500 0 C500 45 240 25 240 100 S500 150 500 192 S760 220 760 272 S500 315 500 400"/><path className={s.activePath} pathLength="1" d="M500 0 C500 45 240 25 240 100 S500 150 500 192 S760 220 760 272 S500 315 500 400"/></svg>
 <div className={s.request} style={{left:`${current.x}%`,top:`${current.y}%`}}><i/><span>ILLUSTRATIVE ENQUIRY</span></div>
 <span className={s.shared}>ONE CONNECTED EXPERIENCE</span>
 </div>
 <div className={s.explanation}><div><span>0{step+1} / {current.who}</span><h3>{current.name}</h3></div><p>{current.text}</p></div>
 <footer className={s.footer}><nav aria-label="Explore responsibilities">{steps.map((item,i)=><button key={item.name} aria-label={item.name} aria-current={step===i?'step':undefined} onClick={()=>go(i)}>0{i+1}</button>)}</nav><span>SCROLL TO FOLLOW THE HANDOVER ↓</span><small>Clinical and service decisions remain with Nikoo.</small></footer>
 </div></section>
 <section ref={closing} id="next-chapter" className={s.closing} aria-label="Start a conversation with Saman"><div className={s.thread} aria-hidden="true"/><p className={s.kicker}>THE NEXT CHAPTER STARTS WITH A CONVERSATION.</p><h2>LET’S BUILD<br/>WHAT’S NEXT,<br/><span>NIKOO.</span></h2><div className={s.closeBottom}><div><p>First, we clarify your services, location and capacity.<br/>Then we agree the scope, timing and investment.</p><a className={s.cta} href="https://wa.me/4917670767725" target="_blank" rel="noopener noreferrer">Start a conversation with Saman <span aria-hidden="true">↗</span></a><a className={s.email} href="mailto:hello@nexlytic.de?subject=Nik%20Supports%20%E2%80%94%20next%20steps">Prefer email? hello@nexlytic.de ↗</a></div><div className={s.signature}><span>PREPARED FOR NIKOO</span><strong>Saman / Nexlytic</strong><p>Strategy. Identity. Digital experience.</p></div></div><footer className={s.end}><span>NIK SUPPORTS × NEXLYTIC</span><a href="#first-90-days">Revisit the 90-day plan ↑</a></footer></section></>;
}
