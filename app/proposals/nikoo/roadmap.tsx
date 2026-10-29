"use client";
import Arrow from "./arrow";
import { useEffect, useRef, useState } from "react";
import s from "./roadmap.module.css";
const phases=[
 {title:"Give the business a clear identity.",label:"DEFINE",days:"01—30",deliver:"Market & audience review · service positioning · visual identity",need:"Your scope, qualifications, location and capacity.",gate:"An offer you can confidently deliver.",steps:["Understand the people","Define the offer","Build the identity"]},
 {title:"Build the way people reach you.",label:"LAUNCH",days:"31—60",deliver:"Website · enquiry process · local search setup · referral pack",need:"Approved content and an owner for every enquiry.",gate:"A tested journey from discovery to first conversation.",steps:["Build the website","Connect the enquiry route","Prepare referrals & launch"]},
 {title:"Learn what works. Shape what comes next.",label:"REFINE",days:"61—90",deliver:"Enquiry-quality review · journey improvements · next investment plan",need:"Feedback on suitability, outcomes and availability.",gate:"Growth decisions grounded in evidence and capacity.",steps:["Review real enquiries","Improve the journey","Choose the next investment"]},
];
export default function Roadmap(){
 const root=useRef<HTMLElement>(null);const [day,setDay]=useState(0);const [paused,setPaused]=useState(false);
 const phase=Math.min(2,Math.floor(day/30));
 useEffect(()=>{const el=root.current!;let frame=0;let lastProgress=-1;const update=()=>{frame=0;const p=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight)));if(p===lastProgress)return;lastProgress=p;el.style.setProperty('--progress',String(p));setDay(Math.round(p*90))};const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};const resize = () => { lastProgress = -1; schedule(); };
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);schedule();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize)}},[]);
 const jump=(index:number)=>{const el=root.current!;window.scrollTo({top:scrollY+el.getBoundingClientRect().top+(el.offsetHeight-innerHeight)*(index*30+1)/90,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})};
 const p=phases[phase];
 return <section ref={root} id="first-90-days" className={s.rail} data-paused={paused} aria-label="The first 90 days roadmap"><div className={s.stage}>
 <header className={s.header}><span>04 / THE FIRST 90 DAYS</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Enable transitions':'Reduce motion'}</button><span>PROPOSED PLAN / TIMING AGREED TOGETHER</span></header>
 <div className={s.heading}><h2>A business.<br/><em>Built in stages.</em></h2><div className={s.counter}><span>DAY</span><strong>{String(day).padStart(2,'0')}</strong><small>/ 90</small></div></div>
 <div className={s.workspace}>
 <div className={s.map} aria-label="Roadmap from definition through launch to refinement">
 <div className={s.mapTop}><span>THE JOURNEY</span><span>IDEA <Arrow direction="right"/> READY <Arrow direction="right"/> LEARNING</span></div>
 <svg className={s.path} viewBox="0 0 700 330" preserveAspectRatio="none" aria-hidden="true"><path d="M40 250 C150 250 120 80 250 80 S380 250 470 250 S560 80 660 80"/><path className={s.traced} pathLength="1" d="M40 250 C150 250 120 80 250 80 S380 250 470 250 S560 80 660 80"/></svg>
 {phases.map((item,i)=><button key={item.label} className={s.station} data-active={phase===i} data-complete={day>=(i+1)*30} onClick={()=>jump(i)} style={{'--station':i} as React.CSSProperties}><span className={s.dot}>{day>=(i+1)*30?'✓':`0${i+1}`}</span><span className={s.stationTitle}>{item.label}</span><span className={s.days}>DAYS {item.days}</span><span className={s.tasks}>{item.steps.map((step,j)=><span key={step} data-done={day>=i*30+(j+1)*10}>{step}</span>)}</span></button>)}
 <div className={s.mapBottom}><span>START WITH CLARITY</span><span>GROW WITH EVIDENCE <Arrow direction="up-right"/></span></div>
 </div>
 <div className={s.output}>
 <div className={s.outputTop}><span>TAKING SHAPE</span><span>0{phase+1} / {p.label}</span></div>
 <div className={s.preview} key={phase}>
 {phase===0?<div className={s.identity}><div className={s.brandMark}>n<span><Arrow direction="up-right"/></span></div><h3>nik supports</h3><p>Your goals. Your pace.</p><div className={s.swatches}><i/><i/><i/></div><small>IDENTITY DIRECTION / CONCEPT</small></div>:phase===1?<div className={s.website}><div className={s.siteNav}>nik supports <span>LET’S TALK <Arrow direction="up-right"/></span></div><div className={s.siteBody}><h3>Support that<br/>starts with <em>you.</em></h3><p>A clear introduction.<br/>An easier first step.</p><span className={s.cta}>Start a conversation <Arrow direction="up-right"/></span></div><div className={s.connection}>WEBSITE <span><Arrow direction="right"/></span> ENQUIRY <span><Arrow direction="right"/></span> RESPONSE</div></div>:<div className={s.review}><h3>From contact<br/>to a clear next step.</h3>{['Source recorded','Suitability reviewed','Next action assigned'].map((text,i)=><div key={text}><span>0{i+1}</span>{text}<b><Arrow direction="up-right"/></b></div>)}<p>Review quality. Improve the journey.<br/>Invest where the evidence leads.</p></div>}
 </div><div className={s.outputFoot}>ILLUSTRATIVE OUTPUT · NOT LIVE PERFORMANCE DATA</div>
 </div>
 </div>
 <div className={s.brief}><div><span className={s.eyebrow}>DAYS {p.days} / {p.label}</span><h3>{p.title}</h3></div><div><span className={s.eyebrow}>WE DELIVER</span><p>{p.deliver}</p></div><div><span className={s.eyebrow}>FROM YOU</span><p>{p.need}</p></div><div className={s.gate}><span className={s.eyebrow}>READY FOR THE NEXT STEP</span><p>{p.gate}</p></div></div>
 <footer className={s.footer}><span>SCROLL TO BUILD THE PLAN <Arrow direction="down"/></span><div><i/></div><span>90 DAYS / ONE CONNECTED JOURNEY</span></footer>
 </div></section>
}
