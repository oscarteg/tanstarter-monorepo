import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { Pipeline } from "@repo/ui/components/rams-content";
import { Kicker, ListRow, SectionHeader, StatusBadge } from "@repo/ui/components/rams-core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { user } = useAuthSuspense();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Kicker>Dashboard</Kicker>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Hi there{user?.name ? `, ${user.name}` : ""}.
        </h1>
        <StatusBadge label="All systems operational" />
      </div>

      <section>
        <SectionHeader
          number="01"
          label="Getting started"
          action={{ label: "Docs ↗", href: "#" }}
        />
        <Pipeline steps={["Clone", "Configure", "Add a module", "Ship"]} activeIndex={2} />
      </section>

      <section>
        <SectionHeader number="02" label="Recent activity" />
        <div className="flex flex-col">
          <ListRow
            left="Today"
            title="Rams design system applied"
            subtitle="@repo/ui retheme — paper, ink, one orange"
            meta="CRT-264"
          />
          <ListRow
            left="Today"
            title="Module system added"
            subtitle="Route + nav injection, one toggle"
            meta="CRT-265"
          />
          <ListRow
            left="Today"
            title="Rams components ported"
            subtitle="SectionHeader, ListRow, Pipeline…"
            meta="CRT-267"
            lastBorder
          />
        </div>
      </section>
    </div>
  );
}
