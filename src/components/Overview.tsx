import React, { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { saveTemplate, getResult, saveToFile } from "@/lib/xlsxUtils";
import { Button } from "./ui/button";

const Overview = () => {
  const { selectedItems, filters, workbook, resultData, setResultData } =
    useAppContext();
  useEffect(() => {
    // Function to get result data and update state
    const updateResultData = () => {
      if (workbook) {
        try {
          const result = getResult(selectedItems, filters, workbook) as any;
          setResultData(result);
        } catch (error) {
          console.error("Error processing result data:", error);
        }
      }
    };

    updateResultData();
  }, [workbook, selectedItems, filters, setResultData]);
  if (!workbook) return null;

  return (
    <div>
      <h2>Çıktı</h2>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Ad</th>
            {filters.map((item) => (
              <th key={item} className="border border-gray-400 p-2">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resultData.length > 0 &&
            resultData.map(
              (
                row: { name: string; data: { item: string; value: string }[] },
                idx: number
              ) => (
                <tr key={idx}>
                  <td className="border border-gray-400 p-2">{row.name}</td>
                  {filters.map((item) => (
                    <td key={item} className="border border-gray-400 p-2">
                      {row.data.find((data) => data.item === item)?.value}
                    </td>
                  ))}
                </tr>
              )
            )}
        </tbody>
      </table>
      <div className="flex justify-end gap-2">
        <Button
          className="max-w-32 mt-4"
          onClick={() => {
            saveToFile(resultData, "çıktı.xlsx");
          }}
        >
          Excel&apos;e Aktar
        </Button>
        <Button
          className="max-w-32 mt-4"
          onClick={() => {
            saveTemplate(selectedItems, filters);
          }}
        >
          Şablonu Kaydet
        </Button>
      </div>
    </div>
  );
};

export default Overview;
