"use client";

import type { ReactNode, RefObject } from "react";

type JobsMobileHeaderProps = {
  userInitial?: string;
  onMenuClick: () => void;
  onProfileClick: () => void;
  menuRef?: RefObject<HTMLDivElement | null>;
  profileRef?: RefObject<HTMLDivElement | null>;
  menuSlot?: ReactNode;
  profileSlot?: ReactNode;
};

export default function JobsMobileHeader({
  userInitial = "P",
  onMenuClick,
  onProfileClick,
  menuRef,
  profileRef,
  menuSlot,
  profileSlot,
}: JobsMobileHeaderProps) {
  const initial = userInitial.trim().charAt(0).toUpperCase() || "P";

  return (
    <header className="bg-[#f8fafc] px-5 pb-3 pt-4 sm:bg-white sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#07133d] transition hover:bg-white/80 sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              className="h-7 w-7"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>

          {menuSlot}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-[34px] font-semibold leading-none tracking-normal text-[#07133d] sm:text-2xl">
            Jobs
          </h1>
          <p className="mt-1.5 text-base leading-5 text-slate-500 sm:mt-1 sm:text-sm">
            Track and prepare your applications
          </p>
        </div>

        <div ref={profileRef} className="relative shrink-0">
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Open profile menu"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#061449] text-lg font-medium text-white shadow-sm transition hover:bg-[#0b1d5f] sm:h-11 sm:w-11 sm:text-sm"
          >
            {initial}
          </button>

          {profileSlot}
        </div>
      </div>
    </header>
  );
}
