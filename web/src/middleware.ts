import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authPages, dashboardPages } from "./config/pages";

const authPagesPaths = Object.values(authPages).map((page) => page.route);

const dashboardPagesPaths = Object.values(dashboardPages).map(
  (page) => page.route,
);

const isProtectedRoute = createRouteMatcher(dashboardPagesPaths);
const isAuthRoute = createRouteMatcher(authPagesPaths);
const isAuthRedirect = createRouteMatcher([dashboardPages.authRedirect.route]);

export default clerkMiddleware((auth, req) => {
  const { sessionClaims, userId } = auth();

  const isSyncedWithDatabase = sessionClaims?.databaseID;

  if (!userId && isProtectedRoute(req)) {
    const params = new URLSearchParams({
      redirect_url: req.url,
    }).toString();

    const url = new URL(`${authPages.login.route}?${params}`, req.url);
    return NextResponse.redirect(url);
  }

  if (userId && !isSyncedWithDatabase && !isAuthRedirect(req)) {
    return NextResponse.redirect(
      new URL(dashboardPages.authRedirect.route, req.url),
    );
  }

  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(
      new URL(dashboardPages.mainPage.route, req.url),
    );
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
