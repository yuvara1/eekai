import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export interface Donation {
  id: string; title: string; category: string; quantity: string;
  status: "pending" | "matched" | "in_transit" | "completed" | "expired";
  ngo?: string; date: string; expiry: string; impact?: string;
}

export interface NotificationItem {
  id: number; cat: string; icon: string; title: string; body: string; time: string; read: boolean;
}

export interface DeliveryStats {
  completed: number; inProgress: number; totalKg: number; rating: number;
}

/* ── Helpers ── */
function seededRnd(s: number) { let x = Math.sin(s) * 10000; return x - Math.floor(x); }
function pickSeeded<T>(arr: T[], seed: number): T { return arr[Math.floor(seededRnd(seed) * arr.length)]; }

const categories = ["Produce", "Bakery", "Dairy", "Prepared Meals", "Canned Goods", "Meat & Protein", "Beverages", "Snacks"];
const ngoNames = ["Community Kitchen", "Hope Foundation", "City Shelter", "Faith Community", "Metro Food Bank", "Sunrise Care", "Bay Volunteers", "Family First NGO", "Ocean View Shelter", "Urban Harvest"];
const foodNames = ["Assorted Produce Mix", "Sourdough Bread Assortment", "Greek Yogurt Cases", "Seasonal Fruit Mix", "Prepared Pasta Meals", "Mixed Sandwiches", "Fresh Vegetable Crates", "Bakery Pastry Box", "Dairy Pack Surplus", "Canned Bean Assortment", "Frozen Chicken Portions", "Rice & Lentils Bulk", "Organic Salad Mix", "Artisan Bread Loaves", "Fruit Juice Cases", "Snack Variety Packs", "Cooked Rice Trays", "Cheese Wheel Assortment", "Muffin & Croissant Box", "Protein Bar Surplus"];
const statuses: Donation["status"][] = ["pending","matched","in_transit","completed","completed","completed","expired"];
const times = ["2h ago","5h ago","Yesterday","Aug 19","Aug 18","Aug 17","Aug 16","Aug 15","Aug 14","Aug 13","Aug 12","Aug 10","Aug 8","Aug 5","Aug 1"];
const expiries = ["Today 6 PM","Tonight 8 PM","Tomorrow 10 AM","Aug 22 6 PM","Aug 23","Aug 24","Expired","—"];

const mockDonations: Donation[] = Array.from({ length: 120 }, (_, i) => {
  const s = 37 + i * 11;
  const status = pickSeeded(statuses, s);
  const cat = pickSeeded(categories, s + 1);
  const qty = Math.floor(seededRnd(s + 2) * 90) + 10;
  const ngo = ["matched","in_transit","completed"].includes(status) ? pickSeeded(ngoNames, s + 3) : undefined;
  return {
    id: `DON-2026-${String(119 + i).padStart(6, "0")}`,
    title: pickSeeded(foodNames, s + 4),
    category: cat,
    quantity: `${qty} ${cat === "Prepared Meals" || cat === "Snacks" ? "portions" : "kg"}`,
    status,
    ngo,
    date: pickSeeded(times, s + 5),
    expiry: status === "completed" || status === "expired" ? "—" : pickSeeded(expiries.slice(0, 6), s + 6),
    impact: ["completed"].includes(status) ? `${qty * 2} meals` : undefined,
  };
});

const mockNotifications: NotificationItem[] = [
  { id: 1,  cat: "matches",   icon: "zap",    title: "New donation matched",       body: "DON-2026-000125 matched with Community Kitchen (94% score)",              time: "5 min ago",  read: false },
  { id: 2,  cat: "deliveries",icon: "truck",  title: "Volunteer assigned",          body: "Alex Rivera assigned to DEL-2026-000088. Pickup at 5:30 PM",             time: "22 min ago", read: false },
  { id: 3,  cat: "donations", icon: "check",  title: "NGO accepted your donation",  body: "Community Kitchen accepted DON-2026-000124 (48 kg)",                     time: "1h ago",     read: false },
  { id: 4,  cat: "deliveries",icon: "party",  title: "Delivery completed",          body: "DEL-2026-000085 completed. 48 kg delivered to Community Kitchen",        time: "3h ago",     read: true  },
  { id: 5,  cat: "donations", icon: "clock",  title: "Donation expiring soon",      body: "DON-2026-000126 expires in 4 hours. No match found yet",                 time: "4h ago",     read: true  },
  { id: 6,  cat: "system",    icon: "shield", title: "Organization verified",       body: "Green Harvest Co. has been verified by our platform team",               time: "1d ago",     read: true  },
  { id: 7,  cat: "donations", icon: "x",      title: "Donation expired",            body: "DON-2026-000119 expired without a match",                                time: "2d ago",     read: true  },
  { id: 8,  cat: "deliveries",icon: "camera", title: "Pickup confirmed",            body: "Volunteer confirmed pickup of DON-2026-000124. Currently in transit",    time: "2d ago",     read: true  },
  { id: 9,  cat: "matches",   icon: "zap",    title: "High-confidence match found", body: "DON-2026-000118 matched with Hope Foundation (89% score)",               time: "3d ago",     read: true  },
  { id: 10, cat: "system",    icon: "shield", title: "Monthly impact report ready", body: "Your August impact report is ready. 284 kg rescued, 96 meals served",    time: "4d ago",     read: true  },
  { id: 11, cat: "donations", icon: "check",  title: "NGO accepted your donation",  body: "Metro Food Bank accepted DON-2026-000116 (60 kg fresh produce)",         time: "5d ago",     read: true  },
  { id: 12, cat: "deliveries",icon: "party",  title: "Delivery completed",          body: "DEL-2026-000079 completed. 60 kg delivered to Metro Food Bank",          time: "5d ago",     read: true  },
  { id: 13, cat: "donations", icon: "clock",  title: "Donation expiring soon",      body: "DON-2026-000122 — Seasonal Fruit Mix — expires in 6 hours",              time: "6d ago",     read: true  },
  { id: 14, cat: "matches",   icon: "zap",    title: "New donation matched",        body: "DON-2026-000115 matched with City Shelter (91% score)",                  time: "7d ago",     read: true  },
  { id: 15, cat: "system",    icon: "shield", title: "System maintenance complete", body: "Scheduled maintenance completed. All services restored",                 time: "8d ago",     read: true  },
];

const mockDeliveryStats: DeliveryStats = { completed: 247, inProgress: 3, totalKg: 8640, rating: 4.9 };

export function useDonations() {
  return useQuery({
    queryKey: ["donations"],
    queryFn: async (): Promise<Donation[]> => { await delay(600); return mockDonations; },
  });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationItem[]> => { await delay(400); return mockNotifications; },
    refetchInterval: 30_000,
  });
}

export function useDeliveryStats() {
  return useQuery({
    queryKey: ["delivery-stats"],
    queryFn: async (): Promise<DeliveryStats> => { await delay(500); return mockDeliveryStats; },
  });
}

export function usePublishDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      await delay(1200);
      return { id: `DON-2026-${String(Date.now()).slice(-6)}`, ...data as object };
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["donations"] }); },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => { await delay(100); return id; },
    onSuccess: (id) => {
      qc.setQueryData<NotificationItem[]>(["notifications"], old =>
        old?.map(n => n.id === id ? { ...n, read: true } : n)
      );
    },
  });
}
