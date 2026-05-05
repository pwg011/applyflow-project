"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import ApplicationDetailsModal from "@/components/ApplicationDetailsModal";
import BurgerMenu from "@/components/BurgerMenu";
import DeleteApplicationModal from "@/components/DeleteApplicationModal";
import ApplicationForm from "@/components/ApplicationForm";
import ImportPreviewModal from "@/components/ImportPreviewModal";
import PlusActionMenu from "@/components/PlusActionMenu";
import ProfileDropdown from "@/components/ProfileDropdown";
import { supabasse } from "@/lib/supabaseClient";
import ApplicationCard from "@/components/ApplicationCard";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Application } from "@/types/application";
import {
  convertDisplayDateToDbDate,
  detectSourceType,
  extractBasicJobFields,
  formatTodayForDisplay,
} from "@/utils/jobParser";

type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";
type StatusFilter = "All" | ApplicationStatus;
type ApplicationId = Application["id"];
type ImportSourceType = "link" | "text" | "link_and_text" | "manual";

type FormData = {
  companyName: string;
  jobTitle: string;
  jobLink: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  rawJobText: string;
  sourceType: ImportSourceType | "";
  importedAt: string;
};

type ImportPreviewData = Pick<
  FormData,
  | "companyName"
  | "jobTitle"
  | "jobLink"
  | "dateApplied"
  | "rawJobText"
  | "sourceType"
  | "importedAt"
>;

type ImportPreviewModalData = {
  company: string;
  role: string;
  job_url: string;
  date_applied: string;
};

type ToastState = {
  message: string;
  tone: "success" | "error";
};

const initialFormData = {
  companyName: "",
  jobTitle: "",
  jobLink: "",
  status: "Applied",
  dateApplied: "",
  notes: "",
  rawJobText: "",
  sourceType: "",
  importedAt: "",
} satisfies FormData;

