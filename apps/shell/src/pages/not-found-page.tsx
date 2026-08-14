import { Button } from "@playground/ui";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-2xl font-semibold tracking-normal">Route not found</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          The requested experiment or page is not registered in the shell.
        </p>
        <Button asChild>
          <Link to="/">Back to overview</Link>
        </Button>
      </div>
    </main>
  );
}
