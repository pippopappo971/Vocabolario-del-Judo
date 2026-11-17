import React from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/usePWAInstall";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 bg-[#1C1917] text-[#FBF9F5] border border-[#57534E] rounded-md text-xs font-medium shadow-sm"
    >
      <WifiOff aria-hidden="true" className="w-3.5 h-3.5 text-[#D6CEBE]" />
      <span>Modalità offline — Archivio locale e Taccuino disponibili</span>
    </div>
  );
};
