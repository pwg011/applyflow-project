import Link from "next/link";
import type { ReactNode } from "react";
import {
  sidebarNavItems,
  type ApplyFlowNavKey,
} from "@/data/applyflow";

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7" />
      <path d="M4 7h16v12H4z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 19c.4-3.5 2.6-5 6.5-5s6.1 1.5 6.5 5z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.3c-.8.3-1 1-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

const navIcons: Record<ApplyFlowNavKey, ReactNode> = {
  dashboard: <GridIcon />,
  jobs: <BriefcaseIcon />,
  profiles: <ProfileIcon />,
};

export default function AppSidebar({
  activeNav,
}: {
  activeNav: ApplyFlowNavKey;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[255px] border-r border-[#e4e6e9] bg-[#f7f9fc] xl:flex xl:flex-col">
      <div className="flex h-[63px] items-center gap-3 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-black text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-[18px] w-[18px]"
          >
            <path d="M3 6h7l2 2h9v11H3z" />
            <circle cx="15.5" cy="13.5" r="2.5" />
          </svg>
        </div>
        <span className="text-[20px] font-semibold tracking-[-0.035em]">
          ApplyFlow
        </span>
      </div>

      <nav className="mt-16 space-y-2 px-5">
        {sidebarNavItems.map((item) => {
          const isActive = item.key === activeNav;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex items-center gap-3.5 px-3 text-[12px] ${
                isActive
                  ? "h-11 font-medium text-black"
                  : "h-10 text-[#46474a]"
              }`}
            >
              <span className="h-4 w-4">{navIcons[item.key]}</span>
              {item.label}
              {isActive ? (
                <span className="absolute -right-0.5 inset-y-0 w-0.5 bg-black" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#e4e6e9] px-5 py-6">
        <button
          type="button"
          className="flex items-center gap-3.5 px-3 text-[12px] text-[#46474a]"
        >
          <span className="h-4 w-4">
            <HelpIcon />
          </span>
          Help
        </button>
      </div>
    </aside>
  );
}
