"use client";

type ImportJobCardProps = {
  onClick: () => void;
  showDraftIndicator?: boolean;
};

export default function ImportJobCard({
  onClick,
  showDraftIndicator = false,
}: ImportJobCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Import job"
      className="relative flex w-full items-center gap-4 rounded-[1.75rem] bg-[#061449] px-6 py-7 text-left text-white shadow-sm transition hover:bg-[#0b1d5f] focus:outline-none focus:ring-2 focus:ring-[#061449]/30 focus:ring-offset-2 sm:rounded-2xl sm:px-5 sm:py-5"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#07133d] sm:h-12 sm:w-12">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="h-8 w-8 sm:h-6 sm:w-6"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[1.42rem] font-semibold leading-7 tracking-normal sm:text-lg sm:leading-6">
          Import Job
        </span>
        <span className="mt-2 block truncate text-[1.16rem] leading-6 text-slate-300 sm:text-sm sm:leading-5">
          Paste a link, job post or description
        </span>
      </span>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 shrink-0 text-white sm:h-6 sm:w-6"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>

      {showDraftIndicator ? (
        <span className="absolute right-4 top-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
          !
        </span>
      ) : null}
    </button>
  );
}
