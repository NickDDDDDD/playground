import { Button, Card, CardContent, CardHeader, CardTitle, useGsapReveal } from "@playground/ui";
import { ArrowRight, Boxes, CheckCircle2, FlaskConical, Route, Server } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { experiments } from "../experiments";
import { useGetPlaygroundStatusQuery } from "../store/services/playground-api";

export function HomePage() {
  const pageRef = useRef<HTMLElement>(null);
  const { data } = useGetPlaygroundStatusQuery();

  useGsapReveal(pageRef);

  return (
    <section
      className="grid w-full auto-rows-min grid-cols-1 gap-4 px-1 py-2 sm:grid-cols-6 sm:gap-5 sm:px-2 lg:grid-cols-12"
      ref={pageRef}
    >
      <div
        className="desktop-widget-motion liquid-card group rounded-[28px] border p-5 sm:col-span-6 sm:p-7 lg:col-span-7 lg:row-span-2"
        data-gsap-reveal
      >
        <div className="flex h-full min-h-[20rem] flex-col justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-primary">Spec-driven desktop lab</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Explore new frontend ideas without losing the system.
            </h1>
            <p className="max-w-[62ch] text-base leading-7 text-muted-foreground text-pretty">
              A desktop-like shell for independently runnable experiments, shared UI primitives,
              Redux Toolkit infrastructure, and architecture decisions that stay visible.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button className="transition-transform group-hover:translate-x-0.5" asChild>
              <Link to={experiments[0]?.path ?? "/"}>
                Open first lab
                <ArrowRight />
              </Link>
            </Button>
            <span className="text-base leading-7 text-muted-foreground sm:text-sm sm:leading-6">
              Experiments live in the Dock.
            </span>
          </div>
        </div>
      </div>

      <div
        className="liquid-card grid content-start gap-2 rounded-[28px] border p-4 sm:col-span-3 lg:col-span-5"
        data-gsap-reveal
      >
        <StatusRow label="API layer" value={`${data?.status ?? "loading"} via ${data?.source ?? "rtk-query"}`} />
        <StatusRow label="Experiments" value={`${experiments.length} registered`} />
        <StatusRow label="Workflow" value="Spec first" />
      </div>

      <FeatureCard className="sm:col-span-3 lg:col-span-5" icon={<Boxes />} title="Monorepo">
        Apps, shared packages, and experiments stay separate without drifting apart.
      </FeatureCard>
      <FeatureCard className="sm:col-span-3 lg:col-span-4" icon={<Route />} title="Routing">
        React Router mounts experiments in windows and keeps standalone apps simple.
      </FeatureCard>
      <FeatureCard className="sm:col-span-3 lg:col-span-4" icon={<Server />} title="RTK Query">
        Server state gets its own cache lifecycle instead of hand-written loading slices.
      </FeatureCard>

      <div className="grid gap-3 sm:col-span-6 lg:col-span-4" data-gsap-reveal>
        {experiments.map((experiment) => (
          <Link
            className="desktop-widget-motion liquid-card group grid gap-4 rounded-[28px] border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            key={experiment.id}
            to={experiment.path}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[18px] bg-primary text-primary-foreground shadow-sm [&_svg]:size-5">
                <FlaskConical />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">{experiment.title}</h2>
                <p className="mt-1 max-w-[64ch] text-base leading-7 text-muted-foreground text-pretty sm:text-sm sm:leading-6">
                  {experiment.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {experiment.tags.map((tag) => (
                    <span
                      className="rounded-full bg-white/58 px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-white/54"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <span className="button-spotlight inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-transform group-hover:translate-x-0.5">
              Open
              <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
};

function StatusRow({ label, value }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] bg-white/54 px-3 py-2.5 text-base shadow-[inset_0_1px_0_rgb(255_255_255_/_0.72)] sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex min-w-0 items-center gap-2 font-medium text-foreground">
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
        <span className="truncate">{value}</span>
      </span>
    </div>
  );
}

type FeatureCardProps = {
  children: React.ReactNode;
  className?: string;
  icon: React.ReactNode;
  title: string;
};

function FeatureCard({ children, className, icon, title }: FeatureCardProps) {
  return (
    <Card className={`liquid-card rounded-[28px] ${className ?? ""}`} data-gsap-reveal>
      <CardHeader>
        <div className="mb-3 flex size-11 items-center justify-center rounded-[18px] bg-white/64 text-primary shadow-sm ring-1 ring-white/60 [&_svg]:size-5">
          {icon}
        </div>
        <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-7 text-muted-foreground text-pretty sm:text-sm sm:leading-6">
          {children}
        </p>
      </CardContent>
    </Card>
  );
}
