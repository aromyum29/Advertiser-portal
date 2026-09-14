/**
 * The sign-in wall.
 *
 * The session is read from local storage on the client, so there is a moment
 * after the server-rendered markup arrives where we genuinely do not know yet
 * whether anyone is signed in. Rather than flashing the sign-in page at
 * someone who is, we hold a quiet placeholder until the answer is known.
 */
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { useSession } from "../../state/session";

export function RequireSession({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (status === "guest") {
      // Remember where they were headed so sign-in can send them back.
      void navigate({ to: "/login", search: { redirect: pathname }, replace: true });
    }
  }, [status, navigate, pathname]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" aria-busy="true">
        <p className="sr-only">Checking your session</p>
        <span
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-gray-900 motion-reduce:animate-none dark:border-t-gray-100"
        />
      </div>
    );
  }

  return <>{children}</>;
}
