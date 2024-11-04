import { Request, Response } from "express";
import parseExcel from "../utils/parceExcel";

export function parceExcel(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const fileBuffer = req.file.buffer;
    const data = parseExcel(fileBuffer);
    res.status(200).json({ message: "File uploaded", data });
  } catch (error) {
    res.status(500).json({ error: (error as { message: string }).message });
  }
}
