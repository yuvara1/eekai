import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SkeletonListItem } from "@/components/ui/skeleton";
import { Clock, CheckCircle2, Package, Truck, Handshake, Bell, ArrowRight, TrendingUp, Zap, Calendar, Leaf, Users, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";

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
    { icon: Star, text: "You earned Gold Donor badge", time: "2d ago", color: "#f59e0b" },
    { icon: Leaf, text: "42 kg food prevented waste", time: "3d ago", color: "#16a34a" },
    { icon: Bell, text: "DON-000122 pickup confirmed", time: "4d ago", color: "#0ea5e9" },
  ],
  ngo: [
    { icon: Package, text: "12 new donations available", time: "Just now", color: "#16a34a" },
    { icon: Truck, text: "Pickup arriving in 18 min", time: "Live", color: "#f59e0b" },
    { icon: CheckCircle2, text: "DON-000122 delivered", time: "3h ago", color: "#16a34a" },
    { icon: Bell, text: "Requirement matched", time: "6h ago", color: "#0ea5e9" },
    { icon: Handshake, text: "New donor partnership", time: "1d ago", color: "#8b5cf6" },
    { icon: Star, text: "Monthly goal reached: 500 kg", time: "2d ago", color: "#f59e0b" },
    { icon: Package, text: "DON-000119 surplus accepted", time: "3d ago", color: "#16a34a" },
  ],
  volunteer: [
    { icon: CheckCircle2, text: "DEL-000085 completed", time: "2h ago", color: "#16a34a" },
    { icon: Truck, text: "New delivery nearby", time: "5 min ago", color: "#f59e0b" },
    { icon: TrendingUp, text: "Rating updated: 4.9★", time: "1d ago", color: "#8b5cf6" },
    { icon: Bell, text: "Pickup confirmed", time: "2d ago", color: "#0ea5e9" },
    { icon: CheckCircle2, text: "DEL-000083 delivered on time", time: "2d ago", color: "#16a34a" },
    { icon: Star, text: "Top Volunteer badge earned", time: "3d ago", color: "#f59e0b" },
    { icon: Truck, text: "DEL-000080 route optimised", time: "4d ago", color: "#8b5cf6" },
  ],
  admin: [
    { icon: Handshake, text: "Metro Food Bank pending", time: "1h ago", color: "#f59e0b" },
    { icon: CheckCircle2, text: "City Shelter verified", time: "3h ago", color: "#16a34a" },
    { icon: Zap, text: "API p99 latency: 42ms", time: "Live", color: "#0ea5e9" },
    { icon: Bell, text: "Login failure detected", time: "6h ago", color: "#f43f5e" },
    { icon: ShieldCheck, text: "Hope Foundation approved", time: "1d ago", color: "#16a34a" },
    { icon: TrendingUp, text: "Platform matched 200 donations", time: "2d ago", color: "#8b5cf6" },
    { icon: Zap, text: "Scheduled maintenance done", time: "3d ago", color: "#0ea5e9" },
  ],
};

const insightStats: Record<Role, { icon: React.ElementType; label: string; value: string; color: string }[]> = {
  donor: [
    { icon: Leaf,       label: "Food rescued",    value: "8.4K kg",  color: "#16a34a" },
    { icon: Users,      label: "People fed",      value: "28.1K",    color: "#0ea5e9" },
    { icon: TrendingUp, label: "CO₂ saved",       value: "3.2 t",    color: "#8b5cf6" },
    { icon: Star,       label: "Donor score",     value: "4.9 / 5",  color: "#f59e0b" },
    { icon: Package,    label: "Donations made",  value: "62",       color: "#16a34a" },
    { icon: Clock,      label: "Avg. pickup time", value: "24 min",  color: "#0ea5e9" },
  ],
  ngo: [
    { icon: Package,    label: "Accepted",        value: "342 kg",   color: "#16a34a" },
    { icon: Users,      label: "Beneficiaries",   value: "1,240",    color: "#0ea5e9" },
    { icon: Truck,      label: "Pickups done",    value: "58",       color: "#8b5cf6" },
    { icon: Star,       label: "NGO rating",      value: "4.8 / 5",  color: "#f59e0b" },
    { icon: Leaf,       label: "Waste prevented", value: "1.1 t",    color: "#16a34a" },
    { icon: Clock,      label: "Avg. lead time",  value: "31 min",   color: "#0ea5e9" },
  ],
  volunteer: [
    { icon: Truck,      label: "Deliveries",      value: "134",      color: "#16a34a" },
    { icon: Leaf,       label: "Food moved",      value: "5.6K kg",  color: "#0ea5e9" },
    { icon: Clock,      label: "Hours given",     value: "62 hrs",   color: "#8b5cf6" },
    { icon: Star,       label: "Rating",          value: "4.9 / 5",  color: "#f59e0b" },
    { icon: TrendingUp, label: "On-time rate",    value: "98%",      color: "#16a34a" },
    { icon: Users,      label: "People helped",   value: "9.4K",     color: "#0ea5e9" },
  ],
  admin: [
    { icon: ShieldCheck, label: "Verified orgs",  value: "148",      color: "#16a34a" },
    { icon: Package,     label: "Donations",      value: "3.2K",     color: "#0ea5e9" },
    { icon: Truck,       label: "Deliveries",     value: "2.8K",     color: "#8b5cf6" },
    { icon: Zap,         label: "Uptime",         value: "99.99%",   color: "#f59e0b" },
    { icon: Users,       label: "Active users",   value: "4,210",    color: "#16a34a" },
    { icon: TrendingUp,  label: "Match rate",     value: "94.2%",    color: "#0ea5e9" },
  ],
};

