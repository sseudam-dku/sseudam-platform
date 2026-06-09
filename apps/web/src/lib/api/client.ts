import { API_BASE_URL } from "./config";

const ACCESS_TOKEN_KEY = "sseudam-access-token";
const REFRESH_TOKEN_KEY = "sseudam-refresh-token";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {}
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {}
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

let refreshInFlight: Promise<void> | null = null;

export async function refreshAccessToken(): Promise<void> {
  if (refreshInFlight) {
    return refreshInFlight;
  }
  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new ApiError("Refresh token not found", 401);
    }
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      clearTokens();
      let message = `Request failed (${response.status})`;
      try {
        const errorBody = (await response.json()) as { message?: string | string[] };
        if (typeof errorBody.message === "string") {
          message = errorBody.message;
        } else if (Array.isArray(errorBody.message)) {
          message = errorBody.message.join(", ");
        }
      } catch {}
      throw new ApiError(message, response.status);
    }
    const data = (await response.json()) as { accessToken: string };
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    } catch {}
  })();
  try {
    await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errorBody = (await response.json()) as { message?: string | string[] };
      if (typeof errorBody.message === "string") {
        message = errorBody.message;
      } else if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(", ");
      }
    } catch {}
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

function buildRequestHeaders(headers: HeadersInit | undefined, body: unknown): Headers {
  const requestHeaders = new Headers(headers);
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }
  return requestHeaders;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, auth = false, headers, ...rest } = options;
  const requestHeaders = buildRequestHeaders(headers, body);

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  if (response.status === 401 && auth && path !== "/auth/refresh" && path !== "/auth/logout") {
    await refreshAccessToken();
    const retryHeaders = buildRequestHeaders(headers, body);
    const newToken = getAccessToken();
    if (newToken) {
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
    }
    const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: retryHeaders,
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    return parseResponse<T>(retryResponse);
  }

  return parseResponse<T>(response);
}
