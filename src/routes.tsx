import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { PAGE_TO_PATH } from "@/hooks/useNav";
import AppLayout from "@/layouts/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing          = lazy(() => import("@/features/public/Landing"));
const Contact          = lazy(() => import("@/features/public/Contact"));
const Auth             = lazy(() => import("@/features/auth/Auth"));
const DonorDashboard   = lazy(() => import("@/features/dashboard/DonorDashboard"));
const NGODashboard     = lazy(() => import("@/features/dashboard/NGODashboard"));
const VolunteerDashboard = lazy(() => import("@/features/dashboard/VolunteerDashboard"));
const AdminDashboard   = lazy(() => import("@/features/dashboard/AdminDashboard"));
const DonorDonations   = lazy(() => import("@/features/donations/DonorDonations"));
const CreateDonation   = lazy(() => import("@/features/donations/CreateDonation"));
const DonorImpact      = lazy(() => import("@/features/impact/DonorImpact"));
const NGORequirements  = lazy(() => import("@/features/requirements/NGORequirements"));
const NGOAccepted      = lazy(() => import("@/features/donations/NGOAccepted"));
const MyDeliveries     = lazy(() => import("@/features/deliveries/MyDeliveries"));
const AdminMonitoringD = lazy(() => import("@/features/admin/AdminMonitoring"));
const AuditLogs        = lazy(() => import("@/features/admin/AuditLogs"));
const Analytics        = lazy(() => import("@/features/analytics/Analytics"));
const Notifications    = lazy(() => import("@/features/notifications/Notifications"));
const SettingsPage     = lazy(() => import("@/features/settings/SettingsPage"));
const Messaging        = lazy(() => import("@/features/messaging/Messaging"));

function RouteLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center animate-spin" style={{ animationDuration: "0.8s" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-foreground/70">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <span className="text-xs text-muted-foreground font-medium tracking-wide">Loading…</span>
      </div>
    </div>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary level="page">
      <Suspense fallback={<RouteLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6 mx-auto">
        <AlertTriangle size={32} className="text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-bold text-foreground tracking-tight mb-3">404</h1>
      <h2 className="text-xl font-semibold text-foreground mb-2">Page not found</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <RefreshCw size={13} className="mr-1.5" /> Go back
        </Button>
        <Button onClick={() => navigate("/")}>
          <Home size={13} className="mr-1.5" /> Home
        </Button>
      </div>
    </div>
  );
}

function AppIndex() {
  const { role } = useAuth();
  return <Navigate to={PAGE_TO_PATH[`${role}-dashboard`]} replace />;
}

const AdminDonations   = () => <Wrap><AdminMonitoringD view="donations" /></Wrap>;
const AdminDeliveries  = () => <Wrap><AdminMonitoringD view="deliveries" /></Wrap>;

export const router = createBrowserRouter([
  { path: "/",        element: <Wrap><Landing /></Wrap> },
  { path: "/contact", element: <Wrap><Contact /></Wrap> },
  { path: "/login",   element: <Wrap><Auth mode="login" /></Wrap> },
  { path: "/register",element: <Wrap><Auth mode="register" /></Wrap> },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: AppIndex },

      /* Donor */
      { path: "donor/dashboard", element: <Wrap><DonorDashboard /></Wrap> },
      { path: "donor/donations", element: <Wrap><DonorDonations /></Wrap> },
      { path: "donor/create",    element: <Wrap><CreateDonation /></Wrap> },
      { path: "donor/impact",    element: <Wrap><DonorImpact /></Wrap> },

      /* NGO */
      { path: "ngo/dashboard",   element: <Wrap><NGODashboard /></Wrap> },
      { path: "ngo/requirements",element: <Wrap><NGORequirements /></Wrap> },
      { path: "ngo/accepted",    element: <Wrap><NGOAccepted /></Wrap> },
      { path: "ngo/impact",      element: <Wrap><DonorImpact /></Wrap> },

      /* Volunteer */
      { path: "volunteer/dashboard",   element: <Wrap><VolunteerDashboard /></Wrap> },
      { path: "volunteer/my-deliveries", element: <Wrap><MyDeliveries /></Wrap> },

      /* Admin */
      { path: "admin/dashboard",  element: <Wrap><AdminDashboard /></Wrap> },
      { path: "admin/donations",  element: <AdminDonations /> },
      { path: "admin/deliveries", element: <AdminDeliveries /> },
      { path: "admin/audit-logs", element: <Wrap><AuditLogs /></Wrap> },

      /* Shared */
      { path: "analytics",    element: <Wrap><Analytics /></Wrap> },
      { path: "notifications",element: <Wrap><Notifications /></Wrap> },
      { path: "messaging",    element: <Wrap><Messaging /></Wrap> },
      { path: "settings",     element: <Wrap><SettingsPage /></Wrap> },

      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
