"use client";

/* Heavy interactive pieces (three.js / matter-js) load as separate chunks
   after the page is interactive, instead of inflating the first bundle.
   Each placeholder reserves the exact box so nothing shifts when they land. */

import dynamic from "next/dynamic";

export const KeyboardBall = dynamic(() => import("@/components/keyboard-ball"), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="aspect-square w-[340px] sm:w-[480px] lg:w-[600px] xl:w-[720px]" />
  ),
});

export const WhyParticles = dynamic(() => import("@/components/why-particles"), {
  ssr: false,
  loading: () => <div aria-hidden className="h-full min-h-[300px] w-full" />,
});

export const WhoPhysics = dynamic(() => import("@/components/who-physics"), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="h-[440px] rounded-3xl border-b border-zinc-950/10 sm:h-[480px] lg:h-[540px]" />
  ),
});
