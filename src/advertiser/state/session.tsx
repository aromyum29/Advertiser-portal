/**
 * Who is signed in.
 *
 * This is a prototype sign-in: credentials are checked in the browser and the
 * session lives in local storage. There is no token, no server and no real
 * authorisation. It exists so the portal has the shape of a real product —
 * a sign-in wall, an account identity in the header, a way out — and so the
 * guard is a single place to swap for real auth later.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { readJSON, remove, writeJSON } from "./storage";

export interface Advertiser {
  readonly username: string;
  readonly displayName: string;
  readonly storeName: string;
  readonly city: string;
}

/** The one demo account. Replaced by a real identity provider in production. */
const DEMO = {
  username: "test",
  password: "test",
  account: {
    username: "test",
    displayName: "Johdoe1",
    storeName: "Carnage",
    city: "Colombo",
  },
} as const;

export const DEMO_CREDENTIALS = { username: DEMO.username, password: DEMO.password };

/**
 * `loading` covers the first paint, when the server has rendered but local
 * storage has not been read yet. Guards wait it out instead of flashing the
 * sign-in page at someone who is already signed in.
 */
export type SessionStatus = "loading" | "authenticated" | "guest";

interface SessionValue {
  readonly status: SessionStatus;
  readonly advertiser: Advertiser | null;
  signIn(username: string, password: string): { ok: true } | { ok: false; error: string };
  signOut(): void;
}

const SessionContext = createContext<SessionValue | null>(null);

const STORAGE_KEY = "session";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);

  // Runs on the client only, so server and client first render agree.
  useEffect(() => {
    const stored = readJSON<Advertiser | null>(STORAGE_KEY, null);
    setAdvertiser(stored);
    setStatus(stored ? "authenticated" : "guest");
  }, []);

  const signIn = useCallback((username: string, password: string) => {
    if (username.trim().toLowerCase() !== DEMO.username || password !== DEMO.password) {
      return { ok: false as const, error: "That username and password do not match." };
    }
    writeJSON(STORAGE_KEY, DEMO.account);
    setAdvertiser(DEMO.account);
    setStatus("authenticated");
    return { ok: true as const };
  }, []);

  const signOut = useCallback(() => {
    remove(STORAGE_KEY);
    setAdvertiser(null);
    setStatus("guest");
  }, []);

  const value = useMemo<SessionValue>(
    () => ({ status, advertiser, signIn, signOut }),
    [status, advertiser, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside a SessionProvider");
  return value;
}
