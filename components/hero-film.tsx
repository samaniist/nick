"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import ConnectedGrowth from "@/components/connected-growth";
import "./hero-film.css";
import SelectedWork from "./selected-work";
import GrowthJourney from "./growth-journey";
import "./mobile-story.css";

const FILM = "/media/hero/digital-engine-2k.mp4";
const CONNECTION = "/media/connected-growth/connected-growth-2k.mp4";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

export default function HeroFilm({ children }: { children: ReactNode }) {
  const scene = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const connectionVideo = useRef<HTMLVideoElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const connection = useRef<HTMLElement>(null);
  const nextChapter = useRef<HTMLElement>(null);
  const work = useRef<HTMLElement>(null);
  const journey = useRef<HTMLElement>(null);
  const journeyVideo = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const chapter = useRef<HTMLSpanElement>(null);
  const skip = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const root = scene.current!;
    const film = video.current!;
    const nextFilm = connectionVideo.current!;
    const openingContent = opening.current!;
    const nextContent = connection.current!;
    const workContent = work.current!;
    const fourthContent = nextChapter.current!;
    const journeyContent = journey.current!;
    const journeyFilm = journeyVideo.current!;
    const journeyBeats = Array.from(journeyContent.querySelectorAll<HTMLElement>("[data-beat]"));
    const typedQuery = journeyContent.querySelector<HTMLElement>("[data-typed-query]");
    let journeyLoaded = false;
    const workCopy = workContent.querySelector<HTMLElement>(".work-copy")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const disciplineElements = Array.from(nextContent.querySelectorAll<HTMLElement>("[data-discipline]"));
    let frame = 0;
    let target = 0;
    let displayed = 0;
    let lastTime = 0;
    let active = true;
    let disposed = false;
    let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0;
    let hasNext = false;
    let readyNext = false;
    let failedNext = false;
    let failedHero = false;
    let connectionVisible = false;
    let focusChapter: HTMLElement | null = null;

    const loadConnection = () => {
      if (hasNext || reduced.matches || failedNext) return;
      hasNext = true;
      nextFilm.src = CONNECTION;
      nextFilm.load();
    };
    // Short-GOP encodes and a single outstanding seek keep reverse scrubbing responsive.
    const seekFilm = (element: HTMLVideoElement, progress: number) => {
      if (disposed || !active || reduced.matches || element.readyState < 2 || element.seeking) return;
      const time = progress * Math.max(0, element.duration - 1 / 24);
      if (Number.isFinite(time) && Math.abs(element.currentTime - time) > 0.025) element.currentTime = time;
    };
    const seek = () => {
      seekFilm(film, clamp(displayed / 0.43));
      seekFilm(nextFilm, clamp((displayed - 0.49) / 0.43));
      seekFilm(journeyFilm, clamp((displayed - 2.22) / 1.03));
    };
    const updateContent = (showNext: boolean) => {
      if (connectionVisible === showNext && root.dataset.enhanced === "true") return;
      connectionVisible = showNext;
      // No invisible links in the keyboard tab order during the handoff.
      openingContent.inert = showNext && !reduced.matches;
      nextContent.inert = !showNext && !reduced.matches;
      openingContent.setAttribute("aria-hidden", String(showNext && !reduced.matches));
      nextContent.setAttribute("aria-hidden", String(!showNext && !reduced.matches));
      if (showNext && focusChapter === nextContent) { nextContent.focus({ preventScroll: true }); focusChapter = null; }
      if (skip.current) {
        skip.current.href = showNext ? "#hero-clients" : "#connected-growth";
        skip.current.textContent = showNext ? "Explore the studio ↓" : "See how it connects ↓";
      }
    };
    const paint = () => {
      const handoff = smooth((displayed - 0.435) / 0.05);
      const workReveal = smooth((displayed - 0.97) / 0.20);
      root.style.setProperty("--work-opacity", String(workReveal));
      const journeyEntry = smooth((displayed - 1.93) / .29);
      root.style.setProperty("--journey-entry", String(journeyEntry));
      const journeyVisible = displayed >= 2.08;
      journeyContent.inert = !journeyVisible && !reduced.matches;
      journeyContent.setAttribute("aria-hidden", String(journeyContent.inert));
      const journeyProgress = clamp((displayed - 2.22) / 1.03) * 4;
      const step = Math.min(3, Math.floor(journeyProgress));
      const local = Math.min(1, journeyProgress - step);
      const mobile = window.innerWidth < 768;
      const rise = smooth((local - .42) / .24);
      const fly = step === 3 ? 0 : smooth((local - .79) / .20);
      const titleIn = smooth((local - (step === 0 ? .29 : .06)) / .13);
      const titleOut = 1 - smooth((local - .87) / .12);
      const initialScale = step === 0 ? (mobile ? .70 : .34) : .82;
      journeyContent.style.setProperty("--title-scale", String(initialScale + (1 - initialScale) * rise + fly * 5));
      journeyContent.style.setProperty("--title-alpha", String(titleIn * (step === 3 ? 1 : titleOut)));
      journeyContent.style.setProperty("--title-x", String(step === 0 ? (mobile ? -48 : -183) * (1 - rise) : 0));
      journeyContent.style.setProperty("--title-y", String(step === 0 ? (mobile ? 20 : 60) * (1 - rise) : 0));
      journeyContent.style.setProperty("--ui-alpha", String((1 - smooth((local - .47) / .23)) * (step === 0 ? 1 : smooth(local / .08))));
      journeyContent.style.setProperty("--ui-lift", String(rise));
      journeyContent.style.setProperty("--result-alpha", String(smooth((local - .27) / .10)));
      journeyContent.style.setProperty("--caret-alpha", String(local < .28 ? 1 : 0));
      journeyContent.style.setProperty("--confirm", String(smooth((local - .26) / .12)));
      journeyContent.style.setProperty("--local-progress", String(local));
      journeyContent.style.setProperty("--caption-alpha", String(smooth((local - .47) / .15) * (step === 3 ? 1 : 1 - fly)));
      journeyContent.style.setProperty("--film-alpha", String(.85 * (1 - fly)));
      if (typedQuery) {
        const query = "your business".slice(0, Math.floor(clamp((local - .04) / .23) * 13));
        if (typedQuery.textContent !== query) typedQuery.textContent = query;
      }
      journeyContent.dataset.step = String(step);
      journeyBeats.forEach((beat, i) => {
        beat.inert = i !== step && !reduced.matches;
        beat.setAttribute("aria-hidden", String(beat.inert));
      });
      if (displayed >= 2.22 && focusChapter === journeyContent) { journeyContent.focus({preventScroll:true}); focusChapter = null; }
      const fourthProgress = smooth((displayed - 1.38) / .30);
      root.style.setProperty("--next-progress", String(fourthProgress));
      const fourthVisible = reduced.matches || displayed >= 1.55;
      if (workContent.dataset.fourth !== String(fourthVisible)) workContent.dataset.fourth = String(fourthVisible);
      fourthContent.inert = !fourthVisible && !reduced.matches;
      fourthContent.setAttribute("aria-hidden", String(fourthContent.inert));
      workCopy.inert = fourthVisible && !reduced.matches;
      workCopy.setAttribute("aria-hidden", String(workCopy.inert));
      if (displayed >= 1.68 && focusChapter === fourthContent) { fourthContent.focus({ preventScroll: true }); focusChapter = null; }

      workContent.inert = (displayed < 1.03 || displayed >= 2.08) && !reduced.matches;
      workContent.setAttribute("aria-hidden", String(workContent.inert));
      if (displayed >= 1.17 && focusChapter === workCopy) { workCopy.focus({ preventScroll: true }); focusChapter = null; }
      const playing = String(displayed >= 1.16 && displayed < 2.22 && active && root.getBoundingClientRect().bottom > window.innerHeight * .65);
      if (workContent.dataset.playing !== playing) workContent.dataset.playing = playing;
      const chapterProgress = clamp((displayed - 0.49) / 0.43);
      const textReveal = smooth((displayed - 0.49) / 0.06);
      root.style.setProperty("--handoff", String(handoff));
      root.style.setProperty("--opening-opacity", String(1 - smooth((displayed - 0.405) / 0.055)));
      root.style.setProperty("--connection-opacity", String(textReveal * (1 - workReveal)));
      root.style.setProperty("--scene-reframe", String(smooth((displayed - 0.49) / 0.25)));
      root.style.setProperty("--pointer-x", `${currentX.toFixed(3)}`);
      root.style.setProperty("--pointer-y", `${currentY.toFixed(3)}`);
      root.style.setProperty("--light-x", `${50 + currentX * 30}%`);
      root.style.setProperty("--light-y", `${50 + currentY * 30}%`);
      disciplineElements.forEach((element, index) => {
        element.style.setProperty("--reveal", String(smooth((chapterProgress - 0.33 - index * 0.13) / 0.22)));
      });
      if (bar.current) bar.current.style.transform = `scaleX(${displayed / 3.35})`;
      if (chapter.current) chapter.current.textContent = displayed < 0.43 ? "01 / The possibility" : displayed < 1.03 ? "02 / Connected growth" : displayed < 1.55 ? "03 / Selected work" : displayed < 2.08 ? "04 / Your next chapter" : "05 / Why Nexlytic";
      updateContent(displayed >= 0.485);
      if (displayed >= 1.03 && !reduced.matches) { nextContent.inert = true; nextContent.setAttribute("aria-hidden", "true"); }
      else if (displayed >= .485) { nextContent.inert = false; nextContent.setAttribute("aria-hidden", "false"); }
      if (skip.current && displayed >= .485) { skip.current.href = displayed < 1.03 ? "#selected-work" : displayed < 1.55 ? "#next-chapter" : displayed < 2.08 ? "#growth-journey" : "#hero-clients"; skip.current.textContent = displayed < 1.03 ? "Explore selected work ↓" : displayed < 1.55 ? "Your next chapter ↓" : displayed < 2.08 ? "See the bigger picture ↓" : "Start a conversation ↓"; }
      seek();
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !active || document.hidden) return;
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      displayed += (target - displayed) * (1 - Math.exp(-dt / 100));
      currentX += (pointerX - currentX) * (1 - Math.exp(-dt / 180));
      currentY += (pointerY - currentY) * (1 - Math.exp(-dt / 180));
      if (Math.abs(target - displayed) < 0.0002) displayed = target;
      if (Math.abs(pointerX - currentX) < 0.001) currentX = pointerX;
      if (Math.abs(pointerY - currentY) < 0.001) currentY = pointerY;
      paint();
      if (displayed !== target || currentX !== pointerX || currentY !== pointerY) frame = requestAnimationFrame(tick);
      else lastTime = 0;
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(tick); };
    const measure = () => {
      const rect = root.getBoundingClientRect();
      const stageHeight = root.firstElementChild?.getBoundingClientRect().height ?? window.innerHeight;
      const distance = Math.max(1, root.offsetHeight - stageHeight);
      target = reduced.matches ? 0 : clamp(-rect.top / distance) * 3.35;
      if (target > 0.08) loadConnection();
      if (target > 1.6 && !journeyLoaded && !reduced.matches) { journeyLoaded = true; journeyFilm.src = "/media/growth-journey/v2/journey-2k.mp4"; journeyFilm.load(); }
      schedule();
    };
    const configure = () => {
      root.dataset.reduced = String(reduced.matches);
      if (reduced.matches) {
        for (const element of [film, nextFilm, journeyFilm]) { element.pause(); element.removeAttribute("src"); element.load(); }
        hasNext = false;
        journeyLoaded = false;
        readyNext = false;
        root.dataset.connectionReady = "false";
        pointerX = pointerY = currentX = currentY = displayed = 0;
      } else {
        if (!film.getAttribute("src") && !failedHero) { film.src = FILM; film.load(); }
      }
      connectionVisible = !connectionVisible;
      updateContent(false);
      root.dataset.enhanced = "true";
      measure();
    };
    const ready = () => { root.dataset.ready = "true"; measure(); seek(); };
    const nextReady = () => { readyNext = true; root.dataset.connectionReady = "true"; measure(); seek(); };
    const fail = () => { failedHero = true; root.dataset.failed = "true"; };
    const nextFail = () => { failedNext = true; root.dataset.connectionFailed = "true"; measure(); };
    const pointerMove = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches || event.pointerType === "touch") return;
      const rect = root.firstElementChild!.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      schedule();
    };
    const resetPointer = () => { pointerX = pointerY = 0; schedule(); };
    const visibility = () => {
      lastTime = 0;
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else measure();
    };
    const jumpChapter = (event: MouseEvent) => {
      const destination = skip.current?.getAttribute("href");
      if (!["#connected-growth", "#selected-work", "#next-chapter", "#growth-journey"].includes(destination ?? "") || reduced.matches) return;
      event.preventDefault();
      loadConnection();
      const distance = root.offsetHeight - root.firstElementChild!.getBoundingClientRect().height;
      window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top + distance * (destination === "#growth-journey" ? 2.30 : destination === "#next-chapter" ? 1.78 : destination === "#selected-work" ? 1.23 : .92) / 3.35, behavior: "smooth" });
      // Focus the revealed chapter when it becomes available, without interrupting scrolling.
      focusChapter = destination === "#growth-journey" ? journeyContent : destination === "#next-chapter" ? fourthContent : destination === "#selected-work" ? workCopy : nextContent;
      focusChapter.tabIndex = -1;
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      root.dataset.active = String(active);
      if (active) measure();
      else { workContent.dataset.playing = "false"; cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    });
    const resize = new ResizeObserver(measure);
    observer.observe(root);
    resize.observe(root);
    journeyFilm.addEventListener("loadeddata", seek);
    journeyFilm.addEventListener("seeked", seek);
    film.addEventListener("loadeddata", ready);
    film.addEventListener("seeked", seek);
    film.addEventListener("error", fail);
    nextFilm.addEventListener("loadeddata", nextReady);
    nextFilm.addEventListener("seeked", seek);
    nextFilm.addEventListener("error", nextFail);
    reduced.addEventListener("change", configure);
    finePointer.addEventListener("change", resetPointer);
    root.addEventListener("pointermove", pointerMove, { passive: true });
    root.addEventListener("pointerleave", resetPointer);
    skip.current?.addEventListener("click", jumpChapter);
    const skipLink = skip.current;
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", visibility);
    configure();
    // Idle prefetch allows the second decoder to be ready before the transition.
    const prefetch = window.setTimeout(() => { if (!readyNext) loadConnection(); }, 1800);
    return () => {
      disposed = true;
      clearTimeout(prefetch);
      cancelAnimationFrame(frame);
      observer.disconnect(); resize.disconnect();
      journeyFilm.removeEventListener("loadeddata", seek); journeyFilm.removeEventListener("seeked", seek);
      film.removeEventListener("loadeddata", ready); film.removeEventListener("seeked", seek); film.removeEventListener("error", fail);
      nextFilm.removeEventListener("loadeddata", nextReady); nextFilm.removeEventListener("seeked", seek); nextFilm.removeEventListener("error", nextFail);
      reduced.removeEventListener("change", configure); finePointer.removeEventListener("change", resetPointer);
      root.removeEventListener("pointermove", pointerMove); root.removeEventListener("pointerleave", resetPointer);
      skipLink?.removeEventListener("click", jumpChapter);
      window.removeEventListener("scroll", measure); window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", visibility);
      delete root.dataset.enhanced;
    };
  }, []);

  return (
    <section ref={scene} className="hero-film" data-scroll-scene aria-label="The Nexlytic story">
      <div className="hero-film-stage">
        <div className="hero-film-visual" aria-hidden="true">
          <Image src="/media/hero/digital-engine-poster.jpg" alt="" fill priority sizes="100vw" className="hero-film-poster" />
          <video ref={video} className="hero-film-first" muted playsInline preload="auto" tabIndex={-1} disablePictureInPicture aria-hidden="true" />
          <div className="hero-film-connection-visual">
            <Image src="/media/connected-growth/start.jpg" alt="" fill sizes="100vw" className="hero-film-bridge" />
            <Image src="/media/connected-growth/poster.jpg" alt="" fill sizes="100vw" className="hero-film-connection-poster" />
            <video ref={connectionVideo} muted playsInline preload="auto" tabIndex={-1} disablePictureInPicture aria-hidden="true" />
          </div>
        </div>
        <div className="hero-film-shade" aria-hidden="true" />
        <div className="hero-film-pointer-light" aria-hidden="true" />
        <div ref={opening} className="hero-film-opening">{children}</div>
        <ConnectedGrowth sectionRef={connection} />
        <SelectedWork sectionRef={work} nextRef={nextChapter} />
        <GrowthJourney sectionRef={journey} videoRef={journeyVideo} />
        <div className="hero-film-timeline">
          <span ref={chapter} aria-hidden="true">01 / The possibility</span>
          <div aria-hidden="true"><span ref={bar} /></div>
          <span className="hero-film-instruction">Scroll to connect</span>
          <a ref={skip} href="#connected-growth">See how it connects ↓</a>
        </div>
      </div>
    </section>
  );
}
