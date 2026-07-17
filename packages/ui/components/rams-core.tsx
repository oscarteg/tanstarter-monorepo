import { cn } from "@repo/ui/lib/utils";

/**
 * Uppercase monospace label — the recurring Rams kicker/eyebrow voice.
 * Renders in muted ink by default, Braun orange when `accent`.
 */
export function Kicker({
  children,
  accent = false,
  className,
  ...props
}: React.ComponentProps<"span"> & { accent?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] font-bold tracking-[0.14em] uppercase",
        accent ? "text-primary" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export type SectionHeaderAction = {
  label: string;
  href?: string;
};

/**
 * The signature Rams section divider: a mono index number, an uppercase mono
 * label, a hairline rule filling the remaining width, and an optional trailing
 * action link.
 */
export function SectionHeader({
  number,
  label,
  action,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Mono index, e.g. "01". Omit to hide. */
  number?: string;
  label: string;
  action?: SectionHeaderAction;
}) {
  return (
    <div className={cn("mb-5 flex items-center gap-3.5", className)} {...props}>
      {number != null && <span className="font-mono text-xs text-primary">{number}</span>}
      <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
      {action && (
        <a
          href={action.href ?? "#"}
          className="font-mono text-[11px] text-primary hover:text-[var(--accent-press)]"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}

/** Haloed orange dot + uppercase mono label — signals availability / live status. */
export function StatusBadge({
  label = "Available",
  showDot = true,
  className,
  ...props
}: React.ComponentProps<"span"> & { label?: string; showDot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    >
      {showDot && (
        <span className="size-2 rounded-full bg-primary shadow-[0_0_0_4px_var(--accent-tint)]" />
      )}
      {label}
    </span>
  );
}

/**
 * A top-ruled record row: an optional left column (year/index, mono orange), a
 * title block, and right-aligned mono meta. Renders as a link when `href` is set.
 */
export function ListRow({
  left,
  title,
  subtitle,
  meta,
  href,
  lastBorder = false,
  className,
}: {
  left?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  href?: string;
  /** Add a bottom hairline (use on the last row of a group). */
  lastBorder?: boolean;
  className?: string;
}) {
  const classes = cn(
    "grid items-baseline gap-6 border-t border-border py-4 text-foreground no-underline",
    left ? "grid-cols-[150px_1fr_auto]" : "grid-cols-[1fr_auto]",
    lastBorder && "border-b",
    className,
  );
  const content = (
    <>
      {left && <span className="font-mono text-xs text-primary">{left}</span>}
      <span>
        <span className="text-lg font-semibold text-foreground">{title}</span>
        {subtitle && <span className="mt-0.5 block text-sm text-muted-foreground">{subtitle}</span>}
      </span>
      {meta && (
        <span className="font-mono text-[11px] whitespace-nowrap text-[var(--faint)]">{meta}</span>
      )}
    </>
  );
  return href ? (
    <a href={href} className={classes}>
      {content}
    </a>
  ) : (
    <div className={classes}>{content}</div>
  );
}
