import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type cellType, type IStore } from "./types";

const useSIMStore = create<IStore>()(
  devtools(
    immer((set, get) => ({
      isLoading: false,
      error: null,
      simulationTable: [],
      setTableData: async (table: cellType[][][]) => {
        try {
          set(() => ({ isLoading: true, error: null }));
          const response = await fetch("/api/simulate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ table }),
          });
          if (!response.ok) {
            throw new Error("Failed to simulate data");
          }
          const simulationTable = await response.json();
          set((state) => {
            state.simulationTable = simulationTable.data;
          });
        } catch (error) {
          set((state) => {
            state.error = (error as Error).message;
            state.simulationTable = [];
          });
        } finally {
          set(() => ({ isLoading: false }));
        }
      },
      clear: () => {
        set(() => ({
          simulationTable: [],
          error: null,
        }));
      },
      saveAsExcel: async () => {
        try {
          if (!get().simulationTable || !get().simulationTable.length) {
            throw new Error("No data to save");
          }
          const response = await fetch("/api/simulate/excel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: get().simulationTable }),
          });
          if (!response.ok) {
            throw new Error("Failed to save data");
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "table.xlsx";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (error) {
          console.error("Error:", error);
          set((state) => {
            state.error = (error as Error).message;
          });
        }
      },
    })),
    { name: "simulation" }
  )
);

export default useSIMStore;
