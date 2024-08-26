import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

const ColumnSelection = () => {
  const { headers, selectedColumns, handleColumnChange, setStep, data } =
    useAppContext();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">Sütun Seçimi</h2>
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded p-2"
            name="col1"
            onChange={handleColumnChange}
          >
            <option value="">Başlık Sütunu</option>
            {headers.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded p-2"
            name="col2"
            onChange={handleColumnChange}
          >
            <option value="">Veri Sütunu</option>
            {headers.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedColumns?.[0]?.column && selectedColumns?.[1]?.column && (
        <div>
          <h2>İlk 5 Sonuç Gösteriliyor</h2>
          <table className="table-auto border-collapse border border-slate-500">
            <thead>
              <tr className="bg-primary-foreground text-primary text-left">
                <th className="border border-slate-500">
                  {selectedColumns[0].columnName}
                </th>
                <th className="border border-slate-500">
                  {selectedColumns[1].columnName}
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedColumns[0].column.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="border border-slate-500">
                  <td className="border border-slate-500">
                    {selectedColumns[0].column[idx]}
                  </td>
                  <td className="border border-slate-500">
                    {selectedColumns[1].column[idx]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end">
        <Button
          className="max-w-32"
          disabled={
            !(selectedColumns?.[0]?.column && selectedColumns?.[1]?.column)
          }
          onClick={() => setStep(3)}
        >
          İlerle
        </Button>
      </div>
    </div>
  );
};

export default ColumnSelection;
/*
 */
