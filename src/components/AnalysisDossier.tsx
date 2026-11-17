import React from "react";
import { Bookmark, BookmarkCheck, MessageSquare, BookOpen } from "lucide-react";
import { JudoAnalysis } from "../types/judo";

interface AnalysisDossierProps {
  analysis: JudoAnalysis | null;
  isLoading: boolean;
  error: string | null;
  isSaved: boolean;
  onSaveToggle: (analysis: JudoAnalysis) => void;
  onSelectRelated: (term: string) => void;
  onAskMasterAboutTerm: (term: string) => void;
}

export const AnalysisDossier: React.FC<AnalysisDossierProps> = ({
  analysis,
  isLoading,
  error,
  isSaved,
  onSaveToggle,
  onSelectRelated,
  onAskMasterAboutTerm,
}) => {
  if (isLoading) {
    return (
      <section
        aria-live="polite"
        className="max-w-7xl mx-auto px-6 lg:px-10 py-12"
      >
        <div className="bg-white border border-[#E5E0D5] rounded-lg p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-6">
            <div className="space-y-3 w-2/3">
              <div className="h-3 w-48 bg-[#F3EFE6] rounded animate-pulse" />
              <div className="h-10 w-80 bg-[#F3EFE6] rounded animate-pulse" />
              <div className="h-5 w-full max-w-lg bg-[#F3EFE6] rounded animate-pulse" />
            </div>
            <div className="h-16 w-28 bg-[#F3EFE6] rounded animate-pulse" />
          </div>
          <p className="text-sm text-[#57534E]">
            Il Maestro sta consultando i dizionari Kōjien, Daijirin, Shinkangorin e i testi del Kodokan...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-40 bg-[#FBF9F5] border border-[#E5E0D5] rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div
          role="alert"
          className="bg-white border border-[#B91C1C]/40 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#B91C1C]">
              Impossibile completare l&apos;analisi lessicografica
            </p>
            <p className="text-sm text-[#57534E]">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <article className="bg-white border border-[#E5E0D5] rounded-lg overflow-hidden">
        {/* Intestazione Scheda Lessicografica */}
        <header className="p-6 sm:p-8 lg:p-10 border-b border-[#E5E0D5] bg-[#FBF9F5]/60">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] font-medium">
                <span>{analysis.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tech">{analysis.termKana}</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] leading-tight text-balance">
                {analysis.termRomaji}
              </h2>

              <p className="text-lg sm:text-xl font-medium text-[#1E3A5F] leading-snug">
                {analysis.italianConceptualTitle}
              </p>

              <p className="text-sm text-[#57534E]">
                <span className="font-semibold text-[#1C1917]">Calco letterale: </span>
                {analysis.literalGloss}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
              <div className="px-5 py-3 bg-[#F3EFE6] border border-[#E5E0D5] rounded-lg text-center">
                <span
                  lang="ja"
                  className="font-kanji text-3xl sm:text-4xl font-semibold text-[#1C1917] tracking-widest block"
                >
                  {analysis.termKanji}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSaveToggle(analysis)}
                  className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-xs font-semibold rounded-md border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F] ${
                    isSaved
                      ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                      : "bg-white text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]"
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck aria-hidden="true" className="w-4 h-4" />
                  ) : (
                    <Bookmark aria-hidden="true" className="w-4 h-4" />
                  )}
                  <span>{isSaved ? "Salvato nel Taccuino" : "Salva nel Taccuino"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAskMasterAboutTerm(analysis.termRomaji)}
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-xs font-semibold text-[#1E3A5F] bg-[#F3EFE6] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                >
                  <MessageSquare aria-hidden="true" className="w-4 h-4" />
                  <span>Approfondisci col Maestro</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Corpo Principale Asimmetrico (70% contenuto, 30% note a margine & fonti) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 space-y-10 lg:border-r lg:border-[#E5E0D5]">
            {/* 01. Sintesi Etimologica e Scomposizione Kanji */}
            <section className="space-y-5">
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                  01. Etimologia dei Kanji e slittamento semantico nel Judo
                </h3>
                <p className="text-[15px] text-[#292524] leading-relaxed max-w-[70ch]">
                  {analysis.etymologySummary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {analysis.kanjiBreakdown.map((item, index) => (
                  <div
                    key={`${item.character}-${index}`}
                    className="p-5 bg-[#FBF9F5] border border-[#E5E0D5] rounded-lg space-y-3"
                  >
                    <div className="flex items-baseline justify-between gap-3 border-b border-[#E5E0D5] pb-2.5">
                      <span
                        lang="ja"
                        className="font-kanji text-3xl font-semibold text-[#B91C1C]"
                      >
                        {item.character}
                      </span>
                      <span className="font-mono-tech text-xs text-[#57534E]">
                        {item.reading}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm leading-relaxed">
                      <p className="text-[#57534E]">
                        <span className="font-semibold text-[#1C1917]">Origine: </span>
                        {item.radicalAndOrigin}
                      </p>
                      <p className="text-[#57534E]">
                        <span className="font-semibold text-[#1C1917]">Vocabolario comune: </span>
                        {item.generalJapaneseMeaning}
                      </p>
                      <p className="text-[#1C1917]">
                        <span className="font-semibold text-[#1E3A5F]">Nel Judo: </span>
                        {item.judoSpecificMeaning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 02. Applicazione Biomeccanica */}
            <section className="space-y-5 pt-6 border-t border-[#E5E0D5]">
              <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                02. Traduzione sul tatami: Principio, Kuzushi, Tsukuri e Kake
              </h3>

              <dl className="divide-y divide-[#E5E0D5] border-y border-[#E5E0D5]">
                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6">
                  <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                    Principio logico (Riai)
                  </dt>
                  <dd className="sm:col-span-8 text-[15px] text-[#1C1917] leading-relaxed">
                    {analysis.biomechanicalApplication.corePrinciple}
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6">
                  <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                    Squilibrio (Kuzushi)
                  </dt>
                  <dd className="sm:col-span-8 text-[15px] text-[#1C1917] leading-relaxed">
                    {analysis.biomechanicalApplication.kuzushiFocus}
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6">
                  <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                    Costruzione e Chiusura
                  </dt>
                  <dd className="sm:col-span-8 text-[15px] text-[#1C1917] leading-relaxed">
                    {analysis.biomechanicalApplication.tsukuriAndKakeFocus}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 03. Distinzioni Sottili & Errori Occidentali */}
            {analysis.subtleDistinctions.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-[#E5E0D5]">
                <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                  03. Distinzioni sottili e trappole semantiche in Occidente
                </h3>
                <div className="space-y-4">
                  {analysis.subtleDistinctions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-[#FBF9F5] border border-[#E5E0D5] rounded-lg space-y-1.5"
                    >
                      <h4 className="text-sm font-semibold text-[#1E3A5F]">
                        {item.comparedTerm}
                      </h4>
                      <p className="text-[15px] text-[#292524] leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Margine Laterale: Parola del Maestro & Fonti */}
          <aside className="lg:col-span-4 p-6 sm:p-8 bg-[#FBF9F5]/40 space-y-8">
            <div className="space-y-3 pb-6 border-b border-[#E5E0D5]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B91C1C]">
                Parola del Maestro · 10° Dan
              </p>
              <blockquote className="font-editorial text-xl italic text-[#1C1917] leading-relaxed">
                &ldquo;{analysis.senseiTatamiAdvice}&rdquo;
              </blockquote>
            </div>

            <div className="space-y-3 pb-6 border-b border-[#E5E0D5]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                <BookOpen aria-hidden="true" className="w-3.5 h-3.5" />
                <span>Vocabolari giapponesi consultati</span>
              </div>
              <ul className="space-y-2 text-sm text-[#44403C]">
                {analysis.japaneseDictionarySources.map((src, idx) => (
                  <li key={idx} className="leading-snug">
                    {src}
                  </li>
                ))}
              </ul>
            </div>

            {analysis.relatedTerms.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                  Termini correlati da esplorare
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.relatedTerms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => onSelectRelated(term)}
                      className="px-3 py-1.5 min-h-[40px] text-xs font-medium text-[#1C1917] bg-white hover:bg-[#F3EFE6] border border-[#E5E0D5] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </section>
  );
};
