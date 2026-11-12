import express from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
} from "../controllers/CompanyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);
router.get("/:id", getCompanyById);

export default router;
