import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    // proteksi untuk /admin, /dosen, /mahasiswa
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dosen") ||
      pathname.startsWith("/mahasiswa")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // ✅ Kalau ada token, verify
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 5 });

    //   cek role
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (
      pathname.startsWith("/dosen") &&
      payload.role !== "lecturer" &&
      payload.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/mahasiswa") && payload.role !== "student") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dosen/:path*",
    "/mahasiswa/:path*",
    "/auth/:path*", // tambahkan ini biar middleware juga kena di /auth/*
  ],
};
