"use client";

import Link from "next/link";

type SegmentedSwitchProps = {
  active: "jobs" | "profiles";
};

export default function SegmentedSwitch({ active }: SegmentedSwitchProps) {
  return (
    <nav aria-label="Primary navigation" className="w-full">
      <div className="inline-flex w-full rounded-2xl border border-slate-200 bg-white p-1 shadow-sm sm:w-auto">
        <Link
          href="/"
          aria-current={active === "jobs" ? "page" : undefined}
          className={`flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium transition sm:flex-none ${
            active === "jobs"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          Jobs
        </Link>
        <Link
          href="/personas"
          aria-current={active === "profiles" ? "page" : undefined}
          className={`ml-1 flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium transition sm:flex-none ${
            active === "profiles"
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          Profiles
        </Link>
      </div>
    </nav>
  );
}

