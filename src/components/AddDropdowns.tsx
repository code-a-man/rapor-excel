"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";

type AddDropdownsProps = {
  input: string[];
  value: string[];
};

const AddDropdowns = ({ input, value }: AddDropdownsProps) => {
  const { filters, setFilters } = useAppContext();
  const [localDropdowns, setLocalDropdowns] = useState<string[]>(filters);

  const addDropdown = () => {
    if (input?.length < 1) {
      return;
    }
    setLocalDropdowns([...localDropdowns, ""]);
  };

  const removeDropdown = (index: number) => {
    const updatedDropdowns = [...localDropdowns];
    updatedDropdowns.splice(index, 1);
    setLocalDropdowns(updatedDropdowns);
    setFilters(
      updatedDropdowns.reduce((acc: any, item: any) => {
        if (item) {
          acc.push(item.trim());
        }
        return acc;
      }, [])
    );
  };

  const handleDropdownChange = (index: number, selectedValue: string) => {
    const updatedDropdowns = [...localDropdowns];
    updatedDropdowns[index] = selectedValue;
    setLocalDropdowns(updatedDropdowns);
    setFilters(
      updatedDropdowns.reduce((acc: any, item: any) => {
        if (item) {
          acc.push(item.trim());
        }
        return acc;
      }, [])
    );
  };

  return (
    <div className="space-y-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={addDropdown}
      >
        +
      </button>
      {localDropdowns.length > 0 && (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => removeDropdown(localDropdowns.length - 1)}
        >
          -
        </button>
      )}
      {localDropdowns.map((dropdown, index) => (
        <div key={index} className="space-x-4 flex flex-row">
          <select
            className="border border-gray-300 rounded p-2"
            value={dropdown}
            onChange={(e) => handleDropdownChange(index, e.target.value)}
          >
            <option value="">Sütun Seçin</option>
            {input.length > 1 &&
              input.map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
          {dropdown && <p>Değer: {value[input.indexOf(dropdown)]}</p>}
        </div>
      ))}
    </div>
  );
};

export default AddDropdowns;
