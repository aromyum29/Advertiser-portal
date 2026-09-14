/**
 * The portal frame: a persistent sidebar on desktop, a slide-over on small
 * screens, and the signed-in advertiser's identity in both.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import kokoLogo from "figma:asset/09ac28c5614ff62377e494f60366a17f58f0e925.png";
import { useSession } from "../../state/session";
import { isNavItemActive, NAV_ITEMS } from "./nav";

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 rounded-lg px-1 py-1"
      aria-label="Koko advertiser portal, home"
    >
      <img
        src={kokoLogo}
        alt=""
        aria-hidden="true"
        className="h-9 w-9 flex-shrink-0 object-contain"
      />
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-bold leading-tight tracking-tight">
          Advertiser Portal
        </span>
        <span className="block truncate text-xs text-muted-foreground">Koko for business</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
              active
                ? "bg-[#BDDCEE] font-bold text-gray-900"
                : "font-medium text-muted-foreground hover:bg-[#BDDCEE]/20 hover:text-foreground",
            )}
          >
            <Icon aria-hidden="true" className="h-[18px] w-[18px] flex-shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountCard() {
  const { advertiser, signOut } = useSession();
  if (!advertiser) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white dark:bg-gray-100 dark:text-gray-900"
      >
        {advertiser.displayName.charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-tight">
          {advertiser.displayName}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {advertiser.storeName} · {advertiser.city}
        </span>
      </span>
      <button
        type="button"
        onClick={signOut}
        aria-label="Sign out"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

function SidebarContents({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto flex flex-col gap-3">
        <Link
          to="/merchant"
          onClick={onNavigate}
          className="rounded-xl border border-dashed border-border px-3.5 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-gray-400 hover:text-foreground"
        >
          Merchant portal reference
        </Link>
        <AccountCard />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the slide-over whenever navigation happens, however it was triggered.
  useEffect(() => setMenuOpen(false), [pathname]);

  // While the slide-over is open it is the only thing on screen, so stop the
  // page behind it scrolling under the advertiser's finger.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-screen w-[264px] flex-shrink-0 border-r border-border/60 bg-card lg:block">
        <SidebarContents />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-gray-900/40"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-card shadow-xl">
            <SidebarContents onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
          >
            {menuOpen ? (
              <Menu aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Menu aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
          <Brand />
        </header>

        <main id="main" className="min-w-0 flex-1 px-4 pb-16 pt-5 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
