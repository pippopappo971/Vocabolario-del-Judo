export type AnalysisMode = "full" | "kanji" | "compare";

export interface KanjiBreakdown {
  character: string;
  reading: string;
  radicalAndOrigin: string;
  generalJapaneseMeaning: string;
  judoSpecificMeaning: string;
}

export interface BiomechanicalApplication {
  corePrinciple: string;
  kuzushiFocus: string;
  tsukuriAndKakeFocus: string;
}

export interface SubtleDistinction {
  comparedTerm: string;
  explanation: string;
}

export interface JudoAnalysis {
  termRomaji: string;
  termKanji: string;
  termKana: string;
  category: string;
  italianConceptualTitle: string;
  literalGloss: string;
  etymologySummary: string;
  kanjiBreakdown: KanjiBreakdown[];
  biomechanicalApplication: BiomechanicalApplication;
  subtleDistinctions: SubtleDistinction[];
  senseiTatamiAdvice: string;
  japaneseDictionarySources: string[];
  relatedTerms: string[];
}

export interface MorphologyRoot {
  id: string;
  romaji: string;
  kanji: string;
  kana: string;
  group: "azioni" | "modificatori" | "principi";
  groupLabel: string;
  italianConcept: string;
  etymologyNote: string;
  biomechanicalMeaning: string;
  examples: string[];
}

export interface GokyoTechnique {
  id: string;
  romaji: string;
  kanji: string;
  kana: string;
  group: "dai1" | "dai2" | "dai3" | "dai4" | "dai5" | "katame";
  groupLabel: string;
  classification: string;
  italianConcept: string;
  keyRootExplanation: string;
}

export interface SavedStudyEntry {
  id: string;
  savedAt: string;
  analysis: JudoAnalysis;
  personalNotes: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