const upcomingItems: Record<Role, { label: string; sub: string; time: string }[]> = {
  donor: [
    { label: "Bread & Pastries", sub: "Expiring soon", time: "Today 6PM" },
    { label: "Pickup window", sub: "DON-000125", time: "Aug 21 2PM" },
    { label: "Cooked Meals — 40 srv", sub: "Ready for pickup", time: "Aug 22 12PM" },
    { label: "DON-000126 scheduled", sub: "Fresh Vegetables", time: "Aug 23 10AM" },
    { label: "Restaurant surplus", sub: "Pending acceptance", time: "Aug 24 8PM" },
  ],
  ngo: [
    { label: "Grand Hotel pickup", sub: "120 portions", time: "Today 6PM" },
    { label: "Green Harvest", sub: "Fresh Produce", time: "Tomorrow 2PM" },
    { label: "City Bakery batch", sub: "48 loaves", time: "Aug 22 8AM" },
    { label: "DON-000130 arriving", sub: "Dairy & Eggs", time: "Aug 23 11AM" },
    { label: "Monthly review call", sub: "Platform team", time: "Aug 25 3PM" },
  ],
  volunteer: [
    { label: "DEL-000088 pickup", sub: "5.2 km away", time: "Today 5:30PM" },
    { label: "Available run", sub: "3 new nearby", time: "Now" },
    { label: "DEL-000091 assigned", sub: "Grand Hotel → Shelter", time: "Aug 22 7AM" },
    { label: "Community Kitchen run", sub: "8.1 km away", time: "Aug 23 9AM" },
    { label: "Weekend drive", sub: "4 stops planned", time: "Aug 24 10AM" },
  ],
  admin: [
    { label: "Verification review", sub: "3 pending", time: "Today" },
    { label: "Weekly report", sub: "Platform metrics", time: "Aug 21" },
    { label: "Metro Food Bank audit", sub: "Compliance check", time: "Aug 22" },
    { label: "New NGO onboarding", sub: "Hope Foundation", time: "Aug 23 2PM" },
    { label: "Quarterly board sync", sub: "Exec summary", time: "Aug 25 10AM" },
  ],
};

export default function RightPanel({ role, onNavigate }: RightPanelProps) {
  const actions = quickActions[role];
  const activity = recentActivity[role];
  const upcoming = upcomingItems[role];
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, [role]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full border-l border-border bg-card h-full overflow-hidden"
    >
      {/* Quick Actions — fixed, never resizable */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2 px-1">Quick Actions</p>
        <div className="space-y-1">
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
      </div>

      <ResizablePanelGroup direction="vertical" className="flex-1 min-h-0">

        {/* Upcoming */}
        <ResizablePanel defaultSize={18} minSize={14} style={{ overflow: "hidden" }}>
          <div className="h-full flex flex-col">
            <div className="shrink-0 flex items-center gap-1.5 px-4 pt-3 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Upcoming</p>
              {loading && <Spinner className="size-3 text-muted-foreground/60" />}
            </div>
            <div className="flex-1 overflow-y-auto scroll-hide px-4 pb-3 space-y-2">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonListItem key={i} />)
                : upcoming.map((u, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-muted/50">
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar size={10} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate leading-tight">{u.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.sub}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 font-medium">{u.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Activity */}
        <ResizablePanel defaultSize={24} minSize={16} style={{ overflow: "hidden" }}>
          <div className="h-full flex flex-col">
            <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Activity</p>
              <motion.button whileHover={{ x: 1 }} onClick={() => onNavigate("notifications")} className="text-[10px] text-primary font-semibold hover:opacity-80 flex items-center gap-0.5">
                All <ArrowRight size={9} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto scroll-hide px-4 pb-3 space-y-1">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonListItem key={i} />)
                : activity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                    className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${a.color}15` }}>
                      <Icon size={10} style={{ color: a.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-foreground leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Your Stats */}
        <ResizablePanel defaultSize={20} minSize={16} style={{ overflow: "hidden" }}>
          <div className="h-full flex flex-col">
            <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground px-4 pt-3 pb-2">Your Stats</p>
            <div className="flex-1 overflow-y-auto scroll-hide px-4 pb-3">
              <div className="grid grid-cols-2 gap-1.5">
                {insightStats[role].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex flex-col gap-1 px-2.5 py-2.5 rounded-xl bg-muted/50"
                    >
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${s.color}18` }}>
                        <Icon size={11} style={{ color: s.color }} />
                      </div>
                      <p className="text-[13px] font-bold text-foreground leading-none">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground leading-none">{s.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </ResizablePanel>


      </ResizablePanelGroup>

      {/* Platform Status — fixed, never resizable */}

      <div className="shrink-0 border-t border-border px-4 py-3 flex flex-col gap-3">
        <Card className="border-border shadow-none">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-1.5">
            {[
              { label: "Matching engine", val: "Online" },
              { label: "Notifications", val: "Online" },
              { label: "API", val: "99.99%" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{s.val}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => onNavigate("notifications")}>
          <Bell size={11} className="mr-1.5" /> View all notifications
        </Button>
      </div>
    </motion.aside>
  );
}
