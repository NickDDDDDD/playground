import { cn } from "@playground/ui";
import { FlaskConical } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { experiments } from "../experiments";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  closeWindow,
  minimizeWindow,
  restoreWindow,
  toggleWindowMaximized
} from "../store/slices/app-layout-slice";

export function ShellLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { windowMaximized, windowMinimized } = useAppSelector((state) => state.appLayout);
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
              "liquid-glass liquid-window mx-auto flex min-w-0 flex-col self-start transition-[height,width,opacity,transform] duration-300",
              windowMaximized
                ? "h-[calc(100dvh-8.5rem)] w-full"
                : "h-[calc(100dvh-10.5rem)] min-h-[32rem] w-full max-w-6xl",
              windowMinimized && "pointer-events-none translate-y-8 opacity-0"
            )}
            aria-hidden={windowMinimized}
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
                onClick={() => dispatch(minimizeWindow())}
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
              {!windowMinimized && <Outlet />}
            </div>
          </div>
        )}

        {!isOverview && windowMinimized && (
          <div className="pointer-events-none absolute inset-x-0 top-[34%] mx-auto flex max-w-sm flex-col items-center rounded-[26px] bg-white/30 px-5 py-4 text-center shadow-[inset_0_1px_0_rgb(255_255_255_/_0.52),0_20px_60px_rgb(15_23_42_/_0.16)] backdrop-blur-2xl">
            <p className="text-base font-medium text-foreground">
              {activeExperiment?.title ?? "Experiment"} is minimized
            </p>
            <p className="mt-1 text-base leading-7 text-muted-foreground sm:text-sm sm:leading-6">
              Click its Dock icon to restore the window.
            </p>
          </div>
        )}
      </main>

      <ExperimentDock
        activeExperimentId={activeExperiment?.id}
        onDockNavigate={() => dispatch(restoreWindow())}
      />
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
  activeExperimentId: string | undefined;
  onDockNavigate: () => void;
};

function ExperimentDock({ activeExperimentId, onDockNavigate }: ExperimentDockProps) {
  return (
    <nav
      aria-label="Experiment dock"
      className="mac-dock fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-fit items-end gap-2 px-2.5 py-2 sm:bottom-4 sm:gap-3 sm:px-3"
    >
      {experiments.map((experiment) => (
        <DockLink
          active={activeExperimentId === experiment.id}
          key={experiment.id}
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
  label: string;
  to: string;
  onNavigate: () => void;
};

function DockLink({ active, label, to, onNavigate }: DockLinkProps) {
  return (
    <NavLink
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "group/dock relative flex flex-col items-center rounded-[20px] p-1 transition-transform duration-150 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "dock-active"
        )
      }
      title={label}
      to={to}
      onClick={onNavigate}
    >
      <span className="mac-dock-icon flex size-14 items-center justify-center rounded-[18px] bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255_/_0.3),0_10px_24px_rgb(15_23_42_/_0.24)] transition-transform duration-150 group-hover/dock:scale-110 sm:size-16 sm:rounded-[20px] [&_svg]:size-7">
        <FlaskConical />
      </span>
      <span className="mt-1 size-1.5 rounded-full bg-foreground/70 opacity-0 transition-opacity data-[active=true]:opacity-100" data-active={active} />
    </NavLink>
  );
}
