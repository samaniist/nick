/** Writes a scroll-speed-driven --scroll-skew (degrees, ±3) onto `target`; it
 *  eases back to 0 once scrolling stops. No-op for reduced motion. */
export function trackScrollSkew(target: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  let lastY = window.scrollY, lastTime = performance.now(), wanted = 0, current = 0, frame = 0;

  const tick = () => {
    frame = 0;
    wanted *= 0.88;
    current += (wanted - current) * 0.18;
    if (Math.abs(wanted) < 0.01 && Math.abs(current) < 0.01) { wanted = current = 0; }
    target.style.setProperty("--scroll-skew", current.toFixed(3));
    if (wanted || current) frame = requestAnimationFrame(tick);
  };
  const scroll = () => {
    const now = performance.now(), y = window.scrollY;
    const velocity = (y - lastY) / Math.max(8, now - lastTime); // px per ms
    lastY = y; lastTime = now;
    wanted = Math.max(-3, Math.min(3, velocity * -1.1));
    if (!frame) frame = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", scroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", scroll);
    cancelAnimationFrame(frame);
    target.style.removeProperty("--scroll-skew");
  };
}