export default function Home() {
  const addMenuRef = useRef<HTMLDivElement | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isAddOptionModalOpen, setIsAddOptionModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [isDraftPromptOpen, setIsDraftPromptOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [importJobLink, setImportJobLink] = useState("");
  const [importJobDescription, setImportJobDescription] = useState("");
  const [importPreviewData, setImportPreviewData] =
    useState<ImportPreviewData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<ApplicationId | null>(null);
  const [deletingId, setDeletingId] = useState<ApplicationId | null>(null);
  const [applicationToDelete, setApplicationToDelete] =
    useState<Application | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<ApplicationId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const totalApplications = applications.length;
  const interviewsCount = applications.filter(
    (application) => application.status === "Interview",
  ).length;
  const offersCount = applications.filter(
    (application) => application.status === "Offer",
  ).length;
  const rejectionsCount = applications.filter(
    (application) => application.status === "Rejected",
  ).length;
  const selectedApplication =
    applications.find(
      (application) => application.id === selectedApplicationId,
    ) ?? null;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      application.company.toLowerCase().includes(normalizedSearchQuery) ||
      application.role.toLowerCase().includes(normalizedSearchQuery);
    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const hasDraftData =
    formData.companyName.trim() !== "" ||
    formData.jobTitle.trim() !== "" ||
    formData.jobLink.trim() !== "" ||
    formData.dateApplied.trim() !== "" ||
    formData.notes.trim() !== "";

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

  function showToast(message: string, tone: ToastState["tone"]) {
    setToast({ message, tone });
  }

  function mapRowToApplication(row: Partial<Application>): Application {
    return {
      id: String(row.id ?? ""),
      user_id: row.user_id ?? null,
      company: row.company ?? "",
      role: row.role ?? "",
      job_url: row.job_url ?? null,
      status: row.status ?? "Applied",
      date_applied: row.date_applied ?? null,
      notes: row.notes ?? "",
      raw_job_text: row.raw_job_text ?? null,
      source_type: row.source_type ?? null,
      imported_at: row.imported_at ?? null,
      created_at: row.created_at ?? null,
    };
  }

  function formatDateForForm(dateValue?: string | null) {
    if (!dateValue) {
      return "";
    }

    const [year, month, day] = dateValue.split("-");

    if (!year || !month || !day) {
      return dateValue;
    }

    return `${day}/${month}/${year}`;
  }

  async function fetchApplications(options?: { showLoading?: boolean }) {
    if (!user) return;

    const showLoading = options?.showLoading ?? false;

    if (showLoading) {
      setIsLoading(true);
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      logSupabaseError("fetch applications", error);
      showToast("Something went wrong. Please try again.", "error");
      if (showLoading) {
        setIsLoading(false);
      }
      return;
    }

    setApplications(
      (data ?? []).map((row) =>
        mapRowToApplication(row as Partial<Application>),
      ),
    );

    if (showLoading) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        logSupabaseError("load auth session", error);
      }

      setUser(session?.user ?? null);
      setIsAuthReady(true);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      setIsLoading(false);
      return;
    }

    void fetchApplications({ showLoading: true });
  }, [user]);

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
    if (!isAddOptionModalOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!addMenuRef.current) {
        return;
      }

      if (!addMenuRef.current.contains(event.target as Node)) {
        closeAddOptionModal();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isAddOptionModalOpen]);

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

  function openNewApplicationPanel() {
    if (editingId === null && hasDraftData) {
      setIsDraftPromptOpen(true);
      return;
    }

    setIsAddOptionModalOpen(true);
  }

  function openBlankApplicationPanel() {
    setEditingId(null);
    setFormData(initialFormData);
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
  }

  function clearForm() {
    setFormData(initialFormData);
  }

  function closeAddOptionModal() {
    setIsAddOptionModalOpen(false);
  }

  function closeImportModal() {
    setIsImportModalOpen(false);
    setImportJobLink("");
    setImportJobDescription("");
  }

  function closeImportPreview() {
    setIsImportPreviewOpen(false);
    setImportPreviewData(null);
  }

  function handleContinueDraft() {
    setIsDraftPromptOpen(false);
    setIsPanelOpen(true);
  }

  function handleClearDraft() {
    clearForm();
    setEditingId(null);
    setIsDraftPromptOpen(false);
    setIsPanelOpen(true);
  }

  function handleCancelDraftPrompt() {
    setIsDraftPromptOpen(false);
  }

  function handleAddManually() {
    closeAddOptionModal();
    openBlankApplicationPanel();
  }

  function handleOpenImportModal() {
    closeAddOptionModal();
    setEditingId(null);
    setFormData(initialFormData);
    setIsImportModalOpen(true);
  }

  function handleImportJob() {
    const trimmedJobLink = importJobLink.trim();
    const trimmedJobDescription = importJobDescription.trim();

    if (!trimmedJobLink && !trimmedJobDescription) {
      showToast("Something went wrong. Please try again.", "error");
      return;
    }

    const sourceType = detectSourceType(
      trimmedJobLink,
      trimmedJobDescription,
    ) as ImportSourceType;
    const importHints = extractBasicJobFields(trimmedJobDescription);

    setEditingId(null);
    setImportPreviewData({
      companyName: importHints.company,
      jobTitle: importHints.role,
      jobLink: trimmedJobLink,
      dateApplied: formatTodayForDisplay(),
      rawJobText: trimmedJobDescription,
      sourceType,
      importedAt: new Date().toISOString(),
    });
    closeImportModal();
    setIsImportPreviewOpen(true);
  }

  function handleImportPreviewChange(updatedData: ImportPreviewModalData) {
    setImportPreviewData((current) =>
      current
        ? {
            ...current,
            companyName: updatedData.company,
            jobTitle: updatedData.role,
            jobLink: updatedData.job_url,
            dateApplied: updatedData.date_applied,
          }
        : current,
    );
  }

  function handleContinueImportPreview() {
    if (!importPreviewData) {
      return;
    }

    setFormData({
      ...initialFormData,
      companyName: importPreviewData.companyName,
      jobTitle: importPreviewData.jobTitle,
      jobLink: importPreviewData.jobLink,
      dateApplied: importPreviewData.dateApplied,
      notes: "Imported job posting",
      rawJobText: importPreviewData.rawJobText,
      sourceType: importPreviewData.sourceType,
      importedAt: importPreviewData.importedAt,
    });
    setIsImportPreviewOpen(false);
    setImportPreviewData(null);
    setIsPanelOpen(true);
  }

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      showToast("You must be logged in to save an application.", "error");
      return;
    }

    setIsSaving(true);

    const applicationData: FormData = {
      companyName: formData.companyName.trim(),
      jobTitle: formData.jobTitle.trim(),
      jobLink: formData.jobLink.trim(),
      status: formData.status,
      dateApplied: formData.dateApplied,
      notes: formData.notes.trim(),
      rawJobText: formData.rawJobText.trim(),
      sourceType: formData.sourceType,
      importedAt: formData.importedAt,
    };
    const databaseDateApplied = convertDisplayDateToDbDate(
      applicationData.dateApplied,
    );

    if (editingId !== null) {
      const { error } = await supabase
        .from("applications")
        .update({
          company: applicationData.companyName,
          role: applicationData.jobTitle,
          job_url: applicationData.jobLink,
          status: applicationData.status,
          date_applied: databaseDateApplied,
          notes: applicationData.notes,
          raw_job_text: applicationData.rawJobText || null,
          source_type: applicationData.sourceType || null,
          imported_at: applicationData.importedAt || null,
        })
        .eq("id", editingId)
        .eq("user_id", user.id);

      if (error) {
        logSupabaseError("update application", error);
        showToast(
          error.message || "Something went wrong. Please try again.",
          "error",
        );
        setIsSaving(false);
        return;
      }

      await fetchApplications();
      console.log("Job application updated:", {
        id: editingId,
        ...applicationData,
      });
      setSelectedApplicationId(editingId);
      showToast("Application updated", "success");
    } else {
      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        company: applicationData.companyName,
        role: applicationData.jobTitle,
        job_url: applicationData.jobLink,
        status: applicationData.status,
        date_applied: databaseDateApplied,
        notes: applicationData.notes,
        raw_job_text: applicationData.rawJobText || null,
        source_type: applicationData.sourceType || "manual",
        imported_at: applicationData.importedAt || new Date().toISOString(),
      });

      if (error) {
        logSupabaseError("create application", error);
        showToast(
          error.message || "Something went wrong. Please try again.",
          "error",
        );
        setIsSaving(false);
        return;
      }

      await fetchApplications();
      console.log("Job application created:", applicationData);
      showToast("Application saved", "success");
    }

    setFormData(initialFormData);
    setEditingId(null);
    closePanel();
    setIsSaving(false);
  }

  function handleCardClick(applicationId: ApplicationId) {
    setSelectedApplicationId(applicationId);
  }

  function handleModalClose() {
    setSelectedApplicationId(null);
  }

  function handleEditApplication(application: Application) {
    handleModalClose();
    setEditingId(application.id);
    setFormData({
      companyName: application.company,
      jobTitle: application.role,
      jobLink: application.job_url ?? "",
      status: application.status as ApplicationStatus,
      dateApplied: formatDateForForm(application.date_applied),
      notes: application.notes ?? "",
      rawJobText: application.raw_job_text ?? "",
      sourceType: (application.source_type as ImportSourceType | "") ?? "",
      importedAt: application.imported_at ?? "",
    });
    setIsPanelOpen(true);
  }

  function handleDeleteRequest(application: Application) {
    setApplicationToDelete(application);
  }

  function handleDeletePromptClose() {
    setApplicationToDelete(null);
  }

  async function handleDeleteApplication(applicationId: ApplicationId) {
    if (!user) return;

    setIsDeleting(true);
    setDeletingId(applicationId);
    handleDeletePromptClose();
    handleModalClose();

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1500);
    });

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId)
      .eq("user_id", user.id);

    if (error) {
      setDeletingId(null);
      setIsDeleting(false);
      logSupabaseError("delete application", error);
      showToast(
        error.message || "Something went wrong. Please try again.",
        "error",
      );
      return;
    }

    setApplications((current) =>
      current.filter((application) => application.id !== applicationId),
    );
    if (editingId === applicationId) {
      setEditingId(null);
      setFormData(initialFormData);
      closePanel();
    }
    setDeletingId(null);
    setIsDeleting(false);
    showToast("Application deleted", "success");
  }

  async function handleModalStatusChange(
    applicationId: ApplicationId,
    status: ApplicationStatus,
  ) {
    if (!user) return;

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId)
      .eq("user_id", user.id);

    if (error) {
      logSupabaseError("update application status", error);
      showToast(
        error.message || "Something went wrong. Please try again.",
        "error",
      );
      return;
    }

    await fetchApplications();
  }

  async function handleSignUp() {
    setAuthMessage("");

    const { error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setAuthMessage("Account created. You can now log in.");
  }

  async function handleLogin() {
    setAuthMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });

    if (error) {
      setAuthMessage(error.message);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logSupabaseError("log out", error);
      return;
    }

    setUser(null);
    setIsProfileMenuOpen(false);
    setApplications([]);
    setSelectedApplicationId(null);
    setEditingId(null);
    setFormData(initialFormData);
    setIsPanelOpen(false);
  }

  if (!isAuthReady) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">ApplyFlow</h1>
          <p className="mt-2 text-sm text-slate-500">Loading session...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">ApplyFlow</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign up or log in to access your dashboard.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(event) => setAuthEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(event) => setAuthPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSignUp}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={handleLogin}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Login
              </button>
            </div>

            {authMessage ? (
              <p
                className={`text-sm ${
                  authMessage === "Account created. You can now log in."
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {authMessage}
              </p>
            ) : null}
          </div>
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
              {"\u2630"}
            </button>

            <BurgerMenu isOpen={isBurgerMenuOpen} currentPath={pathname} />
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">ApplyFlow</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">
              Applications
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div ref={addMenuRef} className="relative">
              <button
                type="button"
                onClick={openNewApplicationPanel}
                aria-label="Open add application panel"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xl leading-none shadow-sm hover:bg-slate-50"
              >
                +
                {hasDraftData ? (
                  <span className="absolute right-0 top-0 flex h-4 w-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white animate-pulse">
                    !
                  </span>
                ) : null}
              </button>

              <PlusActionMenu
                isOpen={isAddOptionModalOpen}
                onClose={closeAddOptionModal}
                onAddManual={handleAddManually}
                onImport={handleOpenImportModal}
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

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-slate-500">Dashboard</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            Job Applications
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Applications</p>
            <p className="mt-3 text-3xl font-semibold">{totalApplications}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Interviews</p>
            <p className="mt-3 text-3xl font-semibold">{interviewsCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Offers</p>
            <p className="mt-3 text-3xl font-semibold">{offersCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Rejections</p>
            <p className="mt-3 text-3xl font-semibold">{rejectionsCount}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="All">All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-medium">No applications yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Click the plus button to add your first job application.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-medium">
              No matching applications found
            </h3>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                deletingId={deletingId}
                onOpenDetails={() => handleCardClick(application.id)}
                onEdit={() => handleEditApplication(application)}
                onDelete={() => handleDeleteRequest(application)}
              />
            ))}
          </div>
        )}
      </section>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 ${
          isPanelOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closePanel}
        aria-hidden="true"
      />

      <ApplicationForm
        isOpen={isPanelOpen}
        onClose={closePanel}
        onSubmit={handleSubmit}
        editingId={editingId}
        formData={formData}
        onInputChange={handleInputChange}
        onClear={clearForm}
        isSaving={isSaving}
      />

      <div
        className={`fixed inset-0 z-[54] bg-slate-950/40 transition-opacity duration-300 ${
          isImportModalOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeImportModal}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[55] flex items-center justify-center px-6 transition-all duration-300 ${
          isImportModalOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isImportModalOpen}
      >
        <div
          className={`w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
            isImportModalOpen
              ? "translate-y-0 scale-100"
              : "translate-y-4 scale-95"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                Import job
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Add a job link, paste a description, or use both.
              </p>
            </div>

            <button
              type="button"
              onClick={closeImportModal}
              aria-label="Close import modal"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              X
            </button>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              <label
                htmlFor="importJobLink"
                className="text-sm font-medium text-slate-700"
              >
                Job link
              </label>
              <input
                id="importJobLink"
                type="text"
                value={importJobLink}
                onChange={(event) => setImportJobLink(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="importJobDescription"
                className="text-sm font-medium text-slate-700"
              >
                Job description
              </label>
              <textarea
                id="importJobDescription"
                value={importJobDescription}
                onChange={(event) =>
                  setImportJobDescription(event.target.value)
                }
                rows={10}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={handleImportJob}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Import
            </button>
          </div>
        </div>
      </div>

      <ImportPreviewModal
        isOpen={isImportPreviewOpen}
        data={{
          company: importPreviewData?.companyName ?? "",
          role: importPreviewData?.jobTitle ?? "",
          job_url: importPreviewData?.jobLink ?? "",
          date_applied: importPreviewData?.dateApplied ?? "",
        }}
        onChange={handleImportPreviewChange}
        onCancel={closeImportPreview}
        onContinue={handleContinueImportPreview}
      />

      <div
        className={`fixed inset-0 z-[80] bg-slate-950/40 transition-opacity duration-300 ${
          isDraftPromptOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={handleCancelDraftPrompt}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center px-6 transition-all duration-300 ${
          isDraftPromptOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isDraftPromptOpen}
      >
        <div
          className={`w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
            isDraftPromptOpen
              ? "translate-y-0 scale-100"
              : "translate-y-4 scale-95"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              You have a pending draft
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Continue where you left off or clear the current draft.
            </p>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Company:</span>{" "}
                {formData.companyName || "Not provided"}
              </p>
              <p className="mt-2">
                <span className="font-medium text-slate-900">Job title:</span>{" "}
                {formData.jobTitle || "Not provided"}
              </p>
              <p className="mt-2">
                <span className="font-medium text-slate-900">Status:</span>{" "}
                {formData.status || "Not provided"}
              </p>
              <p className="mt-2">
                <span className="font-medium text-slate-900">
                  Date applied:
                </span>{" "}
                {formData.dateApplied || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleCancelDraftPrompt}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClearDraft}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Clear draft
              </button>

              <button
                type="button"
                onClick={handleContinueDraft}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Continue draft
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApplicationDetailsModal
        selectedApplication={selectedApplication}
        onClose={handleModalClose}
        onStatusChange={handleModalStatusChange}
        onEdit={handleEditApplication}
        onDelete={handleDeleteRequest}
      />

      <DeleteApplicationModal
        applicationToDelete={applicationToDelete}
        isDeleting={isDeleting}
        onCancel={handleDeletePromptClose}
        onConfirmDelete={() =>
          applicationToDelete
            ? handleDeleteApplication(applicationToDelete.id)
            : undefined
        }
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
