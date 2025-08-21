"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import {
  BagHappy,
  Gallery,
  Home2,
  SearchNormal1,
  UserAdd,
} from "iconsax-reactjs";
import NavItem from "../navItem/page";
import Button from "../Button/page";
import "./style.scss";
import SearchBar from "../SearchBar/page";

const navItems = [
  { name: "بخش دندان پزشکی", link: "/" },
  { name: " ازمایشگاه", link: "/" },
  { name: " فیزیو تراپی", link: "/" },
  { name: " چشم پزشکی", link: "/login" },
];

const NavBar = () => {
  const navbarRef = useRef(null);

  useEffect(() => {
    gsap.from(navbarRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={navbarRef}
      className=" navbar fixed top-1 left-1/2 -translate-x-1/2 bg-white/85  flex justify-between items-center w-[95%]  rounded-2xl shadow-lg  sm:px-6 sm:py-2 md:px-6 py-1 not-[]: mt-2"
    >
      {/* Nav Items */}
      <SearchBar />
      <div className="flex mx-auto justify-center gap-10 ">
        {navItems.map((item) => (
          <NavItem key={item.name} name={item.name} link={item.link} />
        ))}
      </div>

      {/* Actions (Search/Login) */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Optional: Search or Login */}
        {/* <InputSearch icon={<SearchNormal1 size={20} />} /> */}
        {/* <Button name="رزرو نوبت" type="button" className="w-80 " /> */}
        <div className="flex justify-center btn px-20 py-4">رزرو نوبت</div>
      </div>
    </div>
  );
};

export default NavBar;
