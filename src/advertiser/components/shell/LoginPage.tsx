/**
 * Sign in.
 *
 * Credentials are checked in the browser against a single demo account: this
 * is a prototype, and pretending otherwise would be dishonest. The demo
 * credentials are shown on the page so nobody has to guess them.
 */
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";
import kokoWordmark from "figma:asset/2fb784bf4eb111e438185f3f72d368e7963516ad.png";
import { DEMO_CREDENTIALS, useSession } from "../../state/session";
import { PASTEL_GRADIENT } from "../primitives";

export function LoginPage() {
  const { status, signIn } = useSession();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Someone who is already signed in has no business on this page.
  useEffect(() => {
    if (status === "authenticated") void navigate({ to: redirect ?? "/", replace: true });
  }, [status, navigate, redirect]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = signIn(username, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    void navigate({ to: redirect ?? "/", replace: true });
  };

  const canSubmit = username.trim().length > 0 && password.length > 0;

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundImage: PASTEL_GRADIENT }}
    >
      <div className="w-full max-w-[400px] rounded-[22px] bg-white/85 p-8 shadow-[0_20px_60px_-20px_rgba(13,15,20,0.35)] backdrop-blur sm:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={kokoWordmark} alt="Koko" className="h-8 object-contain" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Advertiser portal</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
              Sign in to book advertising space inside the Koko shopper app.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError(null);
              }}
              placeholder="Enter your username"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "signin-error" : undefined}
              className="rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                placeholder="Enter your password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "signin-error" : undefined}
                className="w-full rounded-lg border border-transparent bg-gray-100 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 transition-colors hover:text-gray-900"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Eye aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p id="signin-error" role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "mt-1 rounded-lg px-6 py-3 text-sm font-semibold transition-colors",
              canSubmit
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "cursor-not-allowed bg-gray-200 text-gray-500",
            )}
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 rounded-lg bg-gray-100/80 px-4 py-3 text-center text-xs leading-relaxed text-gray-600">
          This is a prototype. Sign in with{" "}
          <span className="font-semibold text-gray-900">{DEMO_CREDENTIALS.username}</span> /{" "}
          <span className="font-semibold text-gray-900">{DEMO_CREDENTIALS.password}</span>.
        </p>
      </div>
    </div>
  );
}
