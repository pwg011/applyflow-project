"use client";

import type { Application } from "@/types/application";

type DeleteApplicationModalProps = {
  applicationToDelete: Application | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirmDelete: () => void;
};

export default function DeleteApplicationModal({
  applicationToDelete,
  isDeleting,
  onCancel,
  onConfirmDelete,
}: DeleteApplicationModalProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          applicationToDelete
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[110] flex items-center justify-center px-6 transition-all duration-300 ${
          applicationToDelete
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!applicationToDelete}
      >
        <div
          className={`w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
            applicationToDelete
              ? "translate-y-0 scale-100"
              : "translate-y-4 scale-95"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          {applicationToDelete ? (
            <>
              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  Delete application?
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  This action cannot be undone.
                </p>
              </div>

              <div className="px-6 py-5">
                <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Company:</span>{" "}
                    {applicationToDelete.company || "Not provided"}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium text-slate-900">
                      Job title:
                    </span>{" "}
                    {applicationToDelete.role || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={onConfirmDelete}
                  disabled={isDeleting}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
