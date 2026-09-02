const config = {
  Completed: { color: "var(--color-good)", bg: "var(--color-good-bg)", label: "Completed" },
  Pending: { color: "var(--color-pending)", bg: "var(--color-pending-bg)", label: "Pending" },
  "In Progress": { color: "var(--color-progress)", bg: "var(--color-progress-bg)", label: "In Progress" },
  Cancelled: { color: "var(--color-bad)", bg: "var(--color-bad-bg)", label: "Cancelled" },
  "On Duty": { color: "var(--color-good)", bg: "var(--color-good-bg)", label: "On Duty" },
  Busy: { color: "var(--color-pending)", bg: "var(--color-pending-bg)", label: "Busy" },
  "Off Duty": { color: "var(--color-ink-soft)", bg: "#E9E6DD", label: "Off Duty" },
};

export default function StatusBadge({ status }) {
  const c = config[status] || config.Pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold border"
      style={{ color: c.color, backgroundColor: c.bg, borderColor: c.color + "40" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
      {status}
    </span>
  );
}
