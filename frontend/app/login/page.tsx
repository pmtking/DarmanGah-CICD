"use client"
import Button from "@/components/Button/page";
import Header from "@/components/header/page";
import Input from "@/components/Input/page";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";


const Login = () => {
  const [userName , setUserName ] = useState<string>('')
  const [password , setPassword ] = useState<string>('')
  const {login , loading , data} = useAuth()
  const handdleLogin = () => {
    login({userName ,password })
    location.replace('/reseption')
  }
  return (
    <main className="h-screen w-full flex justify-center items-center  ">
      <div className="flex flex-col justify-center items-center gap-4 bg-white px-10 py-10 border rounded-2xl  ">
        <Header size="" text="ورود " />
        <div className="flex flex-col justify-center items-center gap-3">
          <Input
            placeholder=" نام کاربری"
            type="text"
            className="border rounded-2xl border-gray-500"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            placeholder="رمز عبور "
            type="text"
            className="  rounded-2xl border-gray-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="button" name="ورود"  onClick={handdleLogin} loading={loading}/>
        </div>
      </div>
    </main>
  );
};

export default Login;
