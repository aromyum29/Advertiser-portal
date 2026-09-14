/**
 * What one broken page looks like.
 *
 * Scoped to a route rather than the whole app, so a failure in Performance
 * leaves the advertiser their navigation, their other pages, and a way to
 * retry instead of a blank screen.
 */
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export function RouteError({ error, reset }: { error: Error; reset?: () => void }) {
  const router = useRouter();

  useEffect(() => {
    // Goes to the console in the prototype; to the error reporter in production.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-xl font-bold tracking-tight">This page didn't load</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Something went wrong on our end. Nothing you have booked is affected.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            void router.invalidate();
            reset?.();
          }}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Try again
        </button>
        <Link
          to="/"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200"
        >
          Back to Advertise
        </Link>
      </div>
    </div>
  );
}
