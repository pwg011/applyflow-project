import type { ReactNode } from "react";
import PrimaryButton from "@/components/applyflow/PrimaryButton";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionIcon?: ReactNode;
  onActionClick: () => void;
};

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onActionClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[20px] font-semibold tracking-[-0.035em] text-black">
          {title}
        </h1>
        <p className="mt-1 text-[18px] text-[#4b4b4d]">{subtitle}</p>
      </div>
      <PrimaryButton icon={actionIcon} onClick={onActionClick}>
        {actionLabel}
      </PrimaryButton>
    </div>
  );
}
