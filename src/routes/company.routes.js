import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createCompany,
  loginCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  addOffer,
  removeOffer,
} from "../controllers/company.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router
  .post("/register", createCompany)
  .post("/login", loginCompany)
  .get("/", getCompanies)
  .get("/:companyId", getCompanyById)
  .patch(
    "/:companyId",
    authRequired,
    fileUpload({
      useTempFiles: true,
      tempFileDir: "./src/uploads/profileImages",
    }),
    updateCompany
  )
  .patch("/:companyId/offers/", addOffer)
  .delete("/:companyId/offers/:offerId", removeOffer);

export default router;
