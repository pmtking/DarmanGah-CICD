import React from "react";
import SearchBar from "../SearchBar/page";
import PromoBanner from "../PromoBanner/page";
import PromoBannerSlider from "../PromoBanner/page";


const HeroSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#202020] to-[#121212] text-white py-10 px-5 sm:px-12">
      <SearchBar />
      <PromoBannerSlider />
    </section>
  );
};

export default HeroSection;
