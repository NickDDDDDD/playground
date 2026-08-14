import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@playground/ui";
import { Boxes, Minus, Plus, SplitSquareHorizontal } from "lucide-react";
import { useState } from "react";

export function WelcomePage() {
  const [count, setCount] = useState(0);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">Experiment 001</p>
        <h1 className="text-3xl font-semibold tracking-normal">Welcome Lab</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This experiment is both a shell-mounted route and a standalone Vite app.
          It is intentionally small so the architecture is easy to inspect.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <SplitSquareHorizontal className="size-4" />
            </div>
            <CardTitle>Dual entry</CardTitle>
            <CardDescription>
              Export a route module for the shell and keep a standalone app entrypoint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <code className="rounded-md bg-muted px-2 py-1 text-xs">
                pnpm --filter @playground/experiment-welcome dev
              </code>
              <code className="rounded-md bg-muted px-2 py-1 text-xs">
                cd experiments/welcome && pnpm dev
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Boxes className="size-4" />
            </div>
            <CardTitle>Local interaction</CardTitle>
            <CardDescription>
              Small experiments can keep component state local until shared state is needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button
              aria-label="Decrease counter"
              size="icon"
              variant="outline"
              onClick={() => setCount((value) => value - 1)}
            >
              <Minus />
            </Button>
            <span className="min-w-10 text-center text-lg font-semibold">{count}</span>
            <Button
              aria-label="Increase counter"
              size="icon"
              variant="outline"
              onClick={() => setCount((value) => value + 1)}
            >
              <Plus />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
