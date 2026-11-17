import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { MORPHOLOGY_ROOTS } from "../data/judoArchive";
import { MorphologyRoot } from "../types/judo";

interface MorphologyMatrixProps {
  onAnalyzeTerm: (term: string) => void;
}

export const MorphologyMatrix: React.FC<MorphologyMatrixProps> = ({
  onAnalyzeTerm,
}) => {
  const [filter, setFilter] = useState<"all" | MorphologyRoot["group"]>("all");
  const [plateFailed, setPlateFailed] = useState(false);

  const visibleRoots =
    filter === "all"
      ? MORPHOLOGY_ROOTS
      : MORPHOLOGY_ROOTS.filter((r) => r.group === filter);

  return (
    <section
      id="radici"
      className="border-t border-[#E5E0D5] bg-[#F3EFE6]/50 py-14"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#57534E]">
              Morfologia e Principi · Grammatica delle Tecniche
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] text-balance">
              Le radici giapponesi che rivelano il gesto biomeccanico
            </h2>
            <p className="text-[15px] text-[#57534E] leading-relaxed max-w-2xl">
              Nel Judo ogni nome è un&apos;istruzione tecnica condensata. Comprendere
              la differenza etimologica tra un verbo e l&apos;altro impedisce di
              confondere una falciata con una spazzata o una caduta con un aggancio.
            </p>
          </div>

          <figure className="lg:col-span-5 bg-white border border-[#E5E0D5] rounded-lg p-3">
            <div className="w-full aspect-16/9 overflow-hidden rounded border border-[#E5E0D5] bg-[#FBF9F5]">
              {!plateFailed ? (
                <img
                  src="/src/assets/images/plate_principles_flow_1794937953623.jpg"
                  alt="Diagramma biomeccanico giapponese sui vettori di leva e archi di rotazione Tai-sabaki"
                  referrerPolicy="no-referrer"
                  onError={() => setPlateFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-center">
                  <span className="font-editorial text-lg text-[#57534E]">
                    Tav. II — Assi di rotazione e baricentro
                  </span>
                </div>
              )}
            </div>
            <figcaption className="mt-2 text-xs font-editorial italic text-[#57534E]">
              Tav. II — Geometria del movimento (Tai-sabaki) e linee di squilibrio.
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D5] pb-4">
          <div
            role="tablist"
            aria-label="Filtra radici e principi"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] rounded-lg"
          >
            {[
              { id: "all" as const, label: "Tutte le radici" },
              { id: "azioni" as const, label: "Verbi d'azione" },
              { id: "modificatori" as const, label: "Prefissi spaziali" },
              { id: "principi" as const, label: "Principi Kodokan" },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
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

          <span className="text-xs font-mono-tech text-[#57534E]">
            {visibleRoots.length} voci di studio
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRoots.map((root) => (
            <article
              key={root.id}
              className="bg-white border border-[#E5E0D5] rounded-lg p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-[#E5E0D5] pb-3">
                  <div>
                    <p className="text-xs text-[#78716C] mb-1">
                      {root.groupLabel}
                    </p>
                    <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                      {root.romaji}
                    </h3>
                    <p className="font-mono-tech text-xs text-[#57534E]">
                      {root.kana}
                    </p>
                  </div>
                  <span
                    lang="ja"
                    className="font-kanji text-3xl font-semibold text-[#B91C1C] shrink-0"
                  >
                    {root.kanji}
                  </span>
                </div>

                <div className="space-y-2.5 text-sm leading-relaxed">
                  <p className="font-semibold text-[#1E3A5F]">
                    {root.italianConcept}
                  </p>
                  <p className="text-[#57534E]">{root.etymologyNote}</p>
                  <p className="text-[#1C1917]">
                    <span className="font-semibold">Sul tatami: </span>
                    {root.biomechanicalMeaning}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5] flex items-center justify-between gap-3">
                <span className="text-xs text-[#78716C] truncate">
                  Es. {root.examples.slice(0, 2).join(" · ")}
                </span>
                <button
                  type="button"
                  onClick={() => onAnalyzeTerm(root.romaji)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[40px] text-xs font-semibold text-[#1E3A5F] hover:bg-[#F3EFE6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                >
                  <span>Approfondisci</span>
                  <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
