import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

    const token = request.cookies.get("token")?.value
    const { pathname } = request.nextUrl

    const isLoginPage = pathname === "/auth/login"

    // ROOT URL
    if (pathname === "/") {
        if (!token) {
            return NextResponse.redirect(new URL("/auth/login", request.url))
        } else {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    }

    // Not logged in → redirect to login
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Logged in but accessing login → redirect dashboard
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}