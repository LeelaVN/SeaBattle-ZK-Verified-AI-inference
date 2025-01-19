import { Router } from "express";
import { create } from "../controllers/create.controller.js";
import { state } from "../controllers/state.controller.js";
import { transfer } from "../controllers/transfer.controller.js";
import { moveController } from "../controllers/move.controller.js";
import { joinController } from "../controllers/join.controller.js";

const router = Router();

router.post("/create", create)
router.post("/state", state)
router.post("/transfer", transfer)
router.post("/move", moveController)
router.post("/join", joinController)

export default router;