import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ONBOARDING_COMPLETE_KEY } from "@/lib/onboarding";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
]);

async function proxyToApi(request: NextRequest): Promise<NextResponse> {
  const target = process.env.API_PROXY_TARGET;
  if (!target) {
    return NextResponse.json({ message: "API proxy not configured" }, { status: 502 });
  }
  const path = request.nextUrl.pathname.replace(/^\/backend\//, "");
  const url = `${target.replace(/\/$/, "")}/${path}${request.nextUrl.search}`;
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }
  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  const response = await fetch(url, init);
  const responseHeaders = new Headers();
  for (const [key, value] of response.headers.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  }
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/backend/")) {
    return proxyToApi(request);
  }
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }
  const hasCompletedOnboarding = request.cookies.get(ONBOARDING_COMPLETE_KEY)?.value === "true";
  if (!hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/backend/:path*"],
};
