import { ArrowUpRight } from "./icons";
import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";
import "./connected-growth.css";

const disciplines = [
  { name: "Brand", line: "Make your mark.", href: "/services" },
  { name: "Web", line: "Turn attention into action.", href: "/services" },
  { name: "Performance", line: "Connect reach to results.", href: "/services/performance-marketing" },
];

/** Live typography and links stay separate from the cinematic background. */
export default function ConnectedGrowth({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  return (
    <section ref={sectionRef} id="connected-growth" className="connected-growth" aria-labelledby="connected-growth-title">
      <div className="connected-growth-static" aria-hidden="true">
        <Image src="/media/connected-growth/poster.jpg" alt="" width={1672} height={941} sizes="100vw" />
      </div>
      <div className="connected-growth-heading">
        <p className="connected-growth-eyebrow">02 / Connected growth</p>
        <h2 id="connected-growth-title"><span className="reveal-line"><span>Everything connects.</span></span><span className="reveal-line"><span className="cg-accent">Your business moves forward.</span></span></h2>
      </div>
      <ol className="connected-growth-disciplines">
        {disciplines.map((item, index) => (
          <li key={item.name} data-discipline={index}>
            <Link href={item.href} aria-label={`Explore ${item.name} services`}>
              <span className="connected-growth-link-title"><span className="connected-growth-number">0{index + 1}</span> {item.name}<span className="connected-growth-arrow" aria-hidden="true"><ArrowUpRight/></span></span>
              <span className="connected-growth-description">{item.line}</span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="connected-growth-note">One studio. Every connection counts.</p>
    </section>
  );
}
