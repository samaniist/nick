import { ArrowUpRight } from "./icons";
import Link from "next/link";
import type { RefObject } from "react";
import "./growth-journey.css";

export const journeySteps = [
  { title: <>Get <em>found.</em></>, label: "Get found", detail: "Be there when your next customer starts looking.", disciplines: "Search strategy / SEO / Paid media" },
  { title: <>Earn <em>trust.</em></>, label: "Earn trust", detail: "A first impression that gives people a reason to choose you.", disciplines: "Brand / Web design / Experience" },
  { title: <>Make it <em>happen.</em></>, label: "Create customers", detail: "Turn interest into a conversation. A booking. A sale.", disciplines: "Conversion / Sales journeys / Follow-up" },
  { title: <>Grow. <em>Together.</em></>, label: "Grow together", detail: "Your ambition. Our expertise. One direction.", disciplines: "Strategy / Design / Marketing / Sales" },
];

function SearchScene() {
  return <div className="journey-search" aria-hidden="true">
    <div className="journey-search-field"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span data-typed-query/><i className="journey-caret"/><span className="journey-enter">↵</span></div>
    <div className="journey-search-result"><span className="journey-rank">01</span><div><span className="journey-result-domain">yourbusiness.com</span><span className="journey-result-category">The answer they were looking for.</span></div><span className="journey-result-arrow"><ArrowUpRight/></span></div>
    <div className="journey-search-tabs"><span>Relevant.</span><span>Visible.</span><span>Chosen.</span></div>
  </div>;
}

export default function GrowthJourney({ sectionRef, videoRef }: { sectionRef: RefObject<HTMLElement | null>; videoRef: RefObject<HTMLVideoElement | null> }) {
  return <section ref={sectionRef} id="growth-journey" className="growth-journey" aria-label="Why Nexlytic: from first click to lasting growth" data-step="0">
    <div className="journey-film" aria-hidden="true"><video ref={videoRef} muted playsInline preload="none" poster="/media/growth-journey/v2/poster.jpg" disablePictureInPicture tabIndex={-1}/></div>
    <div className="journey-veil" aria-hidden="true"/>
    <p className="journey-eyebrow"><span>05</span> / WHY NEXLYTIC</p>
    <span className="journey-corner" aria-hidden="true">A CONNECTED APPROACH TO GROWTH</span>
    <div className="journey-story">{journeySteps.map((step,index)=><div className="journey-beat" data-beat={index} key={step.label}>
      {index === 0 && <SearchScene/>}
      {index === 1 && <div className="journey-signal" aria-hidden="true"><span className="journey-seal">✓</span><span>Clarity in every detail.</span><span className="journey-signal-line"/></div>}
      {index === 2 && <div className="journey-action" aria-hidden="true"><span className="journey-action-before">Start a conversation <b><ArrowUpRight/></b></span><span className="journey-action-after">✓ &nbsp; A new connection.</span><svg className="journey-cursor" viewBox="0 0 24 30"><path d="M2 1 21 18 12 19 8 28Z"/></svg></div>}
      {index === 3 && <div className="journey-alliance" aria-hidden="true"><span>Design</span><i/><span>Marketing</span><i/><span>Sales</span></div>}
      <h2 className="journey-headline">{step.title}</h2>
      <div className="journey-caption"><p className="journey-discipline">{step.disciplines}</p><p className="journey-description">{step.detail}</p>{index === 3 && <Link className="journey-cta" href="/contact">Let’s grow your business <span aria-hidden="true"><ArrowUpRight/></span></Link>}</div>
    </div>)}</div>
    <div className="journey-route" aria-label="Customer journey">{journeySteps.map((step,i)=><div key={step.label} data-route={i}><span>0{i+1}</span><b>{step.label}</b><i/></div>)}</div>
    <span className="journey-demo">Illustrative journey</span>
  </section>;
}
