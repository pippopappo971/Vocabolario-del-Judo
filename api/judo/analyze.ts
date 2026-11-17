import {
  ANALYSIS_RESPONSE_SCHEMA,
  SENSEI_SYSTEM_INSTRUCTION,
  formatApiError,
  getAiClient,
  withModelFallback,
} from "./_shared.js";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      query?: string;
      mode?: "full" | "kanji" | "compare";
      focusContext?: string;
    };

    const { query, mode = "full", focusContext } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return Response.json(
        {
          error:
            "Inserisci un termine, un kanji o un concetto del Judo da analizzare.",
        },
        { status: 400 }
      );
    }

    const ai = getAiClient();

    const modeInstruction =
      mode === "kanji"
        ? "Concentrati con estrema precisione filologica sull'etimologia di ogni singolo Kanji, sui radicali, sulle letture storiche nei dizionari giapponesi (Shinkangorin, Kojien, Daijirin) e sul motivo per cui il Kodokan ha scelto proprio quei caratteri."
        : mode === "compare"
          ? "Oltre all'analisi completa del termine o confronto richiesto, dedica particolare profondità alla sezione subtleDistinctions mettendo a confronto diretto le sfumature lessicali e biomeccaniche tra le varianti o i termini affini."
          : "Fornisci un'analisi completa, equilibrata tra rigore lessicografico giapponese e applicazione pratica sul tatami per un Maestro di Judo.";

    const prompt = [
      `Richiesta del Maestro italiano: "${query.trim()}"`,
      focusContext ? `Contesto di studio: ${focusContext}` : "",
      `Modalità di analisi richiesta: ${modeInstruction}`,
      "Restituisci esclusivamente il JSON strutturato conforme allo schema fornito.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await withModelFallback((model, thinkingLevel) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: SENSEI_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel },
        },
      })
    );

    const rawText = (response.text ?? "").trim();
    if (!rawText) {
      return Response.json(
        { error: "Il modello non ha restituito alcuna analisi." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(rawText);
    return Response.json(parsed);
  } catch (err) {
    console.error("Error in Vercel /api/judo/analyze:", err);
    const formatted = formatApiError(err);
    return Response.json({ error: formatted.message }, { status: formatted.status });
  }
}
