import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  
  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
    return;
  }

  // Protect /note route (both create and edit)
  if (pathname.startsWith("/note") && !isLoggedIn) {
    let redirectUrl = new URL("/login", req.nextUrl);
    redirectUrl.searchParams.set("callbackUrl", req.url);
    return Response.redirect(redirectUrl);
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
