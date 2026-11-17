import React from "react";

interface HeaderProps {
  activeSection: string;
  savedCount: number;
  onNavigate: (sectionId: string) => void;
  onOpenSenseiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  savedCount,
  onNavigate,
  onOpenSenseiChat,
}) => {
  const navItems = [
    { id: "traduttore", label: "Traduttore" },
    { id: "radici", label: "Radici e Principi" },
    { id: "gokyo", label: "Atlante Gokyo" },
    {
      id: "taccuino",
      label: savedCount > 0 ? `Taccuino (${savedCount})` : "Taccuino",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E5E0D5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        <a
          href="#traduttore"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("traduttore");
          }}
          className="font-editorial text-2xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A5F]"
        >
          Kodokan Kotoba
        </a>

        <nav
          aria-label="Navigazione principale"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 border-b ${
                  isActive
                    ? "text-[#1C1917] border-[#1E3A5F]"
                    : "border-transparent hover:text-[#1C1917] hover:border-[#D6CEBE]"
                } focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A5F]`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenSenseiChat}
            className="px-4 py-2 min-h-[40px] text-xs font-semibold tracking-wide text-white bg-[#1E3A5F] hover:bg-[#162C49] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]"
          >
            Chiedi al Maestro
          </button>
        </div>
      </div>
    </header>
  );
};
