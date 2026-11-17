import {
  SENSEI_SYSTEM_INSTRUCTION,
  formatApiError,
  getAiClient,
  withModelFallback,
} from "./_shared.js";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      message?: string;
      history?: Array<{ role: "user" | "model"; text: string }>;
      activeTerm?: string;
    };

    const { message, history = [], activeTerm } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return Response.json(
        { error: "Scrivi una domanda per il Maestro." },
        { status: 400 }
      );
    }

    const ai = getAiClient();

    const contextualInstruction = [
      SENSEI_SYSTEM_INSTRUCTION,
      activeTerm
        ? `Il Maestro sta attualmente studiando il termine/concetto: "${activeTerm}". Collegati a questo contesto quando pertinente.`
        : "",
      "Mantieni le risposte chiare, ben scandite in paragrafi brevi con i termini chiave in Kanji + Romaji + traduzione concettuale italiana. Non usare simboli di codice o formattazione artificiale eccessiva.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const formattedHistory = history.slice(-12).map((item) => ({
      role: item.role,
      parts: [{ text: item.text }],
    }));

    const response = await withModelFallback((model, thinkingLevel) => {
      const chat = ai.chats.create({
        model,
        history: formattedHistory,
        config: {
          systemInstruction: contextualInstruction,
          thinkingConfig: { thinkingLevel },
        },
      });
      return chat.sendMessage({
        message: message.trim(),
      });
    });

    const reply = (response.text ?? "").trim();
    if (!reply) {
      return Response.json(
        { error: "Nessuna risposta ricevuta dal Maestro." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (err) {
    console.error("Error in Vercel /api/judo/chat:", err);
    const formatted = formatApiError(err);
    return Response.json({ error: formatted.message }, { status: formatted.status });
  }
}
