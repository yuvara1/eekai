import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Package, Truck, Handshake, Bell, ArrowRight, TrendingUp, Zap, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Role = "donor" | "ngo" | "volunteer" | "admin";

interface RightPanelProps {
  role: Role;
  onNavigate: (page: string) => void;
}

const quickActions: Record<Role, { label: string; icon: React.ElementType; page: string; accent: string }[]> = {
  donor: [
    { label: "New Donation", icon: Package, page: "create-donation", accent: "#16a34a" },
    { label: "View Impact", icon: TrendingUp, page: "donor-impact", accent: "#0ea5e9" },
    { label: "Notifications", icon: Bell, page: "notifications", accent: "#f59e0b" },
  ],
  ngo: [
    { label: "Browse Donations", icon: Package, page: "ngo-available", accent: "#16a34a" },
    { label: "Requirements", icon: CheckCircle2, page: "ngo-requirements", accent: "#0ea5e9" },
    { label: "Notifications", icon: Bell, page: "notifications", accent: "#f59e0b" },
  ],
  volunteer: [
    { label: "Find Deliveries", icon: Truck, page: "available-deliveries", accent: "#16a34a" },
    { label: "My Deliveries", icon: CheckCircle2, page: "my-deliveries", accent: "#0ea5e9" },
    { label: "Notifications", icon: Bell, page: "notifications", accent: "#f59e0b" },
  ],
  admin: [
    { label: "Verification", icon: Handshake, page: "admin-verify", accent: "#16a34a" },
    { label: "Analytics", icon: TrendingUp, page: "analytics", accent: "#0ea5e9" },
    { label: "Audit Logs", icon: Zap, page: "audit-logs", accent: "#f59e0b" },
  ],
};

const recentActivity: Record<Role, { icon: React.ElementType; text: string; time: string; color: string }[]> = {
  donor: [
    { icon: CheckCircle2, text: "DON-000124 delivered", time: "2h ago", color: "#16a34a" },
    { icon: Handshake, text: "Community Kitchen accepted", time: "5h ago", color: "#0ea5e9" },
    { icon: Package, text: "DON-000123 matched", time: "1d ago", color: "#8b5cf6" },
    { icon: Truck, text: "Volunteer assigned", time: "1d ago", color: "#f59e0b" },
  ],
  ngo: [
    { icon: Package, text: "12 new donations available", time: "Just now", color: "#16a34a" },
    { icon: Truck, text: "Pickup arriving in 18 min", time: "Live", color: "#f59e0b" },
    { icon: CheckCircle2, text: "DON-000122 delivered", time: "3h ago", color: "#16a34a" },
    { icon: Bell, text: "Requirement matched", time: "6h ago", color: "#0ea5e9" },
  ],
  volunteer: [
    { icon: CheckCircle2, text: "DEL-000085 completed", time: "2h ago", color: "#16a34a" },
    { icon: Truck, text: "New delivery nearby", time: "5 min ago", color: "#f59e0b" },
    { icon: TrendingUp, text: "Rating updated: 4.9★", time: "1d ago", color: "#8b5cf6" },
    { icon: Bell, text: "Pickup confirmed", time: "2d ago", color: "#0ea5e9" },
  ],
  admin: [
    { icon: Handshake, text: "Metro Food Bank pending", time: "1h ago", color: "#f59e0b" },
    { icon: CheckCircle2, text: "City Shelter verified", time: "3h ago", color: "#16a34a" },
    { icon: Zap, text: "API p99 latency: 42ms", time: "Live", color: "#0ea5e9" },
    { icon: Bell, text: "Login failure detected", time: "6h ago", color: "#f43f5e" },
  ],
};

const upcomingItems: Record<Role, { label: string; sub: string; time: string }[]> = {
  donor: [
    { label: "Bread & Pastries", sub: "Expiring soon", time: "Today 6PM" },
    { label: "Pickup window", sub: "DON-000125", time: "Aug 21 2PM" },
  ],
  ngo: [
    { label: "Grand Hotel pickup", sub: "120 portions", time: "Today 6PM" },
    { label: "Green Harvest", sub: "Fresh Produce", time: "Tomorrow 2PM" },
  ],
  volunteer: [
    { label: "DEL-000088 pickup", sub: "5.2 km away", time: "Today 5:30PM" },
    { label: "Available run", sub: "3 new nearby", time: "Now" },
  ],
  admin: [
    { label: "Verification review", sub: "3 pending", time: "Today" },
    { label: "Weekly report", sub: "Platform metrics", time: "Aug 21" },
  ],
};

function SectionToggle({
  label,
  open,
  onToggle,
  children,
  extra,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-1 mb-1.5 group"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <div className="flex items-center gap-1">
          {extra}
          {open
            ? <ChevronUp size={11} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            : <ChevronDown size={11} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RightPanel({ role, onNavigate }: RightPanelProps) {
  const actions = quickActions[role];
  const activity = recentActivity[role];
  const upcoming = upcomingItems[role];

  const [showActions, setShowActions] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="hidden xl:flex flex-col w-64 shrink-0 border-l border-border bg-card overflow-y-auto"
    >
      <div className="p-4 space-y-3">

        {/* Quick Actions — collapsed by default */}
        <SectionToggle label="Quick Actions" open={showActions} onToggle={() => setShowActions(v => !v)}>
          <div className="space-y-1 mb-1">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.button
                  key={i}
                  onClick={() => onNavigate(a.page)}
                  whileHover={{ x: 3, backgroundColor: "var(--muted)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors group"
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: `${a.accent}18` }}>
                    <Icon size={12} style={{ color: a.accent }} />
                  </div>
                  <span className="text-xs font-medium text-foreground">{a.label}</span>
                  <ArrowRight size={10} className="ml-auto text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              );
            })}
          </div>
        </SectionToggle>

        <Separator />

        {/* Upcoming — collapsed by default */}
        <SectionToggle label="Upcoming" open={showUpcoming} onToggle={() => setShowUpcoming(v => !v)}>
          <div className="space-y-2 mb-1">
            {upcoming.map((u, i) => (
              <div key={i} className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-muted/50">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={10} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">{u.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.sub}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 font-medium">{u.time}</span>
              </div>
            ))}
          </div>
        </SectionToggle>

        <Separator />

        {/* Activity — collapsed by default */}
        <SectionToggle
          label="Activity"
          open={showActivity}
          onToggle={() => setShowActivity(v => !v)}
          extra={
            <motion.button
              whileHover={{ x: 1 }}
              onClick={(e) => { e.stopPropagation(); onNavigate("notifications"); }}
              className="text-[10px] text-primary font-semibold hover:opacity-80 flex items-center gap-0.5 mr-1"
            >
              All <ArrowRight size={9} />
            </motion.button>
          }
        >
          <div className="space-y-1 mb-1">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${a.color}15` }}>
                    <Icon size={10} style={{ color: a.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-foreground leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionToggle>

        <Separator />

        {/* Platform Status — always visible */}
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-[11px] font-bold text-foreground">Platform Status</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Matching engine", val: "Online" },
              { label: "Notifications", val: "Online" },
              { label: "API", val: "99.99%" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
                <span className="text-[10px] font-semibold text-emerald-500">{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => onNavigate("notifications")}>
          <Bell size={11} className="mr-1.5" /> View all notifications
        </Button>

      </div>
    </motion.aside>
  );
}
