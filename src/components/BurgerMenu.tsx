"use client";

import Link from "next/link";

type BurgerMenuProps = {
  isOpen: boolean;
  currentPath: string;
};

const navigationItems = [
  { href: "/", label: "Applications" },
  { href: "/personas", label: "Personas" },
];

export default function BurgerMenu({
  isOpen,
  currentPath,
}: BurgerMenuProps) {
  return (
    <div
      className={`absolute left-0 top-full z-[53] mt-3 w-56 origin-top-left rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-all duration-200 ease-out ${
        isOpen
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      {navigationItems.map((item, index) => {
        const isActive = currentPath === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            } ${index > 0 ? "mt-1" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
