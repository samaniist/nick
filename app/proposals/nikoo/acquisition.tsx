"use client";
import Arrow from "./arrow";
import { useEffect, useRef } from "react";
import Image from "next/image";
import photo from "@/public/media/nikoo/nikoo-portrait.jpeg";
import s from "./acquisition.module.css";
const chapters = [
  {title:"BE FOUND.",label:"01 / DISCOVERY",body:"Meet people where their search begins. Build local service visibility and professional referral relationships around your confirmed scope.",work:"Local service pages · search presence · referral introduction",measure:"Enquiry source + relevant local visibility"},
  {title:"FEEL RIGHT.",label:"02 / TRUST",body:"Turn a name into someone they can understand. Show your approach, confirmed qualifications and what support actually looks like.",work:"Brand identity · service clarity · a human introduction",measure:"Service-page visits to suitable enquiries"},
  {title:"START SIMPLY.",label:"03 / FIRST CONTACT",body:"Make the first step feel manageable. Ask only what is needed to arrange a conversation, with a clear choice of contact method.",work:"Accessible enquiry route · consent · clear next steps",measure:"Enquiry completion + response time"},
  {title:"FOLLOW THROUGH.",label:"04 / INTAKE",body:"Give every request an owner and a next action. Check fit and availability before discussing a service start. Close the loop when another provider is more suitable.",work:"Intake workflow · response templates · capacity review",measure:"Suitable enquiry to meeting to service start"},
];
export default function Acquisition(){
 const rail=useRef<HTMLElement>(null);
 useEffect(()=>{
  const el=rail.current!; const panels=Array.from(el.querySelectorAll<HTMLElement>('[data-frame]')); let raf=0;let lastProgress=-1;
  const update=()=>{raf=0;const p=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight)));if(p===lastProgress)return;lastProgress=p;el.style.setProperty('--p',String(p));panels.forEach((panel,i)=>{const d=i-p*3;panel.style.setProperty('--d',String(d));panel.style.setProperty('--alpha',String(Math.max(0,1-Math.abs(d)*1.35)));panel.inert=!matchMedia('(prefers-reduced-motion: reduce), (max-width: 760px)').matches&&Math.abs(d)>.6;});};
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce), (max-width: 760px)').matches)return;el.style.setProperty('--mx',String(e.clientX/innerWidth-.5));el.style.setProperty('--my',String(e.clientY/innerHeight-.5));};
  const resize = () => { lastProgress = -1; schedule(); };
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);el.addEventListener('pointermove',move,{passive:true});schedule();
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);el.removeEventListener('pointermove',move)};
 },[]);
 const jump=(i:number)=>{const el=rail.current!;if(matchMedia('(prefers-reduced-motion: reduce), (max-width: 760px)').matches){el.querySelectorAll<HTMLElement>('[data-frame]')[i].scrollIntoView();return}window.scrollTo({top:scrollY+el.getBoundingClientRect().top+(el.offsetHeight-innerHeight)*i/3,behavior:'smooth'})};
 return <section ref={rail} className={s.rail} id="path-to-nikoo" aria-label="From discovery to service start">
 <div className={s.stage}>
 <header className={s.header}><span>03 / A CLEAR WAY TO YOU</span><span>PROPOSED EXPERIENCE · ILLUSTRATIVE CONTENT</span></header>
 <div className={s.world} aria-hidden="true"><div/><div/><div/></div>
 {chapters.map((c,i)=><article key={c.label} data-frame className={s.frame} style={{'--d':i,'--alpha':i===0?1:0} as React.CSSProperties}>
 <div className={s.copy}><p className={s.label}>{c.label}</p><h2>{c.title}</h2><p className={s.body}>{c.body}</p><dl><div><dt>WHAT WE BUILD</dt><dd>{c.work}</dd></div><div><dt>WHAT WE MEASURE</dt><dd>{c.measure}</dd></div></dl></div>
 <div className={s.visual}>
 <div className={s.browserBar}><span>nik supports</span><span>{['DISCOVER','MEET NIKOO','GET IN TOUCH','INTAKE'][i]} / 0{i+1}</span></div>
 {i===0&&<div className={s.search}>
 <p className={s.micro}>A QUESTION BECOMES A SEARCH</p><div className={s.query}><span>⌕</span>young adult support near me<i/></div>
 <div className={s.result}><small>ILLUSTRATIVE SEARCH RESULT · NOT A LIVE RANKING</small><h3>Support that starts with you.</h3><p>Nik Supports · Clear services, a personal approach and a simple first conversation.</p><span>Explore support <Arrow direction="up-right"/></span></div>
 <div className={s.referral}><span><Arrow direction="up-right"/></span><div><strong>Or a trusted introduction.</strong><p>A coordinator shares your provider profile.</p></div></div>
 <p className={s.note}>Location and search demand to be researched before launch.</p></div>}
 {i===1&&<div className={s.preview}><div className={s.photo}><Image src={photo} alt="Nikoo in a blue shirt" fill sizes="(max-width:760px) 40vw, 25vw" placeholder="blur"/></div><div className={s.siteCopy}><p className={s.micro}>MEET THE PERSON</p><h3>Your goals.<br/>Your pace.<br/><span>Your next step.</span></h3><p>Get to know Nikoo, the support available and how a first conversation works.</p><span className={s.fakeButton}>Get to know Nikoo <Arrow direction="up-right"/></span></div><div className={s.trust}>Approach <span><Arrow direction="right"/></span> Qualifications <span><Arrow direction="right"/></span> Service fit</div></div>}
 {i===2&&<div className={s.form}><p className={s.micro}>AN INVITATION, NOT AN INTERROGATION</p><h3>Let’s start with<br/>a conversation.</h3><div className={s.field}>Your name<span>01</span></div><div className={s.field}>How would you like us to contact you?<span>02</span></div><div className={s.choice}><span>Email</span><span>Phone</span></div><p>A brief reason for getting in touch. Detailed health information belongs in an appropriate intake process.</p><span className={s.fakeButton}>Request a conversation <Arrow direction="up-right"/></span><small>Visual prototype — this is not a working enquiry form.</small></div>}
 {i===3&&<div className={s.intake}><p className={s.micro}>A REQUEST SHOULD NEVER BECOME A GUESSING GAME</p><h3>Every enquiry.<br/><span>A clear next step.</span></h3>{['Received & acknowledged','Fit and availability checked','First conversation arranged','Service start agreed'].map((step,n)=><div className={s.row} key={step}><span>0{n+1}</span><p>{step}</p><b><Arrow direction={n===3?"up-right":"down"}/></b></div>)}<p className={s.note}>If unsuitable or unavailable: explain the outcome and, where appropriate, suggest another route. No automatic promise of acceptance.</p></div>}
 </div></article>)}
 <footer className={s.footer}><span>SCROLL TO MOVE THE JOURNEY FORWARD</span><nav aria-label="Acquisition journey">{chapters.map((c,i)=><button key={c.label} onClick={()=>jump(i)} aria-label={c.title}>0{i+1}</button>)}</nav><div className={s.progress}><i/></div></footer>
 </div></section>
}
