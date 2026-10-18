/* Line icons for the simulator's choice cards, keyed by choice value. */

const paths: Record<string, React.ReactNode> = {
  // Business type
  clinic: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /><path d="M12 10v4M10 12h4" /></>,
  shop: <><path d="M5 8h14l-1.2 11H6.2L5 8Z" /><path d="M9 8V7a3 3 0 0 1 6 0v1" /></>,
  local: <><path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11Z" /><circle cx="12" cy="10" r="2.2" /></>,
  b2b: <><rect x="4" y="8" width="16" height="11" rx="2" /><path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M4 13h16" /></>,
  // Main goal
  customers: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 6.5a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.4-4.5" /></>,
  sales: <><path d="M4 17l5-5 3.5 3.5L20 8" /><path d="M15 8h5v5" /></>,
  brand: <><path d="M12 3.5l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7L12 3.5Z" /></>,
  automation: <><path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" /></>,
  // Current state
  scratch: <><path d="M12 20v-7" /><path d="M12 13c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6Z" /><path d="M12 11c0-3 2.2-5.5 6.5-5.5 0 3-2.2 5.5-6.5 5.5Z" /></>,
  underperform: <><circle cx="12" cy="12" r="8" /><path d="M12 12l4-3" /><path d="M8 16h8" /></>,
  scale: <><path d="M14.5 4.5c2.8-.6 4.4-.3 5 .2.5.6.8 2.2.2 5L13 16.4 7.6 11l6.9-6.5Z" /><path d="M7.6 11 5 10.5 3.5 12l4 1M13 16.4l.5 2.6-1.5 1.5-1-4" /><circle cx="15.5" cy="8.5" r="1.3" /></>,
};

export function ChoiceIcon({ value }: { value: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[value]}
    </svg>
  );
}
