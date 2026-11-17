import React, { useState } from "react";
import { Trash2, Copy, Check, ArrowUpRight } from "lucide-react";
import { SavedStudyEntry } from "../types/judo";

interface StudyNotebookProps {
  entries: SavedStudyEntry[];
  onLoadEntry: (entry: SavedStudyEntry) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const StudyNotebook: React.FC<StudyNotebookProps> = ({
  entries,
  onLoadEntry,
  onUpdateNotes,
  onDeleteEntry,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEntry = async (entry: SavedStudyEntry) => {
    const { analysis, personalNotes } = entry;
    const text = [
      `${analysis.termRomaji} (${analysis.termKanji} · ${analysis.termKana})`,
      `Concetto italiano: ${analysis.italianConceptualTitle}`,
      `Calco letterale: ${analysis.literalGloss}`,
      `Etimologia: ${analysis.etymologySummary}`,
      `Principio: ${analysis.biomechanicalApplication.corePrinciple}`,
      `Consiglio del Maestro: ${analysis.senseiTatamiAdvice}`,
      personalNotes ? `Note personali sul tatami: ${personalNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback ignored silently if clipboard blocked
    }
  };

  return (
    <section
      id="taccuino"
      className="border-t border-[#E5E0D5] bg-[#FBF9F5] py-14"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[#57534E]">
              Archivio Personale · Appunti di Lezione
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
              Taccuino del Maestro
            </h2>
            <p className="text-sm text-[#57534E] max-w-2xl">
              Salva le analisi etimologiche più utili per preparare le tue lezioni sul
              tatami e aggiungi annotazioni personali per i tuoi allievi.
            </p>
          </div>
          <span className="font-mono-tech text-xs text-[#57534E]">
            {entries.length} {entries.length === 1 ? "scheda salvata" : "schede salvate"}
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white border border-[#E5E0D5] rounded-lg p-10 text-center space-y-2">
            <p className="font-editorial text-2xl text-[#1C1917]">
              Il tuo taccuino è ancora vuoto
            </p>
            <p className="text-sm text-[#57534E] max-w-md mx-auto">
              Analizza un termine tecnico o un principio del Judo nella sezione superiore e premi
              &ldquo;Salva nel Taccuino&rdquo; per conservarlo qui con i tuoi appunti.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="bg-white border border-[#E5E0D5] rounded-lg p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-[#E5E0D5] pb-3">
                    <div>
                      <p className="text-xs text-[#78716C]">
                        {entry.analysis.category}
                      </p>
                      <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                        {entry.analysis.termRomaji}
                      </h3>
                    </div>
                    <span lang="ja" className="font-kanji text-2xl text-[#B91C1C]">
                      {entry.analysis.termKanji}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#1E3A5F]">
                    {entry.analysis.italianConceptualTitle}
                  </p>

                  <div className="space-y-1.5">
                    <label
                      htmlFor={`notes-${entry.id}`}
                      className="block text-xs font-medium text-[#57534E]"
                    >
                      Appunti personali per il tatami
                    </label>
                    <textarea
                      id={`notes-${entry.id}`}
                      rows={3}
                      value={entry.personalNotes}
                      onChange={(e) => onUpdateNotes(entry.id, e.target.value)}
                      placeholder="Annota qui esercizi propedeutici, immagini per gli allievi, correzioni frequenti..."
                      className="w-full p-3 bg-[#FBF9F5] border border-[#E5E0D5] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A5F]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E0D5] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadEntry(entry)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] text-xs font-semibold text-[#1E3A5F] bg-[#F3EFE6] hover:bg-[#EBE6DF] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                    >
                      <span>Apri scheda</span>
                      <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyEntry(entry)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                    >
                      {copiedId === entry.id ? (
                        <Check aria-hidden="true" className="w-3.5 h-3.5 text-[#14532D]" />
                      ) : (
                        <Copy aria-hidden="true" className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === entry.id ? "Copiata" : "Copia testo"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label={`Rimuovi ${entry.analysis.termRomaji} dal taccuino`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] text-xs font-medium text-[#B91C1C] hover:bg-[#F3EFE6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B91C1C]"
                  >
                    <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Rimuovi</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
