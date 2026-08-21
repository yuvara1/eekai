import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "donor" | "ngo" | "volunteer" | "admin";

interface User {
  name: string;
  email: string;
  initials: string;
  orgName: string;
}

const usersByRole: Record<Role, User> = {
  donor: { name: "Sarah Chen", email: "sarah@greenharvest.org", initials: "SC", orgName: "Green Harvest Co." },
  ngo: { name: "Maria Santos", email: "maria@commkitchen.org", initials: "MS", orgName: "Community Kitchen" },
  volunteer: { name: "Alex Rivera", email: "alex.r@volunteer.org", initials: "AR", orgName: "FoodBridge Volunteer" },
  admin: { name: "James Park", email: "james@foodbridge.org", initials: "JP", orgName: "FoodBridge Admin" },
};

interface AppState {
  /* Navigation */
  currentPage: string;
  currentRole: Role;
  authMode: "login" | "register";
  sidebarOpen: boolean;
  modal: string | null;

  /* User */
  user: User;

  /* Notifications */
  notifCounts: Record<Role, number>;
  unreadIds: number[];

  /* Actions */
  navigate: (page: string) => void;
  setRole: (role: Role) => void;
  setAuthMode: (mode: "login" | "register") => void;
  setSidebarOpen: (open: boolean) => void;
  setModal: (modal: string | null) => void;
  markNotifRead: (id: number) => void;
  markAllNotifsRead: () => void;
  decrementNotifCount: () => void;
}

const MODAL_PAGES = new Set(["donation-details", "delivery-tracking"]);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: "landing",
      currentRole: "donor",
      authMode: "login",
      sidebarOpen: false,
      modal: null,
      user: usersByRole.donor,
      notifCounts: { donor: 3, ngo: 5, volunteer: 2, admin: 7 },
      unreadIds: [1, 2, 3],

      navigate: (page) => {
        if (page === "login") { set({ authMode: "login", currentPage: "auth" }); return; }
        if (page === "register") { set({ authMode: "register", currentPage: "auth" }); return; }
        if (MODAL_PAGES.has(page)) { set({ modal: page }); return; }
        set({ modal: null, currentPage: page });
        window.scrollTo(0, 0);
      },

      setRole: (role) => set({ currentRole: role, user: usersByRole[role] }),

      setAuthMode: (mode) => set({ authMode: mode }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setModal: (modal) => set({ modal }),

      markNotifRead: (id) => {
        const { unreadIds } = get();
        if (!unreadIds.includes(id)) return;
        set({ unreadIds: unreadIds.filter(i => i !== id) });
      },

      markAllNotifsRead: () => set({ unreadIds: [] }),

      decrementNotifCount: () => {
        const { currentRole, notifCounts } = get();
        set({ notifCounts: { ...notifCounts, [currentRole]: Math.max(0, notifCounts[currentRole] - 1) } });
      },
    }),
    {
      name: "fb-app",
      partialize: (s) => ({ currentRole: s.currentRole, notifCounts: s.notifCounts }),
    }
  )
);

export type { Role, User };
