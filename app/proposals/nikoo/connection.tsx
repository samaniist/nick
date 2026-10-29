"use client";
import { useEffect, useRef } from "react";
import s from "./connection.module.css";

const people = [
  { name: "A young person", question: "Will you listen to me — or decide for me?", need: "Agency, a comfortable connection and support tied to their own goals.", barrier: "Clinical jargon, pressure to commit and a process that speaks only to parents.", discovery: "A recommendation. A search. A first impression.", proof: "Show the person, the approach and what a first conversation feels like. Use direct language that respects their agency.", action: "A low-pressure enquiry with a choice of contact method.", asset: "Your introduction + a clear first-step page" },
  { name: "A parent or carer", question: "Will you understand them, and keep us informed?", need: "Evidence of fit, clear boundaries and a dependable communication process.", barrier: "Broad promises, unclear qualifications and uncertainty about what happens next.", discovery: "A trusted connection or a search for local support.", proof: "Make qualifications, service boundaries, communication and the support process easy to check. Explain how the young person stays involved.", action: "A clear fit conversation: needs, location, availability and next steps.", asset: "Service pages + credentials + process explained" },
  { name: "A referral partner", question: "Can I confidently refer this person to you?", need: "Confirmed service scope, eligibility, location, capacity and a clear handover.", barrier: "An impressive service list without enough detail to assess suitability.", discovery: "Professional relationships and a concise provider introduction.", proof: "Publish confirmed scope, age groups, service area, funding arrangements and current availability. Make the right referral easy.", action: "A short referral route with consent and an agreed response process.", asset: "Referral pack + availability + dedicated enquiry route" },
];
export default function Connection() {
  const host = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    const rail = track.current!;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-person]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.max(0, Math.min(1, -rail.getBoundingClientRect().top / Math.max(1, rail.offsetHeight - innerHeight)));
      el.style.setProperty("--journey", String(p));
      panels.forEach((panel, i) => {
        const distance = i - p * 2;
        panel.style.setProperty("--distance", String(distance));
        panel.style.setProperty("--visibility", String(Math.max(0, 1 - Math.abs(distance) * 1.25)));
        panel.inert = !reduced.matches && Math.abs(distance) > .65;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const move = (e: PointerEvent) => {
      if (reduced.matches || e.pointerType !== "mouse") return;
      el.style.setProperty("--x", String(e.clientX / innerWidth - .5));
      el.style.setProperty("--y", String(e.clientY / innerHeight - .5));
    };
    window.addEventListener("scroll", schedule, {passive:true}); window.addEventListener("resize", schedule);
    el.addEventListener("pointermove", move, {passive:true}); schedule();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll",schedule); window.removeEventListener("resize",schedule); el.removeEventListener("pointermove",move); };
  }, []);
  const go = (i:number) => {
    const el = track.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { host.current?.querySelectorAll<HTMLElement>("[data-person]")[i].scrollIntoView(); return; }
    window.scrollTo({top:scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * i / 2, behavior:"smooth"});
  };
  return <section id="connection-plan" ref={host} className={s.section} aria-label="Understanding the people choosing Nikoo">
    <div ref={track} className={s.track}>
      <div className={s.scene}>
        <header className={s.top}><span>02 / THROUGH THEIR EYES</span><span>NIK SUPPORTS × NEXLYTIC</span></header>
        <div className={s.architecture} aria-hidden="true">{Array.from({length:9},(_,i)=><div key={i} style={{"--ring":i} as React.CSSProperties}/>)}</div>
        <div className={s.axis} aria-hidden="true"><span>UNDERSTAND</span><i/><span>CONNECT</span></div>
        {people.map((p,i)=><article key={p.name} data-person className={s.person} style={{"--distance":i,"--visibility":i===0?1:0} as React.CSSProperties}>
          <div className={s.number} aria-hidden="true">0{i+1}</div>
          <div className={s.statement}>
            <p className={s.kicker}>{p.name.toUpperCase()} / THE QUESTION BEFORE THE ENQUIRY</p>
            <h2>{i===0?<>SEE ME.<br/><span>HEAR ME.</span></>:i===1?<>EARN MY<br/><span>TRUST.</span></>:<>MAKE THE<br/><span>FIT CLEAR.</span></>}</h2>
            <p className={s.question}>“{p.question}”</p>
          </div>
          <div className={s.strategy}>
            <span className={s.tag}>WHAT THIS MEANS FOR YOUR BUSINESS</span>
            <h3>{i===0?"Connection before conversion.":i===1?"Make confidence concrete.":"Remove the referral friction."}</h3>
            <p>{p.proof}</p>
            <div className={s.obstacle}><span>THE FRICTION</span><p>{p.barrier}</p></div>
            <div className={s.solution}><span>OUR RESPONSE ↗</span><p>{p.asset}</p><small>{p.action}</small></div>
          </div>
        </article>)}
        <footer className={s.bottom}><span>SCROLL TO CHANGE PERSPECTIVE</span><div className={s.progress}><i/></div><nav aria-label="Audience chapters">{people.map((p,i)=><button key={p.name} onClick={()=>go(i)} aria-label={`Explore ${p.name}`}>0{i+1}</button>)}</nav></footer>
      </div>
    </div>
    <div className={s.evidence}>
      <div><p className={s.label}>THE EVIDENCE BEHIND THE DIRECTION</p><h3>A plan with reasons.<br /><span>And a way to measure it.</span></h3></div>
      <div className={s.evidenceGrid}>
        <article><span>01 / VERIFIED GUIDANCE</span><h4>Discovery is not one channel.</h4><p>NDIS guidance points people toward trusted recommendations, provider research and reviews. Support coordinators and recovery coaches can help people find providers.</p><a href="https://ndis.gov.au/participants/working-providers/finding-providers/how-find-and-choose-provider" target="_blank" rel="noreferrer">Read the NDIS guidance ↗</a></article>
        <article><span>02 / OUR STRATEGIC RESPONSE</span><h4>Earn trust before asking for contact.</h4><p>Our recommendation: combine local service visibility with a useful referral pack and a clear website. Publish only confirmed qualifications, scope and availability. Test paid acquisition after the enquiry process is ready.</p></article>
        <article><span>03 / MEASUREMENT PLAN</span><h4>Count fit, not just clicks.</h4><p>Track enquiry source, response time, suitable enquiries, first meetings and service starts. Review why people do not proceed. Assess cost per suitable enquiry against actual capacity and economics.</p></article>
      </div>
      <div className={s.research}><strong>Before we set targets.</strong><p>Confirm your city, service radius, qualifications, funding arrangements and weekly capacity. Then assess local providers, search demand and referral opportunities. Local demand, budget and acquisition costs are not yet validated.</p><a href="https://www.ndis.gov.au/publications/quarterly-reports" target="_blank" rel="noreferrer">NDIS regional data for the next research stage ↗</a></div>
      <p className={s.date}>Source review: 29 October 2026. Audience questions are strategic hypotheses based on the supplied brief, not interview findings. This is a proposed system, not a guarantee of enquiries or bookings.</p>
    </div>
  </section>;
}
