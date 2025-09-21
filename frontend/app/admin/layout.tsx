// app/admin/layout.tsx

import DashboardNav from "@/components/DashboardNav/page";
import SideBar from "@/components/SideBar/page";
import defaultImage from '@/public/images/image 8.png'
import { AdminAuthProvider } from "@/hooks/AdminAuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
       
            <div className="flex min-h-screen justify-start gap-2 w-full ">
                <SideBar />
                <div className="flex-1 px-5 ">
                    <DashboardNav user={{ name: "محمد", }}  />
                    {children}
                </div>
            </div>
       
    );
}
