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
      onSelect(found.label);
    } else {
      setSelected(null);
      onSelect("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = Number(inputRef.current?.value);
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
    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-2 w-full max-w-sm gap-3">
      <p className="text-sm font-medium text-gray-700 ">نوع مراجعه</p>

      {/* اگر انتخاب نشده → اینپوت نمایش داده شود */}
      {!selected && (
        <input
          ref={inputRef}
          type="number"
          min={1}
          max={options.length}
          placeholder="شماره (1 تا 5)"
          onKeyDown={handleKeyDown}
          className="w-28 border border-gray-500 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1"
        />
      )}

      {/* اگر انتخاب شده → کارت کوچک نمایش داده شود */}
      {selected && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-1">
          <span className="text-blue-700 text-sm font-medium">
            {options.find((o) => o.id === selected)?.label}
          </span>
          <button
            onClick={clearSelection}
            className="p-1 rounded-full hover:bg-red-100 transition"
            aria-label="حذف انتخاب"
          >
            <Trash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitTypeSelector;
