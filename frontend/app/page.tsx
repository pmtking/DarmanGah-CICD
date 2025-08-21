"use client";

import AboutBox from "@/components/AboutBox/page";
import CategoryButtons from "@/components/CategoryButtons/page";
import DoctorsPresent from "@/components/DoctorsPresent/page";
import Hero from "@/components/Hirosection/page";
import HeroSection from "@/components/Hirosection/page";
import NavBar from "@/components/NavBar/page";
import Services from "@/components/Services/page";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const titleRef = useRef(null);
  const boxRef = useRef(null);
  useEffect(() => {
    gsap.from(titleRef.current, {
      opacity: 0,
      scale: 0.5,
      delay: 0.5,
      duration: 1,
      ease: "back.out(1.7)",
    });
    gsap.from(boxRef.current, {
      opacity: 0,
      scale: 0.5,
      delay: 1.5,
      duration: 1,
      ease: "bounce.out",
    });
  }, []);
  return (
    <div className="flex justify-between items-start mt-30 w-full px-12">
      <NavBar />

      <Services />
      <AboutBox />
      {/* <AboutBox /> */}
      <DoctorsPresent />
    </div>
  );
}
