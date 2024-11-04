import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type cellType } from "./types";

interface IStore {
  tables: cellType[][][];
  fileName: string;
  isLoading: boolean;
  error: string | null;
  setTables: (file: File) => void;
  setTable: (table: cellType[][], index: number) => void;
  clear: () => void;
}
const tables: cellType[][][] = [
  [
    [
      {
        v: "ISSUE_CODE",
        f: "",
        pos: "A1",
      },
      {
        v: "ISSUE",
        f: "",
        pos: "B1",
      },
      {
        v: "SERVICE_TIME",
        f: "",
        pos: "C1",
      },
    ],
  ],
  [
    [
      {
        v: "CLIENT_ID",
        f: "",
        pos: "A1",
      },
      {
        v: "INTERARRIVAL_TIME",
        f: "",
        pos: "B1",
      },
      {
        v: "ISSUE_CODE",
        f: "",
        pos: "C1",
      },
    ],
  ],
];
const useStore = create<IStore>()(
  devtools(
    immer(
      persist(
        subscribeWithSelector((set) => ({
          tables,
          fileName: "",
          isLoading: false,
          error: null,
          setTables: async (file: File) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });
              const data = new FormData();
              data.append("file", file);
              const response = await fetch("/api/simulate/parse", {
                method: "POST",
                body: data,
              });
              if (!response.ok) {
                throw new Error("Failed to parse file");
              }
              const tables = await response.json();
              set((state) => {
                state.tables = tables.data;
                state.fileName = file.name;
              });
            } catch (error) {
              set((state) => {
                state.error = (error as Error).message;
                state.tables = [];
                state.fileName = "";
              });
            } finally {
              set(() => ({ isLoading: false }));
            }
          },
          clear: () =>
            set((state) => {
              state.tables = tables;
              state.error = null;
              state.fileName = "";
              state.isLoading = false;
              localStorage.removeItem("tables");
            }),
          setTable: (table: cellType[][], index: number) =>
            set((state) => {
              // table = table.map((row) => row.map((cell) => ({ ...cell })));
              state.tables[index] = table;
            }),
        })),
        { name: "tables", storage: createJSONStorage(() => sessionStorage) }
      )
    ),
    { name: "tables" }
  )
);

export default useStore;
