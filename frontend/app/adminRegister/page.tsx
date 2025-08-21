'use client';
import Input from "@/components/Input/page";
import { useState } from "react";
import Button from "@/components/Button/page";
import useAuth from "@/hooks/useAuth";

const AdminRegisterPage = () => {
    const [number, setNumber] = useState(""); // شماره تماس به صورت رشته
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const { register, user, loading, error } = useAuth();

    const handleRegister = async () => {
        if (!number || !password ) {
            alert("لطفا تمام فیلدها را پر کنید.");
            return;
        }

        await register({
            number: number, // فرض بر این است که شماره تماس به عنوان ایمیل استفاده می‌شود
            password: password ,
            role:'ADMIN'
        });
    };

    return (
        <main className="flex justify-center items-center w-full h-screen">
            <div className="flex flex-col justify-center gap-10 items-center border border-amber-50 px-10 py-10 rounded-3xl">
                <h1 className="text-2xl font-bold">ثبت نام</h1>

                <div className="flex flex-col justify-center items-center gap-3 w-full">

                    <Input
                        placeholder="شماره تماس"
                        type="text"
                        value={number}
                        onChange={(e: any) => setNumber(e.target.value)}
                        className="outline-0 border rounded-2xl border-gray-500 px-3 py-2 w-64"
                    />
                    <Input
                        placeholder="رمز عبور"
                        type="text"
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        className="outline-0 border rounded-2xl border-gray-500 px-3 py-2 w-64"
                    />
                </div>
                <Button
                    name={loading ? "در حال ثبت نام..." : "ثبت نام"}
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                />
            </div>
        </main>
    );
};

export default AdminRegisterPage;
