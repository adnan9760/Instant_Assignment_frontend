export default function PageHeader({ eyebrow, title, description, right }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <div className="font-mono text-[11px] text-steel font-semibold mb-1">{eyebrow}</div>
        )}
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-ink tracking-tight">{title}</h1>
        {description && <p className="text-sm text-ink-soft mt-1 max-w-xl">{description}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
