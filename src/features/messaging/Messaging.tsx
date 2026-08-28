import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Search, Plus, Package, Truck, Users,
  ChevronLeft, CheckCheck, Check, Loader2, MoreVertical, Phone, X, ArrowLeft,
} from "lucide-react";
import { useConversations, useMessages, useSendMessage, useMarkConversationRead, useCreateConversation } from "@/services/messaging";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Conversation, Message } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/* ── helpers ────────────────────────────────────────────────────── */

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function fmtFull(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

function groupByDay(messages: Message[]) {
  const groups: { label: string; messages: Message[] }[] = [];
  let current: { label: string; messages: Message[] } | null = null;
  for (const msg of messages) {
    const label = dayLabel(msg.createdAt);
    if (!current || current.label !== label) {
      current = { label, messages: [] };
      groups.push(current);
    }
    current.messages.push(msg);
  }
  return groups;
}

/* ── Mock user directory (real API: GET /users/search?q=...) ─────── */
const MOCK_USERS = [
  { id: "u1",  name: "Sarah Chen",       initials: "SC", role: "Donor",     online: true  },
  { id: "u2",  name: "Community Kitchen",initials: "CK", role: "NGO",       online: false },
  { id: "u3",  name: "Ravi Kumar",       initials: "RK", role: "Volunteer", online: true  },
  { id: "u4",  name: "Metro Bakery",     initials: "MB", role: "Donor",     online: false },
  { id: "u5",  name: "Hope Foundation",  initials: "HF", role: "NGO",       online: true  },
  { id: "u6",  name: "Priya Sharma",     initials: "PS", role: "Volunteer", online: false },
  { id: "u7",  name: "Green Harvest Co.",initials: "GH", role: "Donor",     online: true  },
  { id: "u8",  name: "Sunrise Shelter",  initials: "SS", role: "NGO",       online: false },
];

/* ── New chat panel ──────────────────────────────────────────────── */
function NewChatPanel({ onClose, onCreated, existingConvs }: {
  onClose: () => void;
  onCreated: (conv: Conversation) => void;
  existingConvs: Conversation[];
}) {
  const [userSearch, setUserSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createConv = useCreateConversation();
  const qc = useQueryClient();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return MOCK_USERS;
    return MOCK_USERS.filter(u =>
      u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q),
    );
  }, [userSearch]);

  const start = async (user: typeof MOCK_USERS[number]) => {
    // Reuse existing conversation with this user if one exists
    const existing = existingConvs.find(c =>
      c.participants.some(p => p.id === user.id),
    );
    if (existing) { onCreated(existing); onClose(); return; }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      subject: `Chat with ${user.name}`,
      type: "general",
      participants: [
        { id: user.id, name: user.name, initials: user.initials, role: user.role.toLowerCase() as Conversation["participants"][number]["role"], online: user.online },
      ],
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };

    // Inject conversation into cache immediately
    qc.setQueryData<Conversation[]>(["conversations"], old =>
      old ? [newConv, ...old] : [newConv],
    );
    // Seed empty message list so the pane renders without a loading flash
    qc.setQueryData(["messages", newConv.id], {
      pages: [{ messages: [], hasMore: false }],
      pageParams: [0],
    });

    onCreated(newConv);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-10 flex flex-col bg-card"
    >
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-3 h-[57px] border-b border-border">
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          <ArrowLeft size={15} />
        </button>
        <span className="text-[13.5px] font-semibold text-foreground flex-1">New conversation</span>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 py-2.5 border-b border-border">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
          <input
            ref={inputRef}
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            placeholder="Search by name or role…"
            className="w-full h-8 bg-muted/50 border border-border/60 rounded-lg pl-8 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {userSearch && (
            <button onClick={() => setUserSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-2 scroll-hide">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <p className="text-xs text-muted-foreground">No users found for "{userSearch}"</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {results.map(user => (
              <motion.button
                key={user.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => start(user)}
                disabled={createConv.isPending}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left disabled:opacity-50"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/12 text-primary text-xs font-bold flex items-center justify-center ring-2 ring-primary/10">
                    {user.initials}
                  </div>
                  <span className={`absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-2 border-card ${user.online ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user.role}</p>
                </div>
                {user.online && (
                  <span className="text-[10px] text-emerald-500 font-medium shrink-0">Online</span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const TYPE_META: Record<Conversation["type"], { icon: React.ReactNode; label: string; color: string }> = {
  donation: { icon: <Package size={10} />, label: "Donation", color: "text-emerald-500" },
  delivery: { icon: <Truck size={10} />,   label: "Delivery", color: "text-amber-500"  },
  general:  { icon: <Users size={10} />,   label: "General",  color: "text-blue-400"   },
};

/* ── Avatar ──────────────────────────────────────────────────────── */
function Avatar({
  initials, online, size = "md",
}: { initials: string; online?: boolean; size?: "xs" | "sm" | "md" | "lg" }) {
  const cls = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  }[size];
  const dot = { xs: "w-1.5 h-1.5", sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" }[size];
  return (
    <div className="relative shrink-0">
      <div className={`${cls} rounded-full bg-primary/12 text-primary font-bold flex items-center justify-center select-none ring-2 ring-primary/10`}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute -bottom-px -right-px ${dot} rounded-full border-2 border-card ${online ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
      )}
    </div>
  );
}

/* ── Highlight matched query inside a string ─────────────────────── */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-[2px] px-px not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ── Conversation list item ──────────────────────────────────────── */
function ConvItem({ conv, active, onClick, query }: { conv: Conversation; active: boolean; onClick: () => void; query: string }) {
  const other = conv.participants[0];
  const meta = TYPE_META[conv.type];
  const hasUnread = conv.unreadCount > 0;
  const preview = conv.lastMessage?.content ?? conv.subject;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={[
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group",
        active
          ? "bg-primary/10 shadow-[inset_0_0_0_1px] shadow-primary/20"
          : "hover:bg-muted/50",
      ].join(" ")}
    >
      <Avatar initials={other?.initials ?? "??"} online={other?.online} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className={`text-[13px] leading-tight truncate ${hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
            <Highlight text={other?.name ?? conv.subject} query={query} />
          </span>
          {conv.lastMessage && (
            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
              {fmtTime(conv.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`${meta.color} shrink-0`}>{meta.icon}</span>
          <span className={`text-[11.5px] truncate ${hasUnread ? "text-foreground/70 font-medium" : "text-muted-foreground"}`}>
            <Highlight text={preview} query={query} />
          </span>
        </div>
      </div>

      {hasUnread && (
        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[9.5px] font-bold flex items-center justify-center">
          {conv.unreadCount}
        </span>
      )}
    </motion.button>
  );
}

/* ── Read receipt ─────────────────────────────────────────────────── */
function Receipt({ readBy, total }: { readBy: string[]; total: number }) {
  const read = readBy.length >= total;
  const delivered = readBy.length > 0;
  if (read) return <CheckCheck size={12} className="text-primary" />;
  if (delivered) return <CheckCheck size={12} className="text-muted-foreground/50" />;
  return <Check size={12} className="text-muted-foreground/40" />;
}

/* ── Message bubble ──────────────────────────────────────────────── */
function Bubble({ msg, isMine, showAvatar, participantCount }: {
  msg: Message; isMine: boolean; showAvatar: boolean; participantCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar slot — always reserve space to avoid reflow */}
      <div className="shrink-0 w-8">
        {!isMine && showAvatar && <Avatar initials={msg.senderInitials} size="xs" />}
      </div>

      <div className={`flex flex-col gap-0.5 max-w-[68%] ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && showAvatar && (
          <span className="text-[10px] text-muted-foreground font-medium ml-1 mb-0.5">
            {msg.senderName}
          </span>
        )}

        <div className={[
          "px-3.5 py-2 text-[13px] leading-relaxed break-words whitespace-pre-wrap",
          isMine
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-[5px] shadow-sm"
            : "bg-card text-foreground border border-border/80 rounded-2xl rounded-bl-[5px] shadow-sm",
        ].join(" ")}>
          {msg.content}
        </div>

        <div className={`flex items-center gap-1 text-[10px] text-muted-foreground px-0.5 ${isMine ? "flex-row-reverse" : ""}`}>
          <span>{fmtFull(msg.createdAt)}</span>
          {isMine && <Receipt readBy={msg.readBy} total={participantCount} />}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Day separator ───────────────────────────────────────────────── */
function DaySep({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 select-none">
      <div className="flex-1 h-px bg-border/60" />
      <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

/* ── Typing indicator ────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 shrink-0" />
      <div className="px-3.5 py-2.5 bg-card border border-border/80 rounded-2xl rounded-bl-[5px] shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Message pane ────────────────────────────────────────────────── */
function MessagePane({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const { user } = useAuth();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(conv.id);
  const send = useSendMessage();
  const markRead = useMarkConversationRead();
  const { on } = useWebSocket();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [isTypingVisible] = useState(false); // reserved for WS typing events
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Recalculate textarea height on every text change (handles Shift+Enter newlines)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const messages = useMemo(() => data?.pages.flatMap(p => p.messages) ?? [], [data]);
  const groups = useMemo(() => groupByDay(messages), [messages]);
  const other = conv.participants.find(p => p.id !== user?.id) ?? conv.participants[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (conv.unreadCount > 0) markRead.mutate(conv.id);
  }, [conv.id]); // eslint-disable-line

  useEffect(() => {
    return on<Message>("MESSAGE_RECEIVED", (event) => {
      const msg = event.payload;
      if (msg.conversationId !== conv.id) return;
      qc.setQueryData(["messages", conv.id], (old: { pages: { messages: Message[] }[] } | undefined) => {
        if (!old) return old;
        const pages = [...old.pages];
        const last = pages[pages.length - 1];
        if (last.messages.some(m => m.id === msg.id)) return old;
        pages[pages.length - 1] = { ...last, messages: [...last.messages, msg] };
        return { ...old, pages };
      });
    });
  }, [conv.id, on, qc]);

  const handleSend = useCallback(async () => {
    const content = text.trim();
    if (!content || send.isPending) return;
    setText("");
    if (inputRef.current) { inputRef.current.style.height = "auto"; }
    await send.mutateAsync({ conversationId: conv.id, content });
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [text, conv.id, send]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const meta = TYPE_META[conv.type];

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-background/50">
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 h-[57px] border-b border-border bg-card/80 backdrop-blur-sm">
        <button onClick={onBack} className="md:hidden -ml-1 p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Back">
          <ChevronLeft size={16} />
        </button>

        <Avatar initials={other?.initials ?? "??"} online={other?.online} size="sm" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground leading-tight">{other?.name ?? "Conversation"}</span>
            <span className={`${meta.color} flex items-center gap-0.5 text-[10px]`}>
              {meta.icon}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight truncate">
            {other?.online ? (
              <span className="text-emerald-500 font-medium">● Active now</span>
            ) : (
              <span className="text-muted-foreground/60">{conv.subject}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="Voice call">
            <Phone size={14} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="More options">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 scroll-hide">
        {hasNextPage && (
          <div className="flex justify-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
              className="text-xs text-muted-foreground h-7 rounded-full px-4 border border-border/50">
              {isFetchingNextPage && <Loader2 size={11} className="animate-spin mr-1.5" />}
              Load earlier messages
            </Button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <MessageSquare size={22} className="text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground/70 mb-1">No messages yet</p>
            <p className="text-xs text-muted-foreground">Say hello to get the conversation started.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {groups.map((group) => (
              <div key={group.label}>
                <DaySep label={group.label} />
                <div className="space-y-1">
                  {group.messages.map((msg, i) => {
                    const isMine = msg.senderId === user?.id || msg.senderId === "me";
                    const nextMsg = group.messages[i + 1];
                    const showAvatar = !isMine && (nextMsg?.senderId !== msg.senderId || i === group.messages.length - 1);
                    return (
                      <Bubble
                        key={msg.id}
                        msg={msg}
                        isMine={isMine}
                        showAvatar={showAvatar}
                        participantCount={conv.participants.length}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {isTypingVisible && <div className="mt-2"><TypingDots /></div>}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-4 py-3 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className={`flex items-end gap-2.5 bg-muted/40 border rounded-2xl px-3.5 py-2.5 transition-all duration-150 ${
          text ? "border-primary/40 bg-background/60 shadow-sm" : "border-border/60"
        }`}>
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message…"
            rows={1}
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed min-h-[22px] max-h-[120px] overflow-y-auto scroll-hide py-px"
          />
          <AnimatePresence>
            {text.trim() && (
              <motion.button
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                whileTap={{ scale: 0.88 }}
                onClick={handleSend}
                disabled={send.isPending}
                className="shrink-0 w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm disabled:opacity-50"
                aria-label="Send message"
              >
                {send.isPending
                  ? <Loader2 size={13} className="animate-spin text-primary-foreground" />
                  : <Send size={13} className="text-primary-foreground translate-x-px" />
                }
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[10px] text-muted-foreground/40 mt-1.5 pl-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────── */
function EmptyPane() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10 select-none bg-background/30">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5 shadow-sm"
      >
        <MessageSquare size={32} className="text-muted-foreground/40" />
      </motion.div>
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <h3 className="text-[15px] font-semibold text-foreground mb-1.5">Your messages</h3>
        <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
          Select a conversation to start chatting with donors, NGOs, and volunteers.
        </p>
      </motion.div>
    </div>
  );
}

/* ── Main Messaging page ─────────────────────────────────────────── */
export default function Messaging() {
  const { data: convs, isLoading } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mobilePane, setMobilePane] = useState<"list" | "chat">("list");
  const [showNewChat, setShowNewChat] = useState(false);

  const q = search.toLowerCase().trim();
  const filtered = useMemo(() => {
    if (!q) return convs ?? [];
    return (convs ?? []).filter(c =>
      c.subject.toLowerCase().includes(q) ||
      c.participants.some(p => p.name.toLowerCase().includes(q)) ||
      c.lastMessage?.content.toLowerCase().includes(q),
    );
  }, [convs, q]);

  const activeConv = convs?.find(c => c.id === activeId) ?? null;
  const totalUnread = useMemo(() => (convs ?? []).reduce((s, c) => s + c.unreadCount, 0), [convs]);

  const selectConv = (id: string) => { setActiveId(id); setMobilePane("chat"); };
  const onConvCreated = (conv: Conversation) => { setActiveId(conv.id); setMobilePane("chat"); };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">

      {/* ── Conversation list ── */}
      <div className={[
        "relative flex flex-col w-full md:w-[296px] lg:w-[320px] shrink-0 border-r border-border bg-card min-h-0",
        mobilePane === "chat" ? "hidden md:flex" : "flex",
      ].join(" ")}>
        <AnimatePresence>
          {showNewChat && (
            <NewChatPanel
              onClose={() => setShowNewChat(false)}
              onCreated={onConvCreated}
              existingConvs={convs ?? []}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-foreground tracking-tight">Messages</h2>
              <AnimatePresence>
                {totalUnread > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="px-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[9.5px] font-bold flex items-center justify-center"
                  >
                    {totalUnread}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowNewChat(v => !v)}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${showNewChat ? "bg-primary border-primary text-primary-foreground" : "border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"}`}
              aria-label="New conversation"
            >
              <Plus size={13} className={showNewChat ? "rotate-45 transition-transform" : "transition-transform"} />
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full h-8 bg-muted/50 border border-border/60 rounded-lg pl-8 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 scroll-hide">
          {isLoading ? (
            <div className="space-y-1 p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4 rounded" />
                    <Skeleton className="h-2.5 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <MessageSquare size={22} className="text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">
                {q ? `No results for "${search}"` : "No conversations yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(conv => (
                <ConvItem key={conv.id} conv={conv} active={activeId === conv.id} onClick={() => selectConv(conv.id)} query={q} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Message pane ── */}
      <div className={[
        "flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden",
        mobilePane === "list" && !activeConv ? "hidden md:flex" : "flex",
      ].join(" ")}>
        <AnimatePresence mode="wait">
          {activeConv ? (
            <motion.div
              key={activeConv.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 min-h-0 flex flex-col overflow-hidden"
            >
              <MessagePane
                conv={activeConv}
                onBack={() => { setActiveId(null); setMobilePane("list"); }}
              />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
              <EmptyPane />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
