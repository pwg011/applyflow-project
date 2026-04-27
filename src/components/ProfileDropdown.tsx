"use client";

import type { User } from "@supabase/supabase-js";

type ProfileDropdownProps = {
  user: User;
  onLogout: () => void | Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileDropdown({
  user,
  onLogout,
  isOpen,
  onClose,
}: ProfileDropdownProps) {
  void onClose;

  return (
    <div
      className={`absolute right-0 top-full z-[53] mt-3 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-all duration-200 ease-out ${
        isOpen
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="px-3 py-2">
        <p className="truncate text-sm font-medium text-slate-900">
          {user.email}
        </p>
      </div>

      <div className="my-1 border-t border-slate-200" />

      <button
        type="button"
        className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
      >
        Settings
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
      >
        Logout
      </button>
    </div>
  );
}
