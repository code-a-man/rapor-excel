import React, { use } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { getHeaders, getResult, getRows } from "@/lib/xlsxUtils";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FileUpload = () => {
  const {
    handleFileUpload,
    headers,
    setStep,
    workbook,
    setHeaders,
    setRows,
    handleTemplateUpload,
    filters,
    selectedItems,
  } = useAppContext();
  useEffect(() => {
    if (workbook) {
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (sheet) {
        setHeaders(getHeaders(sheet));
        setRows(getRows(sheet));
      }
    }
  }, [setHeaders, setRows, workbook]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="excel">Excel Dosyası Seç</Label>
        <Input id="excel" type="file" onChange={handleFileUpload} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="excel">Şablon Seç (varsa)</Label>
        <Input id="excel" type="file" onChange={handleTemplateUpload} />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          className="max-w-32"
          disabled={filters.length < 1 || selectedItems.length < 1}
          onClick={() => setStep(4)}
        >
          Sona Git
        </Button>
        <Button
          className="max-w-32"
          disabled={headers.length < 1}
          onClick={() => setStep(2)}
        >
          İlerle
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
