import { useState, useRef } from "react";
import { useNav } from "@/hooks/useNav";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, Clock, Globe, CheckCircle,
  Package, Handshake, Truck, ShieldCheck, ChevronDown,
  GitBranch, Link,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/Logo";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/** Aceternity-style floating-label input */
function FloatingInput({
  id, label, type = "text", required = false, placeholder = "",
}: {
  id: string; label: string; type?: string; required?: boolean; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none select-none z-10 ${
          active
            ? "top-1.5 text-[10px] font-semibold text-emerald-400 tracking-wide"
            : "top-1/2 -translate-y-1/2 text-sm text-white/30"
        }`}
      >
        {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={active ? placeholder : ""}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-5 pb-2 px-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/[0.055] placeholder:text-white/15"
      />
      {/* animated underline */}
      <motion.div
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-0 inset-x-3 h-px bg-emerald-500 origin-left rounded-full"
      />
    </div>
  );
}

/** Floating-label textarea */
function FloatingTextarea({ id, label, required = false }: { id: string; label: string; required?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const active = focused || value.length > 0;
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none select-none z-10 ${
          active
            ? "top-1.5 text-[10px] font-semibold text-emerald-400 tracking-wide"
            : "top-3.5 text-sm text-white/30"
        }`}
      >
        {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-6 pb-2 px-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/[0.055] resize-none"
      />
      <motion.div
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-0 inset-x-3 h-px bg-emerald-500 origin-left rounded-full"
      />
    </div>
  );
}

const contactInfo = [
  { Icon: Mail,  label: "Email",       value: "hello@eekai.org",        sub: "We reply within 4 hours",     color: "#22c55e" },
  { Icon: Phone, label: "Phone",       value: "+1 (800) 324-7890",      sub: "Mon–Fri, 9 AM–6 PM EST",      color: "#38bdf8" },
  { Icon: MapPin,label: "Office",      value: "San Francisco, CA",       sub: "545 Market Street, Suite 400", color: "#a78bfa" },
  { Icon: Clock, label: "Response",    value: "< 4 hours",              sub: "Average first response",       color: "#f59e0b" },
];

const roles = [
  { icon: Package,    label: "Food Donor",      desc: "Restaurants, hotels & businesses" },
  { icon: Handshake,  label: "NGO / Charity",   desc: "Communities we serve food to"     },
  { icon: Truck,      label: "Volunteer Driver", desc: "Individuals who deliver food"     },
  { icon: ShieldCheck,label: "Partner / Press",  desc: "Organizations & media"            },
];

const faqs = [
  { q: "How quickly does matching happen?", a: "Our algorithm scores and notifies NGOs within seconds of a donation being listed — typically under 2 minutes to first match." },
  { q: "Is eekai free to use?", a: "Yes. eekai is completely free for donors, NGOs, and volunteers. We're a non-profit platform funded by corporate partnerships." },
  { q: "What food types are accepted?", a: "Prepared meals, fresh produce, bakery items, canned goods, dairy, and packaged foods. We do not accept expired or unsafe food." },
  { q: "How do you verify organizations?", a: "All NGOs and donor organizations go through a document verification before going live. Volunteers are background-checked." },
];

/* Dot-world-map pattern — pure SVG circles approximating landmasses */
function WorldDots() {
  const dots: { cx: number; cy: number }[] = [];
  const cols = 36; const rows = 18;
  // rough landmass mask — very approximate
  const land = (c: number, r: number) => {
    const x = c / cols; const y = r / rows;
    if (y < 0.12 || y > 0.9) return false;
    // NA
    if (x > 0.08 && x < 0.3 && y > 0.15 && y < 0.55) return true;
    // SA
    if (x > 0.18 && x < 0.32 && y > 0.52 && y < 0.85) return true;
    // Europe
    if (x > 0.42 && x < 0.57 && y > 0.12 && y < 0.42) return true;
    // Africa
    if (x > 0.44 && x < 0.6 && y > 0.38 && y < 0.82) return true;
    // Asia
    if (x > 0.55 && x < 0.9 && y > 0.1 && y < 0.6) return true;
    // Aus
    if (x > 0.75 && x < 0.92 && y > 0.6 && y < 0.82) return true;
    return false;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (land(c, r)) dots.push({ cx: (c / cols) * 100, cy: (r / rows) * 100 });
    }
  }
  return (
    <svg viewBox="0 0 100 60" className="w-full opacity-[0.12]" aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="0.7" fill="white" />
      ))}
    </svg>
  );
}

