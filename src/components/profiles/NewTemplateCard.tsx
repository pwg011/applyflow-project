export default function NewTemplateCard({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[151px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e0e2e5] bg-transparent px-6 text-center text-[#4b4b4d]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9dbde] text-[25px] font-light">
        +
      </span>
      <span className="mt-4 text-[9px] font-semibold uppercase tracking-[0.15em]">
        New Template
      </span>
      <span className="mt-2 text-[15px]">
        Start from an industry baseline
      </span>
    </button>
  );
}
