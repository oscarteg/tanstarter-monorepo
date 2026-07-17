import { cn } from "@repo/ui/lib/utils";

export type RailNavItem = {
  label: string;
  href?: string;
  /** Mono index or glyph on the right, e.g. "01" or "↗". */
  index?: string;
  active?: boolean;
};

/**
 * The Rams vertical identity-rail menu: a 2px ink top rule, then label rows with
 * a mono index/glyph, divided by hairlines. The active row is Braun orange.
 *
 * This is a standalone Rams navigation element (portfolio / document / marketing
 * rail) — not a replacement for the app's sidebar-07 shell.
 */
export function RailNav({ items, className }: { items: RailNavItem[]; className?: string }) {
  return (
    <nav className={cn("flex flex-col border-t-2 border-foreground", className)}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href ?? "#"}
          className={cn(
            "flex items-center justify-between border-b border-border py-3 no-underline",
            item.active ? "font-semibold text-primary" : "font-normal text-foreground",
          )}
        >
          {item.label}
          <span
            className={cn(
              "font-mono text-[11px]",
              item.active ? "text-primary" : "text-[var(--faint)]",
            )}
          >
            {item.index}
          </span>
        </a>
      ))}
    </nav>
  );
}
