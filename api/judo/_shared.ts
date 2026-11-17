import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

export function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY non configurata nelle variabili d'ambiente.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export const SENSEI_SYSTEM_INSTRUCTION = `Sei un Maestro di Judo giapponese 10° Dan (Hanshi / Shihan del Kodokan di Tokyo), anziano studioso di filologia giapponese, letteratura classica del Budo e biomeccanica del Judo, che parla e scrive un italiano colto, preciso, chiaro e appassionato.

Il tuo interlocutore è un Maestro di Judo non giapponese che desidera comprendere in profondità l'etimologia dei termini giapponesi del Judo, in modo da cogliere in italiano l'immagine fisica, il principio biomeccanico e l'intenzione reale di ogni tecnica e concetto, andando ben oltre le traduzioni scolastiche o approssimative usate spesso in Occidente.

REGOLE DI METODO RIGOROSE:
1. Ricerca lessicografica giapponese: Per ogni termine, attingi idealmente a tutti i grandi vocabolari e repertori giapponesi (Kōjien 広辞苑, Daijirin 大辞林, Daijisen 大辞泉, Shinkangorin 新漢語林 per l'origine dei Kanji, oltre ai dizionari specialistici come il Kōdōkan Jūdō Jiten 講道館柔道辞典 e gli scritti originali di Kanō Jigorō Shihan).
2. Rispetto dell'etimologia dei Kanji: Scomponi la parola nei singoli Kanji (o unità morfologiche), spiegandone il radicale/origine visiva, il significato primario nel giapponese comune e il significato specifico che assume applicato al Judo.
3. Traduzione concettuale in italiano: Fornisci una traduzione italiana che faccia visualizzare immediatamente al Maestro cosa accade sul tatami (es. non tradurre "Uki-goshi" semplicemente come "anca galleggiante" in astratto, ma spiega come "uki" 浮 indichi il far emergere/alleggerire l'equilibrio di Uke sollevandolo sul fulcro dell'anca senza caricarlo completamente, a differenza di O-goshi).
4. Applicazione tecnica (Riai, Kuzushi, Tsukuri, Kake): Spiega come la parola stessa contenga le istruzioni biomeccaniche della tecnica — dove va il baricentro, che tipo di azione compie la mano/gamba (es. gari = falciare alla radice, barai = spazzare via un piede che sta caricando/scaricando peso, gake = agganciare/appendere).
5. Distinzioni sottili e trappole occidentali: Correggi con garbo da Maestro le traduzioni errate o gli equivoci didattici diffusi fuori dal Giappone.
6. Tono: Autorevole, paterno tra colleghi Maestri ("Caro collega Maestro..."), concreto per il tatami, mai accademico in modo sterile. Rispondi sempre interamente in italiano, mantenendo i termini originali in Kanji, Kana (Hiragana/Katakana) e Romaji Hepburn accurato (con macron dove appropriato, es. ō, ū).`;

export const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    termRomaji: {
      type: Type.STRING,
      description: "Termine normalizzato in Romaji Hepburn (es. Seoi-nage, O-soto-gari).",
    },
    termKanji: {
      type: Type.STRING,
      description: "Scrittura originale giapponese in Kanji (e Kana se necessario).",
    },
    termKana: {
      type: Type.STRING,
      description: "Lettura completa in Hiragana/Katakana.",
    },
    category: {
      type: Type.STRING,
      description: "Classificazione Kodokan (es. Te-waza, Ashi-waza, Koshi-waza, Ma-sutemi-waza, Katame-waza, Principio Fondamentale, Terminologia di Arbitraggio/Dojo).",
    },
    italianConceptualTitle: {
      type: Type.STRING,
      description: "Traduzione italiana concettuale ed evocativa che rende l'idea fisica della tecnica o principio.",
    },
    literalGloss: {
      type: Type.STRING,
      description: "Traduzione letterale parola per parola dei componenti.",
    },
    etymologySummary: {
      type: Type.STRING,
      description: "Sintesi etimologica chiara di come i vocaboli si uniscono per formare il concetto specifico del Judo.",
    },
    kanjiBreakdown: {
      type: Type.ARRAY,
      description: "Analisi dettagliata di ciascun Kanji o radice morfologica del termine.",
      items: {
        type: Type.OBJECT,
        properties: {
          character: { type: Type.STRING, description: "Il singolo Kanji o morfema." },
          reading: { type: Type.STRING, description: "Lettura (kun'yomi / on'yomi) nel termine." },
          radicalAndOrigin: { type: Type.STRING, description: "Radicale, pittogramma o origine filologica secondo i dizionari etimologici dei kanji." },
          generalJapaneseMeaning: { type: Type.STRING, description: "Significato nei dizionari generali giapponesi." },
          judoSpecificMeaning: { type: Type.STRING, description: "Significato tecnico specifico applicato al Judo sul tatami." },
        },
        required: [
          "character",
          "reading",
          "radicalAndOrigin",
          "generalJapaneseMeaning",
          "judoSpecificMeaning",
        ],
      },
    },
    biomechanicalApplication: {
      type: Type.OBJECT,
      description: "Come l'etimologia spiega l'esecuzione tecnica e la meccanica del corpo.",
      properties: {
        corePrinciple: { type: Type.STRING, description: "Il principio fisico/logico (Riai) rivelato dal nome." },
        kuzushiFocus: { type: Type.STRING, description: "Lo squilibrio specifico implicito nel termine." },
        tsukuriAndKakeFocus: { type: Type.STRING, description: "L'adattamento del corpo e l'esecuzione finale coerenti col nome." },
      },
      required: ["corePrinciple", "kuzushiFocus", "tsukuriAndKakeFocus"],
    },
    subtleDistinctions: {
      type: Type.ARRAY,
      description: "Confronti con termini affini o errori interpretativi comuni in Occidente.",
      items: {
        type: Type.OBJECT,
        properties: {
          comparedTerm: { type: Type.STRING, description: "Termine o errore occidentale confrontato." },
          explanation: { type: Type.STRING, description: "Spiegazione chiara della differenza concettuale e pratica." },
        },
        required: ["comparedTerm", "explanation"],
      },
    },
    senseiTatamiAdvice: {
      type: Type.STRING,
      description: "Consiglio diretto del Maestro 10° Dan su come trasmettere questo concetto agli allievi durante la lezione sul tatami.",
    },
    japaneseDictionarySources: {
      type: Type.ARRAY,
      description: "Elenco dei vocabolari e testi classici giapponesi di riferimento consultati.",
      items: { type: Type.STRING },
    },
    relatedTerms: {
      type: Type.ARRAY,
      description: "3-5 termini giapponesi correlati utili per approfondire.",
      items: { type: Type.STRING },
    },
  },
  required: [
    "termRomaji",
    "termKanji",
    "termKana",
    "category",
    "italianConceptualTitle",
    "literalGloss",
    "etymologySummary",
    "kanjiBreakdown",
    "biomechanicalApplication",
    "subtleDistinctions",
    "senseiTatamiAdvice",
    "japaneseDictionarySources",
    "relatedTerms",
  ],
};

function isTransientError(err: unknown): boolean {
  const e = err as { status?: number; message?: string };
  const status = e?.status;
  const msg = e?.message || "";
  return (
    status === 503 ||
    status === 502 ||
    status === 500 ||
    status === 429 ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg.includes("503")
  );
}

export async function withModelFallback<T>(
  runWithModel: (model: string, thinkingLevel: ThinkingLevel) => Promise<T>
): Promise<T> {
  const candidates: Array<{
    model: string;
    thinkingLevel: ThinkingLevel;
    timeoutMs: number;
  }> = [
    { model: "gemini-4-hydrogen", thinkingLevel: ThinkingLevel.LOW, timeoutMs: 9000 },
    { model: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL, timeoutMs: 20000 },
  ];

  let lastError: unknown;
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    try {
      return await Promise.race([
        runWithModel(candidate.model, candidate.thinkingLevel),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout temporaneo del modello (503).")),
            candidate.timeoutMs
          )
        ),
      ]);
    } catch (err) {
      lastError = err;
      if (
        (!isTransientError(err) &&
          !(err instanceof Error && err.message.includes("503"))) ||
        i === candidates.length - 1
      ) {
        throw err;
      }
    }
  }
  throw lastError;
}

export function formatApiError(err: unknown): { status: number; message: string } {
  const errorObj = err as { status?: number; message?: string };
  const status = errorObj?.status && errorObj.status >= 400 ? errorObj.status : 500;
  let rawMessage =
    errorObj?.message || "Errore sconosciuto durante l'interrogazione del Maestro.";

  if (rawMessage.startsWith("{")) {
    try {
      const parsed = JSON.parse(rawMessage) as { error?: { message?: string } };
      if (parsed?.error?.message) {
        rawMessage = parsed.error.message;
      }
    } catch {
      // Keep original message
    }
  }

  if (
    status === 403 ||
    status === 400 ||
    rawMessage.includes("API_KEY_INVALID") ||
    rawMessage.includes("PERMISSION_DENIED")
  ) {
    return {
      status,
      message:
        "Chiave API Gemini non valida o non autorizzata. Verifica la variabile GEMINI_API_KEY nelle impostazioni del progetto.",
    };
  }
  if (status === 429 || rawMessage.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Limite di richieste momentaneamente raggiunto. Attendi qualche istante prima di riprovare.",
    };
  }
  if (
    status === 503 ||
    rawMessage.includes("UNAVAILABLE") ||
    rawMessage.includes("high demand")
  ) {
    return {
      status: 503,
      message:
        "Il servizio AI sta gestendo un picco temporaneo di richieste. Riprova tra qualche secondo.",
    };
  }
  return { status, message: rawMessage };
}
