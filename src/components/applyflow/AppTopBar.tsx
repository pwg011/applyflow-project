type AppTopBarProps = {
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  userInitials?: string;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6.5 9a5.5 5.5 0 0 1 11 0v5l1.5 2H5l1.5-2z" />
      <path d="M10 19h4" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 13.5v-3l-2-.5-.7-1.7 1-1.8-2.1-2.1-1.8 1-1.7-.7-.5-2h-3l-.5 2-1.7.7-1.8-1L2.1 6.5l1 1.8L2.4 10l-2 .5v3l2 .5.7 1.7-1 1.8 2.1 2.1 1.8-1 1.7.7.5 2h3l.5-2 1.7-.7 1.8 1 2.1-2.1-1-1.8.7-1.7z" />
    </svg>
  );
}

export default function AppTopBar({
  searchPlaceholder,
  searchValue = "",
  onSearchChange,
  userInitials = "PA",
}: AppTopBarProps) {
  return (
    <header className="flex h-[63px] items-center bg-[#4b4b4b] px-6 text-white xl:px-12">
      <div className="relative w-full max-w-[258px]">
        <span className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c1c2c3]">
          <SearchIcon />
        </span>
        <input
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-[27px] w-full rounded-full bg-white/5 pl-10 pr-4 text-[12px] font-medium text-white outline-none placeholder:text-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-6">
        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden h-4 w-4 sm:block"
        >
          <BellIcon />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#e4424b]" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="hidden h-[18px] w-[18px] sm:block"
        >
          <GearIcon />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#788087] bg-gradient-to-br from-[#eee5dc] via-[#9e7a63] to-[#2f3336] text-[9px] font-semibold shadow-inner">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
