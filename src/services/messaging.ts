import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { api, isMock, type PaginatedResponse } from "@/infrastructure/api/client";
import type { Conversation, Message } from "@/types";

/* ── Mock fixtures ───────────────────────────────────────────── */

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    subject: "Fresh Produce Donation — DON-2026-000124",
    donationId: "DON-2026-000124",
    type: "donation",
    participants: [
      { id: "u1", name: "Sarah Chen", initials: "SC", role: "donor", online: true },
      { id: "u2", name: "Community Kitchen", initials: "CK", role: "ngo", online: false },
    ],
    lastMessage: { id: "m3", conversationId: "conv-001", senderId: "u2", senderName: "Community Kitchen", senderInitials: "CK", content: "Can you do a 3 PM pickup instead?", type: "text", createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), readBy: [] },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "conv-002",
    subject: "Delivery DEL-2026-000085",
    deliveryId: "DEL-2026-000085",
    type: "delivery",
    participants: [
      { id: "u3", name: "Ravi Kumar", initials: "RK", role: "volunteer", online: true },
      { id: "u2", name: "Community Kitchen", initials: "CK", role: "ngo", online: false },
    ],
    lastMessage: { id: "m7", conversationId: "conv-002", senderId: "u3", senderName: "Ravi Kumar", senderInitials: "RK", content: "I'm 10 minutes away.", type: "text", createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), readBy: ["u2"] },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "conv-003",
    subject: "Bakery Surplus — Coordination",
    type: "general",
    participants: [
      { id: "u4", name: "Metro Bakery", initials: "MB", role: "donor", online: false },
      { id: "u5", name: "Hope Foundation", initials: "HF", role: "ngo", online: true },
    ],
    lastMessage: { id: "m10", conversationId: "conv-003", senderId: "u4", senderName: "Metro Bakery", senderInitials: "MB", content: "We have 40 kg of bread ready daily.", type: "text", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), readBy: ["u4", "u5"] },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

function buildMockMessages(convId: string): Message[] {
  const bases: Record<string, Message[]> = {
    "conv-001": [
      { id: "m1", conversationId: "conv-001", senderId: "u1", senderName: "Sarah Chen", senderInitials: "SC", content: "Hi! We have 60 kg of mixed produce ready for pickup today.", type: "text", createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), readBy: ["u1","u2"] },
      { id: "m2", conversationId: "conv-001", senderId: "u2", senderName: "Community Kitchen", senderInitials: "CK", content: "Great! We can send a volunteer around 2 PM. Does that work?", type: "text", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), readBy: ["u1","u2"] },
      { id: "m3", conversationId: "conv-001", senderId: "u2", senderName: "Community Kitchen", senderInitials: "CK", content: "Can you do a 3 PM pickup instead?", type: "text", createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), readBy: [] },
    ],
    "conv-002": [
      { id: "m5", conversationId: "conv-002", senderId: "u3", senderName: "Ravi Kumar", senderInitials: "RK", content: "I've confirmed the pickup from Green Harvest. On my way to you now.", type: "text", createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), readBy: ["u2","u3"] },
      { id: "m6", conversationId: "conv-002", senderId: "u2", senderName: "Community Kitchen", senderInitials: "CK", content: "Excellent! Our loading bay is on the north side. Gate code is 1234.", type: "text", createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), readBy: ["u2","u3"] },
      { id: "m7", conversationId: "conv-002", senderId: "u3", senderName: "Ravi Kumar", senderInitials: "RK", content: "I'm 10 minutes away.", type: "text", createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), readBy: ["u2"] },
    ],
    "conv-003": [
      { id: "m9", conversationId: "conv-003", senderId: "u5", senderName: "Hope Foundation", senderInitials: "HF", content: "Hello! We saw your bakery listing on eekai. Are you looking for NGO partners?", type: "text", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), readBy: ["u4","u5"] },
      { id: "m10", conversationId: "conv-003", senderId: "u4", senderName: "Metro Bakery", senderInitials: "MB", content: "We have 40 kg of bread ready daily.", type: "text", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), readBy: ["u4","u5"] },
    ],
  };
  return bases[convId] ?? [];
}

/* ── Hooks ───────────────────────────────────────────────────── */

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async (): Promise<Conversation[]> => {
      if (isMock) {
        await new Promise(r => setTimeout(r, 400));
        return MOCK_CONVERSATIONS;
      }
      const res = await api.get<PaginatedResponse<Conversation>>("/messaging/conversations?limit=30");
      return res.data;
    },
    refetchInterval: isMock ? false : 60_000,
  });
}

export function useMessages(conversationId: string | null) {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 0 }): Promise<{ messages: Message[]; hasMore: boolean }> => {
      if (!conversationId) return { messages: [], hasMore: false };
      if (isMock) {
        await new Promise(r => setTimeout(r, 300));
        const msgs = buildMockMessages(conversationId);
        return { messages: msgs, hasMore: false };
      }
      const res = await api.get<PaginatedResponse<Message>>(
        `/messaging/conversations/${conversationId}/messages?page=${pageParam}&limit=40`,
      );
      return { messages: res.data, hasMore: res.meta.page < res.meta.totalPages - 1 };
    },
    initialPageParam: 0,
    getNextPageParam: (last, _, lastPageParam) => last.hasMore ? (lastPageParam as number) + 1 : undefined,
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }): Promise<Message> => {
      if (isMock) {
        await new Promise(r => setTimeout(r, 200));
        return {
          id: `m_${Date.now()}`,
          conversationId,
          senderId: "me",
          senderName: "You",
          senderInitials: "YO",
          content,
          type: "text",
          createdAt: new Date().toISOString(),
          readBy: ["me"],
        };
      }
      return api.post<Message>(`/messaging/conversations/${conversationId}/messages`, { content });
    },
    onSuccess: (msg) => {
      // Optimistically append to local cache
      qc.setQueryData(["messages", msg.conversationId], (old: { pages: { messages: Message[] }[] } | undefined) => {
        if (!old) return old;
        const pages = [...old.pages];
        const last = pages[pages.length - 1];
        pages[pages.length - 1] = { ...last, messages: [...last.messages, msg] };
        return { ...old, pages };
      });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { participantIds: string[]; subject: string; donationId?: string; deliveryId?: string }): Promise<Conversation> => {
      if (isMock) {
        await new Promise(r => setTimeout(r, 600));
        return {
          id: `conv_${Date.now()}`,
          subject: payload.subject,
          donationId: payload.donationId,
          deliveryId: payload.deliveryId,
          type: payload.donationId ? "donation" : payload.deliveryId ? "delivery" : "general",
          participants: [],
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        };
      }
      return api.post<Conversation>("/messaging/conversations", payload);
    },
    onSuccess: (conv) => {
      if (isMock) {
        // Merge into cache without blowing away optimistic entries
        qc.setQueryData<Conversation[]>(["conversations"], old =>
          old?.some(c => c.id === conv.id) ? old : [conv, ...(old ?? [])],
        );
      } else {
        qc.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  });
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (isMock) return conversationId;
      await api.post(`/messaging/conversations/${conversationId}/read`);
      return conversationId;
    },
    onSuccess: (id) => {
      qc.setQueryData<Conversation[]>(["conversations"], old =>
        old?.map(c => c.id === id ? { ...c, unreadCount: 0 } : c),
      );
    },
  });
}
