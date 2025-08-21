import React from "react";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "نوشیدنی گرم",
    slug: "hot-drinks",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 10h12M10 14h4M8 18h8M12 2v2m-4 0v2m8-2v2M6 6h12v2a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
  {
    name: "نوشیدنی سرد",
    slug: "cold-drinks",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2h8l1 6H7l1-6zM5 8h14v2H5zM10 12v8m4-8v8M6 20h12" />
      </svg>
    ),
  },
  {
    name: "پیتزا",
    slug: "pizza",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C7 3 4 8 4 14a8 8 0 0016 0c0-6-3-11-8-12z" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="9" cy="14" r="1" fill="currentColor" />
        <circle cx="15" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "ساندویچ",
    slug: "sandwich",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16v2H4zm1 4h14v2H5zm-1 4h16v2H4z" />
      </svg>
    ),
  },
  {
    name: "سالاد",
    slug: "salad",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 10a8 8 0 0116 0v6a8 8 0 01-16 0v-6zM8 14h8" />
      </svg>
    ),
  },
  {
    name: "دسر",
    slug: "dessert",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-6z" />
      </svg>
    ),
  },
];

const CategoryButtons = () => {
  const router = useRouter();

  const handleNavigate = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  return (
    <div className="w-full px-4 py-10 ">
      <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleNavigate(cat.slug)}
            className="w-full bg-[#2c2c2c] hover:bg-[#383838] transition text-white py-12 rounded-2xl text-lg font-semibold shadow-md flex items-center justify-center gap-3"
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;
