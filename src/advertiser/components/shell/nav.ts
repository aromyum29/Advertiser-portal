/** The portal's primary navigation. Three surfaces, in the order work happens. */
import { BarChart3, LayoutGrid, Megaphone } from "lucide-react";

export interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: typeof Megaphone;
  /** Highlight this item for any URL underneath it, not just an exact match. */
  readonly matchPrefixes?: readonly string[];
  readonly description: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    to: "/",
    label: "Advertise",
    icon: Megaphone,
    matchPrefixes: ["/book"],
    description: "Choose where you want to be seen",
  },
  {
    to: "/bookings",
    label: "My bookings",
    icon: LayoutGrid,
    description: "Everything you have booked",
  },
  {
    to: "/performance",
    label: "Performance",
    icon: BarChart3,
    description: "What your advertising returned",
  },
] as const;

export const isNavItemActive = (item: NavItem, pathname: string): boolean => {
  if (item.to === "/") {
    return pathname === "/" || (item.matchPrefixes ?? []).some((p) => pathname.startsWith(p));
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
};
