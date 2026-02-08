// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const secret = process.env.JWT_SECRET;
    const token = await getToken({ req, secret });

    const { pathname } = req.nextUrl;

    if (token) {
        if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    else {
        if (pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Matcher ensure karta hai ki middleware in paths par chale
    matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
};