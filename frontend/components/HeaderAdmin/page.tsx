import React from "react";
import "./style.scss";
interface HeaderAdminTpe {
  h1?: String;
  span?: String;
}
const HeaderAdmin = ({h1 , span}:HeaderAdminTpe) => {
  return (
    <>
      <main className="flex flex-col justify-center items-start gap-3 w-full text-white px-5 py-5">
        <h1 className="font-bold text-2xl">{h1?h1:"داشبورد مالیاتی" }</h1>
        <span className="text-small">{span ? span :" بررسی امور مالیاتی و حسابداری" }</span>
      </main>
    </>
  );
};

export default HeaderAdmin;
