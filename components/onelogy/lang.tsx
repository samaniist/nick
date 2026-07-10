"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* Page-level EN/FR toggle for /onelogy. The choice lives in React state
   (instant switch, no routing) and is remembered in localStorage. */

export type Lang = "en" | "fr";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function useLang() {
  return useContext(LangContext).lang;
}

export function OnelogyLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("onelogy-lang");
    if (saved === "fr" || saved === "en") setLang(saved);
  }, []);

  const set = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem("onelogy-lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: set }}>
      {children}
    </LangContext.Provider>
  );
}

export function LangToggle() {
  const { lang, setLang } = useContext(LangContext);
  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/70 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-md">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`min-w-11 cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
            lang === l
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {l === "en" ? "EN" : "FR"}
        </button>
      ))}
    </div>
  );
}
