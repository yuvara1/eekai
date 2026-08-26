import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, Bell, ShieldCheck, Sliders, Settings as SettingsIcon,
  Check, Link2, Unlink, Eye, EyeOff, Smartphone, Key, AlertTriangle, Lock,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { value: "profile",       label: "Profile",       icon: User,        desc: "Personal info & photo" },
  { value: "organization",  label: "Organization",  icon: Building2,   desc: "Team & org details" },
  { value: "notifications", label: "Notifications", icon: Bell,        desc: "Alerts & preferences" },
  { value: "security",      label: "Security",      icon: ShieldCheck, desc: "Password & 2FA" },
  { value: "preferences",   label: "Preferences",   icon: Sliders,     desc: "Display & language" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("security");

  return (
    <div className="p-3 sm:p-6 max-w-full overflow-x-hidden">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </motion.div>

      {/* Horizontal tab strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="relative flex items-stretch gap-1 bg-muted/50 rounded-2xl p-1 mb-6 overflow-x-auto scroll-hide border border-border/60"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setActive(item.value)}
              className="relative flex-1 min-w-[100px] flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-colors group z-10 focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="settings-tab-bg"
                  className="absolute inset-0 rounded-xl bg-card border border-border shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                isActive ? "bg-primary/12 text-primary" : "bg-transparent text-muted-foreground group-hover:text-foreground"
              }`}>
                <Icon size={14} />
              </div>
              <div className="relative text-center leading-none">
                <div className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                }`}>{item.label}</div>
                <div className="hidden sm:block text-[9.5px] text-muted-foreground/60 mt-0.5 whitespace-nowrap truncate max-w-[90px]">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {active === "profile"       && <ProfileTab />}
          {active === "notifications" && <NotificationsTab />}
          {active === "security"      && <SecurityTab />}
          {(active === "organization" || active === "preferences") && (
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
            <Input id="first-name" defaultValue="Sarah" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" defaultValue="Chen" />
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
    { label: "Donation matched",      desc: "When a donation is matched with an NGO",        on: true  },
    { label: "NGO accepted donation", desc: "When an NGO accepts your donation",              on: true  },
    { label: "Volunteer assigned",    desc: "When a volunteer is assigned to your delivery",  on: true  },
    { label: "Delivery completed",    desc: "When a food delivery is completed",              on: true  },
    { label: "Donation expiring",     desc: "When a donation is expiring within 6 hours",     on: true  },
    { label: "System announcements",  desc: "Platform updates and maintenance notices",       on: false },
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

/* ── Security ────────────────────────────────────────────── */

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <motion.button
      onClick={onChange}
      whileTap={{ scale: 0.92 }}
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0 focus:outline-none ${on ? "bg-primary" : "bg-muted border border-border"}`}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        animate={{ left: on ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

function SecurityTab() {
  const [googleLinked, setGoogleLinked] = useState(true);
  const [facebookLinked, setFacebookLinked] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  function handleGoogle() {
    setGoogleLoading(true);
    setTimeout(() => { setGoogleLinked(v => !v); setGoogleLoading(false); }, 900);
  }
  function handleFacebook() {
    setFbLoading(true);
    setTimeout(() => { setFacebookLinked(v => !v); setFbLoading(false); }, 900);
  }

  const sessions = [
    { device: "MacBook Pro", location: "San Francisco, CA", time: "Active now",   current: true  },
    { device: "iPhone 15 Pro", location: "San Francisco, CA", time: "2 hours ago", current: false },
    { device: "Chrome · Windows", location: "New York, NY",    time: "3 days ago",  current: false },
  ];

  return (
    <div className="space-y-4">

      {/* ── Sign-in methods ── */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold tracking-tight text-foreground">Sign-in Methods</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Connect social accounts for one-click sign in.</p>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <motion.div
              layout
              className={`relative flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                googleLinked ? "border-primary/30 bg-primary/4" : "border-border bg-muted/30"
              }`}
            >
              {/* Google logo */}
              <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Google</span>
                  {googleLinked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
                      <Check size={9} strokeWidth={3} /> Connected
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {googleLinked ? "sarah@gmail.com" : "Sign in with your Google account"}
                </p>
              </div>

              <motion.button
                onClick={handleGoogle}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                disabled={googleLoading}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                  googleLinked
                    ? "border-border text-muted-foreground hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    : "border-primary/40 text-primary bg-primary/8 hover:bg-primary/14"
                }`}
              >
                {googleLoading ? (
                  <Spinner className="size-3.5" />
                ) : googleLinked ? (
                  <><Unlink size={12} /> Disconnect</>
                ) : (
                  <><Link2 size={12} /> Connect</>
                )}
              </motion.button>
            </motion.div>

            {/* Facebook */}
            <motion.div
              layout
              className={`relative flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                facebookLinked ? "border-blue-500/30 bg-blue-500/4" : "border-border bg-muted/30"
              }`}
            >
              {/* Facebook logo */}
              <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Facebook</span>
                  {facebookLinked && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
                      <Check size={9} strokeWidth={3} /> Connected
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {facebookLinked ? "sarah.chen@facebook.com" : "Sign in with your Facebook account"}
                </p>
              </div>

              <motion.button
                onClick={handleFacebook}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                disabled={fbLoading}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                  facebookLinked
                    ? "border-border text-muted-foreground hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    : "border-blue-400/40 text-blue-600 bg-blue-500/8 hover:bg-blue-500/14"
                }`}
              >
                {fbLoading ? (
                  <Spinner className="size-3.5" />
                ) : facebookLinked ? (
                  <><Unlink size={12} /> Disconnect</>
                ) : (
                  <><Link2 size={12} /> Connect</>
                )}
              </motion.button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* ── Password ── */}
      <Card>
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Key size={14} className="text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Change Password</h2>
              <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="current-pw">Current password</Label>
              <div className="relative">
                <Input id="current-pw" type={showCurrent ? "text" : "password"} defaultValue="••••••••••" className="pr-10" />
                <button onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-pw">New password</Label>
              <div className="relative">
                <Input id="new-pw" type={showNew ? "text" : "password"} placeholder="Min. 8 characters" className="pr-10" />
                <button onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {/* Strength meter */}
            <div className="flex gap-1 pt-0.5">
              {[1,2,3,4].map(i => (
                <motion.div key={i} className="h-1 flex-1 rounded-full"
                  style={{ background: i <= 2 ? "var(--primary)" : "var(--muted)" }}
                  initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Use 8+ characters, uppercase, numbers, and symbols.</p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Button size="sm">Update password</Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* ── 2FA + Sessions row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* 2FA */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${twoFAEnabled ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-muted"}`}>
                  <Smartphone size={15} className={twoFAEnabled ? "text-emerald-600" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Two-factor auth</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{twoFAEnabled ? "Enabled via authenticator" : "Not enabled"}</p>
                </div>
              </div>
              <Toggle on={twoFAEnabled} onChange={() => setTwoFAEnabled(v => !v)} />
            </div>

            <AnimatePresence>
              {twoFAEnabled && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                    <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      Your account is protected with 2FA. Recovery codes saved.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-1 border-t border-border">
              <div>
                <p className="text-xs font-medium text-foreground">Login alerts</p>
                <p className="text-[11px] text-muted-foreground">Email on new device sign-in</p>
              </div>
              <Toggle on={loginAlerts} onChange={() => setLoginAlerts(v => !v)} />
            </div>
          </CardContent>
        </Card>

        {/* Active sessions */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <Lock size={15} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Active Sessions</p>
                <p className="text-[11px] text-muted-foreground">{sessions.length} devices signed in</p>
              </div>
            </div>

            <div className="space-y-2">
              {sessions.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${s.current ? "bg-primary/6 border border-primary/20" : "bg-muted/40 hover:bg-muted/60"}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.current ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{s.device}</p>
                    <p className="text-[10px] text-muted-foreground">{s.location} · {s.time}</p>
                  </div>
                  {!s.current && (
                    <button className="text-[10px] font-medium text-rose-500 hover:text-rose-600 shrink-0">Revoke</button>
                  )}
                  {s.current && <span className="text-[10px] font-semibold text-primary shrink-0">This device</span>}
                </motion.div>
              ))}
            </div>

            <button className="flex items-center gap-1.5 text-[11px] font-medium text-rose-500 hover:text-rose-600 transition-colors pt-1">
              <AlertTriangle size={11} /> Sign out all other devices
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
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
