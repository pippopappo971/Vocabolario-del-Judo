import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { HeroTranslator } from "./components/HeroTranslator";
import { AnalysisDossier } from "./components/AnalysisDossier";
import { MorphologyMatrix } from "./components/MorphologyMatrix";
import { GokyoAtlas } from "./components/GokyoAtlas";
import { SenseiDialogue } from "./components/SenseiDialogue";
import { StudyNotebook } from "./components/StudyNotebook";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { FEATURED_ANALYSES } from "./data/judoArchive";
import {
  AnalysisMode,
  ChatMessage,
  JudoAnalysis,
  SavedStudyEntry,
} from "./types/judo";

const STORAGE_KEY = "kodokan_kotoba_notebook_v1";

async function parseApiJson<T>(res: Response): Promise<T> {
  const rawText = await res.text();
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json") && rawText.trim().startsWith("<")) {
    throw new Error(
      "Il servizio di analisi del server non ha risposto in formato JSON (possibile riavvio in corso o anteprima statica). Riprova tra qualche secondo."
    );
  }
  let parsed: unknown;
  try {
    parsed = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error("Risposta non valida ricevuta dal server. Riprova tra qualche istante.");
  }
  if (!res.ok) {
    const errMsg = (parsed as { error?: string })?.error;
    throw new Error(errMsg || `Errore del server (${res.status}).`);
  }
  return parsed as T;
}

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("traduttore");
  const [query, setQuery] = useState<string>("Seoi-nage");
  const [mode, setMode] = useState<AnalysisMode>("full");

  const [analysis, setAnalysis] = useState<JudoAnalysis | null>(
    FEATURED_ANALYSES["Seoi-nage"]
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [sessionCache, setSessionCache] = useState<Record<string, JudoAnalysis>>(
    {}
  );

  const [savedEntries, setSavedEntries] = useState<SavedStudyEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedStudyEntry[]) : [];
    } catch {
      return [];
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEntries));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [savedEntries]);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const runAnalysis = useCallback(
    async (termOverride?: string, modeOverride?: AnalysisMode) => {
      const targetQuery = (termOverride ?? query).trim();
      const targetMode = modeOverride ?? mode;
      if (!targetQuery) return;

      if (termOverride) {
        setQuery(termOverride);
      }

      const normalizedKey = targetQuery.toLowerCase();
      const cacheKey = `${targetMode}::${normalizedKey}`;

      if (targetMode === "full") {
        const featuredMatch = Object.entries(FEATURED_ANALYSES).find(
          ([k]) => k.toLowerCase() === normalizedKey
        );
        if (featuredMatch) {
          setAnalysisError(null);
          setAnalysis(featuredMatch[1]);
          return;
        }
      }

      if (sessionCache[cacheKey]) {
        setAnalysisError(null);
        setAnalysis(sessionCache[cacheKey]);
        return;
      }

      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const res = await fetch("/api/judo/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: targetQuery,
            mode: targetMode,
          }),
        });

        const parsed = await parseApiJson<JudoAnalysis>(res);
        setAnalysis(parsed);
        setSessionCache((prev) => ({ ...prev, [cacheKey]: parsed }));
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Errore di connessione con il server.";
        setAnalysisError(message);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [query, mode, sessionCache]
  );

  const handleSelectTermFromIndex = useCallback(
    (term: string) => {
      scrollToSection("traduttore");
      void runAnalysis(term, "full");
    },
    [runAnalysis, scrollToSection]
  );

  const isCurrentSaved = Boolean(
    analysis &&
      savedEntries.some(
        (entry) =>
          entry.analysis.termRomaji.toLowerCase() ===
          analysis.termRomaji.toLowerCase()
      )
  );

  const handleSaveToggle = useCallback((target: JudoAnalysis) => {
    setSavedEntries((prev) => {
      const existingIndex = prev.findIndex(
        (e) =>
          e.analysis.termRomaji.toLowerCase() ===
          target.termRomaji.toLowerCase()
      );
      if (existingIndex >= 0) {
        return prev.filter((_, idx) => idx !== existingIndex);
      }
      const newEntry: SavedStudyEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        savedAt: new Date().toISOString(),
        analysis: target,
        personalNotes: "",
      };
      return [newEntry, ...prev];
    });
  }, []);

  const handleUpdateNotes = useCallback((id: string, notes: string) => {
    setSavedEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, personalNotes: notes } : entry
      )
    );
  }, []);

  const handleDeleteEntry = useCallback((id: string) => {
    setSavedEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const handleLoadSavedEntry = useCallback(
    (entry: SavedStudyEntry) => {
      setQuery(entry.analysis.termRomaji);
      setAnalysis(entry.analysis);
      setAnalysisError(null);
      scrollToSection("traduttore");
    },
    [scrollToSection]
  );

  const handleSendChatMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      };

      const historyPayload = chatMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      setChatMessages((prev) => [...prev, userMsg]);
      setIsChatSending(true);
      setChatError(null);

      try {
        const res = await fetch("/api/judo/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: historyPayload,
            activeTerm: analysis
              ? `${analysis.termRomaji} (${analysis.termKanji})`
              : undefined,
          }),
        });

        const data = await parseApiJson<{ reply: string }>(res);

        const modelMsg: ChatMessage = {
          id: `m-${Date.now()}`,
          role: "model",
          text: data.reply,
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, modelMsg]);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Errore di connessione durante il colloquio.";
        setChatError(msg);
      } finally {
        setIsChatSending(false);
      }
    },
    [chatMessages, analysis]
  );

  const handleAskMasterAboutTerm = useCallback(
    (term: string) => {
      scrollToSection("maestro");
      void handleSendChatMessage(
        `Maestro, potresti approfondire come trasmettere sul tatami l'idea etimologica di ${term} e quali errori tecnici evita questa comprensione?`
      );
    },
    [handleSendChatMessage, scrollToSection]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Header
        activeSection={activeSection}
        savedCount={savedEntries.length}
        onNavigate={scrollToSection}
        onOpenSenseiChat={() => scrollToSection("maestro")}
      />

      <main className="flex-1">
        <HeroTranslator
          query={query}
          mode={mode}
          isLoading={isAnalyzing}
          onQueryChange={setQuery}
          onModeChange={setMode}
          onSubmit={(termOverride) => void runAnalysis(termOverride)}
        />

        <AnalysisDossier
          analysis={analysis}
          isLoading={isAnalyzing}
          error={analysisError}
          isSaved={isCurrentSaved}
          onSaveToggle={handleSaveToggle}
          onSelectRelated={(term) => {
            setQuery(term);
            void runAnalysis(term, "full");
          }}
          onAskMasterAboutTerm={handleAskMasterAboutTerm}
        />

        <MorphologyMatrix onAnalyzeTerm={handleSelectTermFromIndex} />

        <GokyoAtlas onSelectTechnique={handleSelectTermFromIndex} />

        <SenseiDialogue
          activeTerm={
            analysis ? `${analysis.termRomaji} (${analysis.termKanji})` : undefined
          }
          messages={chatMessages}
          isSending={isChatSending}
          error={chatError}
          onSendMessage={(msg) => void handleSendChatMessage(msg)}
          onResetChat={() => {
            setChatMessages([]);
            setChatError(null);
          }}
        />

        <StudyNotebook
          entries={savedEntries}
          onLoadEntry={handleLoadSavedEntry}
          onUpdateNotes={handleUpdateNotes}
          onDeleteEntry={handleDeleteEntry}
        />
      </main>

      <footer className="border-t border-[#E5E0D5] bg-[#F3EFE6] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#57534E]">
          <p className="font-editorial text-base font-semibold text-[#1C1917]">
            Kodokan Kotoba — Studio etimologico della terminologia del Judo
          </p>
          <p>
            Riferimenti lessicografici: Kōjien · Daijirin · Shinkangorin · Kōdōkan Jūdō Jiten
          </p>
        </div>
      </footer>

      <OfflineIndicator />
    </div>
  );
}
