export type ApplyFlowNavKey = "dashboard" | "jobs" | "profiles" | "resume";
export type JobStatus = "Interview" | "Applied" | "Draft" | "Saved" | "Active";
export type StatusTone = "blue" | "slate" | "amber" | "gray";
export type ProfileIconName = "design" | "code" | "growth";

export type ApplyFlowJob = {
  id: string;
  company: string;
  role: string;
  level?: string;
  status: JobStatus;
  statusTone: StatusTone;
  detailStatus: string;
  note: string;
  appliedDate: string;
  source: string;
  initials: string;
  logoClass: string;
  tags: string[];
  nextStep: {
    title: string;
    date: string;
    location: string;
  };
  applicationLog: Array<{
    title: string;
    date: string;
  }>;
};

export type ApplyFlowProfile = {
  id: string;
  title: string;
  status: "Active" | "Draft";
  statusTone: StatusTone;
  description: string;
  completion: number;
  footerNote: string;
  icon: ProfileIconName;
};

export const sidebarNavItems: Array<{
  key: ApplyFlowNavKey;
  label: string;
  href: string;
}> = [
  { key: "dashboard", label: "Dashboard", href: "#" },
  { key: "jobs", label: "Jobs", href: "/" },
  { key: "profiles", label: "Profiles", href: "/personas" },
  { key: "resume", label: "Resume Builder", href: "/resume-builder" },
];

export const stats = [
  { label: "Total Applications", value: 4 },
  { label: "Interviews", value: 1 },
  { label: "Offers", value: 0 },
  { label: "Rejections", value: 0 },
];

const defaultApplicationLog = [
  { title: "Interview Scheduled", date: "Oct 24, 2026 \u2022 09:15 AM" },
  { title: "Technical Screener Passed", date: "Oct 20, 2026 \u2022 02:40 PM" },
  { title: "Applied", date: "Oct 15, 2026 \u2022 11:00 AM" },
];

export const jobs: ApplyFlowJob[] = [
  {
    id: "northstar-labs",
    company: "Northstar Labs",
    role: "Product Designer",
    level: "Senior Level",
    status: "Interview",
    statusTone: "blue",
    detailStatus: "Interviewing",
    note: "Portfolio review scheduled.",
    appliedDate: "Oct 15, 2026",
    source: "Company careers page",
    initials: "N",
    logoClass: "bg-[#0b1c30] text-white",
    tags: ["Full-time", "Remote"],
    nextStep: {
      title: "Portfolio Review",
      date: "Tomorrow at 10:00 AM",
      location: "Zoom Meeting",
    },
    applicationLog: defaultApplicationLog,
  },
  {
    id: "brightworks",
    company: "Brightworks",
    role: "Frontend Engineer",
    status: "Applied",
    statusTone: "slate",
    detailStatus: "Applied",
    note: "Waiting for recruiter response.",
    appliedDate: "Oct 18, 2026",
    source: "Recruiter referral",
    initials: "B",
    logoClass: "bg-[#607087] text-white",
    tags: ["Full-time", "Remote"],
    nextStep: {
      title: "Recruiter Follow-up",
      date: "Friday at 2:00 PM",
      location: "Email",
    },
    applicationLog: [
      { title: "Application Submitted", date: "Oct 18, 2026 \u2022 10:30 AM" },
    ],
  },
  {
    id: "linear-studio",
    company: "Linear Studio",
    role: "Product Engineer",
    status: "Draft",
    statusTone: "amber",
    detailStatus: "Draft",
    note: "Resume needs tailoring.",
    appliedDate: "Not submitted",
    source: "Saved job",
    initials: "L",
    logoClass: "bg-[#eee9e7] text-[#7c3307]",
    tags: ["Full-time", "Hybrid"],
    nextStep: {
      title: "Tailor Resume",
      date: "Due this week",
      location: "ApplyFlow",
    },
    applicationLog: [
      { title: "Job Saved", date: "Oct 22, 2026 \u2022 04:10 PM" },
    ],
  },
  {
    id: "vercel",
    company: "Vercel",
    role: "Frontend Developer",
    status: "Saved",
    statusTone: "gray",
    detailStatus: "Saved",
    note: "Review job requirements.",
    appliedDate: "Not submitted",
    source: "Company careers page",
    initials: "V",
    logoClass: "bg-black text-white",
    tags: ["Full-time", "Remote"],
    nextStep: {
      title: "Review Requirements",
      date: "No date set",
      location: "ApplyFlow",
    },
    applicationLog: [
      { title: "Job Saved", date: "Oct 23, 2026 \u2022 08:45 AM" },
    ],
  },
];

export const profiles: ApplyFlowProfile[] = [
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    status: "Active",
    statusTone: "gray",
    description: "Focused on Fintech & SaaS ecosystems.",
    completion: 92,
    footerNote: "CV verified",
    icon: "design",
  },
  {
    id: "frontend-lead",
    title: "Frontend Lead",
    status: "Draft",
    statusTone: "gray",
    description: "React, TypeScript, Architecture.",
    completion: 45,
    footerNote: "Upload pending",
    icon: "code",
  },
  {
    id: "growth-lead",
    title: "Growth Lead",
    status: "Active",
    statusTone: "gray",
    description: "Data-driven user acquisition.",
    completion: 100,
    footerNote: "Optimized",
    icon: "growth",
  },
];
