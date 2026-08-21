import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Download, Share2, Leaf, Utensils, CheckCircle, HandHeart, Wind, Target, Trophy, Zap, Globe, Star } from "lucide-react";
import { AnimatedCounter } from "../components/ui/TextEffects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const monthlyData = [
  { month: "Mar", kg: 520, meals: 884 },
  { month: "Apr", kg: 840, meals: 1428 },
  { month: "May", kg: 680, meals: 1156 },
  { month: "Jun", kg: 1200, meals: 2040 },
  { month: "Jul", kg: 1560, meals: 2652 },
  { month: "Aug", kg: 1400, meals: 2380 },
];

const milestones = [
  { Icon: Target, label: "First donation", date: "Mar 4, 2026", done: true },
  { Icon: Trophy, label: "100 kg rescued", date: "Mar 28, 2026", done: true },
  { Icon: Star, label: "First NGO match", date: "Apr 2, 2026", done: true },
  { Icon: Zap, label: "1,000 kg milestone", date: "May 14, 2026", done: true },
  { Icon: HandHeart, label: "5,000 meals contributed", date: "Jun 30, 2026", done: true },
  { Icon: Globe, label: "10,000 kg rescued", date: "Coming soon", done: false },
];

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function DonorImpact() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold tracking-tight text-xl text-foreground">Your Impact</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Green Harvest Co. · March – August 2026</p>
        </div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 size={13} /> Share
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(30,92,37,0.3)" }} whileTap={{ scale: 0.97 }}>
            <Button size="sm" className="flex items-center gap-2">
              <Download size={13} /> Export Report
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Hero metrics */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-4" initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        {[
          { label: "Food Rescued", val: 8400, suffix: " kg", Icon: Leaf, gradient: "stat-gradient-green" },
          { label: "Meals Contributed", val: 14280, suffix: "", Icon: Utensils, gradient: "stat-gradient-sky" },
          { label: "Donations Completed", val: 108, suffix: "", Icon: CheckCircle, gradient: "stat-gradient-violet" },
          { label: "Orgs Supported", val: 12, suffix: "", Icon: HandHeart, gradient: "stat-gradient-amber" },
          { label: "CO₂ Avoided", val: 42, suffix: " t", Icon: Wind, gradient: "stat-gradient-rose" },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 24, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}
            className={`${s.gradient} rounded-xl p-4 text-white shadow-sm cursor-default`}
          >
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center mb-3">
              <s.Icon size={14} className="text-white" />
            </div>
            <div className="font-serif font-semibold italic text-2xl mb-0.5 leading-none" style={{ fontVariationSettings: "'opsz' 40, 'wght' 600" }}>
              <AnimatedCounter target={s.val} suffix={s.suffix} />
            </div>
            <div className="text-white/80 text-xs">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <Section delay={0.05}>
        <Card>
          <CardHeader>
            <CardTitle>Impact Over Time</CardTitle>
            <CardDescription>Food rescued (kg) and estimated meals contributed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="kgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E5C25" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1E5C25" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mealsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="kg" name="Food rescued (kg)" stroke="#1E5C25" strokeWidth={2.5} fill="url(#kgGrad)" dot={{ r: 3, fill: "#1E5C25" }} />
                <Area type="monotone" dataKey="meals" name="Meals contributed" stroke="#0ea5e9" strokeWidth={2} fill="url(#mealsGrad)" dot={{ r: 3, fill: "#0ea5e9" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Section>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Environmental impact */}
        <Section delay={0.08}>
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "CO₂ emissions avoided", val: "4.2 tonnes", pct: 42, color: "#1E5C25", desc: "vs. food going to landfill" },
                  { label: "Water saved (embedded)", val: "~84,000 L", pct: 68, color: "#0ea5e9", desc: "estimated based on rescued food types" },
                  { label: "Landfill waste diverted", val: "8,400 kg", pct: 84, color: "#8b5cf6", desc: "all food rescued from waste stream" },
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
                        transition={{ duration: 1.2, delay: 0.35 + i * 0.15, ease: "easeOut" }}
                        style={{ background: m.color }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Milestones */}
        <Section delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.done ? "bg-brand-50 dark:bg-brand-900/20" : "bg-muted opacity-40"}`}
                      >
                        <m.Icon size={14} className={m.done ? "text-primary" : "text-muted-foreground"} />
                      </motion.div>
                      {i < milestones.length - 1 && <div className={`w-0.5 flex-1 my-1 ${m.done ? "bg-brand-100 dark:bg-brand-800/40" : "bg-muted"}`} style={{ minHeight: 20 }} />}
                    </div>
                    <div className="pb-4">
                      <div className={`font-semibold tracking-tight text-sm ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.date}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>

      {/* Top NGO partners */}
      <Section delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Organizations Supported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { org: "Community Kitchen NGO", meals: 4280, donations: 32, pct: 100 },
                { org: "Hope Foundation", meals: 3200, donations: 24, pct: 75 },
                { org: "City Shelter", meals: 2800, donations: 20, pct: 65 },
                { org: "Faith Community", meals: 2400, donations: 18, pct: 56 },
                { org: "Metro Food Bank", meals: 1600, donations: 14, pct: 37 },
              ].map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }} className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.12 }} className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-300 text-xs font-semibold shrink-0 cursor-default">
                    {p.org.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">{p.org}</span>
                      <span className="text-muted-foreground font-mono-data">{p.meals.toLocaleString()} meals · {p.donations} donations</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${p.pct}%` }}
                        transition={{ duration: 1.0, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
