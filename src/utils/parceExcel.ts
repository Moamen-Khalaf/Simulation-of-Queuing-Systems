import XLSX from "xlsx";
import { cellType } from "../types/types";
import { getPosition } from "./positions";

export default function parseExcel(fileBuffer: Buffer): cellType[][][] {
  const workbook = XLSX.read(fileBuffer, { type: "buffer", raw: true });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, {
    raw: true,
    header: 1,
  });

  const tables: string[][][] = [[]];
  let blankRow = false;
  jsonData.forEach((row) => {
    if (row.length === 0) {
      blankRow = true;
      return;
    }
    if (blankRow) {
      tables.push([]);
      blankRow = false;
    }
    tables[tables.length - 1].push(row as string[]);
  });
  const parcedTables = tables.map((table) =>
    table.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        v: cell,
        f: "",
        pos: getPosition(colIndex, rowIndex),
      }))
    )
  );

  return parcedTables;
}
