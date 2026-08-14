import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@playground/ui";
import { Boxes, Minus, Plus, SplitSquareHorizontal } from "lucide-react";
import { useState } from "react";

export function WelcomePage() {
  const [count, setCount] = useState(0);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-7">
      <div className="liquid-card rounded-[24px] border p-5 sm:p-7">
        <p className="text-sm font-medium text-primary">Experiment 001</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance">Welcome Lab</h1>
        <p className="mt-3 max-w-[62ch] text-base leading-7 text-muted-foreground text-pretty">
          This experiment is both a shell-mounted route and a standalone Vite app.
          It is intentionally small so the architecture is easy to inspect.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="liquid-card overflow-hidden rounded-[24px]">
          <CardHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-[18px] bg-white/64 text-primary shadow-sm ring-1 ring-white/60">
              <SplitSquareHorizontal className="size-5" />
            </div>
            <CardTitle className="text-lg tracking-tight">Dual entry</CardTitle>
            <CardDescription className="text-base leading-7 sm:text-sm sm:leading-6">
              Export a route module for the shell and keep a standalone app entrypoint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <code className="block max-w-full overflow-x-auto whitespace-nowrap rounded-[14px] bg-white/58 px-3 py-2 text-sm text-foreground ring-1 ring-white/54">
                pnpm --filter @playground/experiment-welcome dev
              </code>
              <code className="block max-w-full overflow-x-auto whitespace-nowrap rounded-[14px] bg-white/58 px-3 py-2 text-sm text-foreground ring-1 ring-white/54">
                cd experiments/welcome && pnpm dev
              </code>
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-card overflow-hidden rounded-[24px]">
          <CardHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-[18px] bg-white/64 text-primary shadow-sm ring-1 ring-white/60">
              <Boxes className="size-5" />
            </div>
            <CardTitle className="text-lg tracking-tight">Local interaction</CardTitle>
            <CardDescription className="text-base leading-7 sm:text-sm sm:leading-6">
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
