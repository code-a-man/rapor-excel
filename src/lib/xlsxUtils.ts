import * as xlsx from "xlsx";
import { save } from "@tauri-apps/api/dialog";
import {
  BaseDirectory,
  writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
function getData(
  name: string,
  selectedItems: string[],
  filter: string[],
  workbook: xlsx.WorkBook,
  toFilter: boolean = false
) {
  const sheet = workbook.Sheets[name] as xlsx.WorkSheet;

  const headers = getHeaders(sheet);

  const rows = getRows(sheet);

  const selectedIndexes = findIndex(headers, selectedItems);

  const selectedColumns = selectColumns(rows, selectedIndexes, selectedItems);

  // find index of filter items in headers and get their values with index
  const filteredData = filter.map((item) => {
    const index = selectedColumns[0]?.column.indexOf(item.trim()) ?? -1;
    if (index !== -1) {
      const value = selectedColumns[1]?.column[index];
      return { item, value };
    }
  });
  if (toFilter) {
    return { headers, selectedIndexes, selectedColumns };
  }
  return filteredData as { item: string; value: string }[];
}

function getHeaders(sheet: xlsx.WorkSheet) {
  // get column names from first row
  const headers: string[] = [];
  const range = xlsx.utils.decode_range(sheet["!ref"] as string);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = { c: C, r: range.s.r };
    const cell_ref = xlsx.utils.encode_cell(cell_address);
    headers.push(sheet[cell_ref].v);
  }
  return headers;
}

function getRows(sheet: xlsx.WorkSheet) {
  const range = xlsx.utils.decode_range(sheet["!ref"] as string);
  // get data from rows
  const rawRows = [];
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const row = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = xlsx.utils.encode_cell(cell_address);
      const cell = sheet[cell_ref];
      if (cell) {
        row.push(cell.v);
      } else {
        row.push(""); // or handle the missing cell value in a different way
      }
    }
    rawRows.push(row);
  }
  //remove rows with full of empty cells
  const rows = rawRows.filter((row) => row.some((cell) => cell !== ""));
  return rows;
}

function getDataToFilter(sheet: xlsx.WorkSheet) {
  const headers = getHeaders(sheet);
  const rows = getRows(sheet);

  return { headers, rows };
}

function findIndex(headers: string[], selectedItems: string[]) {
  // find index of selected items in headers
  return selectedItems.map((item) => headers.indexOf(item.trim()));
}

function selectColumns(
  rows: any[][],
  selectedIndexes: number[],
  selectedItems: string[]
) {
  return selectedIndexes.map((index, idx) => {
    if (index !== -1) {
      const columnName = selectedItems[idx];
      const column = rows.map((row) => row[index]?.toString().trim());
      return { columnName, column };
    }
  });
}

function getResult(
  selectedItems: string[],
  filter: string[],
  workbook: xlsx.WorkBook
) {
  const data = [] as {
    name: string;
    data: { item: string; value: string }[];
  }[];
  const sheet_name_list = workbook.SheetNames;
  for (const sheetName of sheet_name_list) {
    const sheetData = getData(
      sheetName,
      selectedItems,
      filter,
      workbook,
      false
    ) as { item: string; value: string }[];
    data.push({ name: sheetName, data: sheetData });
  }
  return data;
}

async function saveTemplate(selectedItems: string[], filters: string[]) {
  // save to json file blob and download
  const data = {
    selectedItems,
    filters,
  };
  const filename = "template.json";
  const json = JSON.stringify(data, null, 2);

  const filePath = await save({
    defaultPath: filename,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (filePath) {
    await writeTextFile(filePath, json);
  }
}

async function saveToFile(data: any[], filename: string) {
  const xlsxData = [] as { [key: string]: string }[];
  data.forEach((item) => {
    const row = { Ad: item["name"] } as { [key: string]: string };
    item["data"].forEach((data: { item: string; value: string }) => {
      row[data["item"]] = data["value"];
    });
    xlsxData.push(row);
  });

  const ws = xlsx.utils.json_to_sheet(xlsxData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sayfa 1");

  const filePath = await save({
    defaultPath: filename,
    filters: [{ name: "EXCEL", extensions: ["xlsx"] }],
  });

  if (filePath) {
    const wbBuffer = xlsx.write(wb, { type: "array" });
    const UInt8Array = new Uint8Array(wbBuffer);
    writeBinaryFile(filePath, UInt8Array);
  }
}
/*
  const a = document.createElement("a");
  const wbBuffer = xlsx.write(wb, { type: "buffer" });
  const blob = new Blob([wbBuffer], { type: "application/octet-stream" });
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);*/

/*


export default */

export {
  getData,
  getDataToFilter,
  getHeaders,
  getRows,
  findIndex,
  getResult,
  selectColumns,
  saveTemplate,
  saveToFile,
};
