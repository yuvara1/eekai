import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Package, Truck, Handshake, Bell, ArrowRight, TrendingUp, Zap, Calendar, ChevronDown, ChevronUp } from "lucide-react";
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
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
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
      className="hidden xl:flex flex-col w-64 shrink-0 border-l border-border bg-card h-full overflow-y-auto"
    >
      <div className="p-4 space-y-3">

        {/* Quick Actions — collapsed by default */}
        <SectionToggle label="Quick Actions" open={showActions} onToggle={() => setShowActions(v => !v)}>
          <div className="space-y-1 pb-1">
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
          <div className="space-y-2 pb-1">
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
          <div className="space-y-1 pb-1">
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

        {/* Platform Status — always visible, plain div (no Card overflow-hidden) */}
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 mb-3">
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

        {/* ── Impact animation ── */}
        <FoodImpactScene />

      </div>
    </motion.aside>
  );
}

function FoodImpactScene() {
  return (
    <div className="rounded-xl border border-border bg-muted/20 overflow-hidden p-3 pt-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2.5 px-0.5">Community Impact</p>

      {/* SVG scene */}
      <div className="relative w-full" style={{ height: 96 }}>
        <svg viewBox="0 0 220 96" className="w-full h-full" style={{ overflow: "visible" }}>

          {/* Ground line */}
          <line x1="8" y1="82" x2="212" y2="82" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />

          {/* ── Store / Donor building ── */}
          <rect x="8" y="52" width="34" height="30" rx="2" fill="var(--muted)" stroke="var(--border)" strokeWidth="1" />
          <rect x="17" y="62" width="8" height="10" rx="1" fill="var(--background)" />
          <rect x="28" y="58" width="10" height="14" rx="1" fill="var(--background)" />
          {/* Roof */}
          <path d="M5 54 L25 40 L45 54" fill="var(--muted)" stroke="var(--border)" strokeWidth="1" strokeLinejoin="round" />
          {/* Sign */}
          <rect x="10" y="44" width="14" height="5" rx="1" fill="#16a34a" opacity="0.8" />

          {/* ── People / Recipients ── */}
          {/* Person 1 */}
          <circle cx="188" cy="62" r="5" fill="var(--muted-foreground)" opacity="0.7" />
          <path d="M183 82 Q188 68 193 82" fill="var(--muted-foreground)" opacity="0.7" />
          {/* Person 2 */}
          <circle cx="200" cy="64" r="4" fill="var(--muted-foreground)" opacity="0.5" />
          <path d="M196 82 Q200 70 204 82" fill="var(--muted-foreground)" opacity="0.5" />
          {/* Person 3 — child */}
          <circle cx="210" cy="67" r="3" fill="var(--muted-foreground)" opacity="0.35" />
          <path d="M207 82 Q210 72 213 82" fill="var(--muted-foreground)" opacity="0.35" />

          {/* ── Animated truck ── */}
          <motion.g
            animate={{ x: [0, 130, 130, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 0.55, 1] }}
          >
            {/* Truck body */}
            <rect x="50" y="64" width="30" height="18" rx="2" fill="#0ea5e9" opacity="0.85" />
            {/* Cab */}
            <rect x="78" y="68" width="14" height="14" rx="2" fill="#0284c7" opacity="0.9" />
            {/* Window */}
            <rect x="80" y="70" width="8" height="6" rx="1" fill="var(--background)" opacity="0.6" />
            {/* Wheels */}
            <motion.circle cx="60" cy="83" r="4" fill="var(--muted-foreground)" opacity="0.7"
              animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} />
            <motion.circle cx="84" cy="83" r="4" fill="var(--muted-foreground)" opacity="0.7"
              animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} />
            {/* Food box on truck */}
            <rect x="54" y="57" width="12" height="9" rx="1.5" fill="#16a34a" opacity="0.9" />
            <line x1="54" y1="61" x2="66" y2="61" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <line x1="60" y1="57" x2="60" y2="66" stroke="white" strokeWidth="0.8" opacity="0.6" />
          </motion.g>

          {/* ── Floating food particles emitted from store ── */}
          {[0, 1, 2].map((i) => (
            <motion.g key={i}
              animate={{ x: [0, 18, 36], y: [0, -8, -4], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
            >
              <rect x={20 + i * 4} y={46} width="5" height="5" rx="1" fill="#16a34a" opacity="0.6" />
            </motion.g>
          ))}

          {/* ── Heart delivered to people ── */}
          <motion.g
            animate={{ opacity: [0, 1, 1, 0], y: [0, -6, -10, -16], scale: [0.6, 1, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2.2, ease: "easeOut" }}
            style={{ transformOrigin: "190px 50px" }}
          >
            <path d="M190 55 C190 52 186 49 184 52 C182 49 178 52 178 55 C178 60 184 64 184 64 C184 64 190 60 190 55Z"
              fill="#f43f5e" opacity="0.8" transform="translate(3,0) scale(0.7)" />
          </motion.g>

          {/* ── Sparkles near recipients ── */}
          {[0, 1].map((i) => (
            <motion.circle key={i} cx={175 + i * 12} cy={52 + i * 6} r="1.5"
              fill="#f59e0b"
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 2.4 + i * 0.5, ease: "easeOut" }}
            />
          ))}
        </svg>
      </div>

      {/* Stats strip */}
      <div className="flex items-center justify-between mt-2.5 px-0.5">
        {[
          { val: "284K", label: "kg rescued" },
          { val: "48K",  label: "meals" },
          { val: "96%",  label: "delivered" },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="text-center"
          >
            <p className="text-[11px] font-bold text-foreground leading-none">{s.val}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
