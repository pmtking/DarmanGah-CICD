import type { Metadata } from "next";
import "../public/fonts/style.css";
import "../styles/sass/main.scss";
import "./globals.css";


import toast, { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "درمانگاه فرهنگیان نیشابور | رزرو نوبت آنلاین",
  description:
    "رزرو نوبت آنلاین درمانگاه فرهنگیان نیشابور؛ خدمات درمانی، پزشکی و تخصصی برای فرهنگیان و خانواده‌ها.",
  keywords: [
    "درمانگاه فرهنگیان نیشابور",
    "رزرو نوبت درمانگاه فرهنگیان نیشابور",
    "نوبت‌دهی آنلاین درمانگاه نیشابور",
    "کلینیک فرهنگیان نیشابور",
    "بهترین درمانگاه نیشابور",
    "پزشک نیشابور",
    "خدمات درمانی نیشابور",
    "نوبت اینترنتی درمانگاه",
  ],
  openGraph: {
    title: "درمانگاه فرهنگیان نیشابور | رزرو نوبت آنلاین",
    description:
      "امکان رزرو نوبت آنلاین و خدمات درمانی برای فرهنگیان و خانواده‌ها در نیشابور.",
    url: "https://df-neyshabor.ir",
    siteName: "درمانگاه فرهنگیان نیشابور",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "درمانگاه فرهنگیان نیشابور | رزرو نوبت آنلاین",
    description:
      "رزرو نوبت آنلاین و خدمات پزشکی و درمانی برای فرهنگیان و خانواده‌ها در نیشابور.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://df-neyshabor.ir",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="light">
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      <head>
        {/* Structured Data برای گوگل */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              name: "درمانگاه فرهنگیان نیشابور",
              url: "https://df-neyshabor.ir",
              logo: "https://df-neyshabor.ir/logo.png",
              description:
                "رزرو نوبت آنلاین درمانگاه فرهنگیان نیشابور؛ خدمات درمانی و پزشکی برای فرهنگیان و خانواده‌ها.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "نیشابور",
                addressCountry: "IR",
              },
              sameAs: [
                "https://www.instagram.com/yourpage",
                "https://t.me/yourchannel",
              ],
            }),
          }}
        />
      </head>
      <body className="w-full bg-gray-50 text-gray-900 min-h-screen">
        {/* Toaster برای نمایش نوتیفیکیشن */}
        <Toaster position="top-center" />

        {/* ناوبری عمومی */}
        {/* <NavBar /> */}

        {/* محتوای اصلی */}
        <main className="flex flex-col px-4 sm:px-6 md:px-12 lg:px-20 py-6 gap-12">
          {children}
        </main>
      </body>
    </html>
  );
}
