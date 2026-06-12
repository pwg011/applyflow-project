import type { ReactNode } from "react";
import AppSidebar from "@/components/applyflow/AppSidebar";
import AppTopBar from "@/components/applyflow/AppTopBar";
import type { ApplyFlowNavKey } from "@/data/applyflow";

type ApplyShellProps = {
  activeNav: ApplyFlowNavKey;
  children: ReactNode;
  topBarSearchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  userInitials?: string;
};

export default function ApplyShell({
  activeNav,
  children,
  topBarSearchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  userInitials,
}: ApplyShellProps) {
  return (
    <main className="min-h-screen bg-[#f0f2f5] font-sans text-[#191c1e]">
      <AppSidebar activeNav={activeNav} />
      <div className="xl:pl-[255px]">
        <AppTopBar
          searchPlaceholder={topBarSearchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          userInitials={userInitials}
        />
        {children}
      </div>
    </main>
  );
}
