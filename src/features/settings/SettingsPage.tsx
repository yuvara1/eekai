import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Bell, ShieldCheck, Sliders, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { value: "profile",       label: "Profile",       icon: User,         desc: "Personal info & photo" },
  { value: "organization",  label: "Organization",  icon: Building2,    desc: "Team & org details" },
  { value: "notifications", label: "Notifications", icon: Bell,         desc: "Alerts & preferences" },
  { value: "security",      label: "Security",      icon: ShieldCheck,  desc: "Password & 2FA" },
  { value: "preferences",   label: "Preferences",   icon: Sliders,      desc: "Display & language" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="p-3 sm:p-6 max-w-full overflow-x-hidden">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight text-foreground mb-5">
        Settings
      </motion.h1>

      {/* ── Horizontal tab bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setActive(item.value)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="settings-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* ── Content panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          {active === "profile"       && <ProfileTab />}
          {active === "notifications" && <NotificationsTab />}
          {(active === "organization" || active === "security" || active === "preferences") && (
            <PlaceholderTab tab={active} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Profile ─────────────────────────────────────────────── */

function ProfileTab() {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Update your personal details and photo.</p>
        </div>

        <div className="flex items-center gap-4 pb-2">
          <motion.div whileHover={{ scale: 1.05 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg sm:text-xl cursor-pointer shrink-0">
            SC
          </motion.div>
          <div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="sm">Upload photo</Button>
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2 MB</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" type="text" defaultValue="Sarah" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" type="text" defaultValue="Chen" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="sarah@greenharvest.org" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" defaultValue="+1 (415) 555-0142" />
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Button>Save changes</Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

/* ── Notifications ───────────────────────────────────────── */

function NotificationsTab() {
  const items = [
    { label: "Donation matched",      desc: "When a donation is matched with an NGO",              on: true  },
    { label: "NGO accepted donation", desc: "When an NGO accepts your donation",                   on: true  },
    { label: "Volunteer assigned",    desc: "When a volunteer is assigned to your delivery",       on: true  },
    { label: "Delivery completed",    desc: "When a food delivery is completed",                   on: true  },
    { label: "Donation expiring",     desc: "When a donation is expiring within 6 hours",         on: true  },
    { label: "System announcements",  desc: "Platform updates and maintenance notices",           on: false },
  ];

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 space-y-1">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Choose what alerts you receive.</p>
        </div>
        {items.map((n, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{n.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
            </div>
            <motion.div whileTap={{ scale: 0.92 }}
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${n.on ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${n.on ? "left-6" : "left-1"}`} />
            </motion.div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Placeholder ─────────────────────────────────────────── */

function PlaceholderTab({ tab }: { tab: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-20 text-center">
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <SettingsIcon size={20} className="text-muted-foreground/50" />
        </motion.div>
        <p className="font-semibold tracking-tight text-foreground capitalize">{tab} settings</p>
        <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
      </CardContent>
    </Card>
  );
}
