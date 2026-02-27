import { Router } from "express";

import { carController } from "../controllers/car.controller";

const router = Router();

router.get("/:make/models", carController.getModelsByMake);
router.get("/makes", carController.getAllMakes);
router.post("/missing-report", carController.reportMissingCar);

export const carRouter = router;
