import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar,
} from "recharts";
import { Download, Leaf, UtensilsCrossed, Sprout, CheckCircle2, Zap, Truck, Timer, Star, BarChart2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton, SkeletonStatCard, SkeletonChartCard } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

const foodRescuedData = [
  { month: "Mar", kg: 18200 },
  { month: "Apr", kg: 22400 },
  { month: "May", kg: 19800 },
  { month: "Jun", kg: 28600 },
  { month: "Jul", kg: 34200 },
  { month: "Aug", kg: 31800 },
];

const categoryData = [
  { name: "Produce", value: 38, color: "#16a34a" },
  { name: "Prepared Meals", value: 22, color: "#0ea5e9" },
  { name: "Bakery", value: 15, color: "#f59e0b" },
  { name: "Dairy", value: 12, color: "#8b5cf6" },
  { name: "Canned/Packaged", value: 9, color: "#f43f5e" },
  { name: "Other", value: 4, color: "#94a3b8" },
];

const ngoPerformance = [
  { name: "Community Kitchen", accepted: 142, delivered: 138 },
  { name: "Hope Foundation", accepted: 98, delivered: 94 },
  { name: "City Shelter", accepted: 76, delivered: 71 },
  { name: "Faith Community", accepted: 64, delivered: 62 },
  { name: "Metro Food Bank", accepted: 48, delivered: 45 },
];

type MetricViz = "sparkbar" | "radial" | "gauge" | "inverse";
const metrics: { label: string; val: string; delta: string; Icon: React.ElementType; color: string; viz: MetricViz; pct?: number; sparkData?: { v: number }[] }[] = [
  { label: "Total Food Rescued",    val: "284,500 kg",    delta: "+12%",   Icon: Leaf,         color: "#16a34a", viz: "sparkbar",  sparkData: [{ v: 18200 }, { v: 22400 }, { v: 19800 }, { v: 28600 }, { v: 34200 }, { v: 31800 }] },
  { label: "Meals Distributed",     val: "~48,200",       delta: "+8%",    Icon: UtensilsCrossed, color: "#0ea5e9", viz: "sparkbar", sparkData: [{ v: 32000 }, { v: 36500 }, { v: 34100 }, { v: 41200 }, { v: 46800 }, { v: 48200 }] },
  { label: "Carbon Avoided",        val: "142 t CO₂",     delta: "+11%",   Icon: Sprout,       color: "#22c55e", viz: "radial",    pct: 71 },
  { label: "Donation Success Rate", val: "87%",           delta: "+2pp",   Icon: CheckCircle2, color: "#16a34a", viz: "radial",    pct: 87 },
  { label: "Avg. Matching Time",    val: "48 min",        delta: "−12%",   Icon: Zap,          color: "#f59e0b", viz: "gauge",     pct: 40 },
  { label: "Avg. Delivery Time",    val: "61 min",        delta: "−8%",    Icon: Truck,        color: "#8b5cf6", viz: "gauge",     pct: 51 },
  { label: "Expiration Rate",       val: "6.8%",          delta: "−1.2pp", Icon: Timer,        color: "#f43f5e", viz: "inverse",   pct: 7 },
  { label: "Volunteer Completion",  val: "96.2%",         delta: "+0.8pp", Icon: Star,         color: "#f59e0b", viz: "radial",    pct: 96 },
];

