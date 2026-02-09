// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const secret = process.env.JWT_SECRET;
    const token = await getToken({ req, secret });
    const { pathname } = req.nextUrl;

    if (token) {
        const userRole = token.role;

        if (userRole === 'admin') {
            if (pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard")) {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
        }

        else {
            if (pathname.startsWith("/admin")) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }
    }

    else {
        if (pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Note: Yahan "/admin/:path*" add karna zaroori hai
    matcher: ["/", "/login", "/signup", "/dashboard/:path*", "/admin/:path*"],
};