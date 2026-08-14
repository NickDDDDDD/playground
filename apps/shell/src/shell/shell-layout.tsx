import { cn } from "@playground/ui";
import { Clipboard, FlaskConical, Moon, Play, TerminalSquare } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { experiments } from "../experiments";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  closeWindow,
  minimizeWindow,
  openWindow,
  sleepPlayground,
  toggleWindowMaximized,
  wakePlayground
} from "../store/slices/app-layout-slice";

export function ShellLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { runningExperimentId, sleeping, windowMaximized } = useAppSelector(
    (state) => state.appLayout
  );
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition | null>(null);
  const [sleepState, setSleepState] = useState<"entered" | "exiting">("entered");
  const activeExperiment = experiments.find((experiment) =>
    location.pathname.startsWith(experiment.path)
  );
  const isOverview = location.pathname === "/";
  const firstExperiment = experiments[0];
  const closeContextMenu = useCallback(() => setContextMenuPosition(null), []);

  const openContextMenu = useCallback((x: number, y: number) => {
    const menuWidth = 260;
    const menuHeight = 220;

    setContextMenuPosition({
      x: Math.max(12, Math.min(x, window.innerWidth - menuWidth)),
      y: Math.max(12, Math.min(y, window.innerHeight - menuHeight))
    });
  }, []);

  const handleDesktopContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (sleeping) {
        event.preventDefault();
        return;
      }

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("a, button, .liquid-window, .mac-dock, [role='menu']")
      ) {
        return;
      }

      event.preventDefault();
      openContextMenu(event.clientX, event.clientY);
    },
    [openContextMenu, sleeping]
  );

  const wakeFromSleep = useCallback(() => {
    if (!sleeping || sleepState === "exiting") {
      return;
    }

    setSleepState("exiting");
    window.setTimeout(() => dispatch(wakePlayground()), 260);
  }, [dispatch, sleeping, sleepState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContextMenu();

        if (sleeping) {
          wakeFromSleep();
        }
      }

      if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
        event.preventDefault();
        openContextMenu(window.innerWidth / 2 - 120, window.innerHeight / 2 - 80);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeContextMenu, openContextMenu, sleeping, wakeFromSleep]);

  return (
    <div
      className="desktop-wallpaper flex min-h-[100dvh] flex-col overflow-hidden px-3 py-3 text-foreground sm:px-5 sm:py-5"
      onClick={closeContextMenu}
      onContextMenu={handleDesktopContextMenu}
    >
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

      {contextMenuPosition ? (
        <DesktopContextMenu
          position={contextMenuPosition}
          onClose={closeContextMenu}
          onCopyCommand={() => {
            void navigator.clipboard?.writeText("pnpm create:experiment <name>");
            closeContextMenu();
          }}
          onCopyRoute={() => {
            void navigator.clipboard?.writeText(window.location.href);
            closeContextMenu();
          }}
          onOpenFirstExperiment={() => {
            if (firstExperiment) {
              dispatch(openWindow(firstExperiment.id));
              navigate(firstExperiment.path);
            }
            closeContextMenu();
          }}
          onSleep={() => {
            setSleepState("entered");
            dispatch(sleepPlayground());
            closeContextMenu();
          }}
        />
      ) : null}

      {sleeping ? <SleepScreen state={sleepState} onWake={wakeFromSleep} /> : null}
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
          "mac-dock-link group/dock relative flex items-center justify-center rounded-[18px] p-0.5 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "dock-active"
        )
      }
      title={label}
      to={to}
      onClick={() => onNavigate(id)}
    >
      <span className="mac-dock-tooltip" aria-hidden="true">
        {label}
      </span>
      <span className="mac-dock-icon flex size-[3.25rem] items-center justify-center text-primary-foreground transition-transform duration-150 sm:size-14">
        <FlaskConical aria-hidden="true" className="mac-dock-icon-glyph" strokeWidth={2.35} />
      </span>
      <span
        className="mac-dock-running-dot opacity-0 transition-opacity data-[active=true]:opacity-100"
        data-active={active}
      />
    </NavLink>
  );
}

type ContextMenuPosition = {
  x: number;
  y: number;
};

type DesktopContextMenuProps = {
  position: ContextMenuPosition;
  onClose: () => void;
  onCopyCommand: () => void;
  onCopyRoute: () => void;
  onOpenFirstExperiment: () => void;
  onSleep: () => void;
};

function DesktopContextMenu({
  position,
  onClose,
  onCopyCommand,
  onCopyRoute,
  onOpenFirstExperiment,
  onSleep
}: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, []);

  return (
    <div
      aria-label="Desktop menu"
      className="mac-context-menu"
      ref={menuRef}
      role="menu"
      style={{ left: position.x, top: position.y }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
    >
      <button
        className="mac-context-menu-item"
        role="menuitem"
        type="button"
        onClick={onOpenFirstExperiment}
      >
        <Play aria-hidden="true" size={15} />
        Open first lab
      </button>
      <button
        className="mac-context-menu-item"
        role="menuitem"
        type="button"
        onClick={onCopyRoute}
      >
        <Clipboard aria-hidden="true" size={15} />
        Copy current URL
      </button>
      <button
        className="mac-context-menu-item"
        role="menuitem"
        type="button"
        onClick={onCopyCommand}
      >
        <TerminalSquare aria-hidden="true" size={15} />
        Copy experiment command
      </button>
      <span className="mac-context-menu-separator" role="separator" />
      <button className="mac-context-menu-item" role="menuitem" type="button" onClick={onSleep}>
        <Moon aria-hidden="true" size={15} />
        Focus / Sleep Screen
      </button>
    </div>
  );
}

type SleepScreenProps = {
  state: "entered" | "exiting";
  onWake: () => void;
};

function SleepScreen({ state, onWake }: SleepScreenProps) {
  const [now, setNow] = useState(() => new Date());
  const wakeButtonRef = useRef<HTMLButtonElement>(null);
  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(now),
    [now]
  );
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "long"
      }).format(now),
    [now]
  );

  useEffect(() => {
    wakeButtonRef.current?.focus();
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Focus screen"
      aria-modal="true"
      className="sleep-screen"
      data-state={state}
      role="dialog"
      onClick={onWake}
    >
      <div className="sleep-screen-clock" aria-live="polite">
        <p>{dateLabel}</p>
        <strong>{timeLabel}</strong>
      </div>
      <button
        className="button-spotlight sleep-screen-wake"
        ref={wakeButtonRef}
        type="button"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();

          event.currentTarget.style.setProperty(
            "--button-spotlight-x",
            `${event.clientX - rect.left}px`
          );
          event.currentTarget.style.setProperty(
            "--button-spotlight-y",
            `${event.clientY - rect.top}px`
          );
        }}
        onClick={(event) => {
          event.stopPropagation();
          onWake();
        }}
      >
        Wake Playground
      </button>
    </section>
  );
}