function Section({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  return (
    <div className="space-y-0">
      {/* ── Hero banner — matches app's bg-foreground pattern ── */}
      <div className="relative overflow-hidden bg-foreground px-4 py-6 sm:px-6 sm:py-8">
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
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-background/20 flex items-center justify-center">
                <Leaf size={12} className="text-background" />
              </div>
              <span className="text-background/60 text-xs font-medium">Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-background tracking-tight">Impact Analytics</h1>
            <p className="text-background/60 text-sm mt-1">Platform-wide metrics and environmental impact data.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-auto text-sm bg-background/10 text-background border-background/20 hover:bg-background/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <MotionButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="bg-background text-foreground hover:bg-background/90 font-semibold shadow-lg shadow-black/20 flex items-center gap-1.5">
              <Download size={14} /> Export
            </MotionButton>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-5 mt-6 pt-5 border-t border-background/15">
          {[{ label: "this month", val: "31,800 kg" }, { label: "CO₂ avoided", val: "142 t" }, { label: "success rate", val: "87%" }].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Sprout size={10} className="text-background/40" />
              <span className="text-background font-semibold text-sm">{s.val}</span>
              <span className="text-background/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* Top metrics */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      )}
      {!loading && <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
        {metrics.map((m, i) => {
          const Icon = m.Icon;
          const isPositive = m.delta.startsWith("+") || m.delta.startsWith("−") && m.viz === "inverse" || m.delta.startsWith("−") && (m.viz === "gauge");
          const deltaColor = (m.delta.startsWith("+") && m.viz !== "inverse") || (m.delta.startsWith("−") && (m.viz === "gauge" || m.viz === "inverse"))
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-500";
          return (
            <MotionCard
              key={i}
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } } }}
              whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}
              className="cursor-default min-w-0 overflow-hidden"
            >
              <CardContent className="p-4 flex flex-col gap-2">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}18` }}>
                    <Icon size={16} style={{ color: m.color }} />
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted ${deltaColor}`}>{m.delta}</span>
                </div>

                {/* Value + label */}
                <div>
                  <div className="text-lg font-bold tracking-tight text-foreground leading-tight">{m.val}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                </div>

                {/* Visualization */}
                {m.viz === "sparkbar" && m.sparkData && (
                  <div className="flex items-end gap-0.5 h-8 mt-1">
                    {m.sparkData.map((d, j) => {
                      const max = Math.max(...m.sparkData!.map(x => x.v));
                      const h = Math.round((d.v / max) * 100);
                      const isLast = j === m.sparkData!.length - 1;
                      return (
                        <motion.div key={j} className="flex-1 rounded-sm self-end"
                          style={{ height: `${h}%`, background: isLast ? m.color : `${m.color}40` }}
                          initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }}
                          transition={{ delay: 0.1 + j * 0.05, duration: 0.4, ease: "easeOut" }}
                        />
                      );
                    })}
                  </div>
                )}

                {m.viz === "radial" && m.pct !== undefined && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-10 h-10 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="60%" outerRadius="100%" startAngle={90} endAngle={90 - 360 * (m.pct / 100)} data={[{ value: m.pct }]}>
                          <RadialBar dataKey="value" fill={m.color} background={{ fill: "var(--muted)" }} cornerRadius={3} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: m.color }}
                        initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.06, ease: "easeOut" }} />
                    </div>
                  </div>
                )}

                {m.viz === "gauge" && m.pct !== undefined && (
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-[9px] text-muted-foreground"><span>Fast</span><span>Slow</span></div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: m.color }}
                        initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.06, ease: "easeOut" }} />
                    </div>
                  </div>
                )}

                {m.viz === "inverse" && m.pct !== undefined && (
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-[9px] text-muted-foreground"><span>Low (good)</span><span>High</span></div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: m.color }}
                        initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.06, ease: "easeOut" }} />
                    </div>
                  </div>
                )}
              </CardContent>
            </MotionCard>
          );
        })}
      </motion.div>}

      {/* Charts row 1 */}
      {loading && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><SkeletonChartCard /></div>
          <SkeletonChartCard />
        </div>
      )}
      {!loading && <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <Section delay={0.05} className="lg:col-span-2 min-w-0">
          <Card>
            <div className="p-5 pb-4">
              <CardTitle>Food Rescued Over Time</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Total kg rescued per month — platform-wide</p>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <div className="w-full h-52 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={foodRescuedData}>
                  <defs>
                    <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} formatter={(v) => [`${Number(v).toLocaleString()} kg`, "Food rescued"]} />
                  <Area type="monotone" dataKey="kg" stroke="#16a34a" strokeWidth={2.5} fill="url(#impactGrad)" dot={{ r: 3, fill: "#16a34a" }} />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section delay={0.1} className="min-w-0">
          <Card className="overflow-hidden">
            <div className="p-5 pb-4">
              <CardTitle>Donations by Category</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Share of food rescued by type</p>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <div className="w-full h-40 sm:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={68} dataKey="value" strokeWidth={0}>
                    {categoryData.map((_, i) => <Cell key={i} fill={categoryData[i].color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }} formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((d, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-mono-data text-foreground">{d.value}%</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>}

      {/* Charts row 2 */}
      {loading && (
        <div className="grid lg:grid-cols-2 gap-5">
          <SkeletonChartCard />
          <SkeletonChartCard />
        </div>
      )}
      {!loading && <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <Section delay={0.08} className="min-w-0">
          <Card>
            <div className="p-5 pb-4">
              <CardTitle>NGO Performance</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Accepted vs delivered donations — top 5 NGOs</p>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <div className="w-full h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ngoPerformance} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={100} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Bar dataKey="accepted" fill="#94a3b8" radius={[0, 4, 4, 0]} name="Accepted" />
                  <Bar dataKey="delivered" fill="#1E5C25" radius={[0, 4, 4, 0]} name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-2 bg-slate-200 dark:bg-slate-600 rounded" />Accepted
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-2 bg-primary rounded" />Delivered
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section delay={0.1} className="min-w-0">
          <Card className="overflow-hidden">
            <div className="p-5 pb-4">
              <CardTitle>Environmental Impact</CardTitle>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <div className="space-y-5">
                {[
                  { label: "CO₂ emissions avoided", val: "142 tonnes", pct: 71, color: "#16a34a", sub: "Equivalent to 61 cars off the road for a year" },
                  { label: "Food waste diverted from landfill", val: "284,500 kg", pct: 85, color: "#0ea5e9", sub: "vs. same period last year" },
                  { label: "Water saved (embedded)", val: "~2.8M liters", pct: 60, color: "#8b5cf6", sub: "Estimated based on food categories rescued" },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">{m.label}</span>
                      <span className="font-semibold tracking-tight text-foreground">{m.val}</span>
                    </div>
                    <div className="progress-bar mb-1">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                        style={{ background: m.color }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.sub}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>}
    </div>
    </div>
  );
}
