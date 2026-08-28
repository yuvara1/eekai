const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
export const WS_URL = (import.meta.env.VITE_WS_URL as string | undefined) ?? `${BASE}/ws`;

export const isMock = !BASE;

/* ── Token storage ───────────────────────────────────────────── */

const TOKEN_KEY = "fb_token";
const REFRESH_KEY = "fb_refresh";

export function getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
export function getRefreshToken(): string | null { return localStorage.getItem(REFRESH_KEY); }

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/* ── Error type ──────────────────────────────────────────────── */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ── Token refresh (singleton promise to prevent parallel refreshes) ── */

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new ApiError(401, "NO_REFRESH_TOKEN", "Session expired");

    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) {
      clearTokens();
      throw new ApiError(401, "REFRESH_FAILED", "Session expired — please sign in again");
    }
    const { token, refreshToken } = (await res.json()) as { token: string; refreshToken: string };
    setTokens(token, refreshToken);
    return token;
  })().finally(() => { refreshPromise = null; });

  return refreshPromise;
}

/* ── Fetch wrapper ───────────────────────────────────────────── */

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  public?: boolean;
  _retry?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, public: isPublic, _retry, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (!isPublic) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401
  if (res.status === 401 && !isPublic && !_retry) {
    try {
      const newToken = await refreshAccessToken();
      return apiFetch<T>(path, { ...options, _retry: true, headers: { ...headers, Authorization: `Bearer ${newToken}` } });
    } catch {
      // Refresh failed — broadcast logout signal
      window.dispatchEvent(new CustomEvent("auth:logout"));
      throw new ApiError(401, "SESSION_EXPIRED", "Your session has expired. Please sign in again.");
    }
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = (json as { error?: { code?: string; message?: string; details?: unknown } }).error;
    throw new ApiError(
      res.status,
      err?.code ?? "UNKNOWN",
      err?.message ?? `HTTP ${res.status}`,
      err?.details,
    );
  }

  return json as T;
}

/* ── Paginated envelope ──────────────────────────────────────── */

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/* ── Convenience shorthands ──────────────────────────────────── */

export const api = {
  get: <T>(path: string, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "POST", body, ...opts }),

  patch: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "PATCH", body, ...opts }),

  put: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "PUT", body, ...opts }),

  delete: <T>(path: string, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "DELETE", ...opts }),
};
