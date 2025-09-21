"use client"
import React from "react";
import "./style.scss";
import { NavItemtype } from "@/types/globaltypes";
import { usePathname } from "next/navigation";

type Props = NavItemtype & {
  variant?: "sidebar" | "navbar";
};

const NavItem = ({ name, link, icon, variant = "navbar" }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className={`nav-item ${variant} ${isActive ? "active" : ""}`}>
      <a href={link} className="nav-link">
        {icon}
        <span className="nav-text">{name}</span>
      </a>
    </div>
  );
};

export default NavItem;
