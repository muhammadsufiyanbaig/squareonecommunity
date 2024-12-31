import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const email = request.cookies.get("email")?.value; 
  const url = request.nextUrl.clone();

  if (!email && url.pathname.startsWith("/")) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/web/:path*"],
};
