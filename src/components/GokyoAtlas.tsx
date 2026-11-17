import React, { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { GOKYO_CATALOG } from "../data/judoArchive";
import { GokyoTechnique } from "../types/judo";

interface GokyoAtlasProps {
  onSelectTechnique: (term: string) => void;
}

const GROUP_FILTERS: Array<{ id: "all" | GokyoTechnique["group"]; label: string }> = [
  { id: "all", label: "Tutte" },
  { id: "dai1", label: "Dai Ikkyo" },
  { id: "dai2", label: "Dai Nikyo" },
  { id: "dai3", label: "Dai Sankyo" },
  { id: "dai4", label: "Dai Yonkyo" },
  { id: "dai5", label: "Dai Gokyo" },
  { id: "katame", label: "Katame-waza" },
];

export const GokyoAtlas: React.FC<GokyoAtlasProps> = ({
  onSelectTechnique,
}) => {
  const [groupFilter, setGroupFilter] = useState<"all" | GokyoTechnique["group"]>("all");
  const [localSearch, setLocalSearch] = useState("");

  const filtered = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    return GOKYO_CATALOG.filter((item) => {
      const matchesGroup = groupFilter === "all" || item.group === groupFilter;
      if (!matchesGroup) return false;
      if (!q) return true;
      return (
        item.romaji.toLowerCase().includes(q) ||
        item.kanji.includes(q) ||
        item.italianConcept.toLowerCase().includes(q) ||
        item.classification.toLowerCase().includes(q)
      );
    });
  }, [groupFilter, localSearch]);

  return (
    <section
      id="gokyo"
      className="border-t border-[#E5E0D5] bg-[#FBF9F5] py-14"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-[#57534E]">
              Repertorio Tecnico Kodokan · Gokyō no Waza & Katame-waza
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] text-balance">
              Atlante concettuale delle tecniche classiche
            </h2>
            <p className="text-[15px] text-[#57534E] leading-relaxed">
              Seleziona una tecnica per richiamare l&apos;analisi filologica completa
              del Maestro 10° Dan sui singoli Kanji, sul Kuzushi e sulle sfumature esecutive.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filtra tecnica o concetto italiano..."
              aria-label="Filtra le tecniche dell'atlante Gokyo"
              className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-white border border-[#D6CEBE] rounded-lg text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A5F]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4">
          <div
            role="tablist"
            aria-label="Gruppi del Gokyo"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5E0D5] rounded-lg"
          >
            {GROUP_FILTERS.map((tab) => {
              const active = groupFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setGroupFilter(tab.id)}
                  className={`px-3 py-2 min-h-[40px] text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F] ${
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

          <span className="text-xs font-mono-tech text-[#57534E]">
            {filtered.length} tecniche visualizzate
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E0D5] rounded-lg p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-[#1C1917]">
              Nessuna tecnica corrisponde al filtro inserito
            </p>
            <p className="text-sm text-[#57534E]">
              Puoi comunque inserire qualsiasi termine nella barra principale in alto per chiederne l&apos;etimologia al Maestro.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E0D5] rounded-lg divide-y divide-[#E5E0D5]">
            {filtered.map((tech) => (
              <div
                key={tech.id}
                className="p-5 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#FBF9F5] transition-colors duration-150"
              >
                <div className="space-y-1.5 lg:w-5/12">
                  <div className="flex items-center gap-2 text-xs text-[#78716C]">
                    <span>{tech.groupLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tech.classification}</span>
                  </div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                      {tech.romaji}
                    </h3>
                    <span lang="ja" className="font-kanji text-lg text-[#B91C1C]">
                      {tech.kanji}
                    </span>
                    <span className="font-mono-tech text-xs text-[#78716C]">
                      {tech.kana}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 lg:w-5/12">
                  <p className="text-sm font-semibold text-[#1E3A5F]">
                    {tech.italianConcept}
                  </p>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {tech.keyRootExplanation}
                  </p>
                </div>

                <div className="lg:w-2/12 flex lg:justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectTechnique(tech.romaji)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] text-xs font-semibold text-[#1C1917] bg-[#F3EFE6] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                  >
                    <span>Analizza</span>
                    <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
