"use client";

import { useState } from "react";

const AddDropdowns = ({ input, output }) => {
  const [dropdowns, setDropdowns] = useState([]);

  const addDropdown = () => {
    if (input?.length < 1 || output?.length < 1) {
      return;
    }
    setDropdowns([...dropdowns, { x: "", y: "" }]);
  };

  const removeDropdown = (index) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns.splice(index, 1);
    setDropdowns(updatedDropdowns);
  };

  const handleDropdownChange = (index, field, value) => {
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index][field] = value;
    setDropdowns(updatedDropdowns);
  };

  return (
    <div className="space-y-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={addDropdown}
      >
        +
      </button>
      {dropdowns.length > 0 && (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => removeDropdown(dropdowns.length - 1)}
        >
          -
        </button>
      )}
      {dropdowns.map((dropdown, index) => (
        <div key={index} className="space-x-4">
          <select
            className="border border-gray-300 rounded p-2"
            value={dropdown.x}
            onChange={(e) => handleDropdownChange(index, "x", e.target.value)}
          >
            <option value="">Giriş Verisi Seçin</option>
            {input.length > 1 &&
              input.map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
          <select
            className="border border-gray-300 rounded p-2"
            value={dropdown.y}
            onChange={(e) => handleDropdownChange(index, "y", e.target.value)}
          >
            <option value="">Hedef Yeri Seçin</option>
            {output.length > 1 &&
              output.map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default AddDropdowns;
