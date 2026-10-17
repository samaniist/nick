import Link from "next/link";
import type { RefObject } from "react";
import "./next-chapter.css";

export const growthPaths = [
  { id: "brand", title: "Build my brand", description: "An identity people remember. A website they trust.", topic: "Branding" },
  { id: "sales", title: "Grow my sales", description: "Connect your channels. Turn more visits into sales.", topic: "E-Commerce" },
  { id: "systems", title: "Simplify my business", description: "Connect the tools. Automate the work. Make room to grow.", topic: "Automation & Workflows" },
  { id: "leads", title: "Bring me more clients", description: "More qualified enquiries. More booked appointments. Built for practices and service businesses.", topic: "Lead Generation & Appointments" },
];

export function BrandPreview() {
  return <div className="path-brand" aria-label="Illustrative brand and website design preview"><header><strong>N / STUDIO</strong><span>IDENTITY SYSTEM · CONCEPT</span></header><div className="brand-editorial"><small>STRATEGY. IDENTITY. EXPERIENCE.</small><h3>Distinct<br/>by design<span>.</span></h3><div className="brand-sculpture" aria-hidden="true"><i/><i/><i/></div></div><footer><div><span>01 / TYPOGRAPHY</span><b>Aa Bb Cc</b></div><div><span>02 / COLOUR</span><div className="brand-swatches"><i/><i/><i/></div></div><div><span>03 / EXPERIENCE</span><p>Built to be remembered ↗</p></div></footer></div>;
}

export function SystemsPreview() {
  return <div className="path-systems" aria-label="Illustrative workflow automation preview"><header><strong>Nexlytic <span>/ Connected workflows</span></strong><small>DEMO</small></header><div className="systems-heading"><span>LESS BUSYWORK. MORE POSSIBILITY.</span><h3>Let the work flow.</h3><p>Your tools. Working together.</p></div><div className="systems-flow">{['New order','Sync inventory','Create invoice','Notify customer'].map((step,index)=><div key={step} style={{animationDelay:`${index * 1.2}s`}}><i>{['↘','⇄','▤','✓'][index]}</i><span>{step}</span><b>✓</b></div>)}</div><footer><span><i/> Workflow running</span><span>Illustrative automation · Demo</span></footer></div>;
}

export function LeadsPreview() {
  return <div className="path-systems path-leads" aria-label="Illustrative lead generation and appointment dashboard"><header><strong>Nexlytic <span>/ Client growth</span></strong><small>DEMO</small></header><div className="systems-heading"><span>FROM FIRST CLICK TO BOOKED APPOINTMENT</span><h3>Your next client. Connected.</h3></div><div className="lead-metrics"><div><span>Qualified enquiries</span><strong>128<small>↗ 32%</small></strong></div><div><span>Appointments booked</span><strong>46<small>↗ 24%</small></strong></div></div><div className="lead-pipeline">{['Discovered','Enquired','Booked'].map((label,i)=><div key={label}><span>{label}</span><i style={{width:`${95-i*23}%`,animationDelay:`${i*.6}s`}}/></div>)}</div><div className="lead-booking"><i/> New consultation booked <span>✓ Confirmed</span></div><footer>Illustrative demo · Not client results</footer></div>;
}

export default function NextChapter({ sectionRef, selected, onSelect }: { sectionRef: RefObject<HTMLElement | null>; selected: number; onSelect: (index: number) => void }) {
  return <section ref={sectionRef} className="next-chapter" id="next-chapter" aria-labelledby="next-chapter-title">
    <header className="next-chapter-heading"><p className="work-eyebrow"><span>04</span><i/> Your next chapter</p><h2 id="next-chapter-title">What’s your <span>next move?</span></h2><p>Choose the ambition. We’ll build the way forward.</p></header>
    <div className="next-paths"><div role="group" aria-label="Choose your business goal">{growthPaths.map((path,index)=><button key={path.id} type="button" aria-pressed={selected === index} aria-controls="next-path-description" onPointerEnter={event => { if (event.pointerType === "mouse") onSelect(index); }} onFocus={()=>onSelect(index)} onClick={()=>onSelect(index)} className="next-path"><span className="next-path-number">0{index+1}</span><span className="next-path-name">{path.title}</span><span className="next-path-arrow" aria-hidden="true">↗</span></button>)}</div><p id="next-path-description" key={selected} className="next-path-description" aria-live="polite">{growthPaths[selected].description}</p><Link className="work-explore next-cta" href={`/contact?goal=${growthPaths[selected].id}`}><span className="work-cta-label">Let’s build your next chapter</span><span className="work-cta-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5"/></svg></span></Link></div>
  </section>;
}
