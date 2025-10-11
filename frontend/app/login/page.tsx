"use client";
import Button from "@/components/Button/page";
import Header from "@/components/header/page";
import Input from "@/components/Input/page";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Login = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, loading } = useAuth();

  const [forgotOpen, setForgotOpen] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketMessage, setTicketMessage] = useState("فراموشی رمز عبور");
  const [ticketStatus, setTicketStatus] = useState<"idle" | "processing" | "sent">("idle");

  const handleLogin = async () => {
    try {
      const userData = await login({ userName, password });

   
      toast.success("ورود موفق ✅");
    } catch (err) {
      console.error(err);
      toast.error("نام کاربری یا رمز عبور اشتباه ❌");
    }
  };

  const handleSendTicket = () => {
    if (!ticketName) {
      toast.error("لطفا نام خود را وارد کنید");
      return;
    }

    setTicketStatus("processing");

    setTimeout(() => {
      setTicketStatus("sent");
      toast.success(`پیامک برای ${ticketName} ارسال شد ✅`);
    }, 3000);
  };

  const closeModal = () => {
    setForgotOpen(false);
    setTicketStatus("idle");
    setTicketName("");
    setTicketMessage("فراموشی رمز عبور");
  };

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-6 bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <Header size="text-4xl" text="ورود به سیستم" />
        <p className="text-gray-500 text-center">لطفا نام کاربری و رمز عبور خود را وارد کنید</p>

        <div className="flex flex-col gap-4 w-full">
          <Input
            placeholder="نام کاربری"
            type="text"
            className="border rounded-xl border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 transition-all"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            placeholder="رمز عبور"
            type="password"
            className="border rounded-xl border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="button"
          name="ورود"
          onClick={handleLogin}
          loading={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
        />

        <div className="flex justify-between w-full text-sm text-gray-400 mt-2">
          <span
            className="cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setForgotOpen(true)}
          >
            فراموشی رمز عبور؟
          </span>
        </div>
      </div>

      {/* مدال فراموشی رمز عبور */}
      {forgotOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-[#071952]">درخواست پشتیبانی</h3>

            {ticketStatus === "idle" && (
              <>
                <p className="text-gray-500 text-sm">لطفا نام خود را وارد کرده و روی ارسال کلیک کنید</p>
                <Input
                  placeholder="نام شما"
                  type="text"
                  className="border rounded-xl border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 transition-all"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                />
                <textarea
                  placeholder="توضیح مشکل"
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="border rounded-xl border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 transition-all resize-none h-24"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSendTicket}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    ارسال
                  </button>
                </div>
              </>
            )}

            {ticketStatus === "processing" && (
              <p className="text-blue-600 font-medium text-center text-lg">
                ⏳ تیکت شما در حال بررسی است، همکار عزیز...
              </p>
            )}

            {ticketStatus === "sent" && (
              <>
                <p className="text-green-600 font-medium text-center text-lg">
                  ✅ پیامک ارسال شد، لطفا پیامک خود را چک کنید
                </p>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    بستن
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;
