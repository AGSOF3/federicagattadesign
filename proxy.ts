import { NextResponse, NextRequest } from "next/server";
import { isLocale } from "@/lib/locales";
export function proxy(request: NextRequest) {
  const h = new Headers(request.headers);
  h.set(
    "x-site-locale",
    isLocale(request.nextUrl.pathname.split("/")[1])
      ? request.nextUrl.pathname.split("/")[1]
      : "en",
  );
  return NextResponse.next({ request: { headers: h } });
}
export const config = {
  matcher: [
    "/((?!api|_next|images|videos|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
