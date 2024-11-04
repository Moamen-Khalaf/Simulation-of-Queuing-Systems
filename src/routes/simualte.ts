import { Router } from "express";
import { parceExcel } from "../controllers/parceExcel";
import { saveAsExcel } from "../controllers/saveAsExcel";
import { simulate } from "../controllers/simulate";
import upload from "../middlewares/multer";

const simulationRouter = Router();
simulationRouter.post("/", simulate);
simulationRouter.post("/excel", saveAsExcel);
simulationRouter.post("/parse", upload.single("file"), parceExcel);
export default simulationRouter;
