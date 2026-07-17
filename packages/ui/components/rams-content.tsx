import { cn } from "@repo/ui/lib/utils";

/** Stepped process pipeline. The active step is ink-filled; the rest are hairline chips. */
export function Pipeline({
  steps,
  activeIndex = 0,
  className,
}: {
  steps: string[];
  /** Which step is ink-filled (the current one). Default 0. */
  activeIndex?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center font-mono text-[13px]", className)}>
      {steps.map((step, i) => (
        <span key={step} className="flex items-center">
          <span
            className={cn(
              "px-3.5 py-2",
              i === activeIndex ? "bg-foreground text-background" : "border border-border bg-card",
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 && <span className="px-2.5 text-muted-foreground">→</span>}
        </span>
      ))}
    </div>
  );
}

/** A titled skill/spec column: a ruled heading with a square orange marker + a list. */
export function SkillColumn({
  title,
  items,
  className,
}: {
  title: string;
  /** Plain items, one per line. */
  items: readonly React.ReactNode[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-2.5 border-b-2 border-foreground pb-2.5">
        <span className="size-[7px] bg-primary" />
        <span className="text-lg font-semibold text-foreground">{title}</span>
      </div>
      <div className="mt-3.5 flex flex-col gap-2">
        {items.map((item, i) => (
          // Items are free-form nodes with no stable id; index is the only key available.
          <span key={i} className="text-sm text-foreground">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
