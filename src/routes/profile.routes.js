import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { profile, updateProfile } from "../controllers/profile.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/profile", authRequired, profile).patch(
  "/update",
  authRequired,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./src/uploads/profileImages",
  }),
  updateProfile
);

export default router;
