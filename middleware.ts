import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN } from "./constants/config";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get(ACCESS_TOKEN);

  if (request.nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (request.nextUrl.pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}
