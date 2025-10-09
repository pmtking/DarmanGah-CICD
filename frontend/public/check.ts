// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 🛡️ مسیرهایی که ورود با گوگل در آن‌ها ممنوع است
const PROTECTED_PATHS = ["/admin", "/reseption", "/dr-panel"];

// ✅ فقط IPهای داخلی یا مجاز می‌توانند وارد شوند
const ALLOWED_IPS = ["192.168.1.100", "192.171.1.100", "127.0.0.1", "::1"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ بررسی کن آیا مسیر مورد نظر جزو مسیرهای محافظت‌شده است؟
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // 2️⃣ گرفتن IP کاربر از header x-forwarded-for
  //    این header در سرورهای proxy مثل Vercel، Netlify و Nginx همیشه IP واقعی کاربر را می‌دهد
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

  // 3️⃣ اگر IP در لیست مجاز نبود → هدایت به صفحه 403
  if (!ALLOWED_IPS.includes(ip)) {
    console.warn(`🚫 Blocked IP access: ${ip}`);
    return NextResponse.redirect(new URL("/403", req.url));
  }

  // 4️⃣ گرفتن توکن کاربر از کوکی (NextAuth JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 5️⃣ اگر کاربر لاگین نکرده → هدایت به صفحه login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 6️⃣ اگر با گوگل لاگین کرده → مسدودش کن
  if (token.provider === "google" || token.email?.endsWith("@gmail.com")) {
    console.warn(`❌ Google login blocked for: ${token.email}`);
    return NextResponse.redirect(new URL("/403", req.url));
  }

  // 7️⃣ اگر همه چیز درست بود → اجازه ورود
  return NextResponse.next();
}

// 🌐 مسیرهایی که middleware روی آن‌ها اجرا می‌شود
export const config = {
  matcher: ["/admin/:path*", "/reseption/:path*", "/dr-panel/:path*"],
};
