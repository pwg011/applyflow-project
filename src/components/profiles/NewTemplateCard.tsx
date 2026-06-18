export default function NewTemplateCard({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[170px] w-full flex-col items-center justify-center rounded-[6px] border border-dashed border-[#cfd2d6] bg-white/35 px-6 py-6 text-center text-[#4b4b4d] shadow-[0_12px_26px_rgba(0,0,0,0.025),inset_0_1px_0_rgba(255,255,255,0.68)] transition hover:border-[#bfc2c6] hover:bg-white/55"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#d7d9dc] bg-[#eef0f3]/80 text-[24px] font-light text-[#2b2d30] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.04)]">
        +
      </span>
      <span className="mt-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#2f3235]">
        New Template
      </span>
      <span className="mt-2 text-[15px] text-[#55575b]">
        Start from an industry baseline
      </span>
    </button>
  );
}
