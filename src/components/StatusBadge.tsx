import type { RecordStatus } from "../types/record";

interface StatusBadgeProps {
  status: RecordStatus;
}

const BADGE_CLASSES: Record<RecordStatus, string> = {
  valid: "bg-emerald-950 text-emerald-400 border-emerald-800",
  warning: "bg-amber-950 text-amber-400 border-amber-800",
  error: "bg-rose-950 text-rose-400 border-rose-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${BADGE_CLASSES[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}