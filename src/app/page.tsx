"use client";

import AddDropdowns from "@/components/AddDropdowns";

const input = ["X1", "X2", "X3"];
const output = ["Y1", "Y2", "Y3"];

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function HomePage() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({
    col1: "",
    col2: "",
  });
  const [columnData, setColumnData] = useState({ col1Data: [], col2Data: [] });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setColumns(jsonSheet[0]);
      setData(jsonSheet.slice(1));
    };
    reader.readAsBinaryString(file);
  };
  const handleColumnChange = (e) => {
    const { name, value } = e.target;
    const columnIndex = columns.indexOf(value);
    const newData = data.map((row) => row[columnIndex]);

    setSelectedColumns({
      ...selectedColumns,
      [name]: value,
    });

    setColumnData({
      ...columnData,
      [name === "col1" ? "col1Data" : "col2Data"]: newData,
    });
  };
  return (
    <main>
      <div>
        <h1>Excel Dosyası Yükle</h1>
        <input type="file" onChange={handleFileUpload} />
        {columns.length > 0 && (
          <div>
            <h2>Sütun Seçimi</h2>
            <select name="col1" onChange={handleColumnChange}>
              <option value="">Sütun Seçin</option>
              {columns.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <select name="col2" onChange={handleColumnChange}>
              <option value="">Sütun Seçin</option>
              {columns.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedColumns.col1 && selectedColumns.col2 && (
          <table>
            <thead>
              İlk 5 Sonuç Gösteriliyor
              <tr>
                <th>{selectedColumns.col1}</th>
                <th>{selectedColumns.col2}</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  <td>{row[columns.indexOf(selectedColumns.col1)]}</td>
                  <td>{row[columns.indexOf(selectedColumns.col2)]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        {columnData.col1Data.length > 0 && columnData.col2Data.length > 0 && (
          <AddDropdowns input={columnData.col1Data} output={output} />
        )}
      </div>
    </main>
  );
}
