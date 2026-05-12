"use client";

import Link from "next/link";

type SegmentedSwitchProps = {
  active: "jobs" | "profiles";
};

export default function SegmentedSwitch({ active }: SegmentedSwitchProps) {
  return (
    <nav aria-label="Primary navigation" className="w-full">
      <div className="inline-flex min-h-[58px] w-full rounded-2xl border border-slate-200 bg-white px-1 shadow-sm sm:w-auto">
        <Link
          href="/"
          aria-current={active === "jobs" ? "page" : undefined}
          className={`flex flex-1 items-center justify-center border-b-2 px-4 text-center text-sm font-medium transition sm:flex-none ${
            active === "jobs"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-700 hover:text-slate-900"
          }`}
        >
          Jobs
        </Link>
        <Link
          href="/personas"
          aria-current={active === "profiles" ? "page" : undefined}
          className={`ml-1 flex flex-1 items-center justify-center border-b-2 px-4 text-center text-sm font-medium transition sm:flex-none ${
            active === "profiles"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-700 hover:text-slate-900"
          }`}
        >
          Profiles
        </Link>
      </div>
    </nav>
  );
}
