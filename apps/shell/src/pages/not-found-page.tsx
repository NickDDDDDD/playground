import { Button } from "@playground/ui";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="desktop-wallpaper flex min-h-[100dvh] items-center justify-center px-6">
      <div className="liquid-glass flex max-w-md flex-col items-start gap-4 rounded-[28px] p-6">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Route not found</h1>
        <p className="text-base leading-7 text-muted-foreground">
          The requested experiment or page is not registered in the shell.
        </p>
        <Button asChild>
          <Link to="/">Back to overview</Link>
        </Button>
      </div>
    </main>
  );
}
