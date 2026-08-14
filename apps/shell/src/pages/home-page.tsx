import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@playground/ui";
import { ArrowRight, Boxes, Route, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { experiments } from "../experiments";
import { useGetPlaygroundStatusQuery } from "../store/services/playground-api";

export function HomePage() {
  const { data } = useGetPlaygroundStatusQuery();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">Spec-driven technology lab</p>
        <h1 className="text-3xl font-semibold tracking-normal">Explore, isolate, and learn.</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This shell hosts independently runnable experiments while keeping routing,
          shared UI, and Redux Toolkit infrastructure consistent.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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

      <div className="grid gap-3">
        {experiments.map((experiment) => (
          <Card key={experiment.id}>
            <CardHeader>
              <CardTitle>{experiment.title}</CardTitle>
              <CardDescription>{experiment.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
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

      <p className="text-xs text-muted-foreground">
        API layer: {data?.status ?? "loading"} via {data?.source ?? "rtk-query"}
      </p>
    </section>
  );
}

type FeatureCardProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
};

function FeatureCard({ children, icon, title }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground [&_svg]:size-4">
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
