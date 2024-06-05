import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyToken,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router
  .post("/register", validateSchema(registerSchema), register)
  .post("/login", validateSchema(loginSchema), login)
  .post("/logout", logout)
  .get("/verify", verifyToken);

export default router;
