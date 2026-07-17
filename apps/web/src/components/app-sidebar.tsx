import { authClient } from "@repo/auth/auth-client";
import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@repo/ui/components/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  FolderIcon,
  ForwardIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { navigation } from "#/config/navigation";
import { enabledModules } from "#/modules/registry";

/**
 * The application shell sidebar (shadcn `sidebar-07`), driven entirely by
 * `config/navigation.ts`. Compose-and-configure: change the config, not this
 * file, to re-theme the shell for a new project.
 */
export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavModules />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(navigation.teams[0]);

  if (!activeTeam) return null;
  const ActiveLogo = activeTeam.logo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ActiveLogo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-xs">{activeTeam.plan}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {navigation.teams.map((team, index) => {
              const Logo = team.logo;
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                  <span className="ml-auto text-xs text-muted-foreground">⌘{index + 1}</span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <span className="text-muted-foreground">Add team</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavMain() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navigation.navMain.map((item) => {
          const Icon = item.icon;
          const isActive = item.items?.some((sub) => sub.url === pathname) ?? false;
          return (
            <Collapsible key={item.title} defaultOpen={isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={<SidebarMenuButton tooltip={item.title} isActive={isActive} />}
                >
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[panel-open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton href={sub.url} isActive={sub.url === pathname}>
                          <span>{sub.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavModules() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = enabledModules.flatMap((module) => module.nav ?? []);

  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                render={<a href={item.url} aria-label={item.title} />}
                isActive={item.url === pathname}
              >
                <Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavProjects() {
  const { isMobile } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {navigation.projects.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                render={<a href={item.url} aria-label={item.name} />}
                isActive={item.url === pathname}
              >
                <Icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <FolderIcon className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ForwardIcon className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2Icon className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useAuthSuspense();
  const queryClient = useQueryClient();

  if (!user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onResponse: () => {
          queryClient.setQueryData(authQueryOptions().queryKey, null);
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
