type ShowcaseItemProps = {
  name: string;
  openedBy: string;
  status: "Current" | "Unreachable" | "Legacy";
  needsRedesign?: boolean;
  children: React.ReactNode;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none";
const labelClass = "mb-2 block text-sm font-medium text-slate-700";
const secondaryButton =
  "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700";
const primaryButton =
  "rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white";

function ShowcaseItem({
  name,
  openedBy,
  status,
  needsRedesign = true,
  children,
}: ShowcaseItemProps) {
  return (
    <section className="scroll-mt-6" id={name.toLowerCase().replaceAll(" ", "-")}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-[#111827]">{name}</h2>
            <span className="rounded-full bg-[#e9edf3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4a5565]">
              {status}
            </span>
            {needsRedesign ? (
              <span className="rounded-full bg-[#fff1d6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a5300]">
                Needs redesign
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[#63686f]">Normally opened by: {openedBy}</p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-[#dfe3e8] bg-[#e9edf2] px-5 py-10 shadow-sm sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-slate-950/15" />
        <div className="relative mx-auto">{children}</div>
      </div>
    </section>
  );
}

function ModalShell({
  eyebrow,
  title,
  subtitle,
  maxWidth = "max-w-2xl",
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className={`mx-auto flex max-h-[760px] w-full ${maxWidth} flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          {eyebrow ? <p className="text-sm text-slate-500">{eyebrow}</p> : null}
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600"
          aria-label={`Close ${title}`}
        >
          X
        </button>
      </div>
      <div className="overflow-y-auto px-6 py-5">{children}</div>
      {footer ? (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-between">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function ProfileFields() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Display Name</span>
          <input className={inputClass} defaultValue="Priya Ahmed" />
        </label>
        <label>
          <span className={labelClass}>Email</span>
          <input className={inputClass} defaultValue="priya@example.com" />
        </label>
        <label>
          <span className={labelClass}>Phone</span>
          <input className={inputClass} defaultValue="+44 7700 900123" />
        </label>
        <label>
          <span className={labelClass}>Professional Title</span>
          <input className={inputClass} defaultValue="Senior Product Designer" />
        </label>
      </div>
      <label>
        <span className={labelClass}>Target Role</span>
        <input className={inputClass} defaultValue="Lead Product Designer" />
      </label>
      <label>
        <span className={labelClass}>Skills</span>
        <textarea
          className={`${inputClass} min-h-24 resize-none`}
          defaultValue="Product strategy, UX research, interaction design, Figma, design systems"
        />
      </label>
      <label>
        <span className={labelClass}>Experience Summary</span>
        <textarea
          className={`${inputClass} min-h-28 resize-none`}
          defaultValue="Eight years designing B2B SaaS and fintech products, including three years leading cross-functional product teams."
        />
      </label>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <div className="mt-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
        {children}
      </div>
    </div>
  );
}

export default function ModalShowcasePage() {
  const inventory = [
    ["Import Job dialog", "Rendered", "Current"],
    ["Application details", "Rendered safely", "Legacy / unreachable"],
    ["Edit application drawer", "Rendered", "Legacy / unreachable"],
    ["Delete confirmation", "Rendered", "Legacy / unreachable"],
    ["Import preview", "Rendered", "Legacy / unreachable"],
    ["Create Profile", "Rendered as full form", "Current placeholder / legacy form"],
    ["View Profile", "Rendered as persona details", "Current placeholder / legacy modal"],
    ["Edit Profile", "Rendered as full form", "Current placeholder / legacy form"],
    ["New Template", "Rendered as configured form", "Current placeholder"],
    ["Persona build/review", "Rendered safely", "Legacy / unreachable"],
    ["Empty states", "Rendered", "Legacy / unreachable"],
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#111827]">
      <header className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
            Temporary design review route
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            ApplyFlow Modal Showcase
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5e6570]">
            Current and legacy modal states rendered with local sample data. All
            controls are intentionally inert. This page makes no authentication,
            Supabase, OpenRouter, or persistence requests.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-14 px-5 py-10 sm:px-8">
        <section className="rounded-xl border border-[#dfe3e8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Modal inventory report</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#e3e6ea] text-xs uppercase tracking-[0.12em] text-[#737984]">
                <tr>
                  <th className="pb-3 font-semibold">Modal or state</th>
                  <th className="pb-3 font-semibold">Showcase</th>
                  <th className="pb-3 font-semibold">Real app status</th>
                  <th className="pb-3 font-semibold">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef1]">
                {inventory.map(([name, rendered, status]) => (
                  <tr key={name}>
                    <td className="py-3 font-medium">{name}</td>
                    <td className="py-3 text-[#4e5764]">{rendered}</td>
                    <td className="py-3 text-[#4e5764]">{status}</td>
                    <td className="py-3 text-[#8a5300]">Needs redesign</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ShowcaseItem name="Import Job dialog" openedBy="Jobs > Import Job" status="Current">
          <div className="mx-auto w-full max-w-2xl rounded-lg border border-white/80 bg-[#f7f9fc] p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Import Job</h3>
                <p className="mt-2 text-sm text-[#5d6064]">
                  Paste a job link or description.
                </p>
              </div>
              <span className="text-2xl">&times;</span>
            </div>
            <input className="mt-8 w-full rounded border border-[#c7c9cc] bg-white px-4 py-3" defaultValue="https://northstarlabs.com/careers/product-designer" />
            <textarea
              className="mt-4 min-h-40 w-full resize-none rounded border border-[#c7c9cc] bg-white px-4 py-3"
              defaultValue="Northstar Labs is hiring a Senior Product Designer to lead end-to-end product design for our remote collaboration platform."
            />
            <button type="button" className="mt-6 w-full rounded bg-black px-5 py-3 font-semibold text-white">
              Import
            </button>
          </div>
        </ShowcaseItem>

        <ShowcaseItem name="Application details" openedBy="Legacy application card / View Job" status="Unreachable">
          <ModalShell
            eyebrow="Application details"
            title="Northstar Labs"
            subtitle="Senior Product Designer"
            footer={
              <>
                <button type="button" className={secondaryButton}>Delete Application</button>
                <button type="button" className={primaryButton}>Edit Application</button>
              </>
            }
          >
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Status</span>
                  <select className={inputClass} defaultValue="Interview">
                    <option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option>
                  </select>
                </label>
                <DetailRow label="Date applied">Oct 15, 2026</DetailRow>
              </div>
              <DetailRow label="Job link">northstarlabs.com/careers/product-designer</DetailRow>
              <DetailRow label="Notes">Portfolio review scheduled for tomorrow morning.</DetailRow>
              <DetailRow label="Persona">Senior Product Designer - Priya Ahmed</DetailRow>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Analysis</p>
                  <button type="button" className={secondaryButton}>Improve Analysis</button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <DetailRow label="Location">Remote, United Kingdom</DetailRow>
                  <DetailRow label="Skills">Figma, research, prototyping, design systems</DetailRow>
                </div>
              </div>
            </div>
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="Edit application drawer" openedBy="Application details > Edit Application" status="Legacy">
          <div className="ml-auto w-full max-w-md border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold">Edit Application</h3><span className="text-lg">X</span>
            </div>
            <div className="space-y-5 px-6 py-5">
              <label><span className={labelClass}>Company name</span><input className={inputClass} defaultValue="Northstar Labs" /></label>
              <label><span className={labelClass}>Job title</span><input className={inputClass} defaultValue="Senior Product Designer" /></label>
              <label><span className={labelClass}>Job link</span><input className={inputClass} defaultValue="https://northstarlabs.com/careers/product-designer" /></label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Status</span><select className={inputClass} defaultValue="Interview"><option>Applied</option><option>Interview</option></select></label>
                <label><span className={labelClass}>Date applied</span><input className={inputClass} type="date" defaultValue="2026-10-15" /></label>
              </div>
              <label><span className={labelClass}>Notes</span><textarea className={`${inputClass} min-h-28 resize-none`} defaultValue="Portfolio review scheduled." /></label>
            </div>
            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
              <button type="button" className={secondaryButton}>Clear</button>
              <button type="button" className={`${primaryButton} flex-1`}>Update application</button>
            </div>
          </div>
        </ShowcaseItem>

        <ShowcaseItem name="Delete confirmation" openedBy="Application details > Delete Application" status="Legacy">
          <ModalShell
            title="Delete application?"
            subtitle="This action cannot be undone."
            maxWidth="max-w-md"
            footer={<><button className={secondaryButton}>Cancel</button><button className={primaryButton}>Delete</button></>}
          >
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <p><strong className="text-slate-900">Company:</strong> Northstar Labs</p>
              <p className="mt-2"><strong className="text-slate-900">Job title:</strong> Senior Product Designer</p>
            </div>
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="Import preview" openedBy="Legacy job import after parsing" status="Legacy">
          <ModalShell
            title="Review imported job"
            subtitle="Check the extracted details before continuing."
            footer={<><button className={secondaryButton}>Cancel</button><button className={primaryButton}>Save job</button></>}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className={labelClass}>Company</span><input className={inputClass} defaultValue="Brightworks" /></label>
              <label><span className={labelClass}>Job title</span><input className={inputClass} defaultValue="Frontend Engineer" /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Job link</span><input className={inputClass} defaultValue="https://brightworks.example/jobs/frontend-engineer" /></label>
              <label><span className={labelClass}>Date applied</span><input className={inputClass} type="date" defaultValue="2026-10-18" /></label>
            </div>
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="Create Profile dialog" openedBy="Profiles > Create Profile" status="Current">
          <ModalShell
            eyebrow="Persona"
            title="Create Persona"
            footer={<><button className={secondaryButton}>Cancel</button><button className={primaryButton}>Create persona</button></>}
          >
            <ProfileFields />
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="View Profile dialog" openedBy="Profile card > View Profile" status="Current">
          <ModalShell
            eyebrow="Persona details"
            title="Priya Ahmed"
            subtitle="Lead Product Designer"
            footer={<><button className={secondaryButton}>Delete Persona</button><button className={primaryButton}>Edit Persona</button></>}
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailRow label="Display Name">Priya Ahmed</DetailRow>
                <DetailRow label="Email">priya@example.com</DetailRow>
                <DetailRow label="Phone">+44 7700 900123</DetailRow>
                <DetailRow label="Professional Title">Senior Product Designer</DetailRow>
                <DetailRow label="Target Role">Lead Product Designer</DetailRow>
                <DetailRow label="CV">Priya-Ahmed-CV.pdf<br /><button className={`${secondaryButton} mt-3 py-2`}>Replace CV</button></DetailRow>
              </div>
              <DetailRow label="Skills">Product strategy, UX research, interaction design, Figma, design systems</DetailRow>
              <DetailRow label="Experience Summary">Eight years designing B2B SaaS and fintech products and leading cross-functional teams.</DetailRow>
            </div>
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="Edit Profile dialog" openedBy="Profile card or details > Edit Profile" status="Current">
          <ModalShell
            eyebrow="Persona"
            title="Edit Persona"
            footer={<><button className={secondaryButton}>Cancel</button><button className={primaryButton}>Save changes</button></>}
          >
            <ProfileFields />
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="New Template dialog" openedBy="Profiles > New Template" status="Current">
          <ModalShell
            eyebrow="Profile template"
            title="Start from an industry baseline"
            subtitle="Create a reusable profile with a focused starting point."
            maxWidth="max-w-lg"
            footer={<><button className={secondaryButton}>Cancel</button><button className={primaryButton}>Use template</button></>}
          >
            <div className="space-y-5">
              <label><span className={labelClass}>Template</span><select className={inputClass} defaultValue="Product Design"><option>Product Design</option><option>Frontend Engineering</option><option>Growth Marketing</option></select></label>
              <label><span className={labelClass}>Profile name</span><input className={inputClass} defaultValue="Fintech Product Designer" /></label>
              <DetailRow label="Includes">Suggested skills, experience prompts, role keywords, and a completion checklist.</DetailRow>
            </div>
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="Persona build review" openedBy="Legacy profile CV upload or Rebuild with AI" status="Legacy">
          <ModalShell
            eyebrow="Persona review"
            title="Rebuild Persona from CV"
            maxWidth="max-w-3xl"
            footer={<><button className={secondaryButton}>Cancel</button><div className="flex gap-3"><button className={secondaryButton}>Build with AI</button><button className={primaryButton}>Save Persona</button></div></>}
          >
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">CV</p>
              <p className="mt-2 text-sm font-medium text-slate-900">Priya-Ahmed-CV.pdf</p>
              <p className="mt-2 text-sm text-slate-600">CV analysis completed. Review the fields before saving.</p>
            </div>
            <ProfileFields />
          </ModalShell>
        </ShowcaseItem>

        <ShowcaseItem name="Empty states" openedBy="Legacy details with missing analysis or CV data" status="Unreachable">
          <ModalShell eyebrow="Design review" title="Empty state collection">
            <div className="grid gap-5 sm:grid-cols-2">
              <DetailRow label="Job analysis">No analysis available yet. AI insights will appear here.</DetailRow>
              <DetailRow label="Job posting">No job posting text saved for this application.</DetailRow>
              <DetailRow label="Linked persona">No persona selected. Choose a profile for future tailored workflows.</DetailRow>
              <DetailRow label="CV">No CV uploaded yet.<br /><button className={`${secondaryButton} mt-3 py-2`}>Upload CV</button></DetailRow>
            </div>
          </ModalShell>
        </ShowcaseItem>

        <footer className="border-t border-[#dfe3e8] py-8 text-sm text-[#656b74]">
          Temporary screenshot-only route. It is isolated from the ApplyFlow Jobs
          and Profiles application flow.
        </footer>
      </div>
    </main>
  );
}
