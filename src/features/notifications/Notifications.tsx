import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, Truck, CheckCircle2, PartyPopper, Clock, ShieldCheck, XCircle, Camera, Settings, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type NotifIcon = "zap" | "truck" | "check" | "party" | "clock" | "shield" | "x" | "camera";

const iconMap: Record<NotifIcon, React.ElementType> = {
  zap: Zap, truck: Truck, check: CheckCircle2, party: PartyPopper,
  clock: Clock, shield: ShieldCheck, x: XCircle, camera: Camera,
};
const iconColors: Record<NotifIcon, string> = {
  zap: "#f59e0b", truck: "#0ea5e9", check: "#16a34a", party: "#8b5cf6",
  clock: "#f59e0b", shield: "#0ea5e9", x: "#f43f5e", camera: "#64748b",
};
const catColors: Record<string, string> = {
  matches: "#f59e0b", deliveries: "#0ea5e9", donations: "#16a34a", system: "#8b5cf6",
};

const allNotifs = [
  { id: 1,  cat: "matches",   icon: "zap"    as NotifIcon, title: "New donation matched",        body: "DON-2026-000125 has been matched with Community Kitchen NGO (94% score).",                    time: "5 min ago",  read: false },
  { id: 2,  cat: "deliveries",icon: "truck"  as NotifIcon, title: "Volunteer assigned",           body: "Alex Rivera assigned to DEL-2026-000088. Estimated pickup: 5:30 PM today.",                  time: "22 min ago", read: false },
  { id: 3,  cat: "donations", icon: "check"  as NotifIcon, title: "NGO accepted your donation",  body: "Community Kitchen accepted DON-2026-000124 (Assorted Produce · 48 kg).",                     time: "1h ago",     read: false },
  { id: 4,  cat: "deliveries",icon: "party"  as NotifIcon, title: "Delivery completed",          body: "DEL-2026-000085 completed. 48 kg of produce delivered to Community Kitchen.",               time: "3h ago",     read: true  },
  { id: 5,  cat: "donations", icon: "clock"  as NotifIcon, title: "Donation expiring soon",      body: "DON-2026-000126 (Prepared Meals) expires in 4 hours. No match found yet.",                  time: "4h ago",     read: true  },
  { id: 6,  cat: "system",    icon: "shield" as NotifIcon, title: "Organization verified",       body: "Your organization Green Harvest Co. has been verified by our platform team.",                time: "1d ago",     read: true  },
  { id: 7,  cat: "donations", icon: "x"      as NotifIcon, title: "Donation expired",            body: "DON-2026-000119 expired without a match. Consider adjusting your pickup window next time.", time: "2d ago",     read: true  },
  { id: 8,  cat: "deliveries",icon: "camera" as NotifIcon, title: "Pickup confirmed",            body: "Volunteer confirmed pickup of DON-2026-000124. Currently in transit to Community Kitchen.", time: "2d ago",     read: true  },
  { id: 9,  cat: "matches",   icon: "zap"    as NotifIcon, title: "High-confidence match found", body: "DON-2026-000118 has been matched with Hope Foundation (89% score).",                        time: "3d ago",     read: true  },
  { id: 10, cat: "system",    icon: "shield" as NotifIcon, title: "Monthly report ready",        body: "Your August impact report is ready. 284 kg rescued, 96 meals served.",                      time: "4d ago",     read: true  },
];

const categories = ["all", "donations", "matches", "deliveries", "system"];

export default function Notifications() {
  const [activeCat, setActiveCat] = useState("all");
  const [notifs, setNotifs] = useState(allNotifs);

  const filtered = activeCat === "all" ? notifs : notifs.filter(n => n.cat === activeCat);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-border shrink-0 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-semibold tracking-tight text-foreground">Notifications</h1>
            {unread > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-auto">{unread} unread</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted">
              <CheckCheck size={12} /> Mark all read
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted">
              <Settings size={12} /> Preferences
            </motion.button>
          </div>
        </div>

        {/* Category filter */}
        <div className="px-4 sm:px-5 py-3 border-b border-border shrink-0 flex gap-1.5 flex-wrap">
          {categories.map(c => (
            <motion.button key={c} onClick={() => setActiveCat(c)} whileTap={{ scale: 0.93 }}
              className={`relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCat === c ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {c}
              {c === "all" && unread > 0 && (
                <span className="ml-0.5 w-3.5 h-3.5 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold leading-none">
                  {unread}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardContent className="text-center py-20">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Bell size={28} className="text-muted-foreground/40" />
                    </motion.div>
                    <p className="font-semibold text-muted-foreground">No notifications</p>
                    <p className="text-sm text-muted-foreground mt-1">You&apos;re all caught up!</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-2">
                {filtered.map((n, i) => {
                  const Icon = iconMap[n.icon];
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30, scale: 0.95 }}
                      transition={{ delay: i * 0.03, duration: 0.26 }}
                      onClick={() => markRead(n.id)}
                      className={`relative flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        n.read
                          ? "border-border bg-card hover:bg-muted/40"
                          : "border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.06]"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-card shadow-sm"}`}
                        style={{ color: iconColors[n.icon] }}>
                        <Icon size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-sm font-semibold truncate ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0 font-mono-data">{n.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{n.body}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                            style={{ background: `${catColors[n.cat]}18`, color: catColors[n.cat] }}>
                            {n.cat}
                          </span>
                          {!n.read && (
                            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
