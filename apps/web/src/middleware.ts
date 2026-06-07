import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ONBOARDING_COMPLETE_KEY } from "@/lib/onboarding";

export function middleware(request: NextRequest) {
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
  matcher: ["/"],
};
