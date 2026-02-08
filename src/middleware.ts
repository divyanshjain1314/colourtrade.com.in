// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const secret = process.env.JWT_SECRET;

    const token = await getToken({
        req,
        secret,
    });

    console.log("---------------------------------------");
    console.log("PATHNAME:", req.nextUrl.pathname);
    console.log("TOKEN FOUND:", !!token);

    if (token) {
        if (req.nextUrl.pathname === "/" ||
            req.nextUrl.pathname === "/login" ||
            req.nextUrl.pathname === "/signup") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};