import { Request, Response } from "express";
import { cellType } from "../types/types";
import { processTable } from "../utils/processTable";
import { default as simulateData } from "../utils/simulate";

export function simulate(req: Request, res: Response) {
  try {
    const table = req.body.table as cellType[][][];
    if (
      !Array.isArray(table) ||
      !table.every(
        (row) => Array.isArray(row) && row.every((cell) => Array.isArray(cell))
      )
    ) {
      res.status(400).json({ error: "Invalid table format" });
      return;
    }
    const users = processTable(table);
    const data = simulateData(users);
    res.json({ message: "Simulation completed successfully", data });
  } catch (error) {
    res.status(500).json({ error: (error as { message: string }).message });
  }
}
