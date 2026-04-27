"use client";

import type { Persona } from "@/types/persona";

type PersonaCardProps = {
  persona: Persona;
  onEdit: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
};

function getPreview(value?: string | null, maxLength = 120) {
  const trimmedValue = (value ?? "").trim();

  if (!trimmedValue) {
    return "Not provided";
  }

  if (trimmedValue.length <= maxLength) {
    return trimmedValue;
  }

  return `${trimmedValue.slice(0, maxLength).trimEnd()}...`;
}

export default function PersonaCard({
  persona,
  onEdit,
  onDelete,
}: PersonaCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {persona.display_name}
          </h3>
          <p className="text-sm text-slate-600">
            {persona.professional_title || "Professional title not provided"}
          </p>
          <p className="text-sm text-slate-500">
            Target role: {persona.target_role || "Not provided"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(persona)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(persona)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Skills
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {getPreview(persona.skills)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Experience Summary
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {getPreview(persona.experience_summary)}
          </p>
        </div>
      </div>
    </article>
  );
}
