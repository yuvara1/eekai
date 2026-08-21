import React, { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useIsMobile } from "./hooks/useIsMobile";
import AppSidebar, { SidebarNavContent } from "./components/Sidebar";
import Header from "./components/Header";
import RightPanel from "./components/RightPanel";
import Modal from "./components/Modal";
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const DonorDashboard = lazy(() => import("./pages/DonorDashboard"));
const CreateDonation = lazy(() => import("./pages/CreateDonation"));
const DonationDetails = lazy(() => import("./pages/DonationDetails"));
const NGODashboard = lazy(() => import("./pages/NGODashboard"));
const NGORequirements = lazy(() => import("./pages/NGORequirements"));
const VolunteerDashboard = lazy(() => import("./pages/VolunteerDashboard"));
const MyDeliveries = lazy(() => import("./pages/MyDeliveries"));
const DeliveryTracking = lazy(() => import("./pages/DeliveryTracking"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminMonitoring = lazy(() => import("./pages/AdminMonitoring"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Notifications = lazy(() => import("./pages/Notifications"));
const DonorImpact = lazy(() => import("./pages/DonorImpact"));
const Contact = lazy(() => import("./pages/Contact"));
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";

type Role = "donor" | "ngo" | "volunteer" | "admin";

const breadcrumbs: Record<string, string[]> = {
  "donor-dashboard": ["Donor", "Dashboard"],
  "donor-donations": ["Donor", "My Donations"],
  "create-donation": ["Donor", "Create Donation"],
  "donor-org": ["Donor", "Organization"],
  "donor-impact": ["Donor", "Impact"],
  "ngo-dashboard": ["NGO", "Dashboard"],
  "ngo-requirements": ["NGO", "Food Requirements"],
  "ngo-available": ["NGO", "Available Donations"],
  "ngo-accepted": ["NGO", "Accepted Donations"],
  "ngo-deliveries": ["NGO", "Deliveries"],
  "ngo-impact": ["NGO", "Impact"],
  "volunteer-dashboard": ["Volunteer", "Dashboard"],
  "available-deliveries": ["Volunteer", "Available Deliveries"],
  "my-deliveries": ["Volunteer", "My Deliveries"],
  "delivery-history": ["Volunteer", "Delivery History"],
  "admin-dashboard": ["Admin", "Dashboard"],
  "admin-users": ["Admin", "Users"],
  "admin-orgs": ["Admin", "Organizations"],
  "admin-verify": ["Admin", "Verification"],
  "admin-donations": ["Admin", "Donation Monitoring"],
  "admin-deliveries": ["Admin", "Delivery Monitoring"],
  analytics: ["Analytics"],
  "audit-logs": ["Admin", "Audit Logs"],
  notifications: ["Notifications"],
  settings: ["Settings"],
};

const notifCounts: Partial<Record<Role, number>> = {
  donor: 3,
  ngo: 5,
  volunteer: 2,
  admin: 7,
};

const defaultPage: Record<Role, string> = {
  donor: "donor-dashboard",
  ngo: "ngo-dashboard",
  volunteer: "volunteer-dashboard",
  admin: "admin-dashboard",
};

/* Pages opened as modals instead of full navigation */
const MODAL_PAGES = new Set(["donation-details", "delivery-tracking"]);

function PageSkeleton() {
  return (
    <div className="p-6 space-y-5 animate-pulse">
      <div className="h-32 rounded-xl bg-muted" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<string>("landing");
  const [role, setRole] = useState<Role>("donor");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const navigate = (target: string) => {
    if (target === "login") {
      setAuthMode("login");
      setPage("auth");
      return;
    }
    if (target === "register") {
      setAuthMode("register");
      setPage("auth");
      return;
    }
    if (MODAL_PAGES.has(target)) {
      setModal(target);
      return;
    }
    setModal(null);
    setPage(target);
    window.scrollTo(0, 0);
  };

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setPage(defaultPage[selectedRole]);
  };

  const handleSidebarNavigate = (p: string) => {
    navigate(p);
    setSidebarOpen(false);
  };

  if (page === "landing")
    return (
      <Suspense fallback={null}>
        <Landing onNavigate={navigate} />
      </Suspense>
    );
  if (page === "contact")
    return (
      <Suspense fallback={null}>
        <Contact onNavigate={navigate} />
      </Suspense>
    );
  if (page === "auth")
    return (
      <Suspense fallback={null}>
        <Auth mode={authMode} onNavigate={navigate} onLogin={handleLogin} />
      </Suspense>
    );

  const crumbs = breadcrumbs[page] ?? [page];

  return (
    <ThemeProvider>
      <AppShell
        page={page}
        role={role}
        crumbs={crumbs}
        sidebarOpen={sidebarOpen}
        modal={modal}
        isMobile={isMobile}
        navigate={navigate}
        handleSidebarNavigate={handleSidebarNavigate}
        setSidebarOpen={setSidebarOpen}
        setModal={setModal}
        notifCounts={notifCounts}
      />
    </ThemeProvider>
  );
}

interface AppShellProps {
  page: string;
  role: Role;
  crumbs: string[];
  sidebarOpen: boolean;
  modal: string | null;
  isMobile: boolean;
  navigate: (p: string) => void;
  handleSidebarNavigate: (p: string) => void;
  setSidebarOpen: (v: boolean) => void;
  setModal: (v: string | null) => void;
  notifCounts: Partial<Record<Role, number>>;
}

function AppShell({
  page,
  role,
  crumbs,
  sidebarOpen,
  modal,
  isMobile,
  navigate,
  handleSidebarNavigate,
  setSidebarOpen,
  setModal,
  notifCounts,
}: AppShellProps) {
  const { containerRef } = useTheme();
  return (
    <MotionConfig
      transition={isMobile ? { duration: 0.12, ease: "easeOut" } : undefined}
    >
      <div
        ref={containerRef}
        className="flex h-screen bg-background overflow-hidden"
      >
        <AppSidebar role={role} currentPage={page} onNavigate={navigate} />

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
              />
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 md:hidden shadow-xl w-[224px]"
              >
                <SidebarNavContent
                  role={role}
                  currentPage={page}
                  onNavigate={handleSidebarNavigate}
                  onClose={() => setSidebarOpen(false)}
                  expanded={true}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content + right panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            title={crumbs[crumbs.length - 1]}
            breadcrumb={crumbs}
            notifCount={notifCounts[role] ?? 0}
            onMenuToggle={() => setSidebarOpen(true)}
            onNavigate={navigate}
          />
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <main className="flex-1 overflow-y-auto min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Suspense fallback={<PageSkeleton />}>
                    <PageContent
                      page={page}
                      role={role}
                      onNavigate={navigate}
                    />
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </main>
            <RightPanel role={role} onNavigate={navigate} />
          </div>
        </div>

        <Modal
          open={modal === "donation-details"}
          onClose={() => setModal(null)}
          size="xl"
        >
          <DonationDetails
            onNavigate={(p) => {
              setModal(null);
              navigate(p);
            }}
          />
        </Modal>
        <Modal
          open={modal === "delivery-tracking"}
          onClose={() => setModal(null)}
          size="xl"
        >
          <DeliveryTracking
            onNavigate={(p) => {
              setModal(null);
              navigate(p);
            }}
          />
        </Modal>
      </div>
    </MotionConfig>
  );
}

function PageContent({
  page,
  role,
  onNavigate,
}: {
  page: string;
  role: Role;
  onNavigate: (p: string) => void;
}) {
  /* ── Donor ── */
  if (page === "donor-dashboard")
    return <DonorDashboard onNavigate={onNavigate} />;
  if (page === "create-donation")
    return <CreateDonation onNavigate={onNavigate} />;
  if (page === "donor-donations")
    return <DonorDonations onNavigate={onNavigate} />;
  if (page === "donor-impact") return <DonorImpact />;

  /* ── NGO ── */
  if (page === "ngo-dashboard") return <NGODashboard onNavigate={onNavigate} />;
  if (page === "ngo-available") return <NGODashboard onNavigate={onNavigate} />;
  if (page === "ngo-requirements") return <NGORequirements />;
  if (page === "ngo-accepted") return <NGOAccepted onNavigate={onNavigate} />;
  if (page === "ngo-deliveries")
    return <NGODashboard onNavigate={onNavigate} />;
  if (page === "ngo-impact") return <DonorImpact />;

  /* ── Volunteer ── */
  if (page === "volunteer-dashboard")
    return <VolunteerDashboard onNavigate={onNavigate} />;
  if (page === "available-deliveries")
    return <VolunteerDashboard onNavigate={onNavigate} />;
  if (page === "my-deliveries") return <MyDeliveries onNavigate={onNavigate} />;
  if (page === "delivery-history")
    return <MyDeliveries onNavigate={onNavigate} />;

  /* ── Admin ── */
  if (page === "admin-dashboard")
    return <AdminDashboard onNavigate={onNavigate} />;
  if (page === "admin-donations") return <AdminMonitoring view="donations" />;
  if (page === "admin-deliveries") return <AdminMonitoring view="deliveries" />;
  if (page === "admin-users") return <AdminDashboard onNavigate={onNavigate} />;
  if (page === "admin-orgs") return <AdminDashboard onNavigate={onNavigate} />;
  if (page === "admin-verify")
    return <AdminDashboard onNavigate={onNavigate} />;
  if (page === "audit-logs") return <AuditLogs />;

  /* ── Shared ── */
  if (page === "analytics") return <Analytics />;
  if (page === "notifications") return <Notifications />;
  if (page === "settings") return <Settings />;

  const dash: Record<Role, React.ReactNode> = {
    donor: <DonorDashboard onNavigate={onNavigate} />,
    ngo: <NGODashboard onNavigate={onNavigate} />,
    volunteer: <VolunteerDashboard onNavigate={onNavigate} />,
    admin: <AdminDashboard onNavigate={onNavigate} />,
  };
  return <>{dash[role]}</>;
}

/* ── Inline pages ─────────────────────────────────────── */

function DonorDonations({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [filter, setFilter] = useState("all");
  const [ddPage, setDdPage] = useState(1);
  const DD_PER_PAGE = 12;

  function sr(s: number) {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }
  const _ngos = [
    "Community Kitchen",
    "Hope Foundation",
    "City Shelter",
    "Faith Community",
    "Metro Food Bank",
    "Sunrise Care",
    "Bay Volunteers",
    "Urban Harvest",
  ];
  const _foods = [
    "Assorted Produce Mix",
    "Bread & Pastries",
    "Dairy Products",
    "Prepared Meals",
    "Canned Goods",
    "Baked Goods",
    "Seasonal Fruits",
    "Mixed Sandwiches",
    "Fresh Vegetables",
    "Protein Packs",
    "Juice Cases",
    "Snack Variety",
  ];
  const _stats = [
    "published",
    "matched",
    "pickup",
    "delivered",
    "delivered",
    "delivered",
    "expired",
    "cancelled",
  ];

  const donations = React.useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const s = i * 11 + 7;
        const status = _stats[Math.floor(sr(s) * _stats.length)];
        const ngo = ["delivered", "pickup", "matched"].includes(status)
          ? _ngos[Math.floor(sr(s + 1) * _ngos.length)]
          : "—";
        const qty = Math.floor(sr(s + 2) * 90) + 10;
        const food = _foods[Math.floor(sr(s + 3) * _foods.length)];
        const daysAgo = Math.floor(sr(s + 4) * 30);
        const date = new Date("2026-08-20");
        date.setDate(date.getDate() - daysAgo);
        const dateStr =
          i < 6
            ? ["Today", "Yesterday", "2d ago", "3d ago", "4d ago", "5d ago"][i]
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
        return {
          id: `DON-2026-${String(119 + i).padStart(6, "0")}`,
          food,
          qty: `${qty} ${food.includes("Meal") || food.includes("Sandwich") || food.includes("Snack") ? "portions" : "kg"}`,
          status,
          ngo,
          pickup:
            status === "expired" || status === "delivered" ? "—" : dateStr,
          expiry:
            status === "delivered" || status === "expired"
              ? "—"
              : `Aug ${20 + Math.floor(sr(s + 5) * 5)}`,
        };
      }),
    [],
  );

  const statuses = [
    "all",
    "published",
    "matched",
    "pickup",
    "delivered",
    "expired",
    "cancelled",
  ];
  const filtered =
    filter === "all" ? donations : donations.filter((d) => d.status === filter);
  const totalDdPages = Math.ceil(filtered.length / DD_PER_PAGE);
  const pageRows = filtered.slice(
    (ddPage - 1) * DD_PER_PAGE,
    ddPage * DD_PER_PAGE,
  );

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Donations
        </h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button size="sm" onClick={() => onNavigate("create-donation")}>
            + Create
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-1.5"
      >
        {statuses.map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === s ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground border border-border hover:text-foreground"}`}
          >
            {s}
          </motion.button>
        ))}
      </motion.div>

      {/* Table — scrollable on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Donation ID</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((d, i) => (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-mono-data text-xs text-muted-foreground">
                        {d.id}
                      </TableCell>
                      <TableCell className="font-medium text-foreground max-w-[160px] truncate">
                        {d.food}
                      </TableCell>
                      <TableCell className="font-mono-data text-xs">
                        {d.qty}
                      </TableCell>
                      <TableCell>
                        <span className={`badge badge-${d.status}`}>
                          {d.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs truncate max-w-[120px]">
                        {d.ngo}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {d.pickup}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {d.expiry}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary h-7 px-2 text-xs"
                          onClick={() => onNavigate("donation-details")}
                        >
                          View
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min((ddPage - 1) * DD_PER_PAGE + 1, filtered.length)}–
          {Math.min(ddPage * DD_PER_PAGE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => setDdPage((p) => Math.max(1, p - 1))}
            disabled={ddPage === 1}
          >
            ‹
          </Button>
          {Array.from({ length: Math.min(5, totalDdPages) }, (_, i) => {
            const p = ddPage <= 3 ? i + 1 : ddPage + i - 2;
            if (p < 1 || p > totalDdPages) return null;
            return (
              <Button
                key={p}
                variant={ddPage === p ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 px-0 text-xs"
                onClick={() => setDdPage(p)}
              >
                {p}
              </Button>
            );
          }).filter(Boolean)}
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => setDdPage((p) => Math.min(totalDdPages, p + 1))}
            disabled={ddPage === totalDdPages}
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}

function NGOAccepted({ onNavigate }: { onNavigate: (p: string) => void }) {
  const accepted = [
    {
      id: "DON-000124",
      food: "Assorted Produce · 48 kg",
      donor: "Green Harvest Co.",
      pickup: "Aug 18, 2PM",
      status: "delivered",
      volunteer: "Alex Rivera",
    },
    {
      id: "DON-000122",
      food: "Prepared Meals · 120 portions",
      donor: "Grand Hotel",
      pickup: "Aug 20, 6PM",
      status: "pickup",
      volunteer: "Maria Santos",
    },
    {
      id: "DON-000118",
      food: "Bakery Surplus · 35 kg",
      donor: "City Bakehouse",
      pickup: "Aug 21, 8AM",
      status: "accepted",
      volunteer: "Unassigned",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight text-foreground"
      >
        Accepted Donations
      </motion.h1>
      <div className="space-y-4">
        {accepted.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold tracking-tight text-foreground">
                        {d.food}
                      </span>
                      <span className={`badge badge-${d.status}`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono-data mb-2">
                      {d.id}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Donor: {d.donor}</div>
                      <div>Pickup: {d.pickup}</div>
                      <div>Volunteer: {d.volunteer}</div>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="self-start"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate("delivery-tracking")}
                    >
                      Track delivery
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AuditLogs() {
  const [alPage, setAlPage] = useState(1);
  const [alSearch, setAlSearch] = useState("");
  const AL_PER_PAGE = 15;

  function asr(s: number) {
    let x = Math.sin(s * 1.7 + 3.14) * 10000;
    return x - Math.floor(x);
  }
  const _users = [
    "admin@foodbridge.io",
    "sarah@greenharvest.org",
    "alex@email.com",
    "priya@hope.org",
    "james@commkitchen.org",
    "maria@cityshelter.org",
    "tom@metrofoodbank.org",
    "grace@faithcomm.org",
    "omar@urbanharvest.org",
    "lily@sunrise.org",
    "unknown",
  ];
  const _roles = [
    "PLATFORM_ADMIN",
    "DONOR_ADMIN",
    "VOLUNTEER",
    "NGO_STAFF",
    "NGO_ADMIN",
    "DONOR_STAFF",
    "PLATFORM_STAFF",
    "—",
  ];
  const _actions = [
    "donation.publish",
    "donation.accept",
    "donation.expire",
    "delivery.start",
    "delivery.complete",
    "delivery.fail",
    "org.approve",
    "org.suspend",
    "user.suspend",
    "user.unsuspend",
    "requirement.create",
    "requirement.update",
    "auth.login",
    "auth.login_failed",
    "auth.logout",
    "match.trigger",
    "match.override",
    "audit.export",
  ];
  const _resources = [
    "Donation",
    "Delivery",
    "Organization",
    "User",
    "Requirement",
    "Auth",
    "Match",
    "Audit",
  ];
  const _ips = [
    "10.0.1.42",
    "203.0.113.15",
    "192.0.2.88",
    "198.51.100.7",
    "203.0.113.22",
    "198.18.0.44",
    "10.0.2.15",
    "172.16.0.5",
    "198.51.100.22",
    "192.168.1.100",
  ];

  const allLogs = React.useMemo(() => {
    const base = new Date("2026-08-20T15:00:00");
    return Array.from({ length: 200 }, (_, i) => {
      const s = i * 13 + 5;
      const action = _actions[Math.floor(asr(s) * _actions.length)];
      const resource = _resources[Math.floor(asr(s + 1) * _resources.length)];
      const user = _users[Math.floor(asr(s + 2) * _users.length)];
      const role =
        user === "unknown"
          ? "—"
          : _roles[Math.floor(asr(s + 3) * (_roles.length - 1))];
      const result =
        action.includes("fail") ||
        action.includes("failed") ||
        asr(s + 4) > 0.92
          ? "failure"
          : "success";
      const dt = new Date(base.getTime() - i * 4.5 * 60000);
      const ts = dt.toISOString().replace("T", " ").slice(0, 19);
      const resId =
        resource === "Donation"
          ? `DON-${String(100 + Math.floor(asr(s + 5) * 100)).padStart(6, "0")}`
          : resource === "Delivery"
            ? `DEL-${String(80 + Math.floor(asr(s + 5) * 80)).padStart(6, "0")}`
            : resource === "Organization"
              ? `ORG-${String(Math.floor(asr(s + 5) * 60)).padStart(5, "0")}`
              : resource === "User"
                ? `USR-${String(Math.floor(asr(s + 5) * 400)).padStart(5, "0")}`
                : resource === "Auth"
                  ? "—"
                  : `${resource.slice(0, 3).toUpperCase()}-${String(Math.floor(asr(s + 5) * 50)).padStart(5, "0")}`;
      return {
        ts,
        user,
        role,
        action,
        resource,
        id: resId,
        ip: _ips[Math.floor(asr(s + 6) * _ips.length)],
        result,
      };
    });
  }, []);

  const filtered = alSearch
    ? allLogs.filter(
        (l) =>
          l.user.includes(alSearch) ||
          l.action.includes(alSearch) ||
          l.id.includes(alSearch),
      )
    : allLogs;
  const totalAlPages = Math.ceil(filtered.length / AL_PER_PAGE);
  const pageRows = filtered.slice(
    (alPage - 1) * AL_PER_PAGE,
    alPage * AL_PER_PAGE,
  );
  const logs = pageRows;
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise-grade audit trail of all platform actions
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search logs…"
            className="w-40 sm:w-48 text-sm"
            value={alSearch}
            onChange={(e) => {
              setAlSearch(e.target.value);
              setAlPage(1);
            }}
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((l, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.04 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-mono-data text-[10px] text-muted-foreground">
                        {l.ts}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {l.user}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono-data text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {l.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono-data text-[10px] text-foreground">
                          {l.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {l.resource}
                      </TableCell>
                      <TableCell className="font-mono-data text-[10px] text-muted-foreground">
                        {l.id}
                      </TableCell>
                      <TableCell className="font-mono-data text-[10px] text-muted-foreground">
                        {l.ip}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`badge ${l.result === "success" ? "badge-delivered" : "badge-expired"}`}
                        >
                          {l.result}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min((alPage - 1) * AL_PER_PAGE + 1, filtered.length)}–
          {Math.min(alPage * AL_PER_PAGE, filtered.length)} of {filtered.length}{" "}
          entries
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => setAlPage((p) => Math.max(1, p - 1))}
            disabled={alPage === 1}
          >
            ‹
          </Button>
          {Array.from({ length: Math.min(5, totalAlPages) }, (_, i) => {
            const p = alPage <= 3 ? i + 1 : alPage + i - 2;
            if (p < 1 || p > totalAlPages) return null;
            return (
              <Button
                key={p}
                variant={alPage === p ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 px-0 text-xs"
                onClick={() => setAlPage(p)}
              >
                {p}
              </Button>
            );
          }).filter(Boolean)}
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => setAlPage((p) => Math.min(totalAlPages, p + 1))}
            disabled={alPage === totalAlPages}
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight text-foreground"
      >
        Settings
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
      >
        <Tabs defaultValue="profile">
          <TabsList className="border-b border-border rounded-none h-auto p-0 bg-transparent w-full justify-start overflow-x-auto">
            {[
              "profile",
              "organization",
              "notifications",
              "security",
              "preferences",
            ].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-3 py-2 text-sm font-medium capitalize whitespace-nowrap bg-transparent shadow-none"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Card>
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      Profile Information
                    </h2>
                    <div className="flex items-center gap-4 pb-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold tracking-tight text-lg sm:text-xl cursor-pointer shrink-0"
                      >
                        SC
                      </motion.div>
                      <div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button variant="outline" size="sm">
                            Upload photo
                          </Button>
                        </motion.div>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG or PNG, max 2 MB
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                          id="first-name"
                          type="text"
                          defaultValue="Sarah"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" type="text" defaultValue="Chen" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="sarah@greenharvest.org"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+1 (415) 555-0142"
                      />
                    </div>
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-block"
                    >
                      <Button>Save changes</Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="notifications" className="mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Card>
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      Notification Preferences
                    </h2>
                    {[
                      {
                        label: "Donation matched",
                        desc: "When a donation is matched with an NGO",
                        on: true,
                      },
                      {
                        label: "NGO accepted donation",
                        desc: "When an NGO accepts your donation",
                        on: true,
                      },
                      {
                        label: "Volunteer assigned",
                        desc: "When a volunteer is assigned to your delivery",
                        on: true,
                      },
                      {
                        label: "Delivery completed",
                        desc: "When a food delivery is completed",
                        on: true,
                      },
                      {
                        label: "Donation expiring",
                        desc: "When a donation is expiring within 6 hours",
                        on: true,
                      },
                      {
                        label: "System announcements",
                        desc: "Platform updates and maintenance notices",
                        on: false,
                      },
                    ].map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground">
                            {n.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {n.desc}
                          </div>
                        </div>
                        <motion.div
                          whileTap={{ scale: 0.92 }}
                          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${n.on ? "bg-primary" : "bg-muted"}`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-card shadow transition-all ${n.on ? "left-6" : "left-1"}`}
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {["organization", "security", "preferences"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center py-12 text-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3"
                      >
                        <SettingsIcon
                          size={20}
                          className="text-muted-foreground/50"
                        />
                      </motion.div>
                      <p className="font-semibold tracking-tight text-foreground capitalize">
                        {tab} settings
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Coming soon
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}
