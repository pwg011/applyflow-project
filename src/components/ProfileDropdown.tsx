"use client";

type ProfileDropdownProps = {
  onLogout: () => void | Promise<void>;
  isOpen: boolean;
};

export default function ProfileDropdown({
  onLogout,
  isOpen,
}: ProfileDropdownProps) {
  return (
    <div
      className={`absolute right-0 top-full z-[53] mt-3 w-44 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-all duration-200 ease-out ${
        isOpen
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
      >
        Logout
      </button>
    </div>
  );
}
