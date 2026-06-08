import { API_BASE_URL } from "./config";

const LEGACY_TOKEN_KEY = "sseudam-access-token";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Removes legacy localStorage token from before cookie-only auth migration. */
export function clearLegacyAccessToken(): void {
  try {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
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
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
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
    await response.json();
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });
  if (response.status === 401 && auth && path !== "/auth/refresh" && path !== "/auth/logout") {
    await refreshAccessToken();
    const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: buildRequestHeaders(headers, body),
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    return parseResponse<T>(retryResponse);
  }
  return parseResponse<T>(response);
}
