export type PersonaBuildStatus = "manual" | "cv_draft" | "complete";

export type Persona = {
  id: string;
  user_id: string | null;
  display_name: string;
  email: string;
  phone: string | null;
  professional_title: string | null;
  target_role: string | null;
  skills: string | null;
  experience_summary: string | null;
  cv_file_path: string | null;
  cv_file_name: string | null;
  cv_uploaded_at: string | null;
  build_status: PersonaBuildStatus;
  created_at: string | null;
};
