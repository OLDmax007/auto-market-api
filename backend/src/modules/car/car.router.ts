import { Router } from "express";

import { carController } from "./car.controller";

const router = Router();

router.get("/:make/models", carController.getModelsByMake);
router.get("/makes", carController.getAllMakes);
router.post("/missing-report", carController.reportMissingModel);

export const carRouter = router;
