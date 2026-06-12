import type { Application } from "@/types/application";
import type { Persona } from "@/types/persona";

const applicationsStorageKey = "applyflow.local.applications";
const personasStorageKey = "applyflow.local.personas";

export const temporaryLocalUser = {
  id: "local-workspace-user",
  email: "preview@applyflow.local",
};

const sampleApplications: Application[] = [
  {
    id: "sample-application-1",
    user_id: temporaryLocalUser.id,
    company: "Northstar Labs",
    role: "Product Designer",
    job_url: null,
    status: "Interview",
    date_applied: "2026-06-08",
    notes: "Portfolio review scheduled.",
    source_type: "manual",
    created_at: "2026-06-08T09:00:00.000Z",
  },
  {
    id: "sample-application-2",
    user_id: temporaryLocalUser.id,
    company: "Brightworks",
    role: "Frontend Engineer",
    job_url: null,
    status: "Applied",
    date_applied: "2026-06-10",
    notes: "Applied through the company careers page.",
    source_type: "manual",
    created_at: "2026-06-10T11:30:00.000Z",
  },
];

const samplePersonas: Persona[] = [
  {
    id: "sample-persona-1",
    user_id: temporaryLocalUser.id,
    display_name: "Primary Profile",
    email: temporaryLocalUser.email,
    phone: null,
    professional_title: "Product Designer",
    target_role: "Senior Product Designer",
    skills: "Product strategy, UX research, prototyping",
    experience_summary: "Product designer focused on clear, useful workflows.",
    cv_file_path: null,
    cv_file_name: null,
    cv_uploaded_at: null,
    build_status: "manual",
    created_at: "2026-06-08T09:00:00.000Z",
  },
];

function loadLocalData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocalData<T>(key: string, value: T[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function loadLocalApplications() {
  return loadLocalData(applicationsStorageKey, sampleApplications);
}

export function saveLocalApplications(applications: Application[]) {
  saveLocalData(applicationsStorageKey, applications);
}

export function loadLocalPersonas() {
  return loadLocalData(personasStorageKey, samplePersonas);
}

export function saveLocalPersonas(personas: Persona[]) {
  saveLocalData(personasStorageKey, personas);
}
