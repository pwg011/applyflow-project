export type Application = {
  id: string;
  user_id?: string | null;
  company: string;
  role: string;
  job_url?: string | null;
  status: string;
  date_applied?: string | null;
  notes?: string | null;
  persona_id?: string | null;
  raw_job_text?: string | null;
  source_type?: string | null;
  imported_at?: string | null;
  created_at?: string | null;
};
