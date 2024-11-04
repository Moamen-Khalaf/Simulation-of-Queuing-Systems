import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { cellType } from "../store/simulation/types";
import { GoDotFill } from "react-icons/go";
import Button from "./Button";
import useStore from "../store/simulation/table";
import {
  generateColumnHeaders,
  decodeExcelPosition,
  encodeExcelPosition,
  splitPosition,
} from "../utils/table/positionEncodeDecode";

type TableProps = {
  table: cellType[][];
  ediable: boolean;
  index: number;
};

function Table({ table, ediable, index }: TableProps) {
  const [localTable, setLocalTable] = useState(table);
  useEffect(() => {
    setLocalTable(table);
  }, [table]);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (JSON.stringify(localTable) !== JSON.stringify(table)) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [localTable, table]);

  const columnHeaders = useMemo(
    () => generateColumnHeaders(localTable[0].length),
    [localTable]
  );

  const [selectedCell, setSelectedCell] = useState<cellType | null>(null);

  const [selectedColumn, selectedRow] = useMemo(
    () => splitPosition(selectedCell?.pos || ""),
    [selectedCell]
  );

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLTableCellElement).classList.contains("row-header")) {
      return;
    }
    const element = e.target as HTMLInputElement;
    element.style.backgroundColor = "#f3f4f6";
    element.style.color = "#000";
    element.addEventListener("mouseleave", () => {
      element.style.backgroundColor = "";
    });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, cell: cellType) => {
      const element = e.target as HTMLInputElement;
      element.contentEditable = "true";
      element.style.backgroundColor = "#f3f4f6";
      element.style.outline = "1px solid #2563eb";
      setSelectedCell(cell);
      if (cell.f) {
        element.textContent = "=" + cell.f;
      }
      document.addEventListener(
        "pointerdown",
        function handlePointerDown(event) {
          if (
            event.target !== element &&
            (event.target as HTMLInputElement).name !== "cellValue"
          ) {
            element.contentEditable = "false";
            element.style.backgroundColor = "";
            element.style.outline = "";
            element.style.outlineOffset = "";
            if (ediable && element.textContent?.trim() != cell.v) {
              // const newTable = localTable.map((row) => [...row]);
              // newTable[i][j] = {
              //   ...cell,
              //   v: element.textContent?.trim() || "",
              // };
              setLocalTable((prev) => {
                const [j, i] = decodeExcelPosition(cell.pos);
                const newTable = prev.map((row) => [...row]);
                newTable[i][j] = {
                  ...cell,
                  v: element.textContent?.trim() || "",
                };
                return newTable;
              });
            } else {
              element.textContent = cell.v;
            }
            document.removeEventListener("pointerdown", handlePointerDown);
            setSelectedCell(null);
          }
        }
      );
    },
    [ediable]
  );

  return (
    <div className="flex-grow w-full transition-opacity duration-300 opacity-100">
      <table className="table-auto w-full border-collapse text-center select-none">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2 bg-[#2563eb] text-white">
              {isChanged && (
                <span className="max-w-full flex place-content-center">
                  <GoDotFill />
                </span>
              )}
            </th>
            {columnHeaders.map((header: string, index: number) => (
              <th
                key={index}
                className={`border border-gray-400 px-4 py-2 bg-[#2563eb] text-white ${
                  selectedColumn === header ? "bg-[#2d4e94]" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {localTable.map((row, rowIndex) => (
            <tr key={rowIndex} onMouseOver={handleMouseOver}>
              <td
                className={`row-header border border-gray-400 px-4 py-2 bg-[#2563eb] text-white w-[70px] h-[30px] whitespace-nowrap overflow-hidden text-ellipsis ${
                  selectedRow === `${rowIndex + 1}` ? "bg-[#2d4e94]" : ""
                }`}
                onClick={() => {
                  if (ediable && rowIndex === localTable.length - 1) {
                    setLocalTable((prev) => [
                      ...prev,
                      row.map((cell, cellIndex) => ({
                        ...cell,
                        v: "",
                        pos: encodeExcelPosition(cellIndex, prev.length),
                      })),
                    ]);
                  }
                }}
                onMouseOver={(e) => {
                  if (ediable && rowIndex === localTable.length - 1) {
                    const cellElement = e.target as HTMLTableCellElement;
                    cellElement.style.cursor = "pointer";
                    cellElement.textContent = "+";
                    cellElement.addEventListener("mouseleave", () => {
                      cellElement.textContent = `${rowIndex + 1}`;
                    });
                  }
                }}
              >
                {rowIndex + 1}
              </td>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  onMouseDown={(e) => rowIndex && handleMouseDown(e, cell)}
                  className={`border border-gray-400 px-4 py-2 max-w-fit h-[30px] whitespace-nowrap overflow-hidden text-ellipsis ${
                    rowIndex === 0 ? "font-bold" : ""
                  } ${
                    selectedCell?.f.includes(cell.pos) && rowIndex !== 0
                      ? "bg-[#f3f4f6] font-semibold outline-dashed outline-2 outline-blue-500"
                      : ""
                  }`}
                >
                  {cell.v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isChanged && (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              useStore.getState().setTable(localTable, index);
              setIsChanged(false);
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setLocalTable(table);
            }}
          >
            Discard
          </Button>
        </div>
      )}
    </div>
  );
}

export default React.memo(Table);
