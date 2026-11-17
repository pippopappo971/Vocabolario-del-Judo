import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { ChatMessage } from "../types/judo";

interface SenseiDialogueProps {
  activeTerm?: string;
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
}

const SUGGESTED_QUESTIONS = [
  "Qual è la differenza concettuale tra Gari (刈), Barai (払) e Gake (掛)?",
  "Perché si usa il verbo Tsurikomi (釣込) e non semplicemente Hiki (引)?",
  "Come spiegare in italiano agli allievi la differenza tra Uki-goshi e O-goshi?",
  "Cosa significa davvero Shizen-hontai (自然本体) nei testi originali del Kodokan?",
];

export const SenseiDialogue: React.FC<SenseiDialogueProps> = ({
  activeTerm,
  messages,
  isSending,
  error,
  onSendMessage,
  onResetChat,
}) => {
  const [input, setInput] = useState("");
  const [dojoImgFailed, setDojoImgFailed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <section
      id="maestro"
      className="border-t border-[#E5E0D5] bg-[#F3EFE6]/60 py-14"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-[#E5E0D5] rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div className="w-full aspect-4/3 overflow-hidden rounded border border-[#E5E0D5] bg-[#FBF9F5]">
                {!dojoImgFailed ? (
                  <img
                    src="/src/assets/images/sensei_dojo_seal_1794937954309.jpg"
                    alt="Interno tradizionale di un dojo Kodokan giapponese con tatami e shomen"
                    referrerPolicy="no-referrer"
                    onError={() => setDojoImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-center">
                    <span className="font-kanji text-4xl text-[#1E3A5F]">講道館</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-[#B91C1C]">
                  Colloquio con il Maestro · 10° Dan
                </p>
                <h2 className="font-editorial text-3xl font-semibold text-[#1C1917]">
                  Dialogo sul tatami
                </h2>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Poni domande comparative, dubbi sulle sfumature di Kanji o chiedi
                  come trasmettere un principio giapponese ai tuoi allievi italiani.
                </p>
                {activeTerm && (
                  <p className="text-xs text-[#1E3A5F] font-medium pt-1">
                    Contesto attuale in studio: {activeTerm}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#E5E0D5]">
              <p className="text-xs font-semibold text-[#57534E]">
                Spunti di confronto per Maestri:
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={isSending}
                    onClick={() => onSendMessage(q)}
                    className="text-left px-3 py-2 min-h-[40px] text-xs text-[#1C1917] bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#E5E0D5] rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-[#E5E0D5] rounded-lg flex flex-col min-h-[540px]">
            <div className="px-6 py-4 border-b border-[#E5E0D5] flex items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#1C1917]">
                  Sessione di studio lessicografico
                </h3>
                <p className="text-xs text-[#78716C]">
                  Risposte basate su etimologia dei Kanji e pedagogia Kodokan
                </p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={onResetChat}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                >
                  <RotateCcw aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>Nuova conversazione</span>
                </button>
              )}
            </div>

            <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[460px]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-start max-w-xl py-8 space-y-3">
                  <p className="font-editorial text-2xl italic text-[#1C1917]">
                    &ldquo;Caro collega Maestro, ogni parola giapponese del nostro Judo
                    contiene già la postura corretta e l&apos;intenzione del movimento.&rdquo;
                  </p>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Scrivi qui sotto un dubbio tecnico o lessicale, oppure scegli una delle
                    domande comparative a lato per iniziare il colloquio.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl rounded-lg px-5 py-4 text-[15px] leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-[#1E3A5F] text-white"
                          : "bg-[#FBF9F5] border border-[#E5E0D5] text-[#1C1917]"
                      }`}
                    >
                      <p className="text-xs font-medium mb-1.5 opacity-75">
                        {msg.role === "user" ? "Tu · Istruttore" : "Maestro 10° Dan · Shihan"}
                      </p>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}

              {isSending && (
                <div className="flex items-start">
                  <div className="bg-[#FBF9F5] border border-[#E5E0D5] rounded-lg px-5 py-4 text-sm text-[#57534E]">
                    Il Maestro sta riflettendo sui testi giapponesi...
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="p-4 bg-[#FBF9F5] border border-[#B91C1C]/40 rounded-lg text-sm text-[#B91C1C]"
                >
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-5 border-t border-[#E5E0D5] bg-[#FBF9F5]/60 flex flex-col sm:flex-row gap-3"
            >
              <label htmlFor="sensei-chat-input" className="sr-only">
                Scrivi una domanda per il Maestro 10° Dan
              </label>
              <input
                id="sensei-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Es. Perché in Tai-otoshi la gamba non spazza ma si appoggia soltanto?"
                className="flex-1 min-h-[46px] px-4 py-2.5 bg-white border border-[#D6CEBE] rounded-lg text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A5F]"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[46px] bg-[#1E3A5F] hover:bg-[#162C49] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
              >
                <span>Invia</span>
                <Send aria-hidden="true" className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
