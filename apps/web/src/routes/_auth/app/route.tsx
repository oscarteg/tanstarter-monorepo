import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { Fragment } from "react";

import { AppSidebar } from "#/components/app-sidebar";
import { CommandMenu } from "#/components/command-menu";
import { ThemeToggle } from "#/components/theme-toggle";
import { useUiStore } from "#/stores/ui-store";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
});

/** Title-case a URL segment, e.g. "data-fetching" -> "Data Fetching". */
function humanize(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  return (
    <TooltipProvider delay={0}>
      <SidebarProvider>
        <AppSidebar />
        <CommandMenu />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    return (
                      <Fragment key={href}>
                        <BreadcrumbItem className="hidden md:block">
                          {isLast ? (
                            <BreadcrumbPage>{humanize(segment)}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={href}>{humanize(segment)}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                      </Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4">
              <div className="relative hidden sm:block">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="h-8 w-48 pl-8"
                  aria-label="Search"
                  readOnly
                  onClick={() => setCommandOpen(true)}
                />
              </div>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
