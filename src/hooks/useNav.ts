import { useNavigate, useLocation } from "react-router";

export const PAGE_TO_PATH: Record<string, string> = {
  landing: "/",
  contact: "/contact",
  login: "/login",
  register: "/register",
  auth: "/login",
  "donor-dashboard": "/app/donor/dashboard",
  "donor-donations": "/app/donor/donations",
  "create-donation": "/app/donor/create",
  "donor-impact": "/app/donor/impact",
  "ngo-dashboard": "/app/ngo/dashboard",
  "ngo-requirements": "/app/ngo/requirements",
  "ngo-accepted": "/app/ngo/accepted",
  "ngo-impact": "/app/ngo/impact",
  "volunteer-dashboard": "/app/volunteer/dashboard",
  "my-deliveries": "/app/volunteer/my-deliveries",
  "admin-dashboard": "/app/admin/dashboard",
  "admin-donations": "/app/admin/donations",
  "admin-deliveries": "/app/admin/deliveries",
  "audit-logs": "/app/admin/audit-logs",
  analytics: "/app/analytics",
  notifications: "/app/notifications",
  messaging: "/app/messaging",
  settings: "/app/settings",
  // Quick action aliases — map to nearest real route
  "ngo-available": "/app/ngo/accepted",
  "available-deliveries": "/app/volunteer/my-deliveries",
  "admin-verify": "/app/admin/dashboard",
};

export const PATH_TO_PAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH)
    .filter(([, v]) => v.startsWith("/app"))
    .map(([k, v]) => [v, k])
);

// delivery-tracking is accessed as a modal from within MyDeliveries (via Track Live button),
// but the sidebar "Live Tracking" link should navigate to my-deliveries instead.
const MODAL_PAGES = new Set(["donation-details"]);

export function useNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (page: string) => {
    if (MODAL_PAGES.has(page)) {
      const params = new URLSearchParams(location.search);
      params.set("modal", page);
      navigate(`${location.pathname}?${params.toString()}`);
      return;
    }
    const path = PAGE_TO_PATH[page];
    if (path) navigate(path);
  };
}
