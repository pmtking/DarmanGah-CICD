import Button from "@/components/Button/page";
import Header from "@/components/header/page";
import Input from "@/components/Input/page";
import React from "react";

const Login = () => {
  return (
    <main className="h-screen flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center gap-4 px-10 py-10 border rounded-2xl  ">
        <Header size="" text="ورود " />
        <div className="flex flex-col justify-center items-center gap-3">
          <Input
            placeholder=" نام کاربری"
            type="text"
            className="border rounded-2xl border-gray-500"
          />
          <Input
            placeholder="رمز عبور "
            type="text"
            className="  rounded-2xl border-gray-500"
          />
          <Button type="button" name="ورود" />
        </div>
      </div>
    </main>
  );
};

export default Login;
