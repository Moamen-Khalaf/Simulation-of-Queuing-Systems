import { Request, Response } from "express";
import { getDataExcel } from "../utils/getDataExcel";
export async function saveAsExcel(req: Request, res: Response) {
  try {
    const data = req.body.data;
    const blob = getDataExcel(data);
    const buffer = Buffer.from(await blob.arrayBuffer());

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="simulation.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: (error as { message: string }).message });
  }
}
