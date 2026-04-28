"use client";

type PlusActionMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddManual: () => void;
  onImport: () => void;
  addManualLabel?: string;
  importLabel?: string;
};

export default function PlusActionMenu({
  isOpen,
  onClose,
  onAddManual,
  onImport,
  addManualLabel = "Add manually",
  importLabel = "Import job",
}: PlusActionMenuProps) {
  void onClose;

  return (
    <div
      className={`absolute left-1/2 top-full z-[53] mt-3 w-44 -translate-x-1/2 origin-top rounded-2xl bg-slate-900 p-2 shadow-2xl transition-all duration-200 ease-out ${
        isOpen
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={onAddManual}
        className="w-full rounded-xl bg-slate-900 px-3 py-2.5 text-left text-sm font-medium text-white transition hover:bg-slate-800 hover:shadow-sm"
      >
        {addManualLabel}
      </button>

      <button
        type="button"
        onClick={onImport}
        className="mt-2 w-full rounded-xl bg-slate-900 px-3 py-2.5 text-left text-sm font-medium text-white transition hover:bg-slate-800 hover:shadow-sm"
      >
        {importLabel}
      </button>
    </div>
  );
}
