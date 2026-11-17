import React, { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { AnalysisMode } from "../types/judo";
import { QUICK_SEARCH_TERMS } from "../data/judoArchive";
import { PWAInstallButton } from "./PWAInstallButton";

interface HeroTranslatorProps {
  query: string;
  mode: AnalysisMode;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onModeChange: (mode: AnalysisMode) => void;
  onSubmit: (termOverride?: string) => void;
}

export const HeroTranslator: React.FC<HeroTranslatorProps> = ({
  query,
  mode,
  isLoading,
  onQueryChange,
  onModeChange,
  onSubmit,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section
      id="traduttore"
      className="border-b border-[#E5E0D5] bg-[#FBF9F5]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <p className="text-xs font-medium tracking-widest uppercase text-[#57534E]">
                Lessico Etimologico Kodokan · Kōjien · Daijirin · Shinkangorin
              </p>
              <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#1C1917] leading-[1.12] text-balance">
                Comprendere l&apos;idea viva dietro ogni termine giapponese del Judo
              </h1>
              <p className="text-base text-[#57534E] leading-relaxed max-w-2xl">
                Un assistente lessicografico guidato da un Maestro giapponese 10° Dan:
                scompone i Kanji secondo i vocabolari classici giapponesi e traduce
                il concetto fisico e biomeccanico applicato al tatami.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="Modalità di analisi"
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5E0D5] rounded-lg"
                >
                  {[
                    { id: "full" as const, label: "Analisi Completa" },
                    { id: "kanji" as const, label: "Solo Etimologia Kanji" },
                    { id: "compare" as const, label: "Confronto Termini" },
                  ].map((tab) => {
                    const active = mode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onModeChange(tab.id)}
                        className={`px-3.5 py-2 min-h-[40px] text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F] ${
                          active
                            ? "bg-white text-[#1C1917] shadow-xs"
                            : "text-[#57534E] hover:text-[#1C1917]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <PWAInstallButton />
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <label htmlFor="judo-term-input" className="sr-only">
                  Inserisci un termine giapponese del Judo, un Kanji o una domanda comparativa
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      aria-hidden="true"
                      className="w-4 h-4 text-[#78716C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                      id="judo-term-input"
                      type="text"
                      value={query}
                      onChange={(e) => onQueryChange(e.target.value)}
                      placeholder="Es. Uki-goshi, 崩し, differenza tra gari e barai, Tai-sabaki..."
                      className="w-full min-h-[48px] pl-11 pr-4 py-3 bg-white border border-[#D6CEBE] rounded-lg text-[15px] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-[#1E3A5F] hover:bg-[#162C49] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
                  >
                    <span>{isLoading ? "Consultazione..." : "Analizza termine"}</span>
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="pt-1">
                <p className="text-xs font-medium text-[#78716C] mb-2">
                  Termini di studio frequenti:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCH_TERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        onQueryChange(term);
                        onSubmit(term);
                      }}
                      className="px-3 py-1.5 min-h-[40px] text-xs font-medium text-[#1C1917] bg-white hover:bg-[#F3EFE6] border border-[#E5E0D5] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <figure className="lg:col-span-5 flex flex-col justify-between bg-[#F3EFE6] border border-[#E5E0D5] rounded-lg p-4">
            <div className="relative w-full h-64 lg:h-full min-h-[260px] overflow-hidden rounded border border-[#E5E0D5] bg-[#FBF9F5]">
              {!imageFailed ? (
                <img
                  src="/src/assets/images/hero_judo_kuzushi_1794937952914.jpg"
                  alt="Illustrazione in inchiostro sumi-e sullo squilibrio Kuzushi e sulla leva circolare nel Judo Kodokan"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FBF9F5]">
                  <span className="font-kanji text-5xl text-[#1E3A5F] mb-3">
                    柔道
                  </span>
                  <span className="text-sm text-[#57534E]">
                    Studio sul principio di squilibrio (Kuzushi)
                  </span>
                </div>
              )}
            </div>
            <figcaption className="mt-3 text-xs font-editorial italic text-[#57534E] leading-snug">
              Tav. I — Dinamica del Kuzushi (崩し) e vettori di leva biomeccanica sul centro di gravità.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
