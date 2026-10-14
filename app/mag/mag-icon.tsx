type IconName = "up-right" | "down-right" | "down-left" | "down" | "right" | "compare" | "play" | "pause" | "plus";

const paths: Record<IconName, string> = {
  "up-right": "M5 19 19 5M5 5h14v14",
  "down-right": "M5 5l14 14M5 19h14V5",
  "down-left": "M19 5 5 19M5 5v14h14",
  down: "M12 3v18M5 14l7 7 7-7",
  right: "M3 12h18M14 5l7 7-7 7",
  compare: "M3 12h18M8 7l-5 5 5 5M16 7l5 5-5 5",
  play: "m7 4 14 8-14 8Z",
  pause: "M8 4v16M16 4v16",
  plus: "M12 4v16M4 12h16",
};

/** Vector-only UI symbols: never depend on platform emoji or font fallback. */
export default function MagIcon({ name = "up-right" }: { name?: IconName }) {
  return <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}><path d={paths[name]} /></svg>;
}
