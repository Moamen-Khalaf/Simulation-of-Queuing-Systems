export function generateColumnHeaders(length: number) {
  const headers = [];
  for (let i = 0; i < length; i++) {
    let header = "";
    let temp = i;
    while (temp >= 0) {
      header = String.fromCharCode((temp % 26) + 65) + header;
      temp = Math.floor(temp / 26) - 1;
    }
    headers.push(header);
  }
  return headers;
}
export function decodeExcelPosition(pos: string): [number, number] {
  let column = 0;
  let row = 0;
  let i = 0;
  while (i < pos.length && isNaN(parseInt(pos[i]))) {
    // Decode column part (letters)
    const value = pos.charCodeAt(i) - "A".charCodeAt(0) + 1;
    column = column * 26 + value;
    i++;
  }
  column -= 1;
  row = parseInt(pos.slice(i)) - 1;
  return [column, row];
}
export function encodeExcelPosition(column: number, row: number): string {
  let columnLabel = "";
  let col = column + 1;
  while (col > 0) {
    const remainder = (col - 1) % 26;
    columnLabel = String.fromCharCode(remainder + 65) + columnLabel;
    col = Math.floor((col - 1) / 26);
  }
  const rowLabel = (row + 1).toString();
  return columnLabel + rowLabel;
}
export function splitPosition(pos: string): [string, string] {
  const match = pos.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    return ["", ""];
  }
  return [match[1], match[2]];
}
