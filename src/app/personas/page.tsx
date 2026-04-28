"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import BurgerMenu from "@/components/BurgerMenu";
import PersonaForm from "@/components/PersonaForm";
import PlusActionMenu from "@/components/PlusActionMenu";
import ProfileDropdown from "@/components/ProfileDropdown";
import { supabase } from "@/lib/supabaseClient";
import type { Persona } from "@/types/persona";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type PersonaFormData = {
  display_name: string;
  email: string;
  phone: string;
  professional_title: string;
  target_role: string;
  skills: string;
  experience_summary: string;
};

type ToastState = {
  message: string;
  tone: "success" | "error";
};

const initialFormData: PersonaFormData = {
  display_name: "",
  email: "",
  phone: "",
  professional_title: "",
  target_role: "",
  skills: "",
  experience_summary: "",
};

function mapRowToPersona(row: Partial<Persona>): Persona {
  return {
    id: String(row.id ?? ""),
    user_id: row.user_id ?? null,
    display_name: row.display_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? null,
    professional_title: row.professional_title ?? null,
    target_role: row.target_role ?? null,
    skills: row.skills ?? null,
    experience_summary: row.experience_summary ?? null,
    created_at: row.created_at ?? null,
  };
}

export default function PersonasPage() {
  const createMenuRef = useRef<HTMLDivElement | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PersonaFormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function showToast(message: string, tone: ToastState["tone"]) {
    setToast({ message, tone });
  }

  function logSupabaseError(
    action: string,
    error: {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    },
  ) {
    console.log(`Failed to ${action}:`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  const fetchPersonas = useCallback(async (currentUser: User) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetch personas", error);
      showToast(error.message || "Something went wrong. Please try again.", "error");
      setIsLoading(false);
      return;
    }

    setPersonas((data ?? []).map((row) => mapRowToPersona(row as Partial<Persona>)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchPersonas(session.user);
      } else {
        setPersonas([]);
        setIsLoading(false);
      }
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (session?.user) {
          await fetchPersonas(session.user);
        } else {
          setPersonas([]);
          setIsLoading(false);
        }
        setUser(session?.user ?? null);
        setIsAuthReady(true);
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPersonas]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  useEffect(() => {
    if (!isCreateMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!createMenuRef.current) {
        return;
      }

      if (!createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isCreateMenuOpen]);

  useEffect(() => {
    if (!isBurgerMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!burgerMenuRef.current) {
        return;
      }

      if (!burgerMenuRef.current.contains(event.target as Node)) {
        setIsBurgerMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isBurgerMenuOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!profileMenuRef.current) {
        return;
      }

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isProfileMenuOpen]);

  function closeForm() {
    setIsFormOpen(false);
    setEditingPersonaId(null);
    setFormData(initialFormData);
    setFormError("");
  }

  function openCreateForm() {
    setIsCreateMenuOpen(false);
    setEditingPersonaId(null);
    setFormData(initialFormData);
    setFormError("");
    setIsFormOpen(true);
  }

  function handleOpenCreateMenu() {
    setIsCreateMenuOpen((current) => !current);
  }

  function handleCvAutoFillComingSoon() {
    setIsCreateMenuOpen(false);
    showToast("CV auto-fill is coming soon.", "success");
  }

  function openEditForm(persona: Persona) {
    setEditingPersonaId(persona.id);
    setFormData({
      display_name: persona.display_name,
      email: persona.email,
      phone: persona.phone ?? "",
      professional_title: persona.professional_title ?? "",
      target_role: persona.target_role ?? "",
      skills: persona.skills ?? "",
      experience_summary: persona.experience_summary ?? "",
    });
    setFormError("");
    setIsFormOpen(true);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setFormError("You must be logged in to save a persona.");
      return;
    }

    if (!formData.display_name.trim() || !formData.email.trim()) {
      setFormError("Display Name and Email are required.");
      return;
    }

    setFormError("");
    setIsSaving(true);

    const payload = {
      user_id: user.id,
      display_name: formData.display_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      professional_title: formData.professional_title.trim() || null,
      target_role: formData.target_role.trim() || null,
      skills: formData.skills.trim() || null,
      experience_summary: formData.experience_summary.trim() || null,
    };

    if (editingPersonaId) {
      const { error } = await supabase
        .from("personas")
        .update(payload)
        .eq("id", editingPersonaId)
        .eq("user_id", user.id);

      if (error) {
        logSupabaseError("update persona", error);
        setFormError(error.message || "Something went wrong. Please try again.");
        setIsSaving(false);
        return;
      }

      if (user) {
        await fetchPersonas(user);
      }
      showToast("Persona updated", "success");
    } else {
      const { error } = await supabase.from("personas").insert(payload);

      if (error) {
        logSupabaseError("create persona", error);
        setFormError(error.message || "Something went wrong. Please try again.");
        setIsSaving(false);
        return;
      }

      if (user) {
        await fetchPersonas(user);
      }
      showToast("Persona created", "success");
    }

    setIsSaving(false);
    closeForm();
  }

  async function handleDelete(persona: Persona) {
    if (!user) {
      showToast("You must be logged in to delete a persona.", "error");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete persona "${persona.display_name}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    const { error } = await supabase
      .from("personas")
      .delete()
      .eq("id", persona.id)
      .eq("user_id", user.id);

    if (error) {
      logSupabaseError("delete persona", error);
      showToast(error.message || "Something went wrong. Please try again.", "error");
      return;
    }

    setPersonas((current) => current.filter((item) => item.id !== persona.id));
    showToast("Persona deleted", "success");
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logSupabaseError("log out", error);
      return;
    }

    setUser(null);
    setPersonas([]);
    setIsProfileMenuOpen(false);
    closeForm();
  }

  if (!isAuthReady) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Personas</h1>
          <p className="mt-2 text-sm text-slate-500">Loading session...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Personas</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to view and manage your personas.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div ref={burgerMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsBurgerMenuOpen((current) => !current)}
              aria-label="Open navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:bg-slate-50"
            >
              ☰
            </button>

            <BurgerMenu
              isOpen={isBurgerMenuOpen}
              currentPath={pathname}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">ApplyFlow</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">
              Personas
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div ref={createMenuRef} className="relative">
              <button
                type="button"
                onClick={handleOpenCreateMenu}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  +
                </span>
                Create Persona
              </button>

              <PlusActionMenu
                isOpen={isCreateMenuOpen}
                onClose={() => setIsCreateMenuOpen(false)}
                onAddManual={openCreateForm}
                onImport={handleCvAutoFillComingSoon}
                addManualLabel="Create manually"
                importLabel="Use CV to auto-fill"
              />
            </div>

            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white shadow-sm"
              >
                P
              </button>

              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Build reusable professional personas for future AI-assisted workflows.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Loading personas...</p>
          </div>
        ) : personas.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-medium">No personas yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your first persona to start organizing your professional profiles.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {personas.map((persona) => (
              <article
                key={persona.id}
                className="flex min-h-[240px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                    No CV yet
                  </div>

                  <div className="mt-5 space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                      {persona.display_name}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {persona.target_role || "Target role not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(persona)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(persona)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PersonaForm
        isOpen={isFormOpen}
        mode={editingPersonaId ? "edit" : "create"}
        formData={formData}
        errorMessage={formError}
        isSaving={isSaving}
        onChange={handleInputChange}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <div
        className={`fixed right-4 top-4 z-[120] transition-all duration-200 ease-out ${
          toast
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!toast}
      >
        {toast ? (
          <div
            className={`rounded-2xl border bg-white px-4 py-3 text-sm shadow-lg ${
              toast.tone === "success"
                ? "border-slate-200 text-slate-700"
                : "border-red-200 text-red-600"
            }`}
          >
            {toast.message}
          </div>
        ) : null}
      </div>
    </main>
  );
}
