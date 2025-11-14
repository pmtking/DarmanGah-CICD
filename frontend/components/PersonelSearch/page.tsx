import { Trash } from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";
import ImagegDef from '@/public/images/image 8.png'

export interface PersonelSearchType {
  type?: "1" | "2" | "3" | "4" | "5";
}

interface Staff {
  id: number;
  name: string;
  specialty: string;
  queue: number;
  avatar: string;
}

const PersonelSearch = ({ type }: PersonelSearchType) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<Staff | null>(null);

  const staff: Staff[] = [
    { id: 1, name: "دکتر احمدی", specialty: "عمومی", queue: 3, avatar: "https://via.placeholder.com/60" },
    { id: 2, name: "دکتر رضایی", specialty: "متخصص قلب", queue: 5, avatar: "https://via.placeholder.com/60" },
    { id: 12, name: "دکتر طاهری", specialty: "فوق تخصص مغز و اعصاب", queue: 2, avatar: "https://via.placeholder.com/60" },
    { id: 3, name: "دکتر موسوی", specialty: "متخصص داخلی", queue: 4, avatar: "https://via.placeholder.com/60" },
    { id: 4, name: "دکتر کریمی", specialty: "عمومی", queue: 1, avatar: "https://via.placeholder.com/60" },
  ];

  const specialtyGradient = (specialty: string) => {
    switch (specialty) {
      case "عمومی":
        return "from-blue-50 to-blue-100 border-blue-200";
      case "متخصص قلب":
        return "from-pink-50 to-red-100 border-red-200";
      case "متخصص داخلی":
        return "from-green-50 to-green-100 border-green-200";
      case "فوق تخصص مغز و اعصاب":
        return "from-purple-50 to-indigo-100 border-indigo-200";
      default:
        return "from-gray-50 to-gray-100 border-gray-200";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
    } else {
      setResults(
        staff.filter(
          (p) =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.id.toString().includes(value)
        )
      );
    }
  };

  return (
    <div className="w-96 space-y-3">
      {/* کارت انتخاب پزشک */}
      {selected ? (
        <div className={`p-3 rounded-xl shadow-md border bg-gradient-to-r ${specialtyGradient(selected.specialty)} flex flex-col gap-2`}>
          <div className="flex items-center gap-3">
            <Image src={ImagegDef} alt={selected.name} className="w-12 h-12 rounded-full border shadow-sm" />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-sm">{selected.name}</span>
              <span className="text-xs text-gray-600">{selected.specialty}</span>
            </div>
            <button
              className="ml-auto px-2 py-1 rounded-lg text-xs bg-gradient-to-r from-red-400 to-red-600 text-white hover:opacity-90 shadow-sm"
              onClick={() => {
                setSelected(null);
                setQuery("");
              }}
            >
              <Trash size="16" />
            </button>
          </div>

          {/* بخش تخصص و نوبت */}
          <div className="flex justify-between items-center mt-1">
            <span className="px-2 py-0.5 text-[11px] rounded-lg bg-white/80 border shadow-sm font-medium text-gray-700">
              {selected.specialty}
            </span>
            <span className="px-2 py-0.5 text-[11px] rounded-lg bg-yellow-100 border border-yellow-300 shadow-sm font-semibold text-gray-700">
              انتظار: {selected.queue}
            </span>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            placeholder="کد یا نام پزشک..."
          />
          {results.length > 0 && (
            <div className="space-y-2 mt-2">
              {results.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl shadow-md border bg-gradient-to-r ${specialtyGradient(p.specialty)} cursor-pointer hover:scale-[1.02] transition-transform`}
                  onClick={() => {
                    setSelected(p);
                    setResults([]);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Image src={ImagegDef} alt={p.name} className="w-12 h-12 rounded-full border shadow-sm" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm">{p.name}</span>
                      <span className="text-xs text-gray-600">{p.specialty}</span>
                    </div>
                    <span className="ml-auto px-2 py-0.5 text-[11px] rounded-lg bg-yellow-100 border border-yellow-300 shadow-sm font-semibold text-gray-700">
                      انتظار: {p.queue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PersonelSearch;
