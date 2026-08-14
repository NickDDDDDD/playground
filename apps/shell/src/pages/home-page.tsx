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
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-7"
      ref={pageRef}
    >
      <div className="grid gap-5 md:grid-cols-[1.45fr_0.9fr]" data-gsap-reveal>
        <div className="flex flex-col justify-between rounded-[24px] border border-white/45 bg-white/48 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.72),0_20px_60px_rgb(15_23_42_/_0.12)] backdrop-blur-xl sm:min-h-[22rem] sm:p-7">
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
            <Button asChild>
              <Link to={experiments[0]?.path ?? "/"}>
                Open first experiment
                <ArrowRight />
              </Link>
            </Button>
            <span className="text-base leading-7 text-muted-foreground sm:text-sm sm:leading-6">
              Use the Dock below as the experiment launcher.
            </span>
          </div>
        </div>

        <div className="liquid-card grid content-start gap-2 rounded-[24px] border p-4">
          <StatusRow label="API layer" value={`${data?.status ?? "loading"} via ${data?.source ?? "rtk-query"}`} />
          <StatusRow label="Experiments" value={`${experiments.length} registered`} />
          <StatusRow label="Workflow" value="Spec first" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3" data-gsap-reveal>
        <FeatureCard icon={<Boxes />} title="Monorepo">
          Apps, shared packages, and experiments stay separate without drifting apart.
        </FeatureCard>
        <FeatureCard icon={<Route />} title="Routing">
          React Router mounts experiments in the shell and keeps standalone apps simple.
        </FeatureCard>
        <FeatureCard icon={<Server />} title="RTK Query">
          Server state gets its own cache lifecycle instead of hand-written loading slices.
        </FeatureCard>
      </div>

      <div className="grid gap-3" data-gsap-reveal>
        {experiments.map((experiment) => (
          <Link
            className="liquid-card group grid gap-4 rounded-[24px] border p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[1fr_auto] sm:items-center"
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
            <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-transform group-hover:translate-x-0.5">
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
  icon: React.ReactNode;
  title: string;
};

function FeatureCard({ children, icon, title }: FeatureCardProps) {
  return (
    <Card className="liquid-card rounded-[24px]">
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
