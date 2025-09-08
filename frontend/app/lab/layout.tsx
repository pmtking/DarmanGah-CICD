import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "آزمایشگاه درمانگاه فرهنگیان نیشابور",
  description:
    "دریافت و مشاهده جواب آزمایش‌ها در سامانه آزمایشگاه درمانگاه فرهنگیان نیشابور.",
  keywords: [
    "آزمایشگاه درمانگاه فرهنگیان نیشابور",
    "دریافت جواب آزمایش",
    "جواب آزمایش آنلاین",
    "مشاهده جواب آزمایش",
    "سامانه آزمایشگاه فرهنگیان",
    "پیگیری جواب آزمایش",
  ],
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
  
      <main className=" text-gray-900 min-h-screen">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </main>
    
  );
}
