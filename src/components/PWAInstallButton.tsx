import React, { useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] text-xs font-semibold text-[#1E3A5F] bg-white hover:bg-[#F3EFE6] border border-[#D6CEBE] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
      >
        <Download aria-hidden="true" className="w-3.5 h-3.5" />
        <span>Installa app</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] text-xs font-semibold text-[#1E3A5F] bg-white hover:bg-[#F3EFE6] border border-[#D6CEBE] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
        >
          <Smartphone aria-hidden="true" className="w-3.5 h-3.5" />
          <span>Installa su iOS</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/50 p-4"
          >
            <div className="w-full max-w-sm bg-[#FBF9F5] border border-[#E5E0D5] rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="ios-install-title"
                  className="font-editorial text-2xl font-semibold text-[#1C1917]"
                >
                  Installa su iPhone o iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Chiudi istruzioni"
                  className="p-1.5 min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-[#57534E] hover:text-[#1C1917] rounded-md cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-2.5 text-sm text-[#44403C] leading-relaxed list-decimal list-inside">
                <li>
                  Tocca il pulsante <strong>Condividi</strong> nella barra di Safari.
                </li>
                <li>
                  Scorri verso il basso e seleziona <strong>Aggiungi alla schermata Home</strong>.
                </li>
                <li>
                  Conferma toccando <strong>Aggiungi</strong> per avere l&apos;icona sul dispositivo.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 min-h-[44px] bg-[#1E3A5F] hover:bg-[#162C49] text-white text-sm font-semibold rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E3A5F]"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
