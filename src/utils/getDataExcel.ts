import XLSX from "xlsx";
import { cellType } from "../types/types";
export function getDataExcel(tables: cellType[][]) {
  const newFile = XLSX.utils.aoa_to_sheet(tables);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newFile, "Sheet1");

  const excelData = XLSX.write(newWorkbook, {
    bookType: "xlsx",
    type: "binary",
  });

  const arrayBuffer = new ArrayBuffer(excelData.length);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < excelData.length; i++) {
    view[i] = excelData.charCodeAt(i) & 0xff;
  }

  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