export default function Contact() {
  const navigate = useNav();
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  };

  return (
    <div className="bg-[#030303] min-h-screen text-white overflow-x-hidden">

      {/* ── MAIN CONTACT SECTION ── */}
      <section className="min-h-screen grid lg:grid-cols-2">

        {/* ── LEFT PANEL — info + world map ── */}
        <div className="relative flex flex-col justify-between px-8 py-16 lg:px-14 lg:py-20 bg-[#060608] border-b lg:border-b-0 lg:border-r border-white/[0.06] overflow-hidden">

          {/* Subtle radial glow */}
          <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }} />

          {/* Grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "36px 36px" }} />

          <div className="relative z-10">
            {/* Logo + nav back */}
            <button onClick={() => navigate("landing")} className="flex items-center gap-2.5 mb-14 group">
              <LogoMark size={28} />
              <span className="font-serif italic font-semibold text-white" style={{ fontSize: "16px" }}>eekai</span>
            </button>

            <FadeUp>
              <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-4">Get in touch</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                Let&apos;s talk about<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #4ade80, #22c55e, #16a34a)" }}>
                  food rescue.
                </span>
              </h1>
              <p className="text-white/40 text-base leading-relaxed max-w-sm">
                Whether you are a donor, an NGO, a volunteer, or a journalist — we would love to hear from you.
              </p>
            </FadeUp>

            {/* Contact info list */}
            <FadeUp delay={0.1} className="mt-10 space-y-5">
              {contactInfo.map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${c.color}14`, border: `1px solid ${c.color}28` }}>
                    <c.Icon size={15} style={{ color: c.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-0.5">{c.label}</p>
                    <p className="text-sm font-semibold text-white">{c.value}</p>
                    <p className="text-xs text-white/25 mt-0.5">{c.sub}</p>
                  </div>
                </div>
              ))}
            </FadeUp>

            {/* Social links */}
            <FadeUp delay={0.18} className="mt-10 flex items-center gap-3">
              {[
                { Icon: Globe,    href: "#", label: "Twitter"  },
                { Icon: GitBranch, href: "#", label: "GitHub"  },
                { Icon: Link,     href: "#", label: "LinkedIn"  },
                { Icon: Globe,    href: "#", label: "Website"  },
              ].map((s) => (
                <motion.a key={s.label} href={s.href}
                  whileHover={{ scale: 1.1, borderColor: "rgba(34,197,94,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white transition-colors"
                >
                  <s.Icon size={15} />
                </motion.a>
              ))}
            </FadeUp>
          </div>

          {/* World dot map at bottom */}
          <FadeUp delay={0.25} className="relative z-10 mt-16">
            <WorldDots />
            <p className="text-[10px] text-white/20 text-center mt-2 tracking-wide">Available worldwide</p>
          </FadeUp>
        </div>

        {/* ── RIGHT PANEL — form ── */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-14 lg:py-20">
          <FadeUp delay={0.05}>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Send a message</h2>
            <p className="text-white/35 text-sm mb-8">Fill out the form and we&apos;ll get back to you within 4 hours.</p>
          </FadeUp>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center gap-5">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle size={34} className="text-emerald-400" />
                </motion.div>
                <div>
                  <p className="text-white font-bold text-xl mb-1.5">Message sent!</p>
                  <p className="text-white/40 text-sm">We&apos;ll get back to you within 4 hours.</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setSent(false)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-1 underline underline-offset-4">
                  Send another message
                </motion.button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-4">

                {/* Role selector */}
                <FadeUp delay={0.08}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-2.5">I am a…</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {roles.map((r, i) => {
                      const active = selectedRole === i;
                      return (
                        <motion.button key={i} type="button" onClick={() => setSelectedRole(i)}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                            active
                              ? "border-emerald-500/50 bg-emerald-500/[0.08]"
                              : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${active ? "bg-emerald-500/20" : "bg-white/[0.04]"}`}>
                            <r.icon size={12} className={active ? "text-emerald-400" : "text-white/30"} />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold leading-none mb-0.5 ${active ? "text-white" : "text-white/45"}`}>{r.label}</p>
                            <p className="text-[10px] text-white/20 leading-none truncate">{r.desc}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </FadeUp>

                <FadeUp delay={0.12} className="grid grid-cols-2 gap-3">
                  <FloatingInput id="fname" label="First name" required placeholder="Alex" />
                  <FloatingInput id="lname" label="Last name"  required placeholder="Rivera" />
                </FadeUp>

                <FadeUp delay={0.15}>
                  <FloatingInput id="email" label="Email address" type="email" required placeholder="alex@example.com" />
                </FadeUp>

                <FadeUp delay={0.17}>
                  <FloatingInput id="org" label="Organization (optional)" placeholder="Green Harvest Co." />
                </FadeUp>

                <FadeUp delay={0.19}>
                  <FloatingTextarea id="msg" label="Message" required />
                </FadeUp>

                <FadeUp delay={0.22}>
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: 1.015, boxShadow: "0 8px 32px rgba(34,197,94,0.28)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-semibold py-3 text-sm transition-colors"
                  >
                    {sending ? <Spinner className="size-4" /> : <Send size={14} />}
                    {sending ? "Sending…" : "Send message"}
                  </motion.button>
                </FadeUp>

                <FadeUp delay={0.24}>
                  <p className="text-center text-[11px] text-white/20 mt-1">
                    By submitting you agree to our{" "}
                    <a href="#" className="underline underline-offset-2 hover:text-white/40 transition-colors">Privacy Policy</a>.
                  </p>
                </FadeUp>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-3">FAQ</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">Common questions</h2>
          <p className="text-white/35 mt-3 text-sm">Can&apos;t find what you&apos;re looking for? Send us a message above.</p>
        </FadeUp>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <motion.div key={i} layout className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className={`text-sm font-medium transition-colors ${open ? "text-white" : "text-white/55"}`}>{faq.q}</span>
                  <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
                    <ChevronDown size={16} className={open ? "text-emerald-400" : "text-white/20"} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="px-6 pb-5 pt-1 text-sm text-white/40 leading-relaxed border-t border-white/[0.05]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BEAMS ── */}
      <section className="relative overflow-hidden py-24 px-6 text-center border-t border-white/[0.05]">
        <BackgroundBeams className="absolute inset-0" />
        <div className="relative z-10 max-w-xl mx-auto">
          <FadeUp>
            <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-4">Together</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Every connection saves food.</h2>
            <p className="text-white/40 text-sm mb-8">Our team is available Monday–Friday, 9 AM–6 PM EST. For urgent food safety issues, we respond 24/7.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.button whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(34,197,94,0.3)" }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("register")}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-2.5 text-sm transition-colors">
                <Handshake size={15} /> Join eekai
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("landing")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-white/55 hover:text-white hover:border-white/30 px-7 py-2.5 text-sm transition-colors">
                Back to home
              </motion.button>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
