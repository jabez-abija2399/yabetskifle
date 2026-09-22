// ─────────────────────────────────────────────────────────
// src/app/apply/components/SectionLabel.tsx
// ─────────────────────────────────────────────────────────

interface Props {
  step: string;
  label: string;
  description?: string;
}

export function SectionLabel({ step, label, description }: Props) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 pt-0.5 shrink-0">
        {step}
      </span>
      <div>
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {label}
        </h2>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
