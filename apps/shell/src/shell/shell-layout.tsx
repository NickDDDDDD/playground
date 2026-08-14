import { cn } from "@playground/ui";
import { FlaskConical } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { experiments } from "../experiments";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  closeWindow,
  minimizeWindow,
  openWindow,
  toggleWindowMaximized
} from "../store/slices/app-layout-slice";

export function ShellLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { runningExperimentId, windowMaximized } = useAppSelector((state) => state.appLayout);
  const activeExperiment = experiments.find((experiment) =>
    location.pathname.startsWith(experiment.path)
  );
  const isOverview = location.pathname === "/";

  return (
    <div className="desktop-wallpaper flex min-h-[100dvh] flex-col overflow-hidden px-3 py-3 text-foreground sm:px-5 sm:py-5">
      <main className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-y-auto pb-24">
        {isOverview ? (
          <Outlet />
        ) : (
          <div
            className={cn(
              "liquid-glass liquid-window mx-auto flex min-w-0 flex-col self-start transition-[height,width,opacity,transform,border-radius] duration-300",
              windowMaximized
                ? "liquid-window-fullscreen"
                : "h-[calc(100dvh-10.5rem)] min-h-[32rem] w-full max-w-6xl"
            )}
          >
            <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/40 px-4">
              <WindowControl
                ariaLabel="Close window"
                className="bg-[#ff5f57] hover:bg-[#ff5f57]"
                glyph="x"
                onClick={() => {
                  dispatch(closeWindow());
                  navigate("/");
                }}
              />
              <WindowControl
                ariaLabel="Minimize window"
                className="bg-[#febc2e] hover:bg-[#febc2e]"
                glyph="-"
                onClick={() => {
                  if (activeExperiment) {
                    dispatch(minimizeWindow(activeExperiment.id));
                  }
                  navigate("/");
                }}
              />
              <WindowControl
                ariaLabel={windowMaximized ? "Restore window" : "Maximize window"}
                ariaPressed={windowMaximized}
                className="bg-[#28c840] hover:bg-[#28c840]"
                glyph="+"
                onClick={() => dispatch(toggleWindowMaximized())}
              />
              <span className="ml-2 truncate text-sm font-medium text-muted-foreground">
                {activeExperiment?.title ?? "Experiment window"}
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        )}
      </main>

      {!windowMaximized && (
        <ExperimentDock
          runningExperimentId={activeExperiment?.id ?? runningExperimentId}
          onDockNavigate={(experimentId) => dispatch(openWindow(experimentId))}
        />
      )}
    </div>
  );
}

type WindowControlProps = {
  ariaLabel: string;
  ariaPressed?: boolean;
  className: string;
  glyph: string;
  onClick: () => void;
};

function WindowControl({
  ariaLabel,
  ariaPressed,
  className,
  glyph,
  onClick
}: WindowControlProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={cn(
        "group/control flex size-3.5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold leading-none text-black/0 shadow-[inset_0_0_0_1px_rgb(0_0_0_/_0.12)] transition-colors hover:text-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      type="button"
      onClick={onClick}
    >
      <span className="translate-y-[-0.5px]">{glyph}</span>
    </button>
  );
}

type ExperimentDockProps = {
  runningExperimentId: string | null | undefined;
  onDockNavigate: (experimentId: string) => void;
};

function ExperimentDock({ runningExperimentId, onDockNavigate }: ExperimentDockProps) {
  return (
    <nav
      aria-label="Experiment dock"
      className="mac-dock fixed inset-x-3 bottom-2 z-30 mx-auto flex max-w-fit items-center gap-1.5 sm:bottom-3"
    >
      {experiments.map((experiment) => (
        <DockLink
          active={runningExperimentId === experiment.id}
          key={experiment.id}
          id={experiment.id}
          label={experiment.title}
          to={experiment.path}
          onNavigate={onDockNavigate}
        />
      ))}
    </nav>
  );
}

type DockLinkProps = {
  active: boolean;
  id: string;
  label: string;
  to: string;
  onNavigate: (experimentId: string) => void;
};

function DockLink({ active, id, label, to, onNavigate }: DockLinkProps) {
  return (
    <NavLink
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "group/dock relative flex items-center justify-center rounded-[18px] p-0.5 transition-transform duration-150 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "dock-active"
        )
      }
      title={label}
      to={to}
      onClick={() => onNavigate(id)}
    >
      <span className="mac-dock-icon flex size-[3.25rem] items-center justify-center text-primary-foreground transition-transform duration-150 group-hover/dock:scale-[1.12] sm:size-14 [&_svg]:size-6">
        <FlaskConical />
      </span>
      <span className="mac-dock-running-dot opacity-0 transition-opacity data-[active=true]:opacity-100" data-active={active} />
    </NavLink>
  );
}
