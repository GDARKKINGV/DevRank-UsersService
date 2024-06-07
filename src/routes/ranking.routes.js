import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getGlobalRanking } from "../controllers/ranking.controller.js";

const router = Router();

router.get("/", authRequired, getGlobalRanking);

export default router;
