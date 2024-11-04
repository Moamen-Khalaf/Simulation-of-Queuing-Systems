import XLSX from "xlsx";
export function getPosition(colIndex: number, rowIndex: number) {
  return XLSX.utils.encode_cell({ c: colIndex, r: rowIndex });
}
export function getPositionCoordinates(position: string) {
  return XLSX.utils.decode_cell(position);
}
