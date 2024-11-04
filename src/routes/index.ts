import { Router } from "express";
import simulationRouter from "./simualte";

const router = Router();
router.use("/simulate", simulationRouter);
export default router;
