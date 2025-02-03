import { withMiddlewareAuthRequired, getAccessToken } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/manage/:path*"],
};

export default withMiddlewareAuthRequired(async function middleware(req) {
  // Retrieve the token with the required scopes.
  const token = await getAccessToken(req, { scopes: ["openid", "profile", "email"] });
  
  // Log token for debugging (remove in production if desired)
  console.log("Middleware token:", token);
  
  // Read roles from the custom claim
  const roles = token?.accessToken["https://localhost:3000/roles"] || [];
  console.log("Middleware roles:", roles);
  
  // If there is no token or the roles do not include "Manager", redirect
  if (!token || !roles.includes("Manager")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard"; // Fallback route for non-managers
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
});
