import StatusBadge from "@/components/applyflow/StatusBadge";
import SurfacePanel from "@/components/applyflow/SurfacePanel";
import type {
  ApplyFlowProfile,
  ProfileIconName,
} from "@/data/applyflow";

function ProfileIcon({ name }: { name: ProfileIconName }) {
  if (name === "code") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5h16v14H4z" />
        <path d="m7 10 2 2-2 2M12 15h5" />
      </svg>
    );
  }

  if (name === "growth") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m4 17 5-5 3 3 7-8" />
        <circle cx="4" cy="17" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="12" cy="15" r="1" />
        <circle cx="19" cy="7" r="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m5 4 15 15-3 2L2 6z" />
      <path d="m14 5 5 5M12 7l5-5 3 3-5 5M7 12l-5 5 3 3 5-5" />
    </svg>
  );
}

type ProfileCardProps = {
  profile: ApplyFlowProfile;
  onView: () => void;
  onEdit: () => void;
};

export default function ProfileCard({
  profile,
  onView,
  onEdit,
}: ProfileCardProps) {
  return (
    <SurfacePanel className="flex min-h-[270px] flex-col rounded-lg border border-[#e1e3e6] bg-white/70 px-6 py-5 shadow-[0_14px_30px_rgba(0,0,0,0.035)]">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#d7d9dc] bg-[#e9ecef] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_16px_rgba(0,0,0,0.04)]">
          <span className="h-5 w-5">
            <ProfileIcon name={profile.icon} />
          </span>
        </span>
        <StatusBadge
          status={profile.status}
          tone={profile.statusTone}
          variant="tag"
          className="rounded-[2px] border-[#d8dadd] bg-[#e7e9ec] px-2.5 py-1 text-[#4a4d50] tracking-[0.12em]"
        />
      </div>

      <h2 className="mt-4 text-[20px] font-medium tracking-[-0.025em] text-[#191c1e]">
        {profile.title}
      </h2>
      <p className="mt-2 min-h-[42px] text-[15px] leading-[1.42] text-[#4b4b4d]">
        {profile.description}
      </p>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4b4b4d]">
            Completion
          </span>
          <span className="text-[13px] font-semibold text-[#191c1e]">
            {profile.completion}%
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-[2px] bg-[#e4e6e9]">
          <div
            className={`h-full ${
              profile.status === "Draft" ? "bg-[#a9aaad]" : "bg-black"
            }`}
            style={{ width: `${profile.completion}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-[10px] text-[#76777b]">{profile.footerNote}</p>

      <div className="mt-auto flex gap-4 border-t border-[#e4e6e9] pt-3">
        <button
          type="button"
          onClick={onView}
          className="h-[36px] flex-1 border border-[#cfd2d6] bg-white/35 text-[11px] font-semibold text-[#222426] transition hover:bg-white/65"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="h-[36px] flex-1 rounded-[2px] bg-black text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition hover:bg-[#111111]"
        >
          Edit Profile
        </button>
      </div>
    </SurfacePanel>
  );
}
