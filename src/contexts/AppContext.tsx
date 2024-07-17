import { findIndex, getHeaders, getRows, selectColumns } from "@/lib/xlsxUtils";
import React, { createContext, useState, useContext, ReactNode } from "react";
import * as XLSX from "xlsx";

interface AppContextProps {
  headers: string[];
  setHeaders: React.Dispatch<React.SetStateAction<string[]>>;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedColumns: { columnName: string; column: any[] }[] | undefined;
  setSelectedColumns: any;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColumnChange: (e: { target: { name: any; value: any } }) => void;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  workbook: XLSX.WorkBook | null;
  setRows: React.Dispatch<React.SetStateAction<any[]>>;
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  handleTemplateUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resultData: any[];
  setResultData: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState();
  const [step, setStep] = useState(1);
  const [filters, setFilters] = useState<string[]>([]);
  const [resultData, setResultData] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.split(".").pop() !== "xlsx") {
      alert("Lütfen sadece Excel dosyası yükleyin. (.xlsx)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      setWorkbook(workbook);
    };
    if (file) {
      reader.readAsBinaryString(file);
    }
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.split(".").pop() !== "json") {
      alert("Lütfen sadece JSON dosyası yükleyin. (.json)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      const data = JSON.parse(binaryStr as string);
      setSelectedItems(data.selectedItems);
      setFilters(data.filters);
      console.log(data);
    };
    if (file) {
      reader.readAsText(file);
    }
  };

  const [selectedItems, setSelectedItems] = useState<string[]>(["", ""]);

  const handleColumnChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const temp = selectedItems || ["", ""];
    name === "col1" ? (temp[0] = value) : (temp[1] = value);
    setSelectedItems(temp);
    const indexes = findIndex(headers, selectedItems);
    const newData = selectColumns(rows, indexes, selectedItems) as any;
    setSelectedColumns(newData);
    console.log(selectedItems);
    console.log(selectedColumns);
  };

  return (
    <AppContext.Provider
      value={{
        headers,
        setHeaders,
        data,
        setData,
        selectedColumns,
        setSelectedColumns,
        step,
        setStep,
        handleFileUpload,
        handleColumnChange,
        selectedItems,
        setSelectedItems,
        workbook,
        setRows,
        filters,
        setFilters,
        handleTemplateUpload,
        resultData,
        setResultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
