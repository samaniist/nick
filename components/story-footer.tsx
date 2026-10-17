"use client";

import { ArrowUpRight, ArrowUp } from "./icons";
import Image from "next/image";
import Link from "next/link";
import { Mrs_Saint_Delafield } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/contact/contact-form";
import "./story-footer.css";

const signatureFont = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], display: "swap" });

export default function StoryFooter() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const footer = root.current!;
    const video = film.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const playback = () => {
      if (visible && !paused && !reduced.matches && !document.hidden) {
        if (!video.getAttribute("src")) { video.src = "/media/footer/ambient-loop.mp4"; video.load(); }
        void video.play().catch(() => {});
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; playback(); }, { rootMargin: "150px" });
    observer.observe(footer);
    reduced.addEventListener("change", playback);
    document.addEventListener("visibilitychange", playback);
    return () => { observer.disconnect(); reduced.removeEventListener("change", playback); document.removeEventListener("visibilitychange", playback); video.pause(); };
  }, [paused]);

  return <footer ref={root} id="hero-clients" className="story-footer" onPointerMove={e => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--footer-light", `${((e.clientX-r.left)/r.width)*100}%`);
  }}>
    <div className="footer-ambient" aria-hidden="true"><video ref={film} muted loop playsInline preload="none" poster="/media/footer/poster.jpg" tabIndex={-1}/></div>
    <div className="footer-light" aria-hidden="true"/>
    <div className="footer-inner" id="contact">
      <header className="footer-opening">
        <p className="footer-eyebrow"><span>06</span> / LET’S BUILD WHAT’S NEXT</p>
        <h2>Your next chapter.<br/><em>Our next conversation.</em></h2>
        <div className="footer-intro-line"><span/><p>Good things start with a conversation.</p></div>
      </header>
      <div className="footer-conversation">
        <section className="footer-founder" id="about-saman" aria-label="Your growth partner">
          <div className="footer-person"><div className="footer-portrait"><Image src="/founder-avatar.jpg" alt="Saman Pouryaghma, founder of Nexlytic" width={480} height={480} sizes="120px"/></div><div><p>Real people.<br/><strong>Shared ambition.</strong></p><span>Based in Munich. Working across Europe.</span></div></div>
          <blockquote>“Your next chapter deserves more than a website.<br/><em>It deserves a growth partner.</em>”</blockquote>
          <div className="footer-signature"><span className={signatureFont.className} aria-hidden="true">Saman Pouryaghma</span><p>Saman Pouryaghma · Founder, Nexlytic</p></div>
          <p className="footer-personal-note">You’ll work directly with me — connecting strategy, design and marketing to move your business forward.</p>
          <div className="footer-direct"><a href="https://wa.me/4917670767725" target="_blank" rel="noopener noreferrer">Let’s talk on WhatsApp <span aria-hidden="true"><ArrowUpRight/></span></a><a href="mailto:hello@nexlytic.de">hello@nexlytic.de <span aria-hidden="true"><ArrowUpRight/></span></a></div>
        </section>
        <section className="footer-form" aria-labelledby="footer-form-title">
          <div className="footer-form-heading"><span>START HERE</span><span><ArrowUpRight/></span></div>
          <h3 id="footer-form-title">What’s your ambition?</h3>
          <p>A few details. A real conversation. A clear next step.</p>
          <ContactForm idPrefix="home"/>
        </section>
      </div>
      <div className="footer-assurances"><span><ArrowUpRight/> Free first conversation</span><span><ArrowUpRight/> Reply within one business day</span><span><ArrowUpRight/> Strategy through to execution</span></div>
      <div className="footer-directory">
        <div className="footer-studio"><span className="footer-label">NEXLYTIC / DIGITAL GROWTH STUDIO</span><p>Built to connect.<br/>Here to move you forward.</p></div>
        <nav aria-label="Explore Nexlytic"><span className="footer-label">EXPLORE</span><Link href="/services">Services</Link><Link href="/case-studies">Our Work</Link><a href="#about-saman">Meet Saman</a><Link href="/mag">Insights</Link><Link href="/contact">Contact</Link></nav>
        <div><span className="footer-label">GET IN TOUCH</span><a href="mailto:hello@nexlytic.de">hello@nexlytic.de</a><a href="tel:+4917670767725">+49 176 70767725</a><a href="https://wa.me/4917670767725" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight/></a></div>
        <div><span className="footer-label">FIND US</span><a href="https://maps.google.com/?q=M%C3%BCnchen%2C+Deutschland" target="_blank" rel="noopener noreferrer">Munich, Germany <ArrowUpRight/></a><span className="footer-location-note">Local understanding.<br/>International perspective.</span></div>
      </div>
      <div className="footer-wordmark" aria-label="Nexlytic">nexlytic<span aria-hidden="true"><ArrowUpRight/></span></div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Nexlytic</p><button type="button" onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused ? "Play background" : "Pause background"}</button><nav aria-label="Legal information"><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link><a href="#top" aria-label="Back to top"><ArrowUp/></a></nav></div>
    </div>
  </footer>;
}
