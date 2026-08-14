import { Button, cn } from "@playground/ui";
import { ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { experiments } from "../experiments";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleSidebar } from "../store/slices/app-layout-slice";

export function ShellLayout() {
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(
    (state) => state.appLayout.sidebarCollapsed
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200",
          sidebarCollapsed ? "w-16" : "w-72"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-border p-2",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            className={cn(
              "flex h-10 min-w-0 items-center gap-3 rounded-md px-3 transition-colors hover:bg-accent hover:text-accent-foreground",
              sidebarCollapsed && "hidden"
            )}
            to="/"
          >
            <FlaskConical className="size-4 shrink-0 text-primary" />
            {!sidebarCollapsed && (
              <span className="text-sm font-semibold tracking-normal">Playground</span>
            )}
          </Link>
          <Button
            aria-label="Toggle sidebar"
            size="icon"
            variant="ghost"
            onClick={() => dispatch(toggleSidebar())}
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {experiments.map((experiment) => (
            <SidebarLink
              key={experiment.id}
              collapsed={sidebarCollapsed}
              icon={<FlaskConical className="size-4" />}
              label={experiment.title}
              to={experiment.path}
            />
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

type SidebarLinkProps = {
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
  to: string;
};

function SidebarLink({ collapsed, icon, label, to }: SidebarLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-secondary text-foreground",
          collapsed && "justify-center px-0"
        )
      }
      title={collapsed ? label : undefined}
      to={to}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
