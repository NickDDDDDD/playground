import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useGsapReveal
} from "@playground/ui";
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
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8" ref={pageRef}>
      <div className="grid gap-5 rounded-lg border border-border bg-card p-5 shadow-sm md:grid-cols-[1.5fr_1fr]" data-gsap-reveal>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-primary">Spec-driven technology lab</p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-normal">
            Explore new frontend ideas without losing the system.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            A quiet shell for independently runnable experiments, shared UI primitives,
            Redux Toolkit infrastructure, and architecture decisions that stay visible.
          </p>
        </div>
        <div className="grid content-start gap-2 rounded-md bg-muted p-3">
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
          <Card className="overflow-hidden" key={experiment.id}>
            <CardHeader className="border-b border-border bg-muted/60">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-card text-primary shadow-sm [&_svg]:size-4">
                  <FlaskConical />
                </div>
                <div className="min-w-0">
                  <CardTitle>{experiment.title}</CardTitle>
                  <CardDescription>{experiment.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 pt-5">
              <div className="flex flex-wrap gap-2">
                {experiment.tags.map((tag) => (
                  <span
                    className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button asChild>
                <Link to={experiment.path}>
                  Open
                  <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
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
    <div className="flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2 text-sm shadow-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-2 font-medium text-foreground">
        <CheckCircle2 className="size-4 text-primary" />
        {value}
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
    <Card className="bg-card/90">
      <CardHeader>
        <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground shadow-sm [&_svg]:size-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  );
}
