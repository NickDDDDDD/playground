import { Button, cn } from "@playground/ui";
import { FlaskConical, Home, PanelBottomClose, PanelBottomOpen } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { experiments } from "../experiments";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleDock } from "../store/slices/app-layout-slice";

export function ShellLayout() {
  const dispatch = useAppDispatch();
  const dockCollapsed = useAppSelector((state) => state.appLayout.dockCollapsed);

  return (
    <div className="desktop-wallpaper flex min-h-[100dvh] flex-col px-3 py-3 text-foreground sm:px-4 sm:py-4">
      <header className="liquid-glass z-20 mx-auto flex h-12 w-full max-w-7xl items-center justify-between gap-3 rounded-full px-2.5 pl-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            className="flex min-w-0 items-center gap-2 rounded-full px-2 py-1.5 text-base font-semibold transition-colors hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to="/"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <FlaskConical className="size-4" />
            </span>
            <span className="truncate">Playground</span>
          </Link>
        </div>
        <div className="hidden min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground sm:flex">
          <span>React</span>
          <span className="size-1 rounded-full bg-muted-foreground/45" aria-hidden="true" />
          <span>TypeScript</span>
          <span className="size-1 rounded-full bg-muted-foreground/45" aria-hidden="true" />
          <span>SDD Lab</span>
        </div>
        <Button
          aria-label={dockCollapsed ? "Show experiment dock" : "Hide experiment dock"}
          aria-expanded={!dockCollapsed}
          size="icon"
          variant="ghost"
          onClick={() => dispatch(toggleDock())}
        >
          {dockCollapsed ? <PanelBottomOpen /> : <PanelBottomClose />}
        </Button>
      </header>

      <main
        className={cn(
          "mx-auto flex min-h-0 w-full max-w-7xl flex-1 pt-4 transition-[padding] duration-300",
          dockCollapsed ? "pb-5" : "pb-28"
        )}
      >
        <div className="liquid-glass liquid-window flex h-[calc(100dvh-12rem)] min-h-[32rem] w-full min-w-0 flex-col">
          <div className="flex h-11 items-center gap-2 border-b border-white/40 px-4">
            <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
            <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
            <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
            <span className="ml-2 truncate text-sm font-medium text-muted-foreground">
              {dockCollapsed ? "Focused workspace" : "Experiment window"}
            </span>
          </div>
          <div className="min-w-0 flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <ExperimentDock collapsed={dockCollapsed} />
    </div>
  );
}

type ExperimentDockProps = {
  collapsed: boolean;
};

function ExperimentDock({ collapsed }: ExperimentDockProps) {
  return (
    <nav
      aria-label="Experiment dock"
      className={cn(
        "liquid-glass liquid-dock fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-fit items-end gap-2 p-1.5 transition-[opacity,transform,width] duration-300 sm:bottom-4 sm:p-2",
        collapsed && "pointer-events-none translate-y-8 opacity-0"
      )}
    >
      <DockLink icon={<Home />} label="Overview" to="/" />
      <span className="mb-1 h-10 w-px bg-white/45 sm:mb-2" aria-hidden="true" />
      {experiments.map((experiment) => (
        <DockLink
          key={experiment.id}
          icon={<FlaskConical />}
          label={experiment.title}
          to={experiment.path}
        />
      ))}
    </nav>
  );
}

type DockLinkProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

function DockLink({ icon, label, to }: DockLinkProps) {
  return (
    <NavLink
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "group flex w-13 flex-col items-center gap-1 rounded-[20px] p-1.5 text-sm font-medium text-foreground transition-[background-color,box-shadow,transform] hover:-translate-y-1 hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-28 sm:p-2",
          isActive && "bg-white/62 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.7),0_10px_30px_rgb(15_23_42_/_0.14)]"
        )
      }
      to={to}
    >
      <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105 sm:size-11 sm:rounded-[16px] [&_svg]:size-5">
        {icon}
      </span>
      <span className="hidden w-full truncate text-center text-sm leading-4 sm:block">{label}</span>
    </NavLink>
  );
}
