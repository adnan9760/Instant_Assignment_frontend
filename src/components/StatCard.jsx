export default function StatCard({
  label,
  value,
  sub,
  accent = "ink",
  icon: Icon,
}) {
  const accentMap = {
    ink: "text-ink",
    amber: "text-amber-dark",
    steel: "text-steel",
    good: "text-good",
    pending: "text-pending",
    bad: "text-bad",
  };

  return (
    <div className="bg-panel border border-border p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {label}
        </span>

        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 ${accentMap[accent]}`}
            strokeWidth={2}
          />
        )}
      </div>

      <div
        className={`font-display font-extrabold text-3xl leading-none ${accentMap[accent]}`}
      >
        {value}
      </div>

      {sub && (
        <div className="text-xs text-ink-soft font-medium">
          {sub}
        </div>
      )}
    </div>
  );
}