// app/admin/layout.tsx
"use client";

import { ReactNode } from "react";
import { UserProvider } from "@/context/UserContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <html lang="fa">
      <body className="bg-gray-100 font-sans">
        <UserProvider>
          <div className="flex min-h-screen">
            {/* نوار کناری ادمین */}

            {/* محتوای اصلی */}
            <main className="flex-grow p-6">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
};

export default AdminLayout;
