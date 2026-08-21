import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, Truck, CheckCircle2, PartyPopper, Clock, ShieldCheck, XCircle, Camera, Settings, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type NotifIcon = "zap" | "truck" | "check" | "party" | "clock" | "shield" | "x" | "camera";

const iconMap: Record<NotifIcon, React.ElementType> = {
  zap: Zap, truck: Truck, check: CheckCircle2, party: PartyPopper,
  clock: Clock, shield: ShieldCheck, x: XCircle, camera: Camera,
};
const iconColors: Record<NotifIcon, string> = {
  zap: "#f59e0b", truck: "#0ea5e9", check: "#16a34a", party: "#8b5cf6",
  clock: "#f59e0b", shield: "#0ea5e9", x: "#f43f5e", camera: "#64748b",
};

const allNotifs = [
  { id: 1, cat: "matches",   icon: "zap"    as NotifIcon, title: "New donation matched",      body: "DON-2026-000125 has been matched with Community Kitchen NGO (94% score)",                     time: "5 min ago",  read: false },
  { id: 2, cat: "deliveries",icon: "truck"  as NotifIcon, title: "Volunteer assigned",         body: "Alex Rivera assigned to DEL-2026-000088. Estimated pickup: 5:30 PM today.",                  time: "22 min ago", read: false },
  { id: 3, cat: "donations", icon: "check"  as NotifIcon, title: "NGO accepted your donation", body: "Community Kitchen accepted DON-2026-000124 (Assorted Produce · 48 kg)",                     time: "1h ago",     read: false },
  { id: 4, cat: "deliveries",icon: "party"  as NotifIcon, title: "Delivery completed",         body: "DEL-2026-000085 completed. 48 kg of produce delivered to Community Kitchen.",               time: "3h ago",     read: true  },
  { id: 5, cat: "donations", icon: "clock"  as NotifIcon, title: "Donation expiring soon",     body: "DON-2026-000126 (Prepared Meals) expires in 4 hours. No match found yet.",                  time: "4h ago",     read: true  },
  { id: 6, cat: "system",    icon: "shield" as NotifIcon, title: "Organization verified",      body: "Your organization Green Harvest Co. has been verified by our platform team.",                 time: "1d ago",     read: true  },
  { id: 7, cat: "donations", icon: "x"      as NotifIcon, title: "Donation expired",           body: "DON-2026-000119 expired without a match. Consider adjusting your pickup window next time.", time: "2d ago",     read: true  },
  { id: 8, cat: "deliveries",icon: "camera" as NotifIcon, title: "Pickup confirmed",           body: "Volunteer confirmed pickup of DON-2026-000124. Currently in transit to Community Kitchen.", time: "2d ago",     read: true  },
];

const categories = ["all", "donations", "matches", "deliveries", "system"];

const catColors: Record<string, string> = {
  matches: "#f59e0b", deliveries: "#0ea5e9", donations: "#16a34a", system: "#8b5cf6",
};

export default function Notifications() {
  const [activeCat, setActiveCat] = useState("all");
  const [notifs, setNotifs] = useState(allNotifs);
  const [selected, setSelected] = useState<typeof allNotifs[0] | null>(null);

  const filtered = activeCat === "all" ? notifs : notifs.filter(n => n.cat === activeCat);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifs(notifs.map(n => ({ ...n, read: true }))); };

  return (
    <div className="p-6 h-full flex flex-col gap-5">
      {/* Header row */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Notifications</h1>
          {unread > 0 && <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-auto">{unread} unread</Badge>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs gap-1.5">
            <CheckCheck size={12} /> Mark all read
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Settings size={12} /> Preferences
          </Button>
        </div>
      </motion.div>

      {/* Category tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {categories.map((c) => (
          <motion.button key={c} onClick={() => setActiveCat(c)} whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${activeCat === c ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {c}
            {c === "all" && unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}
                className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px]">
                {unread}
              </motion.span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Two-column layout */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* List */}
        <div className="flex-1 min-w-0 overflow-y-auto space-y-2 pr-1">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
                <Card>
                  <CardContent className="text-center py-16">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Bell size={28} className="text-muted-foreground/40" />
                    </motion.div>
                    <p className="text-muted-foreground font-semibold">No notifications</p>
                    <p className="text-sm text-muted-foreground mt-1">You&apos;re all caught up!</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : filtered.map((n, i) => {
              const Icon = iconMap[n.icon];
              const color = iconColors[n.icon];
              const isSelected = selected?.id === n.id;
              return (
                <motion.div key={n.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => { setSelected(n); markRead(n.id); }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? "border-primary/30 bg-accent/50 shadow-sm" :
                    n.read ? "border-border bg-card hover:bg-muted/40" : "border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.06]"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-card shadow-sm"}`} style={{ color }}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm font-semibold truncate ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-mono-data">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">{n.body}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize" style={{ background: `${catColors[n.cat]}18`, color: catColors[n.cat] }}>
                        {n.cat}
                      </span>
                      {!n.read && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Detail panel */}
        <div className="w-80 shrink-0 hidden lg:flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0" style={{ color: iconColors[selected.icon] }}>
                        {(() => { const Icon = iconMap[selected.icon]; return <Icon size={18} />; })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm leading-snug">{selected.title}</CardTitle>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono-data">{selected.time}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.body}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize border" style={{ background: `${catColors[selected.cat]}15`, color: catColors[selected.cat], borderColor: `${catColors[selected.cat]}30` }}>
                        {selected.cat}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-semibold">
                        {selected.read ? "Read" : "Unread"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs h-8">Take action</Button>
                      <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setSelected(null)}>Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="empty-detail" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                      <Bell size={20} className="text-muted-foreground/40" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Select a notification</p>
                    <p className="text-xs text-muted-foreground mt-1">to see details here</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.filter(c => c !== "all").map(c => {
                const count = notifs.filter(n => n.cat === c).length;
                const unreadCount = notifs.filter(n => n.cat === c && !n.read).length;
                return (
                  <div key={c} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: catColors[c] }} />
                      <span className="text-xs capitalize text-foreground">{c}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && <span className="text-[10px] font-bold" style={{ color: catColors[c] }}>{unreadCount} new</span>}
                      <span className="text-xs text-muted-foreground">{count} total</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
