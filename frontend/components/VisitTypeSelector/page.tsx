import { Trash } from "iconsax-reactjs";
import { useState, useRef } from "react";


interface VisitTypeSelectorProps {
  onSelect: (value: string) => void;
}

const VisitTypeSelector: React.FC<VisitTypeSelectorProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = [
    { id: 1, label: "ویزیت پزشک" },
    { id: 2, label: "خدمات پرستاری" },
    { id: 3, label: "فیزیو تراپی" },
    { id: 4, label: "مامائی" },
    { id: 5, label: "رادیو لوژی" },
  ];

  const selectOption = (id: number) => {
    const found = options.find((opt) => opt.id === id);
    if (found) {
      setSelected(found.id);
      onSelect(String(found.id));
    } else {
      setSelected(null);
      onSelect("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      selectOption(value);
    }
  };

  const clearSelection = () => {
    setSelected(null);
    onSelect("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex items-center bg-white rounded-xl border border-gray-300 p-3 w-full max-w-sm gap-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        نوع مراجعه
      </p>

      {!selected && (
        <input
          ref={inputRef}
          type="number"
          min={1}
          max={options.length}
          placeholder="شماره (1 تا 5)"
          onChange={handleChange}   
          className="
            w-32 px-3 py-1.5 text-sm text-gray-800 bg-gray-50 
            border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
            transition-all
          "
        />
      )}

      {selected && (
        <div
          className="
            flex items-center justify-between gap-2 px-3 py-1.5 
            bg-blue-100 border border-blue-300 
            rounded-lg shadow-sm animate-fadeIn
          "
        >
          <span className="text-blue-800 text-sm font-medium">
            {options.find((o) => o.id === selected)?.label}
          </span>

          <button
            onClick={clearSelection}
            className="p-1 rounded-full hover:bg-red-200/60 transition"
          >
            <Trash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitTypeSelector;
