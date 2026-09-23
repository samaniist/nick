"use client";

/* Heavy interactive pieces (three.js / matter-js) load as separate chunks
   after the page is interactive, instead of inflating the first bundle.
   Each placeholder reserves the exact box so nothing shifts when they land. */

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const BallPlaceholder = () => (
  <div aria-hidden className="aspect-square w-[340px] sm:w-[480px] lg:w-[600px] xl:w-[720px]" />
);

const KeyboardBallScene = dynamic(() => import("@/components/keyboard-ball"), {
  ssr: false,
  loading: BallPlaceholder,
});

/* Without a GPU (e.g. PageSpeed Insights' servers) Chrome renders WebGL on the
   CPU, and the ball's per-frame render pins it until the audit times out. */
let hardwareWebGL: boolean | undefined;
function hasHardwareWebGL() {
  if (hardwareWebGL !== undefined) return hardwareWebGL;
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return (hardwareWebGL = false);
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    hardwareWebGL = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    hardwareWebGL = false;
  }
  return hardwareWebGL;
}

const noopSubscribe = () => () => {};

export function KeyboardBall() {
  const gpu = useSyncExternalStore(noopSubscribe, hasHardwareWebGL, () => false);
  return gpu ? <KeyboardBallScene /> : <BallPlaceholder />;
}

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
