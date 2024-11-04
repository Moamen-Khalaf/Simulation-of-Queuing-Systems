import React, { useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import useSIMStore from "../store/simulation/simulationStore";
import useStore from "../store/simulation/table";
import type { cellType } from "../store/simulation/types";
import Button from "./Button";
import Table from "./Table";

function Preview() {
  const tables: cellType[][][] = useStore((state) => state.tables);
  const [refresh, setRefresh] = useState(false);
  const [preview, setPreview] = useState(false);
  const error = useSIMStore((state) => state.error);

  const handleRefresh = () => {
    setRefresh(true);
    useSIMStore.getState().setTableData(tables);
    setTimeout(() => {
      setRefresh(false);
    }, 2500);
  };

  const handlePreviewToggle = () => {
    setPreview(!preview);
  };

  return (
    <div className="transition-opacity duration-500 ease-in-out opacity-100">
      <div className="flex justify-between items-center flex-col scale-90 md:flex-row md:scale-100">
        <Button onClick={handlePreviewToggle}>
          {preview ? "Hide" : "Show"} Preview
        </Button>
        <Button disabled={refresh} onClick={handleRefresh}>
          <MdOutlineRefresh
            className={`text-[1.5rem] cursor-pointer text-white ${
              refresh ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out transform scale-90 md:scale-100 ${
          preview
            ? "max-h-screen opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95"
        } overflow-x-auto`}
      >
        <div className="flex gap-3 flex-col lg:flex-row items-start">
          {tables.map((table, index) => (
            <Table key={index} table={table} ediable={true} index={index} />
          ))}
        </div>
      </div>
      {error && (
        <div className="text-center">
          <p className="text-red-500">
            Error loading data. Please ensure all essential tables are included.
          </p>
        </div>
      )}
    </div>
  );
}
export default React.memo(Preview);
