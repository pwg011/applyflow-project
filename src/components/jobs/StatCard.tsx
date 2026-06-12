import SurfacePanel from "@/components/applyflow/SurfacePanel";

export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <SurfacePanel className="h-[93px] rounded-lg border-white/80 bg-white/55 px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4b4b4d]">
        {label}
      </p>
      <p className="mt-2 text-[20px] font-semibold leading-none text-black">
        {value}
      </p>
    </SurfacePanel>
  );
}
