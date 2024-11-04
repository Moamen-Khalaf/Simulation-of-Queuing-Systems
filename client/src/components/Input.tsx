import React, { useRef } from "react";
import useSIMStore from "../store/simulation/simulationStore";
import useStore from "../store/simulation/table";
import Button from "./Button";
import Preview from "./Preview";

function Input() {
  const setTables = useStore((state) => state.setTables);
  const isLoading = useStore((state) => state.isLoading);
  const clearTables = useStore((state) => state.clear);
  const error = useStore((state) => state.error);
  const fileName = useStore((state) => state.fileName);

  const clearMain = useSIMStore((state) => state.clear);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="p-4 mt-5 bg-white shadow-md rounded-md mx-2 md:mx-10 lg:mx-20">
      <div className="flex flex-col lg:flex-row justify-between gap-2">
        <div className="px-5 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Upload Excel File</h1>
          <h2>About the app</h2>
          <p className="text-gray-500 text-sm">
            This application allows you to upload an Excel file and preview its
            data. To use the app, click on the "Upload" button and select an
            Excel file from your computer. The file will be processed and
            displayed in a preview section below. If you want to clear the
            uploaded file and start over, click the "Clear" button.
          </p>
          <h3>How it works</h3>
          <p className="text-gray-500 text-sm">
            This application leverages the "xlsx" library to read and extract
            data from the uploaded Excel file. The extracted data is displayed
            in a table format for your preview. Once uploaded, the data is
            processed by the application to generate simulation results.
            Additionally, you can download the simulation results in an Excel
            file, which will include the relevant formulas.
          </p>
          <h3>Example</h3>
          <p className="text-gray-500 text-sm">
            The image below illustrates the expected structure of the data
            within the uploaded Excel file.
          </p>
        </div>
        <img src={"example.png"} alt="error" className="scale-75" />
      </div>
      <div className="flex items-center gap-3 justify-between">
        <label htmlFor="file">
          <Button
            disabled={isLoading}
            onClick={() => inputRef.current?.click()}
          >
            {isLoading ? "Loading..." : "Upload"}
          </Button>
        </label>
        <input
          type="file"
          accept=".xlsx"
          ref={inputRef}
          id="file"
          className="hidden"
          onChange={async (e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              await setTables(file);
            }
          }}
        />
        <label>{fileName || "No file selected"}</label>
        <Button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
              inputRef.current.files = null;
            }
            clearTables();
            clearMain();
          }}
        >
          {isLoading ? "Cancel" : "Clear"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <Preview />
    </div>
  );
}
export default React.memo(Input, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
