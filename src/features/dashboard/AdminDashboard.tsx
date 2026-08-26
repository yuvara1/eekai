import { useRef, useState, useEffect } from "react";
import { useNav } from "@/hooks/useNav";
import { motion, useInView } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { Users, Building2, Package, Truck, ShieldCheck, Search, Filter, CheckCircle, XCircle, AlertCircle, ArrowRight, Handshake, Settings2, Leaf, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/TextEffects";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SkeletonStatCard, SkeletonChartCard, SkeletonTableRow } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const MotionCard = motion.create(Card);
const MotionTableRow = motion.create(TableRow);

const platformTrend = [
  { week: "W30", donations: 42, deliveries: 38 },
  { week: "W31", donations: 58, deliveries: 51 },
  { week: "W32", donations: 49, deliveries: 44 },
  { week: "W33", donations: 74, deliveries: 68 },
  { week: "W34", donations: 61, deliveries: 55 },
];

const users = [
  { name: "Sarah Chen",   org: "Green Harvest Co.",   role: "DONOR_ADMIN",  status: "active",  created: "Aug 1",  last: "2h ago" },
  { name: "James Okafor", org: "Community Kitchen",   role: "NGO_ADMIN",    status: "active",  created: "Jul 22", last: "4h ago" },
  { name: "Alex Rivera",  org: "Independent",          role: "VOLUNTEER",    status: "active",  created: "Jul 15", last: "Just now" },
  { name: "Priya Patel",  org: "Hope Foundation",      role: "NGO_STAFF",    status: "pending", created: "Aug 18", last: "1d ago" },
  { name: "Marcus Lee",   org: "City Bakehouse",       role: "DONOR_STAFF",  status: "active",  created: "Jun 30", last: "3h ago" },
];

const pendingVerifications = [
  { org: "Metro Food Bank",      type: "NGO",       submitted: "Aug 18", docs: 3, reviewer: "Unassigned" },
  { org: "Fresh Start Catering", type: "Donor",     submitted: "Aug 17", docs: 2, reviewer: "Platform Admin" },
  { org: "David Kim",            type: "Volunteer", submitted: "Aug 19", docs: 1, reviewer: "Unassigned" },
];

const auditLogs = [
  { ts: "2026-08-20 14:32", user: "admin@foodbridge.io",    role: "PLATFORM_ADMIN", action: "org.approve",      resource: "Organization", id: "ORG-00042",   result: "success" },
  { ts: "2026-08-20 13:15", user: "sarah@greenharvest.org", role: "DONOR_ADMIN",    action: "donation.publish", resource: "Donation",     id: "DON-000125",  result: "success" },
  { ts: "2026-08-20 12:48", user: "admin@foodbridge.io",    role: "PLATFORM_ADMIN", action: "user.suspend",     resource: "User",         id: "USR-00318",   result: "success" },
  { ts: "2026-08-20 11:20", user: "alex@email.com",         role: "VOLUNTEER",      action: "delivery.complete",resource: "Delivery",     id: "DEL-000085",  result: "success" },
  { ts: "2026-08-20 10:05", user: "priya@hope.org",         role: "NGO_STAFF",      action: "donation.accept",  resource: "Donation",     id: "DON-000122",  result: "success" },
];

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

const sparkUsers = [{ v: 2680 }, { v: 2714 }, { v: 2751 }, { v: 2783 }, { v: 2809 }, { v: 2847 }];
const sparkDonations = [{ v: 44 }, { v: 58 }, { v: 49 }, { v: 71 }, { v: 55 }, { v: 61 }];

const topStats = [
  {
    label: "Total Users", val: 2847, sub: "+38 this week",
    icon: <Users size={18} />, gradient: "stat-gradient-sky",
    viz: "area", data: sparkUsers,
  },
  {
    label: "Active Organizations", val: 284, sub: "138 NGOs · 146 Donors",
    icon: <Building2 size={18} />, gradient: "stat-gradient-violet",
    viz: "split", segments: [
      { label: "NGOs", count: 138, pct: 49 },
      { label: "Donors", count: 146, pct: 51 },
    ],
  },
  {
    label: "Active Donations", val: 61, sub: "3 expiring soon",
    icon: <Package size={18} />, gradient: "stat-gradient-amber",
    viz: "spark", data: sparkDonations,
  },
  {
    label: "Active Deliveries", val: 14, sub: "2 delayed",
    icon: <Truck size={18} />, gradient: "stat-gradient-rose",
    viz: "status", ok: 12, warn: 2,
  },
];

const verificationIcons: Record<string, React.ElementType> = {
  NGO: Handshake,
  Donor: Building2,
  Volunteer: Truck,
};

export default function AdminDashboard() {
  const navigate = useNav();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t); }, []);
  return (
    <div className="space-y-0">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-foreground px-6 py-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -inset-8"
            style={{
              backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--background) 40%, transparent) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
            animate={{ x: [0, 28], y: [0, 28] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-background/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-background/20 flex items-center justify-center">
                <ShieldCheck size={12} className="text-background" />
              </div>
              <span className="text-background/60 text-xs font-medium">Platform Admin</span>
            </div>
            <h1 className="text-2xl font-bold text-background tracking-tight">Admin Dashboard</h1>
            <p className="text-background/60 text-sm mt-1">
              <span className="text-background font-semibold">3 pending verifications</span> require your attention.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button onClick={() => navigate("admin-donations")} className="bg-background text-foreground hover:bg-background/90 font-semibold shadow-lg shadow-black/20 gap-1.5">
                <Settings2 size={14} /> System Monitor
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-5 mt-6 pt-5 border-t border-background/15">
          {[{ label: "uptime", val: "99.99%" }, { label: "orgs verified", val: "284" }, { label: "today's rescues", val: "1,240 kg" }].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <TrendingUp size={10} className="text-background/40" />
              <span className="text-background font-semibold text-sm">{s.val}</span>
              <span className="text-background/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview stats */}
        
      {loading && (
        <div className="flex items-center gap-2 px-1 py-2 text-xs text-muted-foreground">
          <Spinner className="size-3 text-muted-foreground" />
          <span>Loading…</span>
        </div>
      )}
      {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
        ) : (
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          {topStats.map((s, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 24, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } }}
              whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
              className={`${s.gradient} rounded-xl p-4 text-white shadow-sm cursor-default flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">{s.icon}</span>
                <span className="text-white/50 text-[10px] font-mono">{s.sub}</span>
              </div>

              {/* Value */}
              <div className="text-2xl font-bold tracking-tight text-white leading-none">
                <AnimatedCounter target={s.val} />
              </div>
              <div className="text-white/75 text-xs mt-0.5 mb-2">{s.label}</div>

              {/* Viz */}
              {s.viz === "area" && s.data && (
                <div className="mt-auto h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={s.data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <defs>
                        <linearGradient id={`ag${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="rgba(255,255,255,0.85)" strokeWidth={2} fill={`url(#ag${i})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {s.viz === "spark" && s.data && (
                <div className="mt-auto h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <Line type="monotone" dataKey="v" stroke="rgba(255,255,255,0.85)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {s.viz === "split" && s.segments && (
                <div className="mt-auto space-y-1.5">
                  {/* stacked proportion bar */}
                  <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                    {s.segments.map((seg, j) => (
                      <motion.div
                        key={j}
                        className="h-full rounded-full"
                        style={{ background: j === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}
                        initial={{ flex: 0 }}
                        animate={{ flex: seg.pct }}
                        transition={{ duration: 0.8, delay: i * 0.08 + j * 0.1, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    {s.segments.map((seg, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: j === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }} />
                        <span className="text-white/70 text-[10px]">{seg.count} {seg.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {s.viz === "status" && (
                <div className="mt-auto space-y-1.5">
                  <div className="flex gap-1">
                    {[...Array(s.ok! + s.warn!)].map((_, j) => (
                      <motion.div
                        key={j}
                        className={`h-1.5 flex-1 rounded-full ${j < s.ok! ? "bg-white/80" : "bg-white/30"}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.08 + j * 0.04, duration: 0.3, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/65 text-[10px]">{s.ok} on track</span>
                    <div className="flex items-center gap-1">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-white/90" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                      <span className="text-white/65 text-[10px]">{s.warn} delayed</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* Platform metrics */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonChartCard key={i} />)}
          </div>
        ) : (
        <motion.div className="grid grid-cols-3 gap-4" initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>

          {/* Food Rescued — monthly area trend */}
          <MotionCard
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Platform Food Rescued</div>
              <div className="text-xl font-bold tracking-tight text-foreground">284,500 kg</div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ +12%</span>
                <span className="text-[10px] text-muted-foreground">this month</span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{m:"Mar",v:18200},{m:"Apr",v:22800},{m:"May",v:19600},{m:"Jun",v:28400},{m:"Jul",v:34100},{m:"Aug",v:38200}]} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                      <linearGradient id="rfg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <Area type="monotone" dataKey="v" stroke="var(--foreground)" strokeWidth={2} fill="url(#rfg)" dot={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }} formatter={(v: number) => [`${(v/1000).toFixed(1)}K kg`]} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </MotionCard>

          {/* Matching Success Rate — radial arc + bar */}
          <MotionCard
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <CardContent className="p-4 flex flex-col">
              <div className="text-xs text-muted-foreground mb-1">Matching Success Rate</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-16 h-16 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="62%" outerRadius="100%" startAngle={90} endAngle={90 - 360 * 0.914} data={[{ value: 91.4 }]}>
                      <RadialBar dataKey="value" fill="var(--foreground)" background={{ fill: "var(--muted)" }} cornerRadius={4} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold tracking-tight text-foreground">91.4%</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↑ +2.1%</span>
                    <span className="text-[10px] text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {[{ label: "Matched", pct: 91 }, { label: "Unmatched", pct: 9 }].map((r, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-16 shrink-0">{r.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.9, delay: 0.2 + j * 0.1, ease: "easeOut" }} />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground w-6 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </MotionCard>

          {/* Avg. Matching Time — gauge bar + trend dots */}
          <MotionCard
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Avg. Matching Time</div>
              <div className="text-2xl font-bold tracking-tight text-foreground">48 min</div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">↓ −6 min</span>
                <span className="text-[10px] text-muted-foreground">vs last month</span>
              </div>
              {/* Speed gauge: 0 = fast (good), 120 = slow. 48/120 = 40% */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>Fast</span><span>Slow</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(to right, var(--foreground) 0%, color-mix(in srgb, var(--foreground) 50%, transparent) 100%)" }}
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
                  />
                </div>
              </div>
              {/* Weekly trend dots */}
              <div className="flex items-end gap-1 h-8">
                {[54, 61, 58, 52, 49, 48].map((v, j) => (
                  <motion.div
                    key={j}
                    className="flex-1 rounded-sm bg-foreground/70"
                    style={{ height: `${(v / 61) * 100}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 + j * 0.06, duration: 0.4, ease: "easeOut" }}
                  />
                ))}
              </div>
              <div className="text-[9px] text-muted-foreground mt-1 text-center">6-week trend (min)</div>
            </CardContent>
          </MotionCard>

        </motion.div>
        )}

        {/* Chart */}
        <Section delay={0.05}>
          <Card>
            <div className="p-5 pb-4 flex items-center justify-between">
              <div>
                <CardTitle>Platform Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Weekly donations vs deliveries</p>
              </div>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={platformTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }} />
                  <Line type="monotone" dataKey="donations" stroke="var(--foreground)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--foreground)" }} name="Donations" />
                  <Line type="monotone" dataKey="deliveries" stroke="var(--muted-foreground)" strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 3, fill: "var(--muted-foreground)" }} name="Deliveries" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-0.5 bg-foreground rounded" />Donations
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-0.5 bg-muted-foreground rounded" />Deliveries
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Verification queue */}
        <Section delay={0.08}>
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-foreground" />
                <CardTitle>Pending Verification</CardTitle>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.3 }}
                  className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-semibold flex items-center justify-center"
                >
                  3
                </motion.span>
              </div>
            </div>
            <CardContent className="p-0 divide-y divide-border">
              {pendingVerifications.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  whileHover={{ backgroundColor: "var(--muted)" }}
                  className="p-4 flex items-center gap-4 transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    {(() => { const Icon = verificationIcons[v.type] ?? Leaf; return <Icon size={18} className="text-muted-foreground" />; })()}
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-foreground">{v.org}</div>
                    <div className="text-xs text-muted-foreground">{v.type} · Submitted {v.submitted} · {v.docs} document{v.docs > 1 ? "s" : ""}</div>
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{v.reviewer}</div>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button size="sm" className="flex items-center gap-1 text-xs h-7">
                        <CheckCircle size={12} /> Approve
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs h-7 border-foreground/30">
                        <XCircle size={12} /> Reject
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs h-7">
                        <AlertCircle size={12} /> Request info
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </Section>

        {/* Users table */}
        <Section delay={0.1}>
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <CardTitle>User Management</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search users..." className="pl-8 h-8 text-xs w-40" />
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs h-8">
                  <Filter size={12} /> Filter
                </Button>
              </div>
            </div>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonTableRow key={i} columns={[
                          { w: "w-32" }, { w: "w-36" }, { w: "w-20", pill: true },
                          { w: "w-16", pill: true }, { w: "w-20" }, { w: "w-24" }, { w: "w-16" },
                        ]} />
                      ))
                    : users.map((u, i) => (
                    <MotionTableRow key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <motion.div whileHover={{ scale: 1.15 }} className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-background text-[11px] font-semibold cursor-default">
                            {u.name.split(" ").map(n => n[0]).join("")}
                          </motion.div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{u.org}</TableCell>
                      <TableCell><span className="font-mono-data text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">{u.role}</span></TableCell>
                      <TableCell><span className={`badge ${u.status === "active" ? "badge-active" : "badge-pending"}`}>{u.status}</span></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.created}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.last}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <motion.button whileHover={{ scale: 1.05 }} className="text-xs text-primary font-semibold hover:opacity-70">Edit</motion.button>
                          <span className="text-border">·</span>
                          <motion.button whileHover={{ scale: 1.05 }} className="text-xs text-muted-foreground font-semibold hover:text-foreground">Suspend</motion.button>
                        </div>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Section>

        {/* Audit logs */}
        <Section delay={0.12}>
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <CardTitle>Audit Logs</CardTitle>
              <motion.button whileHover={{ x: 2 }} onClick={() => navigate("audit-logs")} className="text-sm text-primary font-semibold hover:opacity-70 flex items-center gap-1">
                Full log <ArrowRight size={13} />
              </motion.button>
            </div>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((l, i) => (
                    <MotionTableRow key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
                      <TableCell className="font-mono-data text-[10px] text-muted-foreground">{l.ts}</TableCell>
                      <TableCell className="text-xs text-foreground">{l.user}</TableCell>
                      <TableCell><span className="font-mono-data text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{l.role}</span></TableCell>
                      <TableCell><span className="font-mono-data text-[10px] text-foreground">{l.action}</span></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.resource}</TableCell>
                      <TableCell className="font-mono-data text-[10px] text-muted-foreground">{l.id}</TableCell>
                      <TableCell><span className="badge badge-delivered">{l.result}</span></TableCell>
                    </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Section>
      </div>
    </div>
  );
}
