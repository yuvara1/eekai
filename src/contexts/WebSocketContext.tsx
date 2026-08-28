import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { getToken, WS_URL, isMock } from "@/infrastructure/api/client";
import type { WsEvent, WsEventType } from "@/types";

type Handler<T = unknown> = (event: WsEvent<T>) => void;

interface WebSocketContextValue {
  connected: boolean;
  subscribe: <T>(destination: string, handler: Handler<T>) => () => void;
  publish: (destination: string, body: unknown) => void;
  on: <T>(type: WsEventType, handler: Handler<T>) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  connected: false,
  subscribe: () => () => {},
  publish: () => {},
  on: () => () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const subMapRef = useRef<Map<string, Set<Handler>>>(new Map());
  const eventMapRef = useRef<Map<WsEventType, Set<Handler>>>(new Map());
  const pendingPublishRef = useRef<Array<{ dest: string; body: unknown }>>([]);

  useEffect(() => {
    if (isMock) return;

    let disposed = false;
    let client: Client | null = null;

    void import("sockjs-client").then(({ default: SockJS }) => {
      if (disposed) return;

      client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: { Authorization: `Bearer ${getToken() ?? ""}` },
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
          setConnected(true);

          // Subscribe to user-specific event stream (Kafka-sourced)
          client?.subscribe("/user/queue/events", (msg: IMessage) => {
            try {
              const event = JSON.parse(msg.body) as WsEvent;
              // Route to type-based handlers
              const handlers = eventMapRef.current.get(event.type);
              if (handlers) handlers.forEach((h) => h(event));
            } catch {}
          });

          // Subscribe to user-specific notifications
          client?.subscribe("/user/queue/notifications", (msg: IMessage) => {
            try {
              const event = JSON.parse(msg.body) as WsEvent;
              const handlers = eventMapRef.current.get(event.type);
              if (handlers) handlers.forEach((h) => h(event));
            } catch {}
          });

          // Flush any publishes that queued before connect
          pendingPublishRef.current.forEach(({ dest, body }) => {
            client?.publish({ destination: dest, body: JSON.stringify(body) });
          });
          pendingPublishRef.current = [];
        },

        onDisconnect: () => setConnected(false),
        onStompError: () => setConnected(false),
      });

      client.activate();
      clientRef.current = client;
    });

    return () => {
      disposed = true;
      if (client) {
        void client.deactivate();
        if (clientRef.current === client) clientRef.current = null;
      }
    };
  }, []);

  /** Subscribe to a raw STOMP destination. Returns unsubscribe fn. */
  const subscribe = useCallback(
    <T,>(destination: string, handler: Handler<T>) => {
      const client = clientRef.current;
      let stompsub: StompSubscription | null = null;

      if (client?.connected) {
        stompsub = client.subscribe(destination, (msg: IMessage) => {
          try {
            handler(JSON.parse(msg.body) as WsEvent<T>);
          } catch {}
        });
      } else {
        // Queue for when connection opens
        const set = subMapRef.current.get(destination) ?? new Set();
        set.add(handler as Handler);
        subMapRef.current.set(destination, set);
      }

      return () => {
        stompsub?.unsubscribe();
        subMapRef.current.get(destination)?.delete(handler as Handler);
      };
    },
    [],
  );

  /** Listen for a specific WsEventType. Returns unsubscribe fn. */
  const on = useCallback(<T,>(type: WsEventType, handler: Handler<T>) => {
    const set = eventMapRef.current.get(type) ?? new Set();
    set.add(handler as Handler);
    eventMapRef.current.set(type, set);
    return () => {
      eventMapRef.current.get(type)?.delete(handler as Handler);
    };
  }, []);

  /** Publish to a STOMP destination. Queues if not yet connected. */
  const publish = useCallback((destination: string, body: unknown) => {
    const client = clientRef.current;
    if (client?.connected) {
      client.publish({ destination, body: JSON.stringify(body) });
    } else {
      pendingPublishRef.current.push({ dest: destination, body });
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ connected, subscribe, publish, on }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}

/** Hook: subscribe to a STOMP destination and run handler on messages */
export function useStompSubscription<T>(
  destination: string,
  handler: Handler<T>,
  deps: React.DependencyList = [],
) {
  const { subscribe } = useWebSocket();
  useEffect(() => {
    if (!destination) return;
    return (subscribe as <U>(d: string, h: Handler<U>) => () => void)<T>(
      destination,
      handler,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, ...deps]);
}

/** Hook: react to a specific WsEventType */
export function useWsEvent<T>(type: WsEventType, handler: Handler<T>) {
  const { on } = useWebSocket();
  useEffect(
    () =>
      (on as <U>(t: WsEventType, h: Handler<U>) => () => void)<T>(
        type,
        handler,
      ),
    [on, type, handler],
  );
}
