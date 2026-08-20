"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

type LiveSiteImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  delay?: number;
};

export default function LiveSiteImage({
  src,
  alt,
  width,
  height,
  sizes,
  delay = 0,
}: LiveSiteImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;

    if (!frame || !image) return;

    const measure = () => {
      const distance = Math.max(0, image.getBoundingClientRect().height - frame.clientHeight);
      const duration = Math.min(30, Math.max(14, distance / 72));

      frame.style.setProperty("--site-scroll-distance", `${distance}px`);
      frame.style.setProperty("--site-scroll-duration", `${duration}s`);
      frame.style.setProperty("--site-scrollbar-distance", `${Math.max(0, frame.clientHeight - 56)}px`);
      frame.dataset.canScroll = distance > 24 ? "true" : "false";
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(frame);
    resizeObserver.observe(image);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        frame.dataset.visible = entry.isIntersecting ? "true" : "false";
      },
      { threshold: 0.35 },
    );

    intersectionObserver.observe(frame);
    measure();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="work-site-frame relative h-full overflow-hidden bg-zinc-900"
      style={{ "--site-scroll-delay": `${delay}s` } as CSSProperties}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className="work-site-scroll absolute left-0 top-0 h-auto w-full max-w-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b] shadow-[0_0_8px_#b9ff2b]" />
        Live scroll
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 top-3 w-px bg-white/20">
        <span className="work-site-scrollbar absolute left-[-1px] top-0 h-8 w-[3px] rounded-full bg-[#b9ff2b]" />
      </div>
    </div>
  );
}
